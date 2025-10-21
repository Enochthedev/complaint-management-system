import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
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
  PlusCircle,
  Eye,
} from "lucide-react";
import { ComplaintsFilter } from "@/components/student/ComplaintsFilter";

export default async function ComplaintsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Build query
  let query = supabase
    .from("complaints")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  // Apply filters
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.search) {
    query = query.or(
      `course_code.ilike.%${params.search}%,course_title.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }

  const { data: complaints, error } = await query;

  if (error) {
    console.error("Error fetching complaints:", error);
  }

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
        return <FileText className="h-4 w-4" />;
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

  const getComplaintTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      missing_grade: "Missing Grade",
      result_error: "Result Error",
      course_registration: "Course Registration",
      academic_record: "Academic Record",
      other: "Other",
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Complaints</h1>
          <p className="text-muted-foreground">
            View and track all your submitted complaints
          </p>
        </div>
        <Link href="/student/new-complaint">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ComplaintsFilter />

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
          <CardDescription>
            {complaints?.length || 0} total complaint(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!complaints || complaints.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No complaints found
              </h3>
              <p className="text-muted-foreground mb-4">
                {params.status || params.search
                  ? "Try adjusting your filters"
                  : "Get started by submitting your first complaint"}
              </p>
              {!params.status && !params.search && (
                <Link href="/student/new-complaint">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Submit Complaint
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Side - Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="mt-0.5">
                          {getStatusIcon(complaint.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg">
                              {complaint.course_code}
                            </h3>
                            <Badge variant="secondary">
                              {getComplaintTypeLabel(complaint.complaint_type)}
                            </Badge>
                            <Badge className={getStatusColor(complaint.status)}>
                              {getStatusLabel(complaint.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {complaint.course_title}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm line-clamp-2 text-muted-foreground pl-7">
                        {complaint.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pl-7">
                        <span>
                          {complaint.session} • {complaint.semester} Semester •
                          Level {complaint.level}
                        </span>
                        <span>•</span>
                        <span>
                          Submitted{" "}
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                        {complaint.resolved_at && (
                          <>
                            <span>•</span>
                            <span>
                              Resolved{" "}
                              {new Date(
                                complaint.resolved_at
                              ).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Action */}
                    <Link href={`/student/complaints/${complaint.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
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
