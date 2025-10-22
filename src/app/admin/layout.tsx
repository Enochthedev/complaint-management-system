"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect("/auth/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email, role")
        .eq("id", user.id)
        .single();

      if (
        !profileData ||
        (profileData.role !== "admin" && profileData.role !== "super_admin")
      ) {
        redirect("/auth/login");
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    getProfile();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50 dark:bg-gray-950/50">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Loading Admin Portal
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Verifying permissions and setting up dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-950/50">
      <AdminSidebar
        profile={profile}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile header spacer */}
        <div className="lg:hidden h-16" />

        {/* Page content with proper padding and max width */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Toaster />
    </div>
  );
}
