import type { Review, CreateReviewData, ReviewFilters, ReviewStats } from "@/types/review"
import { ReviewService } from "./review-service"

// Datos mock actualizados con múltiples categorías
const mockReviews: Review[] = [
  {
    id: 1,
    categorias: ["Construcción", "Servicios"], // Múltiples categorías
    calificacion: 2,
    titulo: "Problemas con filtraciones en el techo",
    descripcion:
      "Desde las últimas lluvias tengo filtraciones en el techo de mi casa. Ya van varios vecinos con el mismo problema y la constructora no ha dado respuesta satisfactoria.",
    fecha: "2024-01-15",
    anonimo: true,
    imagenes: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
  },
  {
    id: 2,
    categorias: ["Servicios"],
    calificacion: 1,
    titulo: "Falta de agua constante",
    descripcion:
      "El suministro de agua se corta frecuentemente, especialmente en las mañanas. Esto afecta nuestra rutina diaria y no hemos recibido explicaciones claras.",
    fecha: "2024-01-12",
    anonimo: true,
    imagenes: ["/placeholder.svg?height=300&width=400"],
  },
  {
    id: 3,
    categorias: ["Áreas Comunes", "Administración"],
    calificacion: 3,
    titulo: "Mantenimiento de jardines",
    descripcion:
      "Las áreas verdes necesitan mejor mantenimiento. El césped está descuidado y algunos árboles requieren poda.",
    fecha: "2024-01-10",
    anonimo: true,
    imagenes: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  {
    id: 4,
    categorias: ["Seguridad"],
    calificacion: 4,
    titulo: "Buena respuesta del personal de seguridad",
    descripcion: "El personal de seguridad ha sido muy atento y profesional. Se sienten seguros en el conjunto.",
    fecha: "2024-01-08",
    anonimo: true,
  },
  {
    id: 5,
    categorias: ["Construcción"],
    calificacion: 2,
    titulo: "Grietas en las paredes",
    descripcion:
      "Han aparecido grietas en las paredes interiores de mi casa. Me preocupa que sea un problema estructural que deba ser revisado por la constructora.",
    fecha: "2024-01-05",
    anonimo: true,
    imagenes: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
  },
  {
    id: 6,
    categorias: ["Servicios", "Administración"],
    calificacion: 5,
    titulo: "Excelente atención al cliente",
    descripcion:
      "La administración respondió rápidamente a mi solicitud y solucionaron el problema de manera eficiente.",
    fecha: "2024-01-20",
    anonimo: true,
  },
  {
    id: 7,
    categorias: ["Áreas Comunes", "Seguridad"],
    calificacion: 4,
    titulo: "Mejoras en las áreas recreativas",
    descripcion:
      "Se han hecho mejoras notables en el parque infantil y la zona de ejercicios. Los niños están muy contentos.",
    fecha: "2024-01-18",
    anonimo: true,
    imagenes: ["/placeholder.svg?height=300&width=400"],
  },
]

export class MockReviewService extends ReviewService {
  private reviews: Review[] = [...mockReviews]
  private nextId = 8

  async getReviews(filters?: ReviewFilters): Promise<Review[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredReviews = [...this.reviews]

    // Filtrar por categorías
    if (filters?.categorias && filters.categorias.length > 0 && !filters.categorias.includes("Todas")) {
      filteredReviews = filteredReviews.filter((review) =>
        filters.categorias!.some((categoria) => review.categorias.includes(categoria)),
      )
    }

    // Filtrar por calificación mínima
    if (filters?.calificacionMin) {
      filteredReviews = filteredReviews.filter((r) => r.calificacion >= filters.calificacionMin!)
    }

    // Filtrar por calificación máxima
    if (filters?.calificacionMax) {
      filteredReviews = filteredReviews.filter((r) => r.calificacion <= filters.calificacionMax!)
    }

    // Aplicar ordenamiento
    switch (filters?.ordenamiento) {
      case "mejor":
        filteredReviews.sort((a, b) => b.calificacion - a.calificacion)
        break
      case "peor":
        filteredReviews.sort((a, b) => a.calificacion - b.calificacion)
        break
      case "antiguo":
        filteredReviews.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        break
      case "reciente":
      default:
        filteredReviews.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        break
    }

    return filteredReviews
  }

  async createReview(data: CreateReviewData): Promise<Review> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular upload de imágenes
    const imageUrls = data.imagenes ? await this.uploadImages(data.imagenes) : undefined

    const newReview: Review = {
      id: this.nextId++,
      categorias: data.categorias,
      calificacion: data.calificacion,
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha: new Date().toISOString().split("T")[0],
      anonimo: true,
      imagenes: imageUrls,
    }

    this.reviews.unshift(newReview)
    return newReview
  }

  async getStats(): Promise<ReviewStats> {
    const reviews = await this.getReviews()
    const total = reviews.length
    const promedio = total > 0 ? reviews.reduce((sum, r) => sum + r.calificacion, 0) / total : 0
    const ultimaFecha = reviews.length > 0 ? reviews[0].fecha : new Date().toISOString().split("T")[0]

    return {
      total,
      promedio: Math.round(promedio * 10) / 10,
      ultimaFecha,
    }
  }

  async uploadImages(images: File[]): Promise<string[]> {
    // Simular upload de imágenes
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return images.map(
      (_, index) => `/placeholder.svg?height=300&width=400&query=imagen subida por usuario ${index + 1}`,
    )
  }
}

// Instancia singleton del servicio
export const reviewService = new MockReviewService()
