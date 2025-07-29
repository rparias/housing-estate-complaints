"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MessageSquare, Star, Calendar } from "lucide-react"
import { ReviewCard } from "@/components/review-card"
import { ReviewFilters } from "@/components/review-filters"
import { reviewService } from "@/services/mock-review-service"
import type { Review, ReviewStats } from "@/types/review"

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({ total: 0, promedio: 0, ultimaFecha: "" })
  const [loading, setLoading] = useState(true)

  const loadReviews = async (filters?: { categorias: string[]; ordenamiento: string }) => {
    setLoading(true)
    try {
      const reviewsData = await reviewService.getReviews({
        categorias: filters?.categorias,
        ordenamiento: filters?.ordenamiento as any,
      })
      setReviews(reviewsData)
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await reviewService.getStats()
      setStats(statsData)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  useEffect(() => {
    loadReviews()
    loadStats()
  }, [])

  const handleFiltersChange = (filters: { categorias: string[]; ordenamiento: string }) => {
    loadReviews(filters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reviews Conjunto Habitacional</h1>
              <p className="text-gray-600 mt-1">Comparte tu experiencia de forma anónima</p>
            </div>
            <Link href="/nueva-review">
              <Button className="flex items-center gap-2 hover:cursor-pointer hover:bg-gray-600">
                <Plus className="w-4 h-4" />
                Nueva Review
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Reviews de vecinos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.promedio}/5</div>
              <p className="text-xs text-muted-foreground">Basado en todas las reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Review</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Hoy</div>
              <p className="text-xs text-muted-foreground">Reviews recientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <ReviewFilters onFiltersChange={handleFiltersChange} />

        {/* Lista de Reviews */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reviews {loading ? "Cargando..." : `(${reviews.length})`}</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No se encontraron reviews con los filtros seleccionados.</p>
            </Card>
          ) : (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-2">¿Tienes algo que compartir?</h3>
            <p className="text-gray-600 mb-4">Tu opinión es importante para mejorar nuestro conjunto habitacional</p>
            <Link href="/nueva-review">
              <Button size="lg" className="flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Agregar Review Anónima
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  )
}
