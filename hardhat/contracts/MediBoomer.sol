//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract MediBoomer is Ownable, AccessControl {
  bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
  bytes32 public constant PHARMACIST_ROLE = keccak256("PHARMACIST_ROLE");
  bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");

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

  constructor() {}

  modifier onlyUser() {
    require(!userInfo[msg.sender].isExists, "User not registered");
    _;
  }

  modifier onlyDoctor() {
    require(hasRole(DOCTOR_ROLE, msg.sender), "User is not a doctor");
    _;
  }

  modifier onlyPatient() {
    require(hasRole(PATIENT_ROLE, msg.sender), "User is not a patient");
    _;
  }

  /// @dev Mantainer for WAM
  function addWaysAdministeringMedicines(string memory _name) public onlyOwner {
    uint256 id = wamId.current();
    wamList.push(WaysAdministeringMedicines({id: id, name: _name}));
    wamId.increment();
  }

  /// @dev Mantainer for IntakeTime
  function addIntakeTime(string memory _time) public onlyOwner {
    uint256 id = intakeTimeId.current();
    intakeTimeList.push(IntakeTime({id: id, time: _time}));
    intakeTimeId.increment();
  }

  /// @dev Mantainer for Medicine
  function addMedicine(string memory _name, uint8 _wamId) public onlyOwner {
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
    UserRole _userRole
  ) public onlyUser {
    userInfo[msg.sender] = User({
      id: _id,
      name: _name,
      email: _email,
      userRole: _userRole,
      isExists: true
    });

    if (_userRole == UserRole.Doctor) grantRole(DOCTOR_ROLE, msg.sender);

    if (_userRole == UserRole.Pharmacist)
      grantRole(PHARMACIST_ROLE, msg.sender);

    if (_userRole == UserRole.Patient) {
      grantRole(PATIENT_ROLE, msg.sender);
      patientList.push(userInfo[msg.sender]);
    }
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
  function getPatientList() public view onlyDoctor returns (User[] memory) {
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
}
