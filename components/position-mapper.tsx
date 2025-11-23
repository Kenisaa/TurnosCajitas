"use client"

import type React from "react"
import { useState } from "react"

interface PositionMapperProps {
  image: string
  startNumber: number
  endNumber: number
  onPositionSet: (positions: { [key: number]: { x: number; y: number } }) => void
  onMappingComplete: () => void
}

export default function PositionMapper({
  image,
  startNumber,
  endNumber,
  onPositionSet,
  onMappingComplete,
}: PositionMapperProps) {
  const [currentExit, setCurrentExit] = useState(startNumber)
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  const totalPoints = endNumber - startNumber + 1

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef) return

    const rect = imageRef.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPositions((prev) => ({
      ...prev,
      [currentExit]: { x, y },
    }))

    if (currentExit < endNumber) {
      setCurrentExit(currentExit + 1)
    }
  }

  const handleUndo = () => {
    if (currentExit > startNumber) {
      setCurrentExit(currentExit - 1)
      setPositions((prev) => {
        const newPositions = { ...prev }
        delete newPositions[currentExit - 1]
        return newPositions
      })
    }
  }

  const handleComplete = () => {
    onPositionSet(positions)
    onMappingComplete()
  }

  const progressCount = Object.keys(positions).length

  return (
    <div className="bg-card rounded-lg p-6 border border-border space-y-4 mt-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Marcar posiciones exactas</h2>
        <p className="text-sm text-muted-foreground">
          Haz click en la imagen para marcar la posición del punto{" "}
          <span className="font-bold text-primary">{currentExit}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Progreso: {progressCount}/{totalPoints}
        </p>
      </div>

      <div
        className="relative w-full rounded-lg overflow-hidden border-2 border-primary cursor-crosshair bg-black/5"
        onClick={handleImageClick}
      >
        <img
          src={image || "/placeholder.svg"}
          alt="Plano de emergencia para mapeo"
          className="w-full h-auto block"
          ref={setImageRef}
        />

        {Object.entries(positions).map(([num, pos]) => (
          <div
            key={num}
            className="absolute w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm transform -translate-x-1/2 -translate-y-1/2 ring-2 ring-green-300"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          >
            {num}
          </div>
        ))}

        {!positions[currentExit] && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary/20 mb-2">{currentExit}</div>
              <p className="text-muted-foreground">Haz click aquí</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleUndo}
          disabled={currentExit === startNumber && progressCount === 0}
          className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Deshacer
        </button>
        <button
          onClick={handleComplete}
          disabled={progressCount < totalPoints}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {progressCount === totalPoints ? "Completar mapeo" : `Faltan ${totalPoints - progressCount}`}
        </button>
      </div>
    </div>
  )
}
