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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BriefcaseMedical, HeartPulse, Pill } from "lucide-react"
import { useUser } from "@account-kit/react"
import { UserRole } from "@/lib/constants"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  userRole: z.enum(
    [`${UserRole.Doctor}`, `${UserRole.Pharmacist}`, `${UserRole.Patient}`],
    {
      required_error: "You need to select a Role",
    }
  ),
})

const Register = () => {
  const router = useRouter()
  const user = useUser()
  const { addUser } = useMediBoomerContext()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      userRole: `${UserRole.Patient}`,
    },
  })

  // useEffect(() => {
  //   if (!user) router.replace("/")
  // }, [user])

  if (!user) return <></>

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    if (!user) return

    await addUser(
      user.userId,
      values.name,
      user.email!,
      user.address,
      parseInt(values.userRole)
    )
    setIsLoading(false)

    router.push("/")
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-5">
      <h1 className="text-xl font-semibold text-center">
        Register to MediBoomer
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Frederick Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userRole"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Notify me about...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value={`${UserRole.Patient}`}
                        id={`${UserRole.Patient}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`${UserRole.Patient}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <BriefcaseMedical className="mb-3 h-6 w-6" />
                        Patient
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value={`${UserRole.Pharmacist}`}
                        id={`${UserRole.Pharmacist}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`${UserRole.Pharmacist}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Pill className="mb-3 h-6 w-6" />
                        Pharmacist
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value={`${UserRole.Doctor}`}
                        id={`${UserRole.Doctor}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`${UserRole.Doctor}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <HeartPulse className="mb-3 h-6 w-6" />
                        Doctor
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Register
