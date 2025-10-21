import { createSupabaseClient } from "./supabase";

export interface NotificationData {
  type:
    | "complaint_submitted"
    | "complaint_status_changed"
    | "complaint_response";
  complaintId: string;
  recipientId: string;
  recipientEmail: string;
  data: {
    studentName?: string;
    courseCode?: string;
    status?: string;
    adminName?: string;
    complaintType?: string;
  };
}

export class NotificationService {
  private supabase = createSupabaseClient();

  async sendNotification(notification: NotificationData) {
    try {
      // For now, we'll log the notification
      // In production, this would integrate with Supabase Edge Functions + Resend/SendGrid
      console.log("Notification to be sent:", notification);

      // Store notification in database for tracking
      const { error } = await this.supabase.from("notifications").insert({
        type: notification.type,
        complaint_id: notification.complaintId,
        recipient_id: notification.recipientId,
        recipient_email: notification.recipientEmail,
        data: notification.data,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error storing notification:", error);
        return false;
      }

      // TODO: Trigger Supabase Edge Function to send actual email
      // await this.triggerEmailFunction(notification);

      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }

  async notifyComplaintSubmitted(
    complaintId: string,
    studentName: string,
    courseCode: string
  ) {
    // Get all admins
    const { data: admins } = await this.supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("role", ["admin", "super_admin"]);

    if (!admins) return;

    // Send notification to all admins
    for (const admin of admins) {
      await this.sendNotification({
        type: "complaint_submitted",
        complaintId,
        recipientId: admin.id,
        recipientEmail: admin.email,
        data: {
          studentName,
          courseCode,
        },
      });
    }
  }

  async notifyStatusChanged(
    complaintId: string,
    studentId: string,
    studentEmail: string,
    newStatus: string,
    courseCode: string,
    adminName: string
  ) {
    await this.sendNotification({
      type: "complaint_status_changed",
      complaintId,
      recipientId: studentId,
      recipientEmail: studentEmail,
      data: {
        status: newStatus,
        courseCode,
        adminName,
      },
    });
  }

  async notifyComplaintResponse(
    complaintId: string,
    studentId: string,
    studentEmail: string,
    courseCode: string,
    adminName: string
  ) {
    await this.sendNotification({
      type: "complaint_response",
      complaintId,
      recipientId: studentId,
      recipientEmail: studentEmail,
      data: {
        courseCode,
        adminName,
      },
    });
  }

  // Email templates
  private getEmailTemplate(type: string, data: any) {
    const templates = {
      complaint_submitted: {
        subject: `New Complaint Submitted - ${data.courseCode}`,
        html: `
          <h2>New Complaint Submitted</h2>
          <p>A new complaint has been submitted by <strong>${data.studentName}</strong> for course <strong>${data.courseCode}</strong>.</p>
          <p>Please review and respond to this complaint in the admin dashboard.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/complaints/${data.complaintId}">View Complaint</a>
        `,
      },
      complaint_status_changed: {
        subject: `Complaint Status Updated - ${data.courseCode}`,
        html: `
          <h2>Complaint Status Updated</h2>
          <p>Your complaint for course <strong>${data.courseCode}</strong> has been updated to <strong>${data.status}</strong>.</p>
          <p>Updated by: ${data.adminName}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/student/complaints/${data.complaintId}">View Complaint</a>
        `,
      },
      complaint_response: {
        subject: `New Response to Your Complaint - ${data.courseCode}`,
        html: `
          <h2>New Response to Your Complaint</h2>
          <p>An admin has responded to your complaint for course <strong>${data.courseCode}</strong>.</p>
          <p>Response from: ${data.adminName}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/student/complaints/${data.complaintId}">View Response</a>
        `,
      },
    };

    return templates[type as keyof typeof templates];
  }
}

export const notificationService = new NotificationService();
