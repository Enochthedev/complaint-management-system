"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Eye, RefreshCw, CheckSquare, Square } from "lucide-react";
import { AdvancedFilters } from "@/components/admin/AdvancedFilters";
import { BulkActions } from "@/components/admin/BulkActions";
import { useToast } from "@/hooks/use-toast";

interface FilterState {
  search: string;
  status: string[];
  complaintType: string[];
  dateRange: {
    from: string;
    to: string;
  };
  level: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const initialFilters: FilterState = {
  search: "",
  status: [],
  complaintType: [],
  dateRange: { from: "", to: "" },
  level: [],
  sortBy: "created_at",
  sortOrder: "desc",
};

export default function AdminComplaintsPage() {
  const searchParams = useSearchParams();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const { toast } = useToast();
  const supabase = createSupabaseClient();

  // Initialize filters from URL parameters
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      setFilters((prev) => ({
        ...prev,
        status: [statusParam],
      }));
    }
  }, [searchParams]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let query = supabase.from("complaints").select(`
          *,
          student:student_id(full_name, matric_number, level),
          responses(count)
        `);

      // Apply filters
      if (filters.search) {
        query = query.or(`
          course_code.ilike.%${filters.search}%,
          course_title.ilike.%${filters.search}%,
          description.ilike.%${filters.search}%,
          student.full_name.ilike.%${filters.search}%,
          student.matric_number.ilike.%${filters.search}%
        `);
      }

      if (filters.status.length > 0) {
        query = query.in("status", filters.status);
      }

      if (filters.complaintType.length > 0) {
        query = query.in("complaint_type", filters.complaintType);
      }

      if (filters.level.length > 0) {
        query = query.in(
          "level",
          filters.level.map((l) => parseInt(l))
        );
      }

      if (filters.dateRange.from) {
        query = query.gte("created_at", filters.dateRange.from);
      }

      if (filters.dateRange.to) {
        query = query.lte("created_at", filters.dateRange.to + "T23:59:59");
      }

      // Apply sorting
      query = query.order(filters.sortBy, {
        ascending: filters.sortOrder === "asc",
      });

      const { data, error } = await query;

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Error",
        description: "Failed to fetch complaints",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const handleSelectAll = () => {
    if (selectedComplaints.length === complaints.length) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(complaints.map((c) => c.id));
    }
  };

  const handleSelectComplaint = (complaintId: string) => {
    setSelectedComplaints((prev) =>
      prev.includes(complaintId)
        ? prev.filter((id) => id !== complaintId)
        : [...prev, complaintId]
    );
  };

  const getStatusIcon = (status: string) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      in_progress:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      resolved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      in_progress: "In Progress",
      pending: "Pending",
      resolved: "Resolved",
      rejected: "Rejected",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getComplaintTypeLabel = (type: string) => {
    const types = {
      missing_grade: "Missing Grade",
      result_error: "Result Error",
      course_registration: "Course Registration",
      academic_record: "Academic Record",
      other: "Other",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Complaints</h1>
          <p className="text-muted-foreground">
            Manage and review all student complaints
          </p>
        </div>
        <Button onClick={fetchComplaints} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() => setFilters(initialFilters)}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedComplaints={selectedComplaints}
        onSelectionChange={setSelectedComplaints}
        onUpdate={fetchComplaints}
      />

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Complaints ({complaints.length})</CardTitle>
              <CardDescription>
                {selectedComplaints.length > 0 &&
                  `${selectedComplaints.length} selected`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedComplaints.length === complaints.length &&
                  complaints.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading complaints...</span>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No complaints found matching your filters
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedComplaints.includes(complaint.id)}
                    onCheckedChange={() => handleSelectComplaint(complaint.id)}
                  />

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">
                        {complaint.course_code} - {complaint.course_title}
                      </span>
                      <Badge
                        variant="outline"
                        className={getStatusIcon(complaint.status)}
                      >
                        {getStatusLabel(complaint.status)}
                      </Badge>
                      <Badge variant="secondary">
                        {getComplaintTypeLabel(complaint.complaint_type)}
                      </Badge>
                      {complaint.level && (
                        <Badge variant="outline">{complaint.level} Level</Badge>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <div>
                        <strong>Student:</strong> {complaint.student?.full_name}
                        ({complaint.student?.matric_number})
                      </div>
                      <div>
                        <strong>Submitted:</strong>{" "}
                        {new Date(complaint.created_at).toLocaleString()}
                      </div>
                      <div className="mt-1">
                        <strong>Description:</strong>{" "}
                        {complaint.description.substring(0, 100)}
                        {complaint.description.length > 100 && "..."}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {complaint.responses?.length > 0 && (
                      <Badge variant="outline">
                        {complaint.responses.length} Response
                        {complaint.responses.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                    <Link href={`/admin/complaints/${complaint.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
