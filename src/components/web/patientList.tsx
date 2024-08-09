"use client"

import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

const PatientList = () => {
  const patientList = [
    {
      id: "6544-ASD-4654",
      name: "Liam Johnson",
      email: "liam@pep.com",
    },
  ]
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>List of Patients</CardTitle>
        {/* <CardDescription>Recent orders from your store.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Id</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientList.map(({ id, name, email }) => (
              <TableRow className="bg-accent">
                <TableCell>
                  <div className="font-medium">{name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {email}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{id}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm">View Recipes</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default PatientList
