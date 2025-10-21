"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ComplaintManagementProps {
  complaintId: string;
  currentStatus: string;
  studentId: string;
}

export function ComplaintManagement({
  complaintId,
  currentStatus,
  studentId,
}: ComplaintManagementProps) {
  const [status, setStatus] = useState(currentStatus);
  const [response, setResponse] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSendingResponse, setIsSendingResponse] = useState(false);

  const router = useRouter();
  const supabase = createSupabaseClient();

  const updateStatus = async () => {
    if (status === currentStatus) {
      toast.error("Please select a different status to update");
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const updateData: any = {
        status,
        last_updated: new Date().toISOString(),
      };

      // If status is resolved, set resolved_at timestamp
      if (status === "resolved") {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from("complaints")
        .update(updateData)
        .eq("id", complaintId);

      if (updateError) throw updateError;

      // Create notification for student
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: studentId,
          type: "complaint_updated",
          title: "Complaint Status Updated",
          message: `Your complaint status has been updated to: ${status
            .replace("_", " ")
            .toUpperCase()}`,
          related_id: complaintId,
        });

      if (notificationError) {
        console.error("Failed to create notification:", notificationError);
        // Don't throw error for notification failure
      }

      toast.success("Status updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const sendResponse = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    setIsSendingResponse(true);
    try {
      // Add response to database
      const { error: responseError } = await supabase.from("responses").insert({
        complaint_id: complaintId,
        response_text: response.trim(),
        is_internal: isInternal,
        created_at: new Date().toISOString(),
      });

      if (responseError) throw responseError;

      // Update complaint last_updated timestamp
      const { error: updateError } = await supabase
        .from("complaints")
        .update({ last_updated: new Date().toISOString() })
        .eq("id", complaintId);

      if (updateError) throw updateError;

      // Create notification for student (only if not internal)
      if (!isInternal) {
        const { error: notificationError } = await supabase
          .from("notifications")
          .insert({
            user_id: studentId,
            type: "complaint_response",
            title: "New Response to Your Complaint",
            message:
              "An admin has responded to your complaint. Please check for updates.",
            related_id: complaintId,
          });

        if (notificationError) {
          console.error("Failed to create notification:", notificationError);
          // Don't throw error for notification failure
        }
      }

      toast.success("Response sent successfully");
      setResponse("");
      setIsInternal(false);
      router.refresh();
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error("Failed to send response");
    } finally {
      setIsSendingResponse(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="status">Update Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={updateStatus}
            disabled={isUpdatingStatus || status === currentStatus}
          >
            {isUpdatingStatus ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Add Response */}
      <Card>
        <CardHeader>
          <CardTitle>Add Response</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="response">Response</Label>
            <Textarea
              id="response"
              placeholder="Enter your response..."
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="internal"
              checked={isInternal}
              onCheckedChange={(checked) => setIsInternal(checked as boolean)}
            />
            <Label htmlFor="internal" className="text-sm">
              Internal note (not visible to student)
            </Label>
          </div>
          <Button
            className="w-full"
            onClick={sendResponse}
            disabled={isSendingResponse || !response.trim()}
          >
            {isSendingResponse ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Response"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
