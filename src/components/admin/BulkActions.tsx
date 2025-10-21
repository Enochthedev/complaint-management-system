"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { createSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { CheckSquare, Download, FileSpreadsheet, Loader2 } from "lucide-react";

interface BulkActionsProps {
  selectedComplaints: string[];
  onSelectionChange: (selected: string[]) => void;
  onUpdate: () => void;
}

export function BulkActions({
  selectedComplaints,
  onSelectionChange,
  onUpdate,
}: BulkActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const supabase = createSupabaseClient();

  const handleBulkStatusUpdate = async () => {
    if (!newStatus || selectedComplaints.length === 0) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("complaints")
        .update({
          status: newStatus,
          last_updated: new Date().toISOString(),
        })
        .in("id", selectedComplaints);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated ${selectedComplaints.length} complaints to ${newStatus}`,
      });

      onSelectionChange([]);
      onUpdate();
      setShowConfirmDialog(false);
      setNewStatus("");
    } catch (error) {
      console.error("Error updating complaints:", error);
      toast({
        title: "Error",
        description: "Failed to update complaints",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkExport = async () => {
    if (selectedComplaints.length === 0) return;

    setIsExporting(true);
    try {
      const { data: complaints, error } = await supabase
        .from("complaints")
        .select(
          `
          *,
          student:student_id(full_name, matric_number, email),
          responses(*)
        `
        )
        .in("id", selectedComplaints);

      if (error) throw error;

      // Create CSV content
      const csvHeaders = [
        "ID",
        "Student Name",
        "Matric Number",
        "Course Code",
        "Course Title",
        "Complaint Type",
        "Status",
        "Date Submitted",
        "Description",
      ];

      const csvRows = complaints?.map((complaint) => [
        complaint.id,
        complaint.student?.full_name || "",
        complaint.student?.matric_number || "",
        complaint.course_code,
        complaint.course_title,
        complaint.complaint_type,
        complaint.status,
        new Date(complaint.date_submitted).toLocaleDateString(),
        complaint.description.replace(/"/g, '""'), // Escape quotes
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...(csvRows?.map((row) => row.map((field) => `"${field}"`).join(",")) ||
          []),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `complaints-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `Exported ${selectedComplaints.length} complaints to CSV`,
      });

      onSelectionChange([]);
    } catch (error) {
      console.error("Error exporting complaints:", error);
      toast({
        title: "Error",
        description: "Failed to export complaints",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedComplaints.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
      <CheckSquare className="h-4 w-4" />
      <span className="text-sm font-medium">
        {selectedComplaints.length} selected
      </span>
      <Badge variant="secondary">{selectedComplaints.length}</Badge>

      <div className="flex items-center gap-2 ml-auto">
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Update Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Status Update</DialogTitle>
              <DialogDescription>
                Update the status of {selectedComplaints.length} selected
                complaints.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkStatusUpdate}
                disabled={!newStatus || isUpdating}
              >
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update {selectedComplaints.length} Complaints
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export CSV
        </Button>

        <Button variant="ghost" size="sm" onClick={() => onSelectionChange([])}>
          Clear Selection
        </Button>
      </div>
    </div>
  );
}
