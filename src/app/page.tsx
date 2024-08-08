"use client"
import { MediBoomer } from "@/components/abis/types/MediBoomer"
import { Button } from "@/components/ui/button"
import { OpStatus } from "@/components/web/opStatus"
import { useMediBoomerContext } from "@/components/web3/context/mediBoomerContext"
import { chain } from "@/config"
import { fetchContract } from "@/lib/utils"
import { useSignerStatus, useUser } from "@account-kit/react"
import { AlchemyProvider } from "ethers"
import { useEffect, useState } from "react"

const provider = new AlchemyProvider(
  chain.id,
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
)

const contract = fetchContract(provider)

export default function Home() {
  const user = useUser()
  const { isInitializing, isAuthenticating, isConnected, status } =
    useSignerStatus()
  const {
    isSendingUserOperation,
    sendUserOperationResult,
    isSendUserOperationError,
    getMedicineList,
    addWaysAdministeringMedicines,
    getWamList,
  } = useMediBoomerContext()

  const [wamList, setWamList] = useState<
    MediBoomer.WaysAdministeringMedicinesStruct[] | undefined
  >()
  const [medicineList, setMedicineList] = useState<
    MediBoomer.MedicineStruct[] | undefined
  >()

  useEffect(() => {
    const asyncFunc = async () => {
      if (user) {
        const wl = await getWamList()
        setWamList(wl)
        const ml = await getMedicineList()
        setMedicineList(ml)
      }
    }

    asyncFunc()
  }, [user])

  const handleWamAdded = (address: string) => {
    console.log("address :>> ", address)
  }

  useEffect(() => {
    if (!contract) return
    contract.on("WamAdded", handleWamAdded)

    return () => {
      contract.removeAllListeners("WamAdded")
    }
  }, [contract])

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-4 justify-center text-center">
      <h1 className="text-5xl font-chicle">MediBoomer</h1>
      {user && (
        <>
          <div className="text-center text-lg font-semibold">
            Send a Transaction!
          </div>

          <div className="my-2 flex flex-col gap-4">
            <Button
              disabled={isSendingUserOperation}
              onClick={() => addWaysAdministeringMedicines()}
            >
              Add WAM
            </Button>
            {wamList?.map((wam) => (
              <div key={wam.id}>
                <span>{wam.id}</span>
                <span>{wam.name}</span>
              </div>
            ))}
            {medicineList?.map((ml) => (
              <div key={ml.id}>
                <span>{ml.id}</span>
                <span>{ml.name}</span>
                <span>{ml.wamId}</span>
              </div>
            ))}
          </div>
          <OpStatus
            sendUserOperationResult={sendUserOperationResult}
            isSendingUserOperation={isSendingUserOperation}
            isSendUserOperationError={isSendUserOperationError}
          />
        </>
      )}
    </main>
  )
}
