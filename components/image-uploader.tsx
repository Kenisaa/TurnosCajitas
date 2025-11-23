"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageUpload(result)
      }
      reader.readAsDataURL(file)
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="bg-card rounded-lg p-8 border-2 border-dashed border-border">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`text-center cursor-pointer transition-colors ${dragActive ? "border-primary bg-primary/5" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground mb-2">Carga tu plano de emergencia</p>
        <p className="text-muted-foreground mb-4">Arrastra la imagen aquí o haz clic para seleccionar</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Seleccionar imagen
        </button>
      </div>
    </div>
  )
}
