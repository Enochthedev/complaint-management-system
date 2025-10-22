"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNotifications } from "@/hooks/use-notifications";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Bell,
  Search,
  AlertCircle,
  MessageSquare,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StudentSidebarProps {
  profile: {
    full_name: string;
    matric_number: string;
    email: string;
  };
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "New Complaint", href: "/student/new-complaint", icon: PlusCircle },
  { name: "My Complaints", href: "/student/complaints", icon: FileText },
  { name: "Profile", href: "/student/profile", icon: User },
];

export function StudentSidebar({
  profile,
  mobileMenuOpen = false,
  setMobileMenuOpen,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, getTimeAgo } =
    useNotifications();

  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

  const getNotificationLink = (notification: any) => {
    if (notification.related_id && notification.type.includes("complaint")) {
      return `/student/complaints/${notification.related_id}`;
    }
    return null;
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            UI CS
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Student Portal
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search complaints..."
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-4 border border-primary/10">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {profile.full_name}
            </p>
            <p className="text-xs text-primary font-medium">
              {profile.matric_number}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen?.(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-primary-foreground"
                    : "text-gray-500 dark:text-gray-400"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="p-4 space-y-3 border-t border-gray-100 dark:border-gray-800">
        {/* Quick Action - New Complaint */}
        <Link href="/student/new-complaint">
          <Button className="w-full justify-start gap-3 h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200">
            <PlusCircle className="h-5 w-5" />
            New Complaint
          </Button>
        </Link>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 relative h-12 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-auto h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
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
                notifications.map((notification) => {
                  const notificationLink = getNotificationLink(notification);
                  const NotificationContent = (
                    <div
                      className={`p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer ${
                        !notification.read
                          ? "bg-blue-50/50 dark:bg-blue-950/20"
                          : ""
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
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
                    <Link key={notification.id} href={notificationLink}>
                      {NotificationContent}
                    </Link>
                  ) : (
                    <div key={notification.id}>{NotificationContent}</div>
                  );
                })
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

        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme
          </span>
          <ThemeToggle />
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl"
          onClick={() => setMobileMenuOpen?.(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">
            UI CS Student
          </span>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-white dark:bg-gray-900">
          <div className="pt-16">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent />
      </div>
    </>
  );
}
