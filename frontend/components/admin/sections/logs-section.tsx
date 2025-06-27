'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function LogsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logs del Sistema</CardTitle>
          <CardDescription>Registro de actividades y eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <p>Panel de logs en desarrollo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
