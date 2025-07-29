import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, User, Calendar } from "lucide-react"
import { ImageGallery } from "@/components/image-gallery"

interface Review {
  id: number
  categorias: string[] // Cambiado de categoria a categorias
  calificacion: number
  titulo: string
  descripcion: string
  fecha: string
  anonimo: boolean
  imagenes?: string[]
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const getCategoriaColor = (categoria: string) => {
    const colors = {
      Construcción: "bg-red-100 text-red-800",
      Servicios: "bg-blue-100 text-blue-800",
      "Áreas Comunes": "bg-green-100 text-green-800",
      Seguridad: "bg-purple-100 text-purple-800",
      Administración: "bg-yellow-100 text-yellow-800",
    }
    return colors[categoria as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Múltiples badges de categorías */}
            <div className="flex flex-wrap gap-2">
              {review.categorias.map((categoria) => (
                <Badge key={categoria} className={getCategoriaColor(categoria)}>
                  {categoria}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.calificacion ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">({review.calificacion}/5)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {formatFecha(review.fecha)}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mt-2">{review.titulo}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed mb-4">{review.descripcion}</p>
        <ImageGallery images={review.imagenes || []} alt={`Imágenes de: ${review.titulo}`} />
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
          <User className="w-4 h-4" />
          <span>Vecino anónimo</span>
        </div>
      </CardContent>
    </Card>
  )
}
