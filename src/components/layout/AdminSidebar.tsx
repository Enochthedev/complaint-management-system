"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6">
        <Shield className="h-8 w-8 text-primary" />
        <div className="flex flex-col">
          <span className="text-lg font-bold">UI CS Admin</span>
          <span className="text-xs text-muted-foreground">{roleDisplay}</span>
        </div>
      </div>

      <Separator />

      {/* Search - Only show on complaints pages */}
      {(pathname.includes("/admin/complaints") || pathname === "/admin") && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{profile.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {profile.email}
            </p>
            <p className="text-xs text-muted-foreground">{roleDisplay}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={handleMobileMenuClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              item.isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <Separator />

      {/* Actions */}
      <div className="p-4 space-y-2">
        {/* Notifications */}
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
        <div className="flex items-center justify-between px-3">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>

        <Separator className="my-2" />

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen?.(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold">UI CS Admin</span>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background">
          <div className="pt-16">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-background">
        <SidebarContent />
      </div>
    </>
  );
}
