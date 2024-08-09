"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMediBoomerContext } from "@/components/web3/context/mediBoomerContext"

import { useUser } from "@account-kit/react"
import MedicalRecipeListPharmacy from "@/components/web/medicalRecipeListPharmacy"

const formSchema = z.object({
  patientId: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

const SearchMedicalRecipesPharmacy = () => {
  const router = useRouter()
  const user = useUser()
  const { userInfo } = useMediBoomerContext()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
    },
  })

  useEffect(() => {
    // if (userInfo?.userRole !== UserRole.Doctor) {
    //   router.push("/")
    // }
  }, [userInfo])

  if (!user) return <></>

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    if (!user) return


    setIsLoading(false)

    router.push("/")
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto min-h-screen">
      <div className="flex flex-col p-4 md:p-8 bg-background my-8 shadow-lg rounded-lg gap-y-5 ">
        <h1 className="text-xl font-semibold text-center">
          Search Medical Recipes by Patiend Id
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Id</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Search
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex flex-col ">
        <MedicalRecipeListPharmacy />
      </div>
    </div>
  )
}

export default SearchMedicalRecipesPharmacy
