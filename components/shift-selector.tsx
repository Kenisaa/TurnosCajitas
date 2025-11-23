"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ShiftSelectorProps {
  currentShift: number
  onShiftChange: (shift: number) => void
  shiftsData: { [key: number]: { [key: number]: string } }
}

export default function ShiftSelector({ currentShift, onShiftChange, shiftsData }: ShiftSelectorProps) {
  const getShiftProgress = (shiftNumber: number) => {
    const shifts = Object.keys(shiftsData[shiftNumber] || {}).filter(
      (key) => shiftsData[shiftNumber][Number(key)],
    ).length
    return `${shifts}/8`
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Selecciona Turno</CardTitle>
        <CardDescription>Completa los datos de cada turno por separado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((shift) => (
            <button
              key={shift}
              onClick={() => onShiftChange(shift)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentShift === shift ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="font-bold text-lg">Turno {shift}</div>
              <div className="text-sm text-muted-foreground">{getShiftProgress(shift)} puntos</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
