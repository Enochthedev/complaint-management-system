"use client";

import { useRealtimeComplaints } from "@/hooks/use-realtime-complaints";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
} from "lucide-react";

export function RealtimeDashboard() {
  const { complaints, loading } = useRealtimeComplaints();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading real-time data...</span>
        </CardContent>
      </Card>
    );
  }

  const recentComplaints = complaints.slice(0, 5);

  const getStatusIcon = (status: string) => {
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
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
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
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Live Updates
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </CardTitle>
        <CardDescription>Real-time complaint updates (last 5)</CardDescription>
      </CardHeader>
      <CardContent>
        {recentComplaints.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No complaints yet
          </div>
        ) : (
          <div className="space-y-3">
            {recentComplaints.map((complaint: any) => (
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
                      {new Date(complaint.created_at).toLocaleString()}
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
  );
}
