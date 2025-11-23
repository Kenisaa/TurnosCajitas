"use client"

interface ExitFormProps {
  onExitNameChange: (exitNumber: number, name: string) => void
  exits: { [key: number]: string }
  selectedExit: number | null
  onSelectExit: (exitNumber: number) => void
}

export default function ExitForm({ onExitNameChange, exits, selectedExit, onSelectExit }: ExitFormProps) {
  const exitNumbers = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6">Nombres de puntos de salida</h2>
      <div className="space-y-4">
        {exitNumbers.map((num) => (
          <div
            key={num}
            className={`flex gap-3 items-center p-3 rounded-lg transition-colors cursor-pointer ${
              selectedExit === num ? "bg-primary/10 border border-primary" : "hover:bg-muted"
            }`}
            onClick={() => onSelectExit(num)}
          >
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {num}
            </div>
            <input
              type="text"
              placeholder={`Nombre punto ${num}`}
              value={exits[num] || ""}
              onChange={(e) => onExitNameChange(num, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
