"use client"

import { useState } from "react"
import SecurityDashboard from "@/components/security-dashboard"
import type { SecurityDashboardProps } from "@/types/security-dashboard"

export default function SecurityDashboardExample() {
  const [dashboardData, setDashboardData] = useState<
    Omit<SecurityDashboardProps, "onRefreshData" | "onExportLogs" | "onBlockIP" | "onImplementRecommendation">
  >({
    metrics: {
      totalRequests: 45672,
      blockedAttacks: 127,
      successfulLogins: 1834,
      failedLogins: 89,
      suspiciousActivity: 23,
      csrfTokensGenerated: 8945,
      cookieViolations: 3,
      lastSecurityScan: "2024-01-15T10:30:00Z",
      securityScore: 87,
    },
    logs: [
      {
        id: "1",
        timestamp: "2024-01-15T14:30:00Z",
        type: "attack",
        severity: "high",
        source: "firewall",
        ip: "203.0.113.45",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        action: "SQL Injection Attempt",
        details: 'Intento de inyección SQL detectado en parámetro "id"',
        blocked: true,
        location: "Rusia",
      },
      {
        id: "2",
        timestamp: "2024-01-15T14:25:00Z",
        type: "login",
        severity: "medium",
        source: "auth_service",
        ip: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        action: "Failed Login",
        details: "Intento de login fallido para usuario admin@example.com",
        blocked: false,
        location: "España",
      },
      {
        id: "3",
        timestamp: "2024-01-15T14:20:00Z",
        type: "csrf",
        severity: "critical",
        source: "web_app",
        ip: "198.51.100.23",
        userAgent: "curl/7.68.0",
        action: "CSRF Token Validation Failed",
        details: "Token CSRF inválido en formulario de transferencia",
        blocked: true,
        location: "China",
      },
      {
        id: "4",
        timestamp: "2024-01-15T14:15:00Z",
        type: "access",
        severity: "low",
        source: "web_server",
        ip: "192.168.1.50",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
        action: "Page Access",
        details: "Acceso normal a /admin/dashboard",
        blocked: false,
        location: "España",
      },
      {
        id: "5",
        timestamp: "2024-01-15T14:10:00Z",
        type: "cookie",
        severity: "medium",
        source: "cookie_manager",
        ip: "203.0.113.67",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        action: "Insecure Cookie Detected",
        details: "Cookie sin flag Secure detectada",
        blocked: false,
        location: "Estados Unidos",
      },
    ],
    attacks: [
      {
        id: "1",
        timestamp: "2024-01-15T14:30:00Z",
        type: "sql_injection",
        ip: "203.0.113.45",
        country: "Rusia",
        attempts: 15,
        blocked: true,
        severity: "high",
        details: "Múltiples intentos de inyección SQL en formularios de login",
      },
      {
        id: "2",
        timestamp: "2024-01-15T14:25:00Z",
        type: "brute_force",
        ip: "198.51.100.89",
        country: "China",
        attempts: 47,
        blocked: true,
        severity: "critical",
        details: "Ataque de fuerza bruta contra panel de administración",
      },
      {
        id: "3",
        timestamp: "2024-01-15T14:20:00Z",
        type: "xss",
        ip: "192.0.2.156",
        country: "Brasil",
        attempts: 8,
        blocked: true,
        severity: "medium",
        details: "Intento de XSS en campos de comentarios",
      },
      {
        id: "4",
        timestamp: "2024-01-15T14:15:00Z",
        type: "ddos",
        ip: "203.0.113.78",
        country: "Corea del Norte",
        attempts: 1250,
        blocked: true,
        severity: "critical",
        details: "Ataque DDoS detectado - 1250 req/seg desde una IP",
      },
    ],
    cookieStatus: {
      totalCookies: 24,
      secureCookies: 22,
      httpOnlyCookies: 20,
      sameSiteCookies: 18,
      expiredCookies: 5,
      violations: 3,
      complianceScore: 85,
    },
    csrfProtection: {
      enabled: true,
      tokensGenerated: 8945,
      tokensValidated: 8832,
      failedValidations: 113,
      lastTokenRefresh: "2024-01-15T14:00:00Z",
      protectionLevel: "strict",
    },
    recommendations: [
      {
        id: "1",
        title: "Implementar Autenticación de Dos Factores",
        description: "Añadir 2FA obligatorio para cuentas de administrador para mejorar la seguridad de acceso.",
        severity: "critical",
        category: "authentication",
        implemented: false,
        priority: 9,
        estimatedTime: "2-3 días",
      },
      {
        id: "2",
        title: "Actualizar Certificados SSL",
        description: "Los certificados SSL expiran en 30 días. Renovar antes del vencimiento.",
        severity: "warning",
        category: "encryption",
        implemented: false,
        priority: 8,
        estimatedTime: "1 día",
      },
      {
        id: "3",
        title: "Configurar Rate Limiting Avanzado",
        description: "Implementar límites de velocidad más estrictos para prevenir ataques de fuerza bruta.",
        severity: "error",
        category: "access_control",
        implemented: false,
        priority: 7,
        estimatedTime: "1-2 días",
      },
      {
        id: "4",
        title: "Habilitar Logging de Auditoría",
        description: "Activar logs detallados de todas las acciones administrativas para cumplimiento.",
        severity: "info",
        category: "monitoring",
        implemented: true,
        priority: 6,
        estimatedTime: "4 horas",
      },
      {
        id: "5",
        title: "Implementar CSP Headers",
        description: "Añadir Content Security Policy headers para prevenir ataques XSS.",
        severity: "warning",
        category: "compliance",
        implemented: true,
        priority: 5,
        estimatedTime: "2 horas",
      },
    ],
  })

  const handleRefreshData = async () => {
    // Simular actualización de datos
    console.log("Actualizando datos de seguridad...")
    // Aquí conectarías con tu API real
  }

  const handleExportLogs = () => {
    // Simular exportación de logs
    console.log("Exportando logs de seguridad...")
    // Aquí implementarías la exportación real
  }

  const handleBlockIP = (ip: string) => {
    console.log(`Bloqueando IP: ${ip}`)
    // Aquí implementarías el bloqueo real de IP
  }

  const handleImplementRecommendation = (id: string) => {
    setDashboardData((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((rec) => (rec.id === id ? { ...rec, implemented: true } : rec)),
    }))
    console.log(`Implementando recomendación: ${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <SecurityDashboard
          {...dashboardData}
          onRefreshData={handleRefreshData}
          onExportLogs={handleExportLogs}
          onBlockIP={handleBlockIP}
          onImplementRecommendation={handleImplementRecommendation}
        />
      </div>
    </div>
  )
}
