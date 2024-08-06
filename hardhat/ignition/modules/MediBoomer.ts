import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const MediBoomerModule = buildModule("MediBoomerModule", (m: any) => {
  const mediBoomer = m.contract("MediBoomer")

  return { mediBoomer }
})

export default MediBoomerModule
