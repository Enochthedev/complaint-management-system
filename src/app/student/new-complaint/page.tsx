"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, FileText } from "lucide-react";

type ComplaintType =
  | "missing_grade"
  | "result_error"
  | "course_registration"
  | "academic_record"
  | "other";

const COMPLAINT_TYPES: { value: ComplaintType; label: string }[] = [
  { value: "missing_grade", label: "Missing Grade" },
  { value: "result_error", label: "Result Error" },
  { value: "course_registration", label: "Course Registration Issue" },
  { value: "academic_record", label: "Academic Record Issue" },
  { value: "other", label: "Other" },
];

const SESSIONS = [
  "2024/2025",
  "2023/2024",
  "2022/2023",
  "2021/2022",
  "2020/2021",
];

const SEMESTERS = ["First", "Second"];

const LEVELS = [100, 200, 300, 400, 500];

export default function NewComplaintPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    complaintType: "" as ComplaintType | "",
    courseCode: "",
    courseTitle: "",
    session: "",
    semester: "",
    level: "",
    description: "",
    expectedGrade: "",
    currentGrade: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Validate file size (max 5MB per file)
      const invalidFiles = newFiles.filter(
        (file) => file.size > 5 * 1024 * 1024
      );

      if (invalidFiles.length > 0) {
        toast({
          title: "File Too Large",
          description: "Each file must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      // Prepare complaint data
      const complaintData: any = {
        student_id: user.id,
        complaint_type: formData.complaintType,
        course_code: formData.courseCode.toUpperCase(),
        course_title: formData.courseTitle,
        session: formData.session,
        semester: formData.semester,
        level: parseInt(formData.level),
        description: formData.description,
        status: "pending",
      };

      // Add optional fields if provided
      if (formData.expectedGrade) {
        complaintData.expected_grade = formData.expectedGrade;
      }
      if (formData.currentGrade) {
        complaintData.current_grade = formData.currentGrade;
      }

      // Create complaint
      const { data: complaint, error: complaintError } = await supabase
        .from("complaints")
        .insert(complaintData)
        .select()
        .single();

      if (complaintError) {
        console.error("Insert error:", complaintError);
        throw complaintError;
      }

      // Upload files if any
      if (files.length > 0) {
        setUploadingFiles(true);

        for (const file of files) {
          // Create unique file path: student_id/complaint_id/filename
          const filePath = `${user.id}/${complaint.id}/${Date.now()}_${
            file.name
          }`;

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("complaint-documents")
              .upload(filePath, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw uploadError;
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from("complaint-documents")
            .getPublicUrl(filePath);

          // Save attachment record to database
          const { error: attachmentError } = await supabase
            .from("complaint_attachments")
            .insert({
              complaint_id: complaint.id,
              file_name: file.name,
              file_path: filePath,
              file_url: urlData.publicUrl,
              file_size: file.size,
              file_type: file.type,
            });

          if (attachmentError) {
            console.error("Attachment error:", attachmentError);
            throw attachmentError;
          }
        }
      }

      toast({
        title: "Complaint Submitted!",
        description: "Your complaint has been submitted successfully.",
      });

      // Redirect to complaints list
      router.push("/student/complaints");
      router.refresh();
    } catch (error: any) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit complaint",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Submit New Complaint</h1>
        <p className="text-muted-foreground">
          Fill in the details below to submit your complaint
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
          <CardDescription>
            Provide as much information as possible to help us resolve your
            issue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Complaint Type */}
            <div className="space-y-2">
              <Label htmlFor="complaintType">Complaint Type *</Label>
              <Select
                value={formData.complaintType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    complaintType: value as ComplaintType,
                  })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select complaint type" />
                </SelectTrigger>
                <SelectContent>
                  {COMPLAINT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Code and Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code *</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CSC501"
                  value={formData.courseCode}
                  onChange={(e) =>
                    setFormData({ ...formData, courseCode: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseTitle">Course Title *</Label>
                <Input
                  id="courseTitle"
                  placeholder="e.g., Database Systems"
                  value={formData.courseTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, courseTitle: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Session, Semester, Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session">Academic Session *</Label>
                <Select
                  value={formData.session}
                  onValueChange={(value) =>
                    setFormData({ ...formData, session: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSIONS.map((session) => (
                      <SelectItem key={session} value={session}>
                        {session}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) =>
                    setFormData({ ...formData, semester: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Expected and Current Grade (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedGrade">Expected Grade (Optional)</Label>
                <Input
                  id="expectedGrade"
                  placeholder="e.g., A"
                  value={formData.expectedGrade}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedGrade: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentGrade">Current Grade (Optional)</Label>
                <Input
                  id="currentGrade"
                  placeholder="e.g., B or N/A"
                  value={formData.currentGrade}
                  onChange={(e) =>
                    setFormData({ ...formData, currentGrade: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your complaint in detail..."
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Be as specific as possible. Include dates, course details, and
                any relevant information.
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="files">Supporting Documents (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Input
                  id="files"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <Label
                  htmlFor="files"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, JPG, PNG, DOC (max 5MB per file)
                  </span>
                </Label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || uploadingFiles}
                className="flex-1"
              >
                {loading || uploadingFiles ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadingFiles ? "Uploading files..." : "Submitting..."}
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
