//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract MediBoomer is Ownable, AutomationCompatibleInterface {
  using Counters for Counters.Counter;

  /// @dev WaysAdministeringMedicines id counter
  Counters.Counter wamId;

  /// @dev Medical Recipe id counter
  Counters.Counter medicalRecipeId;

  /// @dev Intake Time id counter
  Counters.Counter intakeTimeId;

  /// @dev Medicine id counter
  Counters.Counter medicineId;

  /// @dev Prescription id counter
  Counters.Counter prescriptionId;

  /**
   * Public counter variable
   */
  uint256 public counter;

  /**
   * Use an interval in seconds and a timestamp to slow execution of Upkeep
   */
  uint256 public immutable interval;
  uint256 public lastTimeStamp;

  /* Events */
  event WamAdded(address indexed userAddress);

  enum UserRole {
    Doctor,
    Pharmacist,
    Patient
  }

  enum MedicalRecipeStatus {
    Created,
    PartialDelivered,
    FullyDelivered
  }

  /// @dev Personal Information of the user
  struct User {
    string id;
    string name;
    string email;
    address contractAddress;
    UserRole userRole;
    bool isExists;
  }

  /// @dev Ways of Administering Medicines
  struct WaysAdministeringMedicines {
    uint256 id;
    string name;
  }

  /// @dev Medicine and his way of administering
  struct Medicine {
    uint256 id;
    string name;
    uint256 wamId;
  }

  /// @dev Schedule for taking medication
  struct IntakeTime {
    uint256 id;
    string time;
  }

  /// @dev Each medicine and how to take it
  struct Prescription {
    uint256 id;
    uint256 medicineId;
    string dose;
    bool isDelivered;
    uint256 timeDelivered;
    uint8 duration; // in days
    IntakeTime[] intakeTimeList;
  }

  /// @dev Medical Recipe
  struct MedicalRecipe {
    uint256 id;
    address patient;
    uint256[] prescriptions; // Array of Prescription Id
    MedicalRecipeStatus status;
  }

  WaysAdministeringMedicines[] wamList;
  Medicine[] medicineList;
  IntakeTime[] intakeTimeList;

  /// @dev Only users as patients in this list
  User[] patientList;

  /// @dev map patient with their medical recipes
  mapping(address => uint256[]) mapPatientMedicalRecipes;

  /// @dev map medicalRecipe Id with his medical recipe
  mapping(uint256 => MedicalRecipe) mapMedicalRecipes;

  /// @dev map prescription Id with his prescriotion
  mapping(uint256 => Prescription) mapPrescriptions;

  /// @dev map user with his info
  mapping(address => User) userInfo;

  constructor(uint256 updateInterval) {
    interval = updateInterval;
    lastTimeStamp = block.timestamp;

    counter = 0;
  }

  modifier onlyUser(address userAddress) {
    require(userInfo[userAddress].isExists, "User not registered");
    _;
  }

  function checkUpkeep(
    bytes memory checkData
  ) public view override returns (bool upkeepNeeded, bytes memory performData) {
    bool hasElements = wamList.length == counter;
    bool isTimeExpired = (block.timestamp - lastTimeStamp) > interval;

    upkeepNeeded = hasElements && isTimeExpired;
    // don't used
    performData = checkData;
  }

  function performUpkeep(bytes calldata /* performData */) external override {
    (bool upkeepNeeded, ) = checkUpkeep("");
    require(upkeepNeeded, "No se ha cumplido aun");

    lastTimeStamp = block.timestamp;
    counter = counter + 1;
  }

  // TODO: Permisos
  /// @dev Mantainer for WAM
  function addWaysAdministeringMedicines(
    string memory _name
  ) public /* onlyOwner */ {
    uint256 id = wamId.current();
    wamList.push(WaysAdministeringMedicines({id: id, name: _name}));
    wamId.increment();

    emit WamAdded(msg.sender);
  }

  /// @dev Mantainer for IntakeTime
  function addIntakeTime(string memory _time) public /* onlyOwner */ {
    uint256 id = intakeTimeId.current();
    intakeTimeList.push(IntakeTime({id: id, time: _time}));
    intakeTimeId.increment();
  }

  /// @dev Mantainer for Medicine
  function addMedicine(
    string memory _name,
    uint8 _wamId
  ) public /* onlyOwner */ {
    uint256 medId = medicineId.current();
    medicineList.push(Medicine({id: medId, name: _name, wamId: _wamId}));
    medicineId.increment();
  }

  function addPrescription(
    uint256 _prescriptionId,
    uint256 _medicineID,
    string memory _dose,
    uint8 _duration,
    IntakeTime[] memory _intakeTimeList
  ) internal {
    Prescription storage prescription = mapPrescriptions[_prescriptionId];
    prescription.id = _prescriptionId;
    prescription.medicineId = _medicineID;
    prescription.dose = _dose;
    prescription.isDelivered = false;
    prescription.duration = _duration;

    for (uint8 i = 0; i < _intakeTimeList.length; i++) {
      prescription.intakeTimeList.push(
        IntakeTime({id: _intakeTimeList[i].id, time: _intakeTimeList[i].time})
      );
    }
  }

  function addMedicalRecipe(
    address _patient,
    Prescription[] calldata _prescriptionList
  ) public {
    uint256 id = medicalRecipeId.current();
    MedicalRecipe storage medicalRecipe = mapMedicalRecipes[id];

    medicalRecipe.id = id;
    medicalRecipe.patient = _patient;
    medicalRecipe.status = MedicalRecipeStatus.Created;

    for (uint256 i = 0; i < _prescriptionList.length; i++) {
      uint256 prescId = prescriptionId.current();
      addPrescription(
        prescId,
        _prescriptionList[i].medicineId,
        _prescriptionList[i].dose,
        _prescriptionList[i].duration,
        _prescriptionList[i].intakeTimeList
      );

      medicalRecipe.prescriptions.push(prescId);
      prescriptionId.increment();
    }

    medicalRecipeId.increment();
    mapPatientMedicalRecipes[_patient].push(id);
  }

  /// @dev Add a new user to the platform
  function addUser(
    string memory _id,
    string memory _name,
    string memory _email,
    address _contractAddress,
    UserRole _userRole
  ) public {
    require(!userInfo[_contractAddress].isExists, "User already exists");

    userInfo[_contractAddress] = User({
      id: _id,
      name: _name,
      email: _email,
      userRole: _userRole,
      contractAddress: _contractAddress,
      isExists: true
    });

    if (_userRole == UserRole.Patient)
      patientList.push(userInfo[_contractAddress]);
  }

  /// @dev Get the list of Intake Times
  function getIntakeTimeList() public view returns (IntakeTime[] memory) {
    return intakeTimeList;
  }

  /// @dev Get the list of Ways of Administering Medicines
  function getWamList()
    public
    view
    returns (WaysAdministeringMedicines[] memory)
  {
    return wamList;
  }

  /// @dev Get the list of Medicines
  function getMedicineList() public view returns (Medicine[] memory) {
    return medicineList;
  }

  /// @dev Get a List of Medical Recipes of a Patient
  function getPatientMedicalRecipeList(
    address _address
  ) public view returns (MedicalRecipe[] memory) {
    uint256[] memory mrList = mapPatientMedicalRecipes[_address];
    MedicalRecipe[] memory mr = new MedicalRecipe[](mrList.length);

    for (uint256 i = 0; i < mrList.length; i++) {
      mr[i] = mapMedicalRecipes[mrList[i]];
    }

    return mr;
  }

  /// @dev Get a List of Patients
  function getPatientList() public view returns (User[] memory) {
    return patientList;
  }

  /// @dev Get a Medical Recipes
  function getMedicalRecipe(
    address _address,
    uint256 _medicalRecipeId
  ) public view returns (MedicalRecipe memory) {
    MedicalRecipe[] memory mrList = getPatientMedicalRecipeList(_address);
    uint256 idList = 0;

    for (uint i = 0; i < mrList.length; i++) {
      if (mrList[i].id == _medicalRecipeId) {
        idList = i;
        break;
      }
    }

    return mrList[idList];
  }

  function getUserInfo(address userAddress) public view returns (User memory) {
    return userInfo[userAddress];
  }
}
