"use client";

import { useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { PerformanceMonitor } from "@/components/admin/PerformanceMonitor";
import { useDashboardData } from "@/hooks/use-dashboard-data";

// Simple skeleton component
const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`animate-pulse rounded-md bg-muted ${className}`}
    {...props}
  />
);

export function ClientDashboard() {
  const startTime = useMemo(() => performance.now(), []);
  const { stats, recentComplaints, chartData, loading, error, refetch } =
    useDashboardData();

  // Memoize helper functions
  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }, []);

  // Memoize stats cards data
  const statsCards = useMemo(
    () => [
      {
        title: "Total Complaints",
        value: stats?.totalComplaints || 0,
        icon: FileText,
        description: "All time",
        color: "text-muted-foreground",
      },
      {
        title: "Pending",
        value: stats?.pendingComplaints || 0,
        icon: Clock,
        description: "Awaiting review",
        color: "text-yellow-600",
      },
      {
        title: "In Progress",
        value: stats?.inProgressComplaints || 0,
        icon: AlertCircle,
        description: "Being handled",
        color: "text-blue-600",
      },
      {
        title: "Resolved",
        value: stats?.resolvedComplaints || 0,
        icon: CheckCircle,
        description: "Completed",
        color: "text-green-600",
      },
      {
        title: "Rejected",
        value: stats?.rejectedComplaints || 0,
        icon: XCircle,
        description: "Not valid",
        color: "text-red-600",
      },
      {
        title: "Total Students",
        value: stats?.totalStudents || 0,
        icon: Users,
        description: "Registered users",
        color: "text-muted-foreground",
      },
    ],
    [stats]
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all complaints and system statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Complaints */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>Latest complaint submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <Skeleton className="h-4 w-4 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : recentComplaints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No complaints yet
              </div>
            ) : (
              <div className="space-y-3">
                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5">
                        {getStatusIcon(complaint.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {complaint.course_code}
                          </span>
                          <Badge
                            variant="outline"
                            className={getStatusColor(complaint.status)}
                          >
                            {getStatusLabel(complaint.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {complaint.student?.full_name} (
                          {complaint.student?.matric_number})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link href={`/admin/complaints/${complaint.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Complaints by Type */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Complaints by Type</CardTitle>
            <CardDescription>
              Distribution of complaint categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !chartData ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-32 h-2" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {chartData.complaintsByType.map((item: any) => (
                  <div
                    key={item.type}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{item.type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${
                              (item.count / (stats?.totalComplaints || 1)) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      {chartData && (
        <DashboardCharts
          complaintsOverTime={chartData.complaintsOverTime}
          statusDistribution={chartData.statusDistribution}
          complaintsByType={chartData.complaintsByType}
          averageResolutionTime={chartData.averageResolutionTime}
        />
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/complaints?status=pending">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Review Pending ({stats?.pendingComplaints || 0})
              </Button>
            </Link>
            <Link href="/admin/complaints">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View All Complaints
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Performance Monitor (dev only) */}
      <PerformanceMonitor loading={loading} startTime={startTime} />
    </div>
  );
}
