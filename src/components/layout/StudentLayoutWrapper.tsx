"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { StudentSidebar } from "./StudentSidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { User } from "@supabase/supabase-js";

interface Profile {
  full_name: string;
  matric_number: string;
  email: string;
}

interface StudentLayoutWrapperProps {
  children: React.ReactNode;
}

export function StudentLayoutWrapper({ children }: StudentLayoutWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseClient();

    const getUser = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/auth/login");
          return;
        }

        setUser(user);

        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, matric_number, email")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData) {
          console.error("Error fetching profile:", profileError);
          router.push("/auth/login");
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error("Error in getUser:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50 dark:bg-gray-950/50">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Loading Student Portal
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please wait while we set up your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-950/50">
      <StudentSidebar
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
    </div>
  );
}
