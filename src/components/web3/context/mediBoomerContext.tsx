"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { MediBoomer } from "@/components/abis/types/MediBoomer"
import MediBoomerAbi from "@/components/abis/MediBoomer.json"
import { ZeroAddress } from "ethers"
import {
  SendUserOperationWithEOA,
  useBundlerClient,
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from "@account-kit/react"
import { accountType, accountClientOptions as opts } from "@/config"
import { Hex, encodeFunctionData } from "viem"
import { EntryPointRegistryBase } from "@alchemy/aa-core"
import { ClientWithAlchemyMethods } from "@account-kit/infra"

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
  addWaysAdministeringMedicines: (name: string, userAddress: string) => void
  getWamList: () => Promise<
    MediBoomer.WaysAdministeringMedicinesStruct[] | undefined
  >
  getUserInfo: (
    userAddress: string
  ) => Promise<MediBoomer.UserStruct[] | undefined>

  addUser: (
    id: string,
    name: string,
    email: string,
    userAddress: string,
    userRole: number
  ) => Promise<void | string>
  clientBundler: ClientWithAlchemyMethods
  userInfo: MediBoomer.UserStruct | undefined
}

export const MediBoomerContext = createContext<MediBoomerContextType | null>(
  null
)

const MediBoomerProvider = ({ children }: MediBoomerProviderProps) => {
  const user = useUser()
  const clientBundler = useBundlerClient()
  const { client } = useSmartAccountClient({
    type: accountType,
    policyId: process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID!,
    opts,
  })
  const [userInfo, setUserInfo] = useState<MediBoomer.UserStruct>()

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

  useEffect(() => {
    const asyncFunc = async () => {
      if (user) {
        const userInfo = (await clientBundler.readContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Hex,
          abi: MediBoomerAbi.abi,
          functionName: "getUserInfo",
          args: [user.address],
        })) as MediBoomer.UserStruct

        setUserInfo(userInfo)
      }
    }

    asyncFunc()
  }, [user])

  const getMedicineList = async (): Promise<
    MediBoomer.MedicineStruct[] | undefined
  > => {
    const medicineList = (await clientBundler.readContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Hex,
      abi: MediBoomerAbi.abi,
      functionName: "getMedicineList",
      args: [],
    })) as MediBoomer.MedicineStruct[]

    return medicineList
  }

  const addWaysAdministeringMedicines = (
    name: string,
    userAddress: string
  ): void => {
    const target = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Hex
    const value = "0"

    const data = encodeFunctionData({
      abi: MediBoomerAbi.abi,
      functionName: "addWaysAdministeringMedicines",
      args: [name, userAddress],
    })

    sendUserOperation({
      uo: { target, data, value: value ? BigInt(value) : 0n },
    })
  }

  const addUser = async (
    id: string,
    name: string,
    email: string,
    userAddress: string,
    userRole: number
  ): Promise<void | string> => {
    const value = "0"

    const user = (await clientBundler.readContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Hex,
      abi: MediBoomerAbi.abi,
      functionName: "getUserInfo",
      args: [userAddress],
    })) as MediBoomer.UserStruct

    if (user.contractAddress !== ZeroAddress) {
      console.log("user :>> ", user)
      console.log("user.id :>> ", user.contractAddress)
      return "ya existe"
    }

    const target = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Hex
    const addr = userAddress as Hex

    const data = encodeFunctionData({
      abi: MediBoomerAbi.abi,
      functionName: "addUser",
      args: [id, name, email, addr, userRole],
    })

    sendUserOperation({
      uo: { target, data, value: value ? BigInt(value) : 0n },
    })
  }

  const getWamList = async (): Promise<
    MediBoomer.WaysAdministeringMedicinesStruct[] | undefined
  > => {
    const wamList = (await clientBundler.readContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Hex,
      abi: MediBoomerAbi.abi,
      functionName: "getWamList",
      args: [],
    })) as MediBoomer.WaysAdministeringMedicinesStruct[]

    return wamList
  }

  const getUserInfo = async (
    userAddress: string
  ): Promise<MediBoomer.UserStruct[] | undefined> => {
    const userInfo = (await clientBundler.readContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Hex,
      abi: MediBoomerAbi.abi,
      functionName: "getUserInfo",
      args: [userAddress],
    })) as MediBoomer.UserStruct[]

    return userInfo
  }

  return (
    <MediBoomerContext.Provider
      value={{
        addUser,
        addWaysAdministeringMedicines,
        getMedicineList,
        getUserInfo,
        getWamList,
        userInfo,

        isSendingUserOperation,
        sendUserOperationResult,
        isSendUserOperationError,

        clientBundler,
      }}
    >
      {children}
    </MediBoomerContext.Provider>
  )
}

export default MediBoomerProvider
export const useMediBoomerContext = () =>
  useContext(MediBoomerContext) as MediBoomerContextType
