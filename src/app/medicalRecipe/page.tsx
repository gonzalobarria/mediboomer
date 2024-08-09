"use client"

import { Button } from "@/components/ui/button"
import PrescriptionList from "@/components/web/prescriptionList"

const MedicalRecipe = () => {
  return (
    <div className="flex flex-col mt-8 gap-y-10 max-w-4xl mx-auto min-h-screen">
      <div className="flex flex-row">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-2xl font-semibold tracking-tight sm:grow-0 content-center">
          Medical Recipe for <strong>Gonzalo Barría Marchant</strong>
        </h1>
        <div className="flex flex-row max-w-fit ml-auto gap-8  justify-end">
          <Button variant="destructive">New Prescription</Button>
        </div>
      </div>
      <div className="flex flex-col">
        <PrescriptionList />
      </div>
    </div>
  )
}

export default MedicalRecipe
