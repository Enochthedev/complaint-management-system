"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface PerformanceMonitorProps {
  loading: boolean;
  startTime?: number;
}

export function PerformanceMonitor({
  loading,
  startTime,
}: PerformanceMonitorProps) {
  const [loadTime, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && startTime) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setLoadTime(Math.round(duration));
    }
  }, [loading, startTime]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {loading ? (
        <Badge variant="secondary" className="animate-pulse">
          Loading...
        </Badge>
      ) : loadTime ? (
        <Badge
          variant={
            loadTime > 2000
              ? "destructive"
              : loadTime > 1000
              ? "secondary"
              : "default"
          }
          className="text-xs"
        >
          Loaded in {loadTime}ms
        </Badge>
      ) : null}
    </div>
  );
}
