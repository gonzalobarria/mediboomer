"use client"

import { ReactNode, createContext, useContext } from "react"
import { MediBoomer } from "@/components/abis/types/MediBoomer"
import MediBoomerAbi from "@/components/abis/MediBoomer.json"
import { AlchemyProvider } from "ethers"
import {
  SendUserOperationWithEOA,
  useSendUserOperation,
  useSmartAccountClient,
} from "@account-kit/react"
import { accountType, accountClientOptions as opts, chain } from "@/config"
import { Hex, encodeFunctionData } from "viem"
import { EntryPointRegistryBase } from "@alchemy/aa-core"
import { fetchContract } from "@/lib/utils"

type MediBoomerProviderProps = {
  children: ReactNode
}

type MediBoomerContextType = {
  sendUserOperationResult:
    | SendUserOperationWithEOA<keyof EntryPointRegistryBase<unknown>>
    | undefined
  isSendingUserOperation: boolean
  isSendUserOperationError: Error | null
  getMedicineList: () => Promise<MediBoomer.MedicineStruct[] | undefined>
  addWaysAdministeringMedicines: () => void
  getWamList: () => Promise<
    MediBoomer.WaysAdministeringMedicinesStruct[] | undefined
  >
}

export const MediBoomerContext = createContext<MediBoomerContextType | null>(
  null
)

const MediBoomerProvider = ({ children }: MediBoomerProviderProps) => {
  const { client } = useSmartAccountClient({
    type: accountType,
    policyId: process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID!,
    opts,
  })

  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({
    client,
    waitForTxn: true,
    onSuccess: ({ hash, request }) => {
      // [optional] Do something with the hash and request
    },
    onError: (error) => {
      console.log("error en uo :>> ", error)
      // [optional] Do something with the error
    },
  })

  const getMedicineList = async (): Promise<
    MediBoomer.MedicineStruct[] | undefined
  > => {
    const provider = new AlchemyProvider(
      chain.id,
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    )

    const contract = fetchContract(provider)
    const medicineList = await contract.getMedicineList()

    return medicineList
  }

  const addWaysAdministeringMedicines = (): void => {
    const target = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Hex
    const value = "0"

    const data = encodeFunctionData({
      abi: MediBoomerAbi.abi,
      functionName: "addWaysAdministeringMedicines",
      args: ["Intravenosa"],
      // args: ["Sublingual"],
      // args: ["Oral"],
    })

    sendUserOperation({
      uo: { target, data, value: value ? BigInt(value) : 0n },
    })
  }

  const getWamList = async (): Promise<
    MediBoomer.WaysAdministeringMedicinesStruct[] | undefined
  > => {
    const provider = new AlchemyProvider(
      chain.id,
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    )

    const contract = fetchContract(provider)
    const wamList = await contract.getWamList()

    return wamList
  }

  return (
    <MediBoomerContext.Provider
      value={{
        isSendingUserOperation,
        sendUserOperationResult,
        isSendUserOperationError,
        getMedicineList,
        addWaysAdministeringMedicines,
        getWamList,
      }}
    >
      {children}
    </MediBoomerContext.Provider>
  )
}

export default MediBoomerProvider
export const useMediBoomerContext = () =>
  useContext(MediBoomerContext) as MediBoomerContextType
