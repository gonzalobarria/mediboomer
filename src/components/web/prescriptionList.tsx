"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

const PrescriptionList = () => {
  const docId = "987-ASDdFF-65"
  const prescriptions = [
    {
      medicineName: "Aspirina",
      doses: "2 tabletas",
      wamName: "Oral",
      duration: 5,
    },
    {
      medicineName: "Hoja de Coca",
      doses: "2 gramos",
      wamName: "Sublingual",
      duration: 10,
    },
  ]

  const viewPrescription = (prescriptionId: string) => {
    console.log(prescriptionId)
  }

  return (
    <div className="flex flex-col gap-y-5">
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
                  <TableHead className="hidden sm:table-cell">Doses</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Ways of Administering Medicines
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    How long
                  </TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No medical recipes were found
                    </TableCell>
                  </TableRow>
                )}
                {prescriptions.map(
                  ({ medicineName, doses, wamName, duration }, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {medicineName}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {doses}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {wamName}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {duration}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end w-full space-x-4">
        <Button variant="link">Cancel</Button>
        <Button>Save Medical Recipe</Button>
      </div>
    </div>
  )
}

export default PrescriptionList
