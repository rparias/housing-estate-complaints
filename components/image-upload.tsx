"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { X, Upload, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  images: File[]
  onImagesChange: (images: File[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter((file) => {
      // Validar que sea imagen
      if (!file.type.startsWith("image/")) return false
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) return false
      return true
    })

    const totalImages = images.length + newFiles.length
    if (totalImages > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`)
      return
    }

    onImagesChange([...images, ...newFiles])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      <Label>Fotografías (opcional)</Label>

      {/* Área de drop */}
      <Card
        className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <div>
            <p className="text-sm font-medium">Haz clic o arrastra imágenes aquí</p>
            <p className="text-xs text-gray-500">Máximo {maxImages} imágenes, hasta 5MB cada una</p>
          </div>
        </div>
      </Card>

      {/* Preview de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
              <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ImageIcon className="w-4 h-4" />
          <span>
            {images.length} imagen{images.length !== 1 ? "es" : ""} seleccionada{images.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  )
}
