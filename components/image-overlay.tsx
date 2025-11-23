"use client"

import { useState } from "react"

interface ImageOverlayProps {
  image: string
  exits: { [key: number]: string }
  selectedExit: number | null
  onExitClick: (exitNumber: number) => void
  exitPositions?: { [key: number]: { x: number; y: number } }
  startNumber?: number
}

export default function ImageOverlay({
  image,
  exits,
  selectedExit,
  onExitClick,
  exitPositions = {},
  startNumber = 1,
}: ImageOverlayProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  const defaultPositions: { [key: number]: { x: number; y: number } } = {
    1: { x: 15, y: 30 },
    2: { x: 10, y: 55 },
    3: { x: 40, y: 30 },
    4: { x: 43, y: 50 },
    5: { x: 38, y: 70 },
    6: { x: 75, y: 30 },
    7: { x: 78, y: 50 },
    8: { x: 75, y: 85 },
    9: { x: 30, y: 40 },
    10: { x: 70, y: 60 },
  }

  const positionsToUse = Object.keys(exitPositions).length > 0 ? exitPositions : defaultPositions

  const endNumber = startNumber === 1 ? 8 : 10
  const exitNumbersToShow = Array.from({ length: endNumber - startNumber + 1 }, (_, i) => startNumber + i)

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border bg-background">
      <img
        src={image || "/placeholder.svg"}
        alt="Plano de emergencia"
        className="w-full h-auto block"
        onLoad={(e) => {
          const img = e.currentTarget
          setImageSize({ width: img.width, height: img.height })
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        {exitNumbersToShow.map((num) => {
          const pos = positionsToUse[num]
          const name = exits[num]
          const isSelected = selectedExit === num

          return (
            <div
              key={num}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              onClick={() => onExitClick(num)}
            >
              {/* Círculo del punto */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all ${
                  isSelected
                    ? "bg-primary scale-125 ring-2 ring-primary ring-offset-2"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {num}
              </div>

              {name && (
                <div className="absolute top-full mt-2 whitespace-nowrap bg-foreground text-background px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {name}
                </div>
              )}

              {!name && (
                <div className="absolute top-full mt-2 whitespace-nowrap bg-muted text-muted-foreground px-3 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Sin asignar
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
