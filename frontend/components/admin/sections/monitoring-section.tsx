'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RealTimeMonitoring from '@/components/real-time-monitoring';

export default function MonitoringSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoreo del Sistema</CardTitle>
          <CardDescription>Supervisión en tiempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <RealTimeMonitoring />
        </CardContent>
      </Card>
    </div>
  );
}
