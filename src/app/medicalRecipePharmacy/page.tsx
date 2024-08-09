"use client"

import PrescriptionListPharmacy from "@/components/web/prescriptionListPharmacy"

const SearchMedicalRecipes = () => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col mt-8 gap-y-10 max-w-4xl mx-auto min-h-screen">
        <div className="flex flex-row">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-2xl font-semibold tracking-tight sm:grow-0 content-center">
            Medical Recipe for <strong>Gonzalo Barría Marchant</strong>
          </h1>
        </div>
        <div className="flex flex-col">
          <PrescriptionListPharmacy medicalRecipeId="1" />
        </div>
      </div>
    </div>
  )
}

export default SearchMedicalRecipes
