"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { format, subDays, startOfDay } from "date-fns";

interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  rejectedComplaints: number;
  totalStudents: number;
}

interface Complaint {
  id: string;
  course_code: string;
  status: string;
  complaint_type: string;
  created_at: string;
  date_submitted: string;
  resolved_at?: string;
  student: {
    full_name: string;
    matric_number: string;
  };
}

interface ChartData {
  complaintsOverTime: Array<{ date: string; count: number }>;
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  complaintsByType: Array<{ type: string; count: number }>;
  averageResolutionTime: number;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseClient();

  const getComplaintTypeLabel = useCallback((type: string) => {
    const types: { [key: string]: string } = {
      missing_grade: "Missing Grade",
      result_error: "Result Error",
      course_registration: "Course Registration",
      academic_record: "Academic Record",
      other: "Other",
    };
    return types[type] || type;
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load basic stats first (fastest queries)
      const [complaintsResponse, studentsResponse] = await Promise.all([
        supabase
          .from("complaints")
          .select(
            "status, complaint_type, created_at, date_submitted, resolved_at"
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "student"),
      ]);

      if (complaintsResponse.error) throw complaintsResponse.error;

      const complaints = complaintsResponse.data || [];
      const totalStudents = studentsResponse.count || 0;

      // Calculate stats
      const dashboardStats: DashboardStats = {
        totalComplaints: complaints.length,
        pendingComplaints: complaints.filter((c) => c.status === "pending")
          .length,
        inProgressComplaints: complaints.filter(
          (c) => c.status === "in_progress"
        ).length,
        resolvedComplaints: complaints.filter((c) => c.status === "resolved")
          .length,
        rejectedComplaints: complaints.filter((c) => c.status === "rejected")
          .length,
        totalStudents,
      };

      setStats(dashboardStats);

      // Load recent complaints with student data (slower query)
      const recentResponse = await supabase
        .from("complaints")
        .select("*, student:student_id(full_name, matric_number)")
        .order("created_at", { ascending: false })
        .limit(10);

      if (recentResponse.data) {
        setRecentComplaints(recentResponse.data as Complaint[]);
      }

      // Prepare chart data
      const complaintsByType = complaints.reduce((acc: any, complaint) => {
        acc[complaint.complaint_type] =
          (acc[complaint.complaint_type] || 0) + 1;
        return acc;
      }, {});

      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = startOfDay(subDays(new Date(), 29 - i));
        const dateStr = format(date, "MMM dd");
        const count = complaints.filter(
          (c) => startOfDay(new Date(c.created_at)).getTime() === date.getTime()
        ).length;
        return { date: dateStr, count };
      });

      const statusDistribution = [
        {
          name: "Pending",
          value: dashboardStats.pendingComplaints,
          color: "#f59e0b",
        },
        {
          name: "In Progress",
          value: dashboardStats.inProgressComplaints,
          color: "#3b82f6",
        },
        {
          name: "Resolved",
          value: dashboardStats.resolvedComplaints,
          color: "#10b981",
        },
        {
          name: "Rejected",
          value: dashboardStats.rejectedComplaints,
          color: "#ef4444",
        },
      ].filter((item) => item.value > 0);

      const complaintTypeData = Object.entries(complaintsByType).map(
        ([type, count]) => ({
          type: getComplaintTypeLabel(type),
          count: count as number,
        })
      );

      // Calculate average resolution time
      const resolvedComplaintsWithTime = complaints.filter(
        (c) => c.status === "resolved" && c.resolved_at
      );

      const averageResolutionTime =
        resolvedComplaintsWithTime.length > 0
          ? resolvedComplaintsWithTime.reduce((acc, complaint) => {
              const submitted = new Date(complaint.date_submitted);
              const resolved = new Date(complaint.resolved_at!);
              const days =
                (resolved.getTime() - submitted.getTime()) /
                (1000 * 60 * 60 * 24);
              return acc + days;
            }, 0) / resolvedComplaintsWithTime.length
          : 0;

      setChartData({
        complaintsOverTime: last30Days,
        statusDistribution,
        complaintsByType: complaintTypeData,
        averageResolutionTime,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [supabase, getComplaintTypeLabel]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const refetch = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    stats,
    recentComplaints,
    chartData,
    loading,
    error,
    refetch,
  };
}
