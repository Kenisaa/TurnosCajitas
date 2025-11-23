"use client"

import type React from "react"

import { useState } from "react"

const ADMIN_PASSWORD = "admin123" // Cambiar a contraseña más segura

interface AdminLoginProps {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulamos una pequeña espera para dar sensación de verificación
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onLogin()
      } else {
        setError("Contraseña incorrecta")
        setPassword("")
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Acceso Admin</h1>
            <p className="text-muted-foreground">Panel de administración protegido</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isLoading ? "Verificando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <a href="/" className="text-sm text-primary hover:text-primary/80 underline transition-colors">
              Volver a inicio
            </a>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p></p>
        </div>
      </div>
    </main>
  )
}
