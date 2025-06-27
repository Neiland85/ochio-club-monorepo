import { useEffect } from 'react';
import io from 'socket.io-client';

export function useFanLocationSocket(userId, onLocationUpdate) {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token: localStorage.getItem('token') },
    });
    socket.emit('fan:join_stadium', userId);
    socket.on('fan:location_update', onLocationUpdate);
    return () => {
      socket.disconnect();
    };
  }, [userId, onLocationUpdate]);
}
