import { redirect, notFound } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  MessageSquare,
  Activity,
} from "lucide-react";

export default async function ComplaintDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch complaint
  const { data: complaint, error: complaintError } = await supabase
    .from("complaints")
    .select("*")
    .eq("id", id)
    .eq("student_id", user.id) // Ensure student can only see their own complaints
    .single();

  if (complaintError || !complaint) {
    notFound();
  }

  // Fetch attachments
  const { data: attachments } = await supabase
    .from("complaint_attachments")
    .select("*")
    .eq("complaint_id", id)
    .order("uploaded_at", { ascending: true });

  // Fetch responses (non-internal only for students)
  const { data: responses } = await supabase
    .from("responses")
    .select(
      `
      *,
      admin:admin_id (
        full_name,
        role
      )
    `
    )
    .eq("complaint_id", id)
    .eq("is_internal", false)
    .order("created_at", { ascending: true });

  // Fetch activity logs
  const { data: logs } = await supabase
    .from("action_logs")
    .select(
      `
      *,
      user:user_id (
        full_name,
        role
      )
    `
    )
    .eq("complaint_id", id)
    .order("created_at", { ascending: true });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "in_progress":
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5" />;
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

  const downloadFile = async (filePath: string, fileName: string) => {
    const { data } = supabase.storage
      .from("complaint-documents")
      .getPublicUrl(filePath);

    if (data) {
      window.open(data.publicUrl, "_blank");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/student/complaints">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Complaints
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {getStatusIcon(complaint.status)}
            <h1 className="text-3xl font-bold">{complaint.course_code}</h1>
            <Badge className={getStatusColor(complaint.status)}>
              {getStatusLabel(complaint.status)}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">
            {complaint.course_title}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Details */}
          <Card>
            <CardHeader>
              <CardTitle>Complaint Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <p className="text-sm">
                    {getComplaintTypeLabel(complaint.complaint_type)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Session
                  </p>
                  <p className="text-sm">{complaint.session}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Semester
                  </p>
                  <p className="text-sm">{complaint.semester}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Level
                  </p>
                  <p className="text-sm">{complaint.level}</p>
                </div>
                {complaint.expected_grade && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Expected Grade
                    </p>
                    <p className="text-sm">{complaint.expected_grade}</p>
                  </div>
                )}
                {complaint.current_grade && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Grade
                    </p>
                    <p className="text-sm">{complaint.current_grade}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {complaint.admin_notes && complaint.status === "resolved" && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Admin Notes
                    </p>
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">
                      {complaint.admin_notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                  {attachments.length} file(s) uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {attachment.file_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(attachment.file_size / 1024).toFixed(1)} KB •
                            Uploaded{" "}
                            {new Date(
                              attachment.uploaded_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          downloadFile(
                            attachment.file_path,
                            attachment.file_name
                          )
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Responses */}
          {responses && responses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Admin Responses
                </CardTitle>
                <CardDescription>
                  {responses.length} response(s) from administrators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responses.map((response: any) => (
                    <div
                      key={response.id}
                      className="p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">
                            {response.admin?.full_name || "Administrator"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(response.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {response.admin?.role === "super_admin"
                            ? "Super Admin"
                            : "Admin"}
                        </Badge>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">
                        {response.response_text}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-1 bg-primary">
                      <FileText className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">Complaint Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(complaint.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {complaint.last_updated !== complaint.created_at && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full p-1 bg-blue-500">
                        <Activity className="h-3 w-3 text-white" />
                      </div>
                      <div className="w-px h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.last_updated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {complaint.resolved_at && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full p-1 ${
                          complaint.status === "resolved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {complaint.status === "resolved" ? (
                          <CheckCircle className="h-3 w-3 text-white" />
                        ) : (
                          <XCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {complaint.status === "resolved"
                          ? "Resolved"
                          : "Rejected"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.resolved_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          {logs && logs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-4 w-4" />
                  Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.map((log: any) => (
                    <div key={log.id} className="text-xs">
                      <p className="font-medium">{log.action}</p>
                      {log.description && (
                        <p className="text-muted-foreground">
                          {log.description}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
