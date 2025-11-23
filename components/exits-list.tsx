"use client"

interface ExitsListProps {
  exits: { [key: number]: string }
}

export default function ExitsList({ exits }: ExitsListProps) {
  const exitNumbers = Array.from({ length: 8 }, (_, i) => i + 1)
  const exitosConNombre = exitNumbers.filter((num) => exits[num])

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-4">Lista de salidas</h2>

      {exitosConNombre.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Agrega nombres para ver la lista</p>
      ) : (
        <ul className="space-y-2">
          {exitosConNombre.map((num) => (
            <li
              key={num}
              className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {num}
              </span>
              <span className="text-foreground font-medium">{exits[num]}</span>
            </li>
          ))}
        </ul>
      )}

      {exitosConNombre.length > 0 && (
        <div className="mt-4 p-3 bg-accent rounded-lg text-sm text-accent-foreground">
          Total de puntos configurados: <strong>{exitosConNombre.length}/8</strong>
        </div>
      )}
    </div>
  )
}
