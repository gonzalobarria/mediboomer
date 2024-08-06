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
    string medicineName;
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
    uint8 dose;
    IntakeTime[] intakeTimeList;
  }

  /// @dev Medical Recipe
  struct MedicalRecipe {
    uint256 id;
    address patient;
    Prescription[] prescriptions;
  }

  WaysAdministeringMedicines[] wamList;
  Medicine[] medicineList;
  IntakeTime[] intakeTimeList;

  /// @dev Only users as patients in this list
  User[] patientList;

  /// @dev map patient with their medical recipes
  mapping(address => MedicalRecipe[]) patientMedicalRecipeList;

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
  function addMedicine(
    string memory _medicineName,
    uint8 _wamId
  ) public onlyOwner {
    uint256 medId = medicineId.current();
    medicineList.push(
      Medicine({id: medId, medicineName: _medicineName, wamId: _wamId})
    );
    medicineId.increment();
  }

  /// @dev Add a Medical Recipe
  function addMedicalRecipe(
    address _patient,
    Prescription[] memory _prescriptionList
  ) public {
    uint256 id = medicalRecipeId.current();
    Prescription[] memory prescriptionList = new Prescription[](
      _prescriptionList.length
    );
    uint j = 0;

    for (uint i = 0; i < _prescriptionList.length; i++) {
      uint256 prescId = prescriptionId.current();

      Prescription memory prescription = Prescription({
        id: prescId,
        medicineId: _prescriptionList[i].medicineId,
        dose: _prescriptionList[i].dose,
        intakeTimeList: _prescriptionList[i].intakeTimeList
      });

      prescriptionList[j] = prescription;
      j++;
      prescriptionId.increment();
    }

    // MedicalRecipe memory mr = MedicalRecipe({
    //   id: id,
    //   patient: _patient,
    //   prescriptions: prescriptionList
    // });

    // MedicalRecipe[] memory patMRL = patientMedicalRecipeList[_patient];
    // patMRL.push(mr);
    patientMedicalRecipeList[_patient].push(
      MedicalRecipe({
        id: id,
        patient: _patient,
        prescriptions: prescriptionList
      })
    );

    medicalRecipeId.increment();
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
    return patientMedicalRecipeList[_address];
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
