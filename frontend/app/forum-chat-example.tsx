"use client"

import ForumChat from "@/components/forum-chat"
import AppLayout from "@/components/layout/app-layout"
import type { NavigationItem } from "@/types/layout"
import type { ChatMessage, AnonymousUser } from "@/types/forum-chat"

const navigationItems: NavigationItem[] = [
  { label: "Inicio", href: "/", isActive: true },
  { label: "Productos", href: "/productos", isActive: false },
  { label: "Sobre Nosotros", href: "/nosotros", isActive: false },
  { label: "Contacto", href: "/contacto", isActive: false },
]

export default function ForumChatExample() {
  const handleMessageSent = (message: ChatMessage) => {
    console.log("Mensaje enviado:", message)
    // Aquí podrías enviar el mensaje a tu API/WebSocket
  }

  const handleUserJoined = (user: AnonymousUser) => {
    console.log("Usuario unido:", user)
    // Aquí podrías notificar al servidor sobre el nuevo usuario
  }

  return (
    <AppLayout navigationItems={navigationItems}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Comunidad Ochío Club</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Únete a la conversación con otros amantes de los ochíos. Comparte experiencias, recetas y descubre nuevas
            variedades.
          </p>
        </div>

        {/* Chat Component */}
        <ForumChat
          maxMessages={100}
          placeholder="Comparte tu experiencia con ochíos..."
          welcomeMessage="¡Bienvenido al chat de Ochío Club! Aquí puedes conversar con otros amantes de los ochíos de forma anónima y segura."
          onMessageSent={handleMessageSent}
          onUserJoined={handleUserJoined}
          className="mb-8"
        />

        {/* Información adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="font-semibold mb-2">🔒 Privacidad</h3>
            <p className="text-muted-foreground text-sm">
              Chat completamente anónimo. No guardamos datos personales ni historial.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="font-semibold mb-2">⚡ Tiempo Real</h3>
            <p className="text-muted-foreground text-sm">Conversaciones instantáneas con otros usuarios conectados.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="font-semibold mb-2">🛡️ Moderación</h3>
            <p className="text-muted-foreground text-sm">
              Sistema automático de moderación para mantener un ambiente respetuoso.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
