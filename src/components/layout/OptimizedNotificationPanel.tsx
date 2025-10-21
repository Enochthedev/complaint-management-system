"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, FileText, AlertCircle, MessageSquare, Info } from "lucide-react";
import { Notification } from "@/hooks/use-notifications";

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getTimeAgo: (date: string) => string;
  getNotificationLink: (notification: Notification) => string | null;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "complaint_submitted":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "complaint_updated":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "complaint_response":
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case "system":
      return <Info className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const NotificationItem = React.memo(
  ({
    notification,
    markAsRead,
    getTimeAgo,
    getNotificationLink,
  }: {
    notification: Notification;
    markAsRead: (id: string) => void;
    getTimeAgo: (date: string) => string;
    getNotificationLink: (notification: Notification) => string | null;
  }) => {
    const notificationLink = getNotificationLink(notification);

    const handleClick = () => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    };

    const NotificationContent = (
      <div
        className={`p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer ${
          !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
        }`}
        onClick={handleClick}
      >
        <div className="flex items-start gap-3">
          {getNotificationIcon(notification.type)}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="text-xs text-muted-foreground">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground">
              {getTimeAgo(notification.created_at)}
            </p>
          </div>
          {!notification.read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
          )}
        </div>
      </div>
    );

    return notificationLink ? (
      <Link href={notificationLink}>{NotificationContent}</Link>
    ) : (
      <div>{NotificationContent}</div>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

export const OptimizedNotificationPanel = React.memo(
  ({
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getTimeAgo,
    getNotificationLink,
  }: NotificationPanelProps) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 relative"
          >
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start" side="right">
          <div className="p-4 border-b">
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have {unreadCount} unread notifications
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  markAsRead={markAsRead}
                  getTimeAgo={getTimeAgo}
                  getNotificationLink={getNotificationLink}
                />
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            )}
          </div>
          <div className="p-2 border-t flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                className="flex-1 text-sm"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
            <Button variant="ghost" className="flex-1 text-sm">
              View all
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

OptimizedNotificationPanel.displayName = "OptimizedNotificationPanel";
