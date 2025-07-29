"use client"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CategorySelectorProps {
  selectedCategories: string[]
  onCategoriesChange: (categories: string[]) => void
}

const availableCategories = ["Construcción", "Servicios", "Áreas Comunes", "Seguridad", "Administración"]

export function CategorySelector({ selectedCategories, onCategoriesChange }: CategorySelectorProps) {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  return (
    <div className="space-y-3">
      <Label>Categorías * (selecciona una o más)</Label>

      {/* Mostrar categorías seleccionadas */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedCategories.map((category) => (
            <Badge key={category} variant="default" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <Label htmlFor={category} className="text-sm font-normal cursor-pointer flex-1">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500">
        {selectedCategories.length === 0
          ? "Selecciona al menos una categoría"
          : `${selectedCategories.length} categoría${selectedCategories.length !== 1 ? "s" : ""} seleccionada${selectedCategories.length !== 1 ? "s" : ""}`}
      </p>
    </div>
  )
}
