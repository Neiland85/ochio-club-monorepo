'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Navigation } from 'lucide-react';
import { useSocket } from '@/lib/socket';

import 'mapbox-gl/dist/mapbox-gl.css';

// Configure Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface Fan {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  avatar?: string;
  lastSeen: Date;
}

interface Stadium {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  capacity?: number;
}

interface FanLocationMapProps {
  stadium: Stadium;
  fans: Fan[];
  userLocation?: { lat: number; lng: number };
  onLocationUpdate?: (lat: number, lng: number) => void;
}

export default function FanLocationMap({
  stadium,
  fans,
  userLocation,
  onLocationUpdate,
}: FanLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const fanMarkers = useRef<mapboxgl.Marker[]>([]);

  const [isTracking, setIsTracking] = useState(false);
  const [nearbyFans, setNearbyFans] = useState<Fan[]>([]);

  const { updateLocation, isConnected } = useSocket();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [stadium.location.lng, stadium.location.lat],
      zoom: 15,
      pitch: 45,
      bearing: 0,
    });

    // Add stadium marker
    new mapboxgl.Marker({
      color: '#FF6B35',
      scale: 1.5,
    })
      .setLngLat([stadium.location.lng, stadium.location.lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${stadium.name}</h3>
            <p class="text-sm text-gray-600">
              ${stadium.capacity ? `Capacity: ${stadium.capacity.toLocaleString()}` : ''}
            </p>
          </div>
        `)
      )
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    map.current.addControl(geolocate, 'top-right');

    // Listen for user location updates
    geolocate.on('geolocate', (e) => {
      const { latitude, longitude } = e.coords;
      onLocationUpdate?.(latitude, longitude);

      // Send location to server via socket
      updateLocation(latitude, longitude, stadium.id);
    });

    return () => {
      map.current?.remove();
    };
  }, [stadium]);

  // Update user location marker
  useEffect(() => {
    if (!map.current || !userLocation) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    userMarker.current = new mapboxgl.Marker({
      color: '#00D2FF',
      scale: 1.2,
    })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold">Your Location</h3>
            <p class="text-sm text-gray-600">Currently here</p>
          </div>
        `)
      )
      .addTo(map.current);
  }, [userLocation]);

  // Update fan markers
  useEffect(() => {
    if (!map.current) return;

    // Remove existing fan markers
    fanMarkers.current.forEach((marker) => marker.remove());
    fanMarkers.current = [];

    // Add new fan markers
    fans.forEach((fan) => {
      const marker = new mapboxgl.Marker({
        color: '#10B981',
        scale: 0.8,
      })
        .setLngLat([fan.location.lng, fan.location.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <div class="flex items-center gap-2">
                ${fan.avatar ? `<img src="${fan.avatar}" class="w-8 h-8 rounded-full" />` : ''}
                <div>
                  <h3 class="font-bold">${fan.name}</h3>
                  <p class="text-sm text-gray-600">
                    Last seen: ${new Date(fan.lastSeen).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          `)
        )
        .addTo(map.current);

      fanMarkers.current.push(marker);
    });

    // Calculate nearby fans (within 500m)
    if (userLocation) {
      const nearby = fans.filter((fan) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          fan.location.lat,
          fan.location.lng
        );
        return distance <= 0.5; // 500 meters
      });
      setNearbyFans(nearby);
    }
  }, [fans, userLocation]);

  // Calculate distance between two points in kilometers
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toggleLocationTracking = () => {
    if ('geolocation' in navigator) {
      if (isTracking) {
        setIsTracking(false);
      } else {
        setIsTracking(true);
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            onLocationUpdate?.(latitude, longitude);
            updateLocation(latitude, longitude, stadium.id);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setIsTracking(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Fans</p>
                <p className="text-2xl font-bold">{fans.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nearby Fans</p>
                <p className="text-2xl font-bold">{nearbyFans.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connection</p>
                <Badge variant={isConnected ? 'default' : 'destructive'}>
                  {isConnected ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <Navigation className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          onClick={toggleLocationTracking}
          variant={isTracking ? 'destructive' : 'default'}
          size="sm"
        >
          <Navigation className="w-4 h-4 mr-2" />
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </Button>
      </div>

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div
            ref={mapContainer}
            className="w-full h-[500px] rounded-lg overflow-hidden"
          />
        </CardContent>
      </Card>

      {/* Nearby Fans List */}
      {nearbyFans.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Nearby Fans</h3>
            <div className="space-y-2">
              {nearbyFans.map((fan) => (
                <div
                  key={fan.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  {fan.avatar && (
                    <img
                      src={fan.avatar}
                      alt={fan.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{fan.name}</p>
                    <p className="text-sm text-gray-600">
                      Last seen: {new Date(fan.lastSeen).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="secondary">Nearby</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
