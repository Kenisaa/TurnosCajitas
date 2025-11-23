"use client"

import { useState, useEffect } from "react"
import AdminDashboard from "@/components/admin-dashboard"
import AdminLogin from "@/components/admin-login"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuthenticated")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem("adminAuthenticated", "true")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuthenticated")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Cargando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}
