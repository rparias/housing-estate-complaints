"use client"

import type React from "react"
import { ImageUpload } from "@/components/image-upload"
import { CategorySelector } from "@/components/category-selector"
import { reviewService } from "@/services/mock-review-service"
import type { CreateReviewData } from "@/types/review"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Shield, Send } from "lucide-react"

export function ReviewForm() {
  const [formData, setFormData] = useState<CreateReviewData>({
    categorias: [], // Cambiado de categoria a categorias
    calificacion: 0,
    titulo: "",
    descripcion: "",
    imagenes: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await reviewService.createReview(formData)
      setShowSuccess(true)

      // Limpiar formulario
      setFormData({
        categorias: [],
        calificacion: 0,
        titulo: "",
        descripcion: "",
        imagenes: [],
      })
    } catch (error) {
      console.error("Error al enviar review:", error)
    } finally {
      setIsSubmitting(false)
    }

    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const isFormValid = formData.categorias.length > 0 && formData.calificacion && formData.titulo && formData.descripcion

  return (
    <div className="space-y-6">
      {/* Mensaje de privacidad */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Tu privacidad está protegida.</strong> Esta review será completamente anónima. No recopilamos ningún
          dato personal que pueda identificarte.
        </AlertDescription>
      </Alert>

      {/* Mensaje de éxito */}
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ¡Review enviada exitosamente! Gracias por tu feedback anónimo.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Comparte tu experiencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de categorías múltiples */}
            <CategorySelector
              selectedCategories={formData.categorias}
              onCategoriesChange={(categorias) => setFormData({ ...formData, categorias })}
            />

            {/* Calificación */}
            <div className="space-y-3">
              <Label>Calificación *</Label>
              <RadioGroup
                value={formData.calificacion.toString()}
                onValueChange={(value) => setFormData({ ...formData, calificacion: Number.parseInt(value) })}
                className="flex gap-6"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                      {rating}
                      <div className="flex">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título de tu review *</Label>
              <Input
                id="titulo"
                placeholder="Ej: Problemas con el suministro de agua"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                maxLength={100}
              />
              <p className="text-sm text-gray-500">{formData.titulo.length}/100 caracteres</p>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Describe tu experiencia *</Label>
              <Textarea
                id="descripcion"
                placeholder="Comparte los detalles de tu experiencia. Sé específico para que la constructora pueda entender y abordar tu situación."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={6}
                maxLength={1000}
              />
              <p className="text-sm text-gray-500">{formData.descripcion.length}/1000 caracteres</p>
            </div>

            {/* Upload de imágenes */}
            <ImageUpload
              images={formData.imagenes || []}
              onImagesChange={(images) => setFormData({ ...formData, imagenes: images })}
              maxImages={5}
            />

            {/* Botón de envío */}
            <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Review Anónima
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">¿Por qué es importante tu feedback?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ayuda a identificar problemas comunes en el conjunto</li>
            <li>• Permite a la constructora priorizar las mejoras necesarias</li>
            <li>• Crea un registro histórico de la experiencia de los vecinos</li>
            <li>• Fomenta la transparencia y comunicación</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
