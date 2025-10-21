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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  MessageSquare,
  Download,
} from "lucide-react";
import { FilePreview } from "@/components/ui/file-preview";
import { ComplaintManagement } from "@/components/admin/ComplaintManagement";

export default async function AdminComplaintDetailPage({
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

  // Get complaint details with student info and responses
  const { data: complaint } = await supabase
    .from("complaints")
    .select(
      `
      *,
      student:student_id(full_name, matric_number, email, phone_number, department, level),
      responses(*),
      complaint_attachments(*)
    `
    )
    .eq("id", id)
    .single();

  if (!complaint) {
    redirect("/admin/complaints");
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/admin/complaints">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Complaints
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Complaint Details</h1>
          <p className="text-muted-foreground">
            Review and manage this complaint
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(complaint.status)}
          <Badge variant="outline" className={getStatusColor(complaint.status)}>
            {getStatusLabel(complaint.status)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Complaint Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Course Code
                  </Label>
                  <p className="font-medium">{complaint.course_code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Course Title
                  </Label>
                  <p className="font-medium">{complaint.course_title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Semester
                  </Label>
                  <p>{complaint.semester}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Session
                  </Label>
                  <p>{complaint.session}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Complaint Type
                  </Label>
                  <p>{getComplaintTypeLabel(complaint.complaint_type)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Date Submitted
                  </Label>
                  <p>{new Date(complaint.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {complaint.expected_grade && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Expected Grade
                    </Label>
                    <p className="font-medium">{complaint.expected_grade}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Current Grade
                    </Label>
                    <p className="font-medium">
                      {complaint.current_grade || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <p className="mt-2 text-sm leading-relaxed">
                  {complaint.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {complaint.complaint_attachments?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                  Files uploaded with this complaint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complaint.complaint_attachments.map((attachment: any) => (
                    <FilePreview
                      key={attachment.id}
                      fileName={attachment.file_name}
                      fileUrl={attachment.file_url}
                      fileType={attachment.file_type}
                      fileSize={attachment.file_size}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Responses ({complaint.responses?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complaint.responses?.length > 0 ? (
                <div className="space-y-4">
                  {complaint.responses.map((response: any) => (
                    <div
                      key={response.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">Admin Response</span>
                          {response.is_internal && (
                            <Badge variant="secondary" className="text-xs">
                              Internal
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(response.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {response.response_text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No responses yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </Label>
                <p className="font-medium">{complaint.student?.full_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Matric Number
                </Label>
                <p>{complaint.student?.matric_number}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <p className="text-sm">{complaint.student?.email}</p>
              </div>
              {complaint.student?.phone_number && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </Label>
                  <p className="text-sm">{complaint.student?.phone_number}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Department
                </Label>
                <p>{complaint.student?.department}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Level
                </Label>
                <p>{complaint.student?.level} Level</p>
              </div>
            </CardContent>
          </Card>

          {/* Complaint Management */}
          <ComplaintManagement
            complaintId={complaint.id}
            currentStatus={complaint.status}
            studentId={complaint.student_id}
          />

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Complaint Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(complaint.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {complaint.last_updated !== complaint.created_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.last_updated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {complaint.resolved_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Resolved</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.resolved_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
