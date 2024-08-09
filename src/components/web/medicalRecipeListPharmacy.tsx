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

const MedicalRecipeListPharmacy = () => {
  const docId = "987-ASDdFF-65"
  const medicalRecipes = [
    {
      mrId: "6544-ASD-4654",
      mrName: "Recipe 1",
      status: "Delivered",
    },
    {
      mrId: "6544-ASD-4654",
      mrName: "Recipe 2",
      status: "Partial",
      doctorId: "123-MMMM-65",
      doctorName: "Hidden",
      createdAt: "05/03/2023 15:23 PM",
    },
    {
      mrId: "504-ASD-4654",
      mrName: "Recipe 3",
      status: "No Delivered",
      doctorId: "987-ASDdFF-65",
      doctorName: "Liam Johnson",
      createdAt: "05/03/2023 15:23 PM",
    },
  ]

  const viewRecipe = (medicalRecipeId: string) => {
    console.log(medicalRecipeId)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col shadow-lg bg-background">
        <Card>
          <CardHeader className="px-7 flex flex-row w-full justify-between">
            <CardTitle className="w-64">List of Medical Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicalRecipes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No medical recipes were found
                    </TableCell>
                  </TableRow>
                )}
                {medicalRecipes.map(({ mrId, mrName, status }) => (
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">{mrName}</div>
                      <div className="hidden text-xs text-muted-foreground md:inline">
                        {mrId}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {status}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => viewRecipe(mrId)}
                        variant="outline"
                      >
                        View Recipes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MedicalRecipeListPharmacy
