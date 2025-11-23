"use client"

import { useState } from "react"

type User = {
  id: string
  name: string
  role: "admin" | "user"
  assignedShift: number
}

const VALID_USERS: User[] = [
  { id: "1", name: "Admin", role: "admin", assignedShift: 0 },
  { id: "2", name: "Juan", role: "user", assignedShift: 1 },
  { id: "3", name: "María", role: "user", assignedShift: 2 },
  { id: "4", name: "Carlos", role: "user", assignedShift: 3 },
  { id: "5", name: "Ana", role: "user", assignedShift: 4 },
]

interface LoginPageProps {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleLogin = (user: User) => {
    setSelectedUser(user)
    onLogin(user)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground text-center mb-2">Turnos Asamblea</h1>
          <p className="text-muted-foreground text-center mb-8">Selecciona tu usuario para acceder</p>

          <div className="space-y-3">
            {VALID_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                disabled={selectedUser?.id === user.id}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  user.role === "admin"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {user.name} {user.role === "admin" ? "(Admin)" : `(Turno ${user.assignedShift})`}
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Demo:</strong> Haz clic en cualquier usuario para ingresar. Los administradores pueden editar
              todos los turnos. Los usuarios solo ven su turno asignado.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
