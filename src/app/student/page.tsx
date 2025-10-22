import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedPage } from "@/components/ui/animated-page";

import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

export default async function StudentDashboard() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get student's complaints
  const { data: complaints } = await supabase
    .from("complaints")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate stats
  const totalComplaints = complaints?.length || 0;
  const pendingComplaints =
    complaints?.filter((c) => c.status === "pending").length || 0;
  const inProgressComplaints =
    complaints?.filter((c) => c.status === "in_progress").length || 0;
  const resolvedComplaints =
    complaints?.filter((c) => c.status === "resolved").length || 0;
  const rejectedComplaints =
    complaints?.filter((c) => c.status === "rejected").length || 0;

  // Recent complaints (last 5)
  const recentComplaints = complaints?.slice(0, 5) || [];

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

  return (
    <AnimatedPage animation="fadeIn">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here's an overview of your complaints.
            </p>
          </div>
          <Link href="/student/new-complaint">
            <Button className="transition-colors duration-200">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Complaint
            </Button>
          </Link>
        </div>

        {/* Stats Cards with enhanced animations */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Total Complaints Card */}
          <Link href="/student/complaints">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group animate-in slide-in-from-bottom-4 duration-700 delay-100 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Complaints
                </CardTitle>
                <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                  {totalComplaints}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View details →
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Pending Complaints Card */}
          <Link href="/student/complaints?status=pending">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/50 dark:to-yellow-900/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group animate-in slide-in-from-bottom-4 duration-700 delay-200 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pending
                </CardTitle>
                <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-all duration-300 group-hover:scale-110">
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 group-hover:animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                  {pendingComplaints}
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View details →
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* In Progress Complaints Card */}
          <Link href="/student/complaints?status=in_progress">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/50 dark:to-indigo-900/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group animate-in slide-in-from-bottom-4 duration-700 delay-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  In Progress
                </CardTitle>
                <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-all duration-300 group-hover:scale-110">
                  <AlertCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover:animate-spin" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                  {inProgressComplaints}
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View details →
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Resolved Complaints Card */}
          <Link href="/student/complaints?status=resolved">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group animate-in slide-in-from-bottom-4 duration-700 delay-400 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Resolved
                </CardTitle>
                <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-300 group-hover:scale-110">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                  {resolvedComplaints}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View details →
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Rejected Complaints Card */}
          <Link href="/student/complaints?status=rejected">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group animate-in slide-in-from-bottom-4 duration-700 delay-500 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rejected
                </CardTitle>
                <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-300 group-hover:scale-110">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                  {rejectedComplaints}
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View details →
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Complaints */}
        <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Complaints
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your most recent complaint submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentComplaints.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative">
                  <FileText className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-primary/10 rounded-full blur-xl" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                  No complaints yet
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Get started by submitting your first complaint
                </p>
                <Link href="/student/new-complaint">
                  <Button className="mt-6 h-12 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 group">
                    <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                    Submit Complaint
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentComplaints.map((complaint, index) => (
                  <Link
                    key={complaint.id}
                    href={`/student/complaints/${complaint.id}`}
                    className="block animate-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                      <div className="flex items-start gap-4 flex-1 relative z-10">
                        <div className="mt-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                          {getStatusIcon(complaint.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                              {complaint.course_code}
                            </span>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(
                                complaint.status
                              )} border-0 font-medium group-hover:scale-105 transition-transform duration-300`}
                            >
                              {getStatusLabel(complaint.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                            {complaint.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {new Date(complaint.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {recentComplaints.length > 0 && (
              <Link href="/student/complaints">
                <Button
                  variant="outline"
                  className="w-full mt-6 h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                >
                  View All Complaints
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
