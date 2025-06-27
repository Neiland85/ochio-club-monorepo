// Fast analytics service using Prisma and Redis
import { PrismaClient } from "@prisma/client";
import Redis from "redis";

interface FanLocation {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  stadiumId?: string;
}

interface AttendanceMetrics {
  eventId: string;
  totalCheckins: number;
  uniqueUsers: number;
  peakTime: Date;
  averageStayDuration: number;
}

interface GeolocationAnalytics {
  heatmapData: Array<{
    lat: number;
    lng: number;
    weight: number;
  }>;
  popularAreas: Array<{
    name: string;
    coordinates: [number, number];
    fanCount: number;
  }>;
  movementPatterns: Array<{
    from: [number, number];
    to: [number, number];
    count: number;
  }>;
}

export class AnalyticsService {
  constructor(
    private prisma: PrismaClient,
    private redis: Redis.RedisClientType,
  ) {}

  // Real-time fan location tracking
  async trackFanLocation(data: FanLocation): Promise<void> {
    try {
      // Store in database
      await this.prisma.analytics.create({
        data: {
          type: "USER_LOCATION",
          data: {
            userId: data.userId,
            coordinates: [data.longitude, data.latitude],
            timestamp: data.timestamp,
            stadiumId: data.stadiumId,
          },
        },
      });

      // Store in Redis for real-time access
      const key = `location:${data.userId}`;
      await this.redis.setEx(
        key,
        3600, // 1 hour expiration
        JSON.stringify({
          lat: data.latitude,
          lng: data.longitude,
          timestamp: data.timestamp,
          stadiumId: data.stadiumId,
        }),
      );

      // Update stadium fan count
      if (data.stadiumId) {
        await this.redis.sAdd(`stadium:${data.stadiumId}:fans`, data.userId);
        await this.redis.expire(`stadium:${data.stadiumId}:fans`, 3600);
      }
    } catch (error) {
      console.error("Error tracking fan location:", error);
      throw error;
    }
  }

  // Get real-time stadium occupancy
  async getStadiumOccupancy(stadiumId: string): Promise<{
    currentFans: number;
    recentLocations: Array<{ lat: number; lng: number; userId: string }>;
  }> {
    try {
      // Get current fans in stadium from Redis
      const fanIds = await this.redis.sMembers(`stadium:${stadiumId}:fans`);

      // Get their recent locations
      const locations = [];
      for (const fanId of fanIds) {
        const locationData = await this.redis.get(`location:${fanId}`);
        if (locationData) {
          const location = JSON.parse(locationData);
          locations.push({
            lat: location.lat,
            lng: location.lng,
            userId: fanId,
          });
        }
      }

      return {
        currentFans: fanIds.length,
        recentLocations: locations,
      };
    } catch (error) {
      console.error("Error getting stadium occupancy:", error);
      throw error;
    }
  }

  // Generate heatmap data for geolocation visualization
  async generateHeatmapData(
    stadiumId?: string,
    timeRange?: { start: Date; end: Date },
  ): Promise<GeolocationAnalytics> {
    try {
      const whereClause: any = {
        type: "USER_LOCATION",
      };

      if (stadiumId) {
        whereClause.data = {
          path: ["stadiumId"],
          equals: stadiumId,
        };
      }

      if (timeRange) {
        whereClause.timestamp = {
          gte: timeRange.start,
          lte: timeRange.end,
        };
      }

      const locationData = await this.prisma.analytics.findMany({
        where: whereClause,
        orderBy: { timestamp: "desc" },
        take: 10000, // Limit for performance
      });

      // Process data for heatmap
      const heatmapPoints = new Map<string, number>();

      locationData.forEach((record) => {
        const coordinates = record.data as any;
        if (coordinates.coordinates) {
          const [lng, lat] = coordinates.coordinates;
          const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
          heatmapPoints.set(key, (heatmapPoints.get(key) || 0) + 1);
        }
      });

      const heatmapData = Array.from(heatmapPoints.entries()).map(
        ([key, weight]) => {
          const [lat, lng] = key.split(",").map(Number);
          return { lat, lng, weight };
        },
      );

      // Calculate popular areas (clustering)
      const popularAreas = this.calculatePopularAreas(heatmapData);

      // Calculate movement patterns
      const movementPatterns =
        await this.calculateMovementPatterns(locationData);

      return {
        heatmapData,
        popularAreas,
        movementPatterns,
      };
    } catch (error) {
      console.error("Error generating heatmap data:", error);
      throw error;
    }
  }

  // Event attendance analytics
  async getEventAttendanceMetrics(eventId: string): Promise<AttendanceMetrics> {
    try {
      const checkins = await this.prisma.eventCheckin.findMany({
        where: { eventId },
        include: {
          user: true,
          event: true,
        },
        orderBy: { checkedInAt: "asc" },
      });

      const totalCheckins = checkins.length;
      const uniqueUsers = new Set(checkins.map((c) => c.userId)).size;

      // Find peak check-in time
      const hourlyCheckins = new Map<number, number>();
      checkins.forEach((checkin) => {
        const hour = checkin.checkedInAt.getHours();
        hourlyCheckins.set(hour, (hourlyCheckins.get(hour) || 0) + 1);
      });

      const peakHour = Array.from(hourlyCheckins.entries()).sort(
        (a, b) => b[1] - a[1],
      )[0];

      const peakTime = new Date();
      peakTime.setHours(peakHour[0], 0, 0, 0);

      // Calculate average stay duration (mock calculation)
      const averageStayDuration = 120; // 2 hours average

      return {
        eventId,
        totalCheckins,
        uniqueUsers,
        peakTime,
        averageStayDuration,
      };
    } catch (error) {
      console.error("Error getting event attendance metrics:", error);
      throw error;
    }
  }

  // Predictive analytics for event attendance
  async predictEventAttendance(eventId: string): Promise<{
    predictedAttendance: number;
    confidence: number;
    factors: Array<{ factor: string; impact: number }>;
  }> {
    try {
      // Get historical data for similar events
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        include: { stadium: true },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // Simple prediction model based on historical data
      const historicalEvents = await this.prisma.event.findMany({
        where: {
          stadiumId: event.stadiumId,
          eventDate: {
            lt: new Date(),
          },
        },
        include: {
          checkins: true,
        },
        take: 10,
        orderBy: { eventDate: "desc" },
      });

      const avgAttendance =
        historicalEvents.reduce((sum, e) => sum + e.checkins.length, 0) /
        historicalEvents.length;

      // Factors affecting attendance
      const dayOfWeek = event.eventDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const hour = event.eventDate.getHours();
      const isPrimeTime = hour >= 18 && hour <= 22;

      let multiplier = 1;
      const factors = [];

      if (isWeekend) {
        multiplier *= 1.3;
        factors.push({ factor: "Weekend", impact: 0.3 });
      }

      if (isPrimeTime) {
        multiplier *= 1.2;
        factors.push({ factor: "Prime Time", impact: 0.2 });
      }

      const predictedAttendance = Math.round(avgAttendance * multiplier);
      const confidence = Math.min(0.95, 0.6 + historicalEvents.length * 0.05);

      return {
        predictedAttendance,
        confidence,
        factors,
      };
    } catch (error) {
      console.error("Error predicting event attendance:", error);
      throw error;
    }
  }

  // Get real-time dashboard metrics
  async getDashboardMetrics(): Promise<{
    totalActiveFans: number;
    eventsToday: number;
    topStadiums: Array<{ id: string; name: string; fanCount: number }>;
    recentActivity: Array<{ type: string; message: string; timestamp: Date }>;
  }> {
    try {
      // Get active fans from Redis (fans with recent location updates)
      const activeUserKeys = await this.redis.keys("location:*");
      const totalActiveFans = activeUserKeys.length;

      // Get events today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const eventsToday = await this.prisma.event.count({
        where: {
          eventDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      // Get top stadiums by current fan count
      const stadiumKeys = await this.redis.keys("stadium:*:fans");
      const stadiumData = [];

      for (const key of stadiumKeys) {
        const stadiumId = key.split(":")[1];
        const fanCount = await this.redis.sCard(key);

        const stadium = await this.prisma.stadium.findUnique({
          where: { id: stadiumId },
        });

        if (stadium) {
          stadiumData.push({
            id: stadium.id,
            name: stadium.name,
            fanCount,
          });
        }
      }

      const topStadiums = stadiumData
        .sort((a, b) => b.fanCount - a.fanCount)
        .slice(0, 5);

      // Get recent activity from analytics
      const recentAnalytics = await this.prisma.analytics.findMany({
        take: 10,
        orderBy: { timestamp: "desc" },
      });

      const recentActivity = recentAnalytics.map((record) => ({
        type: record.type,
        message: this.formatActivityMessage(record),
        timestamp: record.timestamp,
      }));

      return {
        totalActiveFans,
        eventsToday,
        topStadiums,
        recentActivity,
      };
    } catch (error) {
      console.error("Error getting dashboard metrics:", error);
      throw error;
    }
  }

  private calculatePopularAreas(
    heatmapData: Array<{ lat: number; lng: number; weight: number }>,
  ) {
    // Simple clustering algorithm for popular areas
    const clusters = [];
    const threshold = 0.01; // ~1km

    for (const point of heatmapData) {
      let addedToCluster = false;

      for (const cluster of clusters) {
        const distance = Math.sqrt(
          Math.pow(cluster.lat - point.lat, 2) +
            Math.pow(cluster.lng - point.lng, 2),
        );

        if (distance < threshold) {
          cluster.weight += point.weight;
          cluster.points++;
          addedToCluster = true;
          break;
        }
      }

      if (!addedToCluster) {
        clusters.push({
          lat: point.lat,
          lng: point.lng,
          weight: point.weight,
          points: 1,
        });
      }
    }

    return clusters
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10)
      .map((cluster, index) => ({
        name: `Popular Area ${index + 1}`,
        coordinates: [cluster.lng, cluster.lat] as [number, number],
        fanCount: cluster.weight,
      }));
  }

  private async calculateMovementPatterns(locationData: any[]): Promise<
    Array<{
      from: [number, number];
      to: [number, number];
      count: number;
    }>
  > {
    // Group by user and calculate movement patterns
    const userMovements = new Map<string, any[]>();

    locationData.forEach((record) => {
      const data = record.data as any;
      if (data.userId && data.coordinates) {
        if (!userMovements.has(data.userId)) {
          userMovements.set(data.userId, []);
        }
        userMovements.get(data.userId)!.push({
          coordinates: data.coordinates,
          timestamp: record.timestamp,
        });
      }
    });

    const movementPatterns = new Map<string, number>();

    userMovements.forEach((movements) => {
      movements.sort((a, b) => a.timestamp - b.timestamp);

      for (let i = 0; i < movements.length - 1; i++) {
        const from = movements[i].coordinates;
        const to = movements[i + 1].coordinates;
        const key = `${from[0]},${from[1]}->${to[0]},${to[1]}`;
        movementPatterns.set(key, (movementPatterns.get(key) || 0) + 1);
      }
    });

    return Array.from(movementPatterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([key, count]) => {
        const [fromStr, toStr] = key.split("->");
        const from = fromStr.split(",").map(Number) as [number, number];
        const to = toStr.split(",").map(Number) as [number, number];
        return { from, to, count };
      });
  }

  private formatActivityMessage(record: any): string {
    switch (record.type) {
      case "USER_LOCATION":
        return "Fan location updated";
      case "EVENT_ATTENDANCE":
        return "New event check-in";
      case "APP_USAGE":
        return "App interaction logged";
      default:
        return "Activity recorded";
    }
  }
}
