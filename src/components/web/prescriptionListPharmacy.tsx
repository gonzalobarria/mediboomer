"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Checkbox } from "../ui/checkbox"

import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

const formSchema = z.object({
  medicines: z.array(
    z.object({
      prescriptionId: z.string(),
      medicineName: z.string(),
      isDelivered: z.boolean().default(false).optional(),
    })
  ),
})

type PrescriptionListPharmacyProps = {
  medicalRecipeId: string
}

const PrescriptionListPharmacy = ({
  medicalRecipeId,
}: PrescriptionListPharmacyProps) => {
  const docId = "987-ASDdFF-65"
  const prescriptions = [
    {
      prescriptionId: "654",
      medicineName: "Aspirina",
      doses: "2 tabletas",
      wamName: "Oral",
      duration: 5,
      isDelivered: true,
    },
    {
      prescriptionId: "852",
      medicineName: "Hoja de Coca",
      doses: "2 gramos",
      wamName: "Sublingual",
      duration: 10,
      isDelivered: false,
    },
  ]

  const viewPrescription = (prescriptionId: string) => {
    console.log(prescriptionId)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicines: prescriptions,
    },
  })

  // useEffect(() => {
  //   if (!user) router.replace("/")
  // }, [user])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("values :>> ", values)
  }

  const { fields } = useFieldArray({
    name: "medicines",
    control: form.control,
  })

  return (
    <div className="flex flex-col gap-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col shadow-lg bg-background">
            <Card>
              <CardHeader className="px-7 flex flex-row w-full justify-between">
                <CardTitle>List of Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine Name</TableHead>
                      <TableHead className="text-right">
                        is Delivered?
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No medical recipes were found
                        </TableCell>
                      </TableRow>
                    )}
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">
                          {field.medicineName}
                        </TableCell>

                        <TableCell className="w-fit text-right">
                          <FormField
                            control={form.control}
                            name={`medicines.${index}.isDelivered`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row justify-end space-x-3 space-y-0 p-2">
                                <FormControl>
                                  <Checkbox
                                    className="w-5 h-5"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end w-full space-x-4">
            <Button variant="link">Cancel</Button>
            <Button type="submit">Deliver Prescriptions</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default PrescriptionListPharmacy
