"use client"

import { useState, useEffect } from "react"
import ImageOverlay from "@/components/image-overlay"

type ShiftsData = {
  [key: number]: { [key: number]: string }
}

export default function Home() {
  const [image1, setImage1] = useState<string | null>(null)
  const [image2, setImage2] = useState<string | null>(null)
  const [currentShift, setCurrentShift] = useState<number | null>(null)
  const [shiftsData, setShiftsData] = useState<ShiftsData>({
    1: {},
    2: {},
    3: {},
    4: {},
  })
  const [selectedExit, setSelectedExit] = useState<number | null>(null)
  const [exitPositions1, setExitPositions1] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [exitPositions2, setExitPositions2] = useState<{ [key: number]: { x: number; y: number } }>({})

  useEffect(() => {
    const savedShiftsData = localStorage.getItem("shiftsData")
    const savedExitPositions1 = localStorage.getItem("exitPositions1")
    const savedExitPositions2 = localStorage.getItem("exitPositions2")
    const savedImage1 = localStorage.getItem("emergencyImage1")
    const savedImage2 = localStorage.getItem("emergencyImage2")

    if (savedShiftsData) setShiftsData(JSON.parse(savedShiftsData))
    if (savedExitPositions1) setExitPositions1(JSON.parse(savedExitPositions1))
    if (savedExitPositions2) setExitPositions2(JSON.parse(savedExitPositions2))
    if (savedImage1) setImage1(savedImage1)
    if (savedImage2) setImage2(savedImage2)
  }, [])

  const exits = currentShift ? shiftsData[currentShift] || {} : {}

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {currentShift === null ? (
          <>
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <div className="inline-block px-6 py-2 bg-primary/10 rounded-full mb-6">
                <span className="text-primary font-semibold text-sm tracking-wide uppercase">Turnos cajittas</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
                Asamblea de circuito 2025-2026
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Selecciona tu turno para visualizar tu punto asignado
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((shift) => (
                  <button
                    key={shift}
                    onClick={() => setCurrentShift(shift)}
                    className="group relative h-64 rounded-2xl overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-card/80 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent"></div>

                    <div className="relative h-full flex flex-col items-center justify-center p-8">
                      <div className="mb-4 px-4 py-1 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Turno
                        </p>
                      </div>
                      <p className="text-8xl font-black text-primary group-hover:scale-110 transition-transform duration-300 mb-4">
                        {shift}
                      </p>
                      {shiftsData[shift] && Object.keys(shiftsData[shift]).length > 0 ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <p className="text-xs font-medium text-foreground">
                            {Object.keys(shiftsData[shift]).length}/10 puntos configurados
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No configurado
                        </p>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center mt-16">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors group"
              >
                <span className="px-4 py-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  🔐 Acceso administrador
                </span>
              </a>
            </div>
          </>
        ) : (
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => {
                setCurrentShift(null)
                setSelectedExit(null)
              }}
              className="mb-8 inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all hover:shadow-lg font-medium"
            >
              <span>←</span>
              <span>Volver a turnos</span>
            </button>

            <div className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border-2 border-border shadow-2xl">
              <div className="text-center mb-12">
                <div className="inline-block px-6 py-2 bg-primary/10 rounded-full mb-4">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">Turno seleccionado</p>
                </div>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                  <p className="relative text-8xl md:text-9xl font-black text-primary">{currentShift}</p>
                </div>
              </div>

              <div className="space-y-8">
                {image1 && (
                  <div className="bg-gradient-to-br from-background to-muted rounded-2xl p-8 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">📍</span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground">Plano de salida - Puntos 1-8</h2>
                    </div>
                    <ImageOverlay
                      image={image1}
                      exits={exits}
                      selectedExit={selectedExit}
                      onExitClick={setSelectedExit}
                      exitPositions={exitPositions1}
                      startNumber={1}
                    />
                  </div>
                )}

                {image2 && (
                  <div className="bg-gradient-to-br from-background to-muted rounded-2xl p-8 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">📍</span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground">Plano de salida - Puntos 9-10</h2>
                    </div>
                    <ImageOverlay
                      image={image2}
                      exits={exits}
                      selectedExit={selectedExit}
                      onExitClick={setSelectedExit}
                      exitPositions={exitPositions2}
                      startNumber={9}
                    />
                  </div>
                )}

                {!image1 && !image2 && (
                  <div className="text-center py-20 bg-gradient-to-br from-muted to-background rounded-2xl border-2 border-dashed border-border">
                    <div className="mb-4 text-6xl">⚠️</div>
                    <p className="text-foreground text-xl font-semibold mb-2">No hay planos configurados</p>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      El administrador debe configurar los planos de emergencia para este turno
                    </p>
                  </div>
                )}
              </div>

              {exits && Object.keys(exits).length > 0 && (
                <div className="mt-12 pt-8 border-t-2 border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">🚪</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Puntos de salida</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((exitNum) => (
                      <div
                        key={exitNum}
                        className={`group relative bg-gradient-to-br from-background to-muted border-2 rounded-xl p-5 text-center cursor-pointer transition-all hover:shadow-lg ${
                          selectedExit === exitNum
                            ? "border-primary bg-primary/10 shadow-lg scale-105"
                            : "border-border hover:border-primary hover:scale-105"
                        }`}
                        onClick={() => setSelectedExit(exitNum)}
                      >
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold">{exitNum}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 font-medium">Salida</p>
                        <p className="font-bold text-foreground text-sm leading-tight min-h-10 flex items-center justify-center">
                          {exits[exitNum] || "—"}
                        </p>
                        {selectedExit === exitNum && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-xl"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
