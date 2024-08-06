import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { assert, expect } from "chai"
import { ethers } from "hardhat"

describe("MediBoomer", function () {
  async function deployMediBoomer() {
    const [owner, account1, account2] = await ethers.getSigners()

    const MediBoomer = await ethers.getContractFactory("MediBoomer")

    const mediBoomer = await MediBoomer.deploy()

    return { mediBoomer, owner, account1, account2 }
  }

  describe("Basic Test", () => {
    
  })
})
