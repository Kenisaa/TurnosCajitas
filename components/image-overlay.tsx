"use client"

import { useState, useRef, useEffect } from "react"

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
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const pointRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll automático cuando se selecciona un punto
  useEffect(() => {
    if (selectedExit && pointRefs.current[selectedExit] && containerRef.current) {
      const pointElement = pointRefs.current[selectedExit]
      const container = containerRef.current

      // Calcular posición del punto relativo al contenedor
      const pointRect = pointElement.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // Calcular el scroll necesario para centrar el punto
      const scrollLeft = container.scrollLeft + (pointRect.left - containerRect.left) - containerRect.width / 2 + pointRect.width / 2
      const scrollTop = container.scrollTop + (pointRect.top - containerRect.top) - containerRect.height / 2 + pointRect.height / 2

      // Hacer scroll suave
      container.scrollTo({
        left: scrollLeft,
        top: scrollTop,
        behavior: 'smooth'
      })

      // Si no hay zoom, hacer zoom automático en móvil
      if (isMobile && scale === 1) {
        setScale(1.5)
      }
    }
  }, [selectedExit, isMobile, scale])

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

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 1))
  const handleResetZoom = () => setScale(1)

  // Tamaño del punto basado en si es móvil y el zoom
  const pointSize = isMobile ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base'

  return (
    <div className="space-y-4">
      {/* Controles de zoom para móvil */}
      {isMobile && (
        <div className="flex items-center justify-center gap-2 bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
          >
            🔍−
          </button>
          <span className="text-foreground font-semibold min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
          >
            🔍+
          </button>
          {scale > 1 && (
            <button
              onClick={handleResetZoom}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-all"
            >
              Resetear
            </button>
          )}
        </div>
      )}

      {/* Contenedor de la imagen con scroll */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-lg border border-border bg-background ${
          isMobile && scale > 1 ? 'overflow-auto' : 'overflow-hidden'
        }`}
        style={{
          maxHeight: isMobile ? '70vh' : 'none',
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${100 / scale}%`,
          }}
        >
          <div className="relative">
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
                    ref={(el) => (pointRefs.current[num] = el)}
                    className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                    onClick={() => onExitClick(num)}
                  >
                    {/* Círculo del punto */}
                    <div
                      className={`${pointSize} rounded-full flex items-center justify-center font-bold text-white transition-all shadow-lg ${
                        isSelected
                          ? "bg-primary scale-125 ring-4 ring-primary/50 ring-offset-2 animate-pulse"
                          : "bg-secondary hover:bg-secondary/90 active:scale-110"
                      }`}
                    >
                      {num}
                    </div>

                    {/* Tooltip en móvil: siempre visible si está seleccionado */}
                    {name && (
                      <div
                        className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-xl transition-opacity pointer-events-none ${
                          isMobile && isSelected
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                        style={{
                          maxWidth: '200px',
                          whiteSpace: 'normal',
                          textAlign: 'center',
                        }}
                      >
                        {name}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45"></div>
                      </div>
                    )}

                    {!name && (
                      <div
                        className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-muted text-muted-foreground px-3 py-1 rounded-md text-xs transition-opacity pointer-events-none ${
                          isMobile && isSelected
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        Sin asignar
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ayuda para móvil */}
      {isMobile && (
        <div className="text-center text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1">
          <p>💡 <strong>Tip:</strong> Toca un punto o selecciónalo de la lista abajo.</p>
          <p>🎯 La imagen hará zoom y se centrará automáticamente en tu punto.</p>
        </div>
      )}
    </div>
  )
}
