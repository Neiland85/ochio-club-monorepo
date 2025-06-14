export interface DatabaseMonitorProps {
  metrics: {
    health: {
      status: string;
      uptime: string;
      lastBackup: Date;
      replicationLag?: number;
    };
    connections: {
      active: number;
      idle: number;
      total: number;
      maxConnections: number;
    };
    performance: {
      queriesPerSecond: number;
      avgQueryTime: number;
      cacheHitRatio: number;
      slowQueries: number;
    };
    storage: {
      usagePercentage: number;
      usedSize: string;
      totalSize: string;
    };
    errors: {
      recent: number;
    };
  };
  onRefresh: () => Promise<Response>;
  isLoading: boolean;
}
