import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { assert, expect } from "chai"
import { ethers } from "hardhat"
import { UserRole } from "./enums"

describe("MediBoomer", function () {
  async function deployMediBoomer() {
    const [owner, account1, account2] = await ethers.getSigners()

    const MediBoomer = await ethers.getContractFactory("MediBoomer")

    const mediBoomer = await MediBoomer.deploy()

    return { mediBoomer, owner, account1, account2 }
  }

  describe("Basic Test", () => {
    it("Add User", async () => {
      const { mediBoomer, account1, account2 } =
        await loadFixture(deployMediBoomer)
      let id = "123-1323DSR"
      let userName = "Gonzalo"
      let email = "gbm@gbm.com"

      await mediBoomer.addUser(id, userName, email, account1, UserRole.Patient)

      const patientList = await mediBoomer.getPatientList()

      assert(patientList[0].name, userName)

      id = "5489-6QWER"
      userName = "PedroPE"
      email = "pedro@gbm.com"

      await mediBoomer.addUser(id, userName, email, account2, UserRole.Doctor)

      await expect(
        mediBoomer.connect(account1).getPatientList(),
      ).to.be.revertedWith("User is not a doctor")
    })

    it("Add Ways of Administering Medicines", async () => {
      const { mediBoomer } = await loadFixture(deployMediBoomer)
      const wamName = "Oral"

      await mediBoomer.addWaysAdministeringMedicines(wamName)

      const wamList = await mediBoomer.getWamList()

      assert(wamList[0].name, wamName)
    })

    it("Add Medicine", async () => {
      const { mediBoomer } = await loadFixture(deployMediBoomer)
      const wamName = "Oral"
      await mediBoomer.addWaysAdministeringMedicines(wamName)
      const wamList = await mediBoomer.getWamList()

      const medicineName = "Aspirina"
      await mediBoomer.addMedicine(medicineName, wamList[0].id)
      const medicineList = await mediBoomer.getMedicineList()

      assert(medicineList[0].name, medicineName)
    })

    it("Add Intake Time", async () => {
      const { mediBoomer } = await loadFixture(deployMediBoomer)
      const time = "15:00"
      await mediBoomer.addIntakeTime(time)
      const ittList = await mediBoomer.getIntakeTimeList()

      assert(ittList[0].time, time)
    })

    it("Add Medical Recipe", async () => {
      const { mediBoomer, account1 } = await loadFixture(deployMediBoomer)
      const time = "15:00"
      await mediBoomer.addIntakeTime(time)

      const wamName = "Oral"
      await mediBoomer.addWaysAdministeringMedicines(wamName)
      const wamList = await mediBoomer.getWamList()

      const medicineName = "Aspirina"
      await mediBoomer.addMedicine(medicineName, wamList[0].id)
      const medicineList = await mediBoomer.getMedicineList()
      const dose = "2 cucharadas"

      const prescriptionArr = [
        {
          id: 0,
          medicineId: medicineList[0].id,
          dose,
          duration: 2,
          isDelivered: false,
          intakeTimeList: [
            {
              id: 0,
              time,
            },
          ],
        },
      ]
      await mediBoomer.addMedicalRecipe(account1, prescriptionArr)
      const pml = await mediBoomer.getPatientMedicalRecipeList(account1)

      assert(pml[0].patient, account1 + "")
    })
  })
})
