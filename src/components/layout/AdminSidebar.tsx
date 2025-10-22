"use client";

import React, { useMemo, useCallback } from "react";
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
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Search,
  Bell,
  AlertCircle,
  MessageSquare,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  profile: {
    full_name: string;
    email: string;
    role: string;
  };
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "All Complaints", href: "/admin/complaints", icon: FileText },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({
  profile,
  mobileMenuOpen = false,
  setMobileMenuOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { notifications, unreadCount, markAsRead, markAllAsRead, getTimeAgo } =
    useNotifications();
  const router = useRouter();
  const supabase = createSupabaseClient();

  // Memoize expensive calculations
  const userInitials = useMemo(() => {
    return profile.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [profile.full_name]);

  const roleDisplay = useMemo(() => {
    return profile.role === "super_admin" ? "Super Admin" : "Admin";
  }, [profile.role]);

  // Memoize navigation items with active state
  const navigationItems = useMemo(() => {
    return navigation.map((item) => ({
      ...item,
      isActive: pathname === item.href,
    }));
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }, [supabase, router]);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen?.(false);
  }, [setMobileMenuOpen]);

  const getNotificationIcon = useCallback((type: string) => {
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
  }, []);

  const getNotificationLink = useCallback((notification: any) => {
    if (notification.related_id && notification.type.includes("complaint")) {
      return `/admin/complaints/${notification.related_id}`;
    }
    return null;
  }, []);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
          <Shield className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            UI CS Admin
          </span>
          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
            {roleDisplay}
          </span>
        </div>
      </div>

      {/* Search - Only show on complaints pages */}
      {(pathname.includes("/admin/complaints") || pathname === "/admin") && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            <Input
              placeholder="Search complaints..."
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 p-4 border border-red-200/50 dark:border-red-800/30">
          <Avatar className="h-12 w-12 ring-2 ring-red-500/20">
            <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold text-lg">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {profile.full_name}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              {roleDisplay}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-4">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={handleMobileMenuClose}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
              item.isActive
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 transition-all duration-200 group-hover:scale-110",
                item.isActive
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              )}
            />
            {item.name}
            {item.isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 rounded-xl animate-pulse" />
            )}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="p-4 space-y-3 border-t border-gray-100 dark:border-gray-800">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 relative h-12 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 group"
            >
              <Bell className="h-5 w-5 group-hover:animate-pulse" />
              Notifications
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-auto h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs animate-bounce bg-gradient-to-r from-red-500 to-red-600"
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
          className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
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
            <X className="h-6 w-6 transition-transform duration-200 rotate-90" />
          ) : (
            <Menu className="h-6 w-6 transition-transform duration-200" />
          )}
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">
            UI CS Admin
          </span>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out">
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
