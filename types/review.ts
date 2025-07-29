export interface Review {
  id: number
  categorias: string[] // Cambiado de categoria a categorias (array)
  calificacion: number
  titulo: string
  descripcion: string
  fecha: string
  anonimo: boolean
  imagenes?: string[]
}

export interface CreateReviewData {
  categorias: string[] // Cambiado de categoria a categorias (array)
  calificacion: number
  titulo: string
  descripcion: string
  imagenes?: File[]
}

export interface ReviewFilters {
  categorias?: string[]
  calificacionMin?: number
  calificacionMax?: number
  ordenamiento?: "reciente" | "antiguo" | "mejor" | "peor" // Nuevo campo de ordenamiento
}

export interface ReviewStats {
  total: number
  promedio: number
  ultimaFecha: string
}
