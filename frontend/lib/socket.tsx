'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/use-auth';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
  joinStadium: (stadiumId: string) => void;
  updateLocation: (lat: number, lng: number, stadiumId?: string) => void;
  checkinToEvent: (eventId: string) => void;
}

const SocketContext = React.createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emit: () => {},
  joinStadium: () => {},
  updateLocation: () => {},
  checkinToEvent: () => {},
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;

    // Initialize socket connection
    const newSocket = io(
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      {
        auth: {
          token,
        },
        transports: ['websocket'],
      }
    );

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Location update handler
    newSocket.on('fan:location_update', (data) => {
      console.log('Fan location update:', data);
      // Handle real-time location updates from other fans
    });

    // Event checkin handler
    newSocket.on('event:new_checkin', (data) => {
      console.log('New event checkin:', data);
      // Handle real-time event checkins
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user, token]);

  const emit = (event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const joinStadium = (stadiumId: string) => {
    emit('join:stadium', stadiumId);
  };

  const updateLocation = (lat: number, lng: number, stadiumId?: string) => {
    emit('location:update', { lat, lng, stadiumId });
  };

  const checkinToEvent = (eventId: string) => {
    emit('event:checkin', eventId);
  };

  const value = {
    socket,
    isConnected,
    emit,
    joinStadium,
    updateLocation,
    checkinToEvent,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
