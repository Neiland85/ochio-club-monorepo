'use client';

import type React from 'react';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Users, MessageCircle, Clock, Shield } from 'lucide-react';
import type {
  ChatMessage,
  AnonymousUser,
  ForumChatProps,
  ChatStats,
} from '@/types/forum-chat';

// Generador de alias anónimos
const ADJECTIVES = [
  'Alegre',
  'Valiente',
  'Creativo',
  'Divertido',
  'Genial',
  'Inteligente',
  'Amable',
  'Listo',
  'Mágico',
  'Noble',
  'Optimista',
  'Paciente',
  'Rápido',
  'Sabio',
  'Talentoso',
  'Único',
  'Vivaz',
  'Brillante',
  'Curioso',
  'Elegante',
  'Fantástico',
  'Gracioso',
  'Honesto',
  'Increíble',
];

const NOUNS = [
  'Panadero',
  'Chef',
  'Artista',
  'Explorador',
  'Inventor',
  'Músico',
  'Escritor',
  'Soñador',
  'Aventurero',
  'Creador',
  'Pensador',
  'Viajero',
  'Maestro',
  'Héroe',
  'Genio',
  'Mago',
  'Guardián',
  'Pionero',
  'Visionario',
  'Innovador',
  'Estratega',
  'Líder',
  'Mentor',
  'Sabio',
];

const USER_COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
  '#14B8A6',
  '#F43F5E',
];

// Mensajes de ejemplo para simular actividad
const SAMPLE_MESSAGES = [
  '¡Hola a todos! ¿Alguien ha probado los ochíos de la panadería del centro?',
  'Los ochíos con aceitunas están buenísimos 😋',
  '¿Cuál es vuestra variedad favorita de ochío?',
  'Acabo de hacer mi primer pedido, ¡qué emoción!',
  'La tradición del ochío es fascinante, ¿sabéis de dónde viene?',
  '¿Hay alguna panadería que haga ochíos sin gluten?',
  'El ochío integral está muy rico, lo recomiendo',
  '¿Alguien sabe si hacen entregas los domingos?',
  'Me encanta este chat, qué buena idea 👍',
  'Los ochíos de queso son mi debilidad...',
];

function generateAnonymousUser(): AnonymousUser {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    alias: `${adjective}${noun}`,
    color,
    joinedAt: new Date(),
  };
}

function generateSampleMessage(users: AnonymousUser[]): ChatMessage {
  const user = users[Math.floor(Math.random() * users.length)];
  const content =
    SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];

  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    content,
    timestamp: new Date(),
    userId: user.id,
    userAlias: user.alias,
    userColor: user.color,
  };
}

function sanitizeMessage(content: string): string {
  return content
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .substring(0, 500); // Límite de caracteres
}

export default function ForumChat({
  maxMessages = 50,
  placeholder = 'Escribe tu mensaje...',
  welcomeMessage = '¡Bienvenido al chat de Ochío Club! Comparte tu experiencia con otros amantes de los ochíos.',
  className = '',
  onMessageSent,
  onUserJoined,
}: ForumChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<AnonymousUser | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<ChatStats>({
    totalMessages: 0,
    activeUsers: 0,
    messagesLastHour: 0,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sampleUsers] = useState<AnonymousUser[]>(() =>
    Array.from({ length: 8 }, () => generateAnonymousUser())
  );

  // Scroll automático a nuevos mensajes
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Inicializar usuario anónimo
  useEffect(() => {
    const user = generateAnonymousUser();
    setCurrentUser(user);
    onUserJoined?.(user);

    // Mensaje de bienvenida del sistema
    const welcomeMsg: ChatMessage = {
      id: `welcome_${Date.now()}`,
      content: welcomeMessage,
      timestamp: new Date(),
      userId: 'system',
      userAlias: 'Sistema',
      userColor: '#6B7280',
      isSystem: true,
    };
    setMessages([welcomeMsg]);

    // Cargar algunos mensajes de ejemplo
    const initialMessages = Array.from({ length: 5 }, () =>
      generateSampleMessage(sampleUsers)
    );
    setMessages((prev) => [...prev, ...initialMessages]);

    // Actualizar estadísticas
    setStats({
      totalMessages: 1247,
      activeUsers: Math.floor(Math.random() * 15) + 5,
      messagesLastHour: Math.floor(Math.random() * 30) + 10,
    });
  }, [welcomeMessage, onUserJoined, sampleUsers]);

  // Simular mensajes de otros usuarios
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% probabilidad cada 10 segundos
        const newMessage = generateSampleMessage(sampleUsers);
        setMessages((prev) => {
          const updated = [...prev, newMessage].slice(-maxMessages);
          return updated;
        });

        setStats((prev) => ({
          ...prev,
          totalMessages: prev.totalMessages + 1,
          messagesLastHour: prev.messagesLastHour + 1,
        }));
      }
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, [maxMessages, sampleUsers]);

  // Scroll automático cuando hay nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !currentUser || isLoading) return;

    const sanitizedContent = sanitizeMessage(inputValue);
    if (!sanitizedContent) return;

    setIsLoading(true);

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: sanitizedContent,
      timestamp: new Date(),
      userId: currentUser.id,
      userAlias: currentUser.alias,
      userColor: currentUser.color,
    };

    setMessages((prev) => {
      const updated = [...prev, newMessage].slice(-maxMessages);
      return updated;
    });

    setStats((prev) => ({
      ...prev,
      totalMessages: prev.totalMessages + 1,
      messagesLastHour: prev.messagesLastHour + 1,
    }));

    setInputValue('');
    onMessageSent?.(newMessage);

    // Simular delay de envío
    setTimeout(() => {
      setIsLoading(false);
      inputRef.current?.focus();
    }, 300);
  }, [inputValue, currentUser, isLoading, maxMessages, onMessageSent]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat Comunitario
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{stats.activeUsers} online</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{stats.messagesLastHour} msgs/hora</span>
            </div>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentUser.color }}
              />
              {currentUser.alias}
            </Badge>
            <span className="text-muted-foreground">
              • Chat anónimo y seguro
            </span>
            <Shield className="h-3 w-3 text-green-600" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Área de mensajes */}
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={message.id} className="space-y-1">
                {index > 0 && <Separator className="my-2 opacity-30" />}

                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                    style={{ backgroundColor: message.userColor }}
                  >
                    {message.isSystem ? 'S' : message.userAlias.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-medium text-sm"
                        style={{ color: message.userColor }}
                      >
                        {message.userAlias}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.isSystem && (
                        <Badge variant="secondary" className="text-xs">
                          Sistema
                        </Badge>
                      )}
                    </div>

                    <p
                      className={`text-sm leading-relaxed ${message.isSystem ? 'text-muted-foreground italic' : ''}`}
                    >
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input de mensaje */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
            maxLength={500}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>
            💬 {stats.totalMessages.toLocaleString()} mensajes enviados •
            Presiona Enter para enviar
          </p>
          <p>
            🔒 Chat moderado automáticamente • Sin registro requerido • Respeta
            a otros usuarios
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
