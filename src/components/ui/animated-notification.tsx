"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export interface NotificationProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const notificationStyles = {
  success:
    "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
  error:
    "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
  warning:
    "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
  info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
};

export function AnimatedNotification({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const Icon = notificationIcons[type];

  useEffect(() => {
    // Entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss
    if (duration > 0) {
      const hideTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }

    return () => clearTimeout(showTimer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 transform",
        notificationStyles[type],
        isVisible && !isExiting
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      )}
    >
      {/* Animated progress bar */}
      {duration > 0 && (
        <div className="absolute top-0 left-0 h-1 bg-current opacity-30">
          <div
            className="h-full bg-current animate-pulse"
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 animate-in zoom-in-50 duration-300" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm animate-in slide-in-from-left-2 duration-300">
            {title}
          </h4>
          {message && (
            <p className="text-sm opacity-90 mt-1 animate-in slide-in-from-left-2 duration-300 delay-100">
              {message}
            </p>
          )}

          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium underline hover:no-underline mt-2 animate-in slide-in-from-left-2 duration-300 delay-200"
            >
              {action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 animate-in zoom-in-50 duration-300 delay-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// Notification container component
interface NotificationContainerProps {
  notifications: NotificationProps[];
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

const positionStyles = {
  "top-right": "fixed top-4 right-4 z-50",
  "top-left": "fixed top-4 left-4 z-50",
  "bottom-right": "fixed bottom-4 right-4 z-50",
  "bottom-left": "fixed bottom-4 left-4 z-50",
  "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
  "bottom-center": "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
};

export function NotificationContainer({
  notifications,
  position = "top-right",
}: NotificationContainerProps) {
  return (
    <div className={cn(positionStyles[position], "max-w-sm w-full")}>
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <AnimatedNotification {...notification} />
          </div>
        ))}
      </div>
    </div>
  );
}
