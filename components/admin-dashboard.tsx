"use client"

import { useState, useEffect } from "react"
import ImageUploader from "@/components/image-uploader"
import ExitForm from "@/components/exit-form"
import ExitsList from "@/components/exits-list"
import ImageOverlay from "@/components/image-overlay"
import PositionMapper from "@/components/position-mapper"
import ShiftSelector from "@/components/shift-selector"

type ShiftsData = {
  [key: number]: { [key: number]: string }
}

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [image1, setImage1] = useState<string | null>(null)
  const [image2, setImage2] = useState<string | null>(null)
  const [currentShift, setCurrentShift] = useState(1)
  const [shiftsData, setShiftsData] = useState<ShiftsData>({
    1: {},
    2: {},
    3: {},
    4: {},
  })
  const [selectedExit, setSelectedExit] = useState<number | null>(null)
  const [exitPositions1, setExitPositions1] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [exitPositions2, setExitPositions2] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [isMapping1, setIsMapping1] = useState(false)
  const [isMapping2, setIsMapping2] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  useEffect(() => {
    localStorage.setItem("shiftsData", JSON.stringify(shiftsData))
  }, [shiftsData])

  useEffect(() => {
    localStorage.setItem("exitPositions1", JSON.stringify(exitPositions1))
  }, [exitPositions1])

  useEffect(() => {
    localStorage.setItem("exitPositions2", JSON.stringify(exitPositions2))
  }, [exitPositions2])

  const exits = shiftsData[currentShift] || {}

  const handleImageUpload1 = (imageData: string) => {
    setImage1(imageData)
    setIsMapping1(true)
    localStorage.setItem("emergencyImage1", imageData)
  }

  const handleImageUpload2 = (imageData: string) => {
    setImage2(imageData)
    setIsMapping2(true)
    localStorage.setItem("emergencyImage2", imageData)
  }

  const handleExitNameChange = (exitNumber: number, name: string) => {
    setShiftsData((prev) => ({
      ...prev,
      [currentShift]: {
        ...prev[currentShift],
        [exitNumber]: name,
      },
    }))
  }

  const handlePositionSet1 = (positions: { [key: number]: { x: number; y: number } }) => {
    setExitPositions1(positions)
  }

  const handlePositionSet2 = (positions: { [key: number]: { x: number; y: number } }) => {
    setExitPositions2(positions)
  }

  const handleShiftChange = (shiftNumber: number) => {
    setCurrentShift(shiftNumber)
    setSelectedExit(null)
  }

  const handleClearAllData = () => {
    // Limpiar todas las imágenes
    setImage1(null)
    setImage2(null)
    localStorage.removeItem("emergencyImage1")
    localStorage.removeItem("emergencyImage2")

    // Limpiar todas las posiciones
    setExitPositions1({})
    setExitPositions2({})
    localStorage.removeItem("exitPositions1")
    localStorage.removeItem("exitPositions2")

    // Limpiar todas las asignaciones de salidas
    setShiftsData({
      1: {},
      2: {},
      3: {},
      4: {},
    })
    localStorage.removeItem("shiftsData")

    // Resetear estados
    setSelectedExit(null)
    setIsMapping1(false)
    setIsMapping2(false)
    setShowDeleteConfirm(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="inline-block px-4 py-1 bg-white/20 rounded-full mb-3">
                <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">Panel de Control</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                Administrador
              </h1>
              <p className="text-white/80 text-sm md:text-base">Configura los 10 puntos de salida para cada turno</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all hover:shadow-lg border border-white/20 font-medium"
              >
                🗑️ Eliminar todo
              </button>
              <button
                onClick={onLogout}
                className="px-6 py-3 bg-white text-primary rounded-xl hover:bg-white/90 transition-all hover:shadow-lg font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <ShiftSelector currentShift={currentShift} onShiftChange={handleShiftChange} shiftsData={shiftsData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-border shadow-lg hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">🖼️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Imagen 1 - Puntos 1-8</h3>
              </div>
              <ImageUploader onImageUpload={handleImageUpload1} />

              {image1 && isMapping1 && (
                <div className="mt-4">
                  <PositionMapper
                    image={image1}
                    startNumber={1}
                    endNumber={8}
                    onPositionSet={handlePositionSet1}
                    onMappingComplete={() => setIsMapping1(false)}
                  />
                </div>
              )}

              {image1 && !isMapping1 && (
                <div className="bg-gradient-to-br from-background to-muted rounded-xl p-6 border-2 border-primary/20 mt-4 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-foreground">
                      Vista previa - Turno {currentShift}
                    </h2>
                    <button
                      onClick={() => setIsMapping1(true)}
                      className="text-sm px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all hover:shadow-md font-medium"
                    >
                      ✏️ Ajustar posiciones
                    </button>
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
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-border shadow-lg hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">🖼️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Imagen 2 - Puntos 9-10</h3>
              </div>
              <ImageUploader onImageUpload={handleImageUpload2} />

              {image2 && isMapping2 && (
                <div className="mt-4">
                  <PositionMapper
                    image={image2}
                    startNumber={9}
                    endNumber={10}
                    onPositionSet={handlePositionSet2}
                    onMappingComplete={() => setIsMapping2(false)}
                  />
                </div>
              )}

              {image2 && !isMapping2 && (
                <div className="bg-gradient-to-br from-background to-muted rounded-xl p-6 border-2 border-primary/20 mt-4 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-foreground">
                      Vista previa - Turno {currentShift}
                    </h2>
                    <button
                      onClick={() => setIsMapping2(true)}
                      className="text-sm px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all hover:shadow-md font-medium"
                    >
                      ✏️ Ajustar posiciones
                    </button>
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
            </div>
          </div>

          <div className="space-y-6">
            <ExitForm
              onExitNameChange={handleExitNameChange}
              exits={exits}
              selectedExit={selectedExit}
              onSelectExit={setSelectedExit}
            />
            <ExitsList exits={exits} />
          </div>
        </div>

        {/* Diálogo de confirmación para eliminar */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-card to-card/90 border-2 border-destructive/30 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-2xl font-black text-foreground">¿Eliminar todo?</h2>
              </div>

              <p className="text-foreground mb-4 font-medium">
                Esta acción eliminará permanentemente:
              </p>

              <div className="bg-destructive/10 rounded-xl p-4 mb-6 border border-destructive/20">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-foreground text-sm">
                    <span className="text-destructive mt-0.5">✗</span>
                    <span>Todas las fotos subidas</span>
                  </li>
                  <li className="flex items-start gap-2 text-foreground text-sm">
                    <span className="text-destructive mt-0.5">✗</span>
                    <span>Todas las posiciones de los puntos de salida</span>
                  </li>
                  <li className="flex items-start gap-2 text-foreground text-sm">
                    <span className="text-destructive mt-0.5">✗</span>
                    <span>Todas las asignaciones de nombres</span>
                  </li>
                  <li className="flex items-start gap-2 text-foreground text-sm">
                    <span className="text-destructive mt-0.5">✗</span>
                    <span>Configuración de los 4 turnos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-destructive/20 border border-destructive/40 rounded-xl p-4 mb-6">
                <p className="text-destructive font-bold text-center">
                  ⚠️ Esta acción no se puede deshacer
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all hover:shadow-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClearAllData}
                  className="flex-1 px-6 py-3 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-all hover:shadow-lg font-medium"
                >
                  Eliminar todo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
