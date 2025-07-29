"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpDown, Filter } from "lucide-react"

interface ReviewFiltersProps {
  onFiltersChange: (filters: {
    categorias: string[]
    ordenamiento: string
  }) => void
}

const categorias = ["Todas", "Construcción", "Servicios", "Áreas Comunes", "Seguridad", "Administración"]

const opcionesOrdenamiento = [
  { value: "reciente", label: "Más reciente" },
  { value: "antiguo", label: "Más antiguo" },
  { value: "mejor", label: "Mejor calificación" },
  { value: "peor", label: "Peor calificación" },
]

export function ReviewFilters({ onFiltersChange }: ReviewFiltersProps) {
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>(["Todas"])
  const [ordenamiento, setOrdenamiento] = useState("reciente")

  const handleCategoriaClick = (categoria: string) => {
    let nuevasCategorias: string[]

    if (categoria === "Todas") {
      nuevasCategorias = ["Todas"]
    } else {
      if (categoriasSeleccionadas.includes("Todas")) {
        nuevasCategorias = [categoria]
      } else if (categoriasSeleccionadas.includes(categoria)) {
        nuevasCategorias = categoriasSeleccionadas.filter((c) => c !== categoria)
        if (nuevasCategorias.length === 0) {
          nuevasCategorias = ["Todas"]
        }
      } else {
        nuevasCategorias = [...categoriasSeleccionadas, categoria]
      }
    }

    setCategoriasSeleccionadas(nuevasCategorias)
    onFiltersChange({
      categorias: nuevasCategorias,
      ordenamiento,
    })
  }

  const handleOrdenamientoChange = (nuevoOrdenamiento: string) => {
    setOrdenamiento(nuevoOrdenamiento)
    onFiltersChange({
      categorias: categoriasSeleccionadas,
      ordenamiento: nuevoOrdenamiento,
    })
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Filtros por categoría */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4" />
              <Label className="text-base font-semibold">Filtrar por categoría</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {categorias.map((categoria) => (
                <Badge
                  key={categoria}
                  variant={categoriasSeleccionadas.includes(categoria) ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => handleCategoriaClick(categoria)}
                >
                  {categoria}
                </Badge>
              ))}
            </div>
          </div>

          {/* Ordenamiento */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpDown className="w-4 h-4" />
              <Label className="text-base font-semibold">Ordenar por</Label>
            </div>
            <Select value={ordenamiento} onValueChange={handleOrdenamientoChange}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {opcionesOrdenamiento.map((opcion) => (
                  <SelectItem key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
