import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const MediBoomerModule = buildModule("MediBoomerModule", (m) => {
  const mediBoomer = m.contract("MediBoomer", [30])

  return { mediBoomer }
})

export default MediBoomerModule
