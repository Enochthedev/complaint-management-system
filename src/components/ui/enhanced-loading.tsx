"use client";

import { Loader2, FileText, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoadingProps {
  type?: "default" | "dashboard" | "table" | "form";
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function EnhancedLoading({
  type = "default",
  message = "Loading...",
  size = "md",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  if (type === "dashboard") {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-48"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded"></div>
        ))}
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        ))}
        <div className="h-10 bg-muted rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// Specific loading components for different sections
export function DashboardLoading() {
  return <EnhancedLoading type="dashboard" message="Loading dashboard..." />;
}

export function TableLoading() {
  return <EnhancedLoading type="table" message="Loading data..." />;
}

export function FormLoading() {
  return <EnhancedLoading type="form" message="Loading form..." />;
}
