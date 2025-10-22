"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  GraduationCap,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createSupabaseClient();
      // Determine if identifier is email or matric
      const isEmail = formData.identifier.includes("@");

      let email = formData.identifier;

      // If matric number, get the email from profiles table
      if (!isEmail) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("email")
          .eq("matric_number", formData.identifier)
          .single();

        if (profileError || !profile) {
          toast({
            title: "Error",
            description: "Invalid matric number",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        email = profile.email;
      }

      // Sign in with email
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: formData.password,
        });

      if (authError) throw authError;

      // Login successful

      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Profile not found. Please contact administrator.");
      }

      // Check if user role matches login type
      const isAdminRole =
        profile.role === "admin" || profile.role === "super_admin";
      const isStudentRole = profile.role === "student";

      if (loginType === "admin" && !isAdminRole) {
        toast({
          title: "Access Denied",
          description: `You don't have admin access.`,
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (loginType === "student" && !isStudentRole) {
        toast({
          title: "Access Denied",
          description: `You don't have student access.`,
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Show success message
      toast({
        title: "Login Successful",
        description: `Welcome back, ${profile.full_name}!`,
      });

      // Session established, redirect immediately

      // Use Next.js router for navigation - this should work now that middleware is disabled
      const targetUrl =
        isAdminRole && loginType === "admin" ? "/admin" : "/student";

      router.push(targetUrl);
      setLoading(false);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
      <CardHeader className="space-y-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
            {loginType === "student" ? (
              <GraduationCap className="h-8 w-8 text-primary" />
            ) : (
              <Shield className="h-8 w-8 text-red-600" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Login to your UI CS Complaint System account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Simplified Login Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Button
              type="button"
              variant={loginType === "student" ? "default" : "ghost"}
              onClick={() => setLoginType("student")}
              className="transition-colors duration-200"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Student
            </Button>
            <Button
              type="button"
              variant={loginType === "admin" ? "default" : "ghost"}
              onClick={() => setLoginType("admin")}
              className={`transition-colors duration-200 ${
                loginType === "admin" ? "bg-red-600 hover:bg-red-700" : ""
              }`}
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </Button>
          </div>

          {/* Identifier Input */}
          <div className="space-y-2">
            <Label htmlFor="identifier">
              {loginType === "student" ? "Matric Number or Email" : "Email"}
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder={
                loginType === "student"
                  ? "222505 or email@ui.edu.ng"
                  : "admin@ui.edu.ng"
              }
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full transition-colors duration-200 ${
              loginType === "admin" ? "bg-red-600 hover:bg-red-700" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              `Login as ${loginType === "student" ? "Student" : "Admin"}`
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        {loginType === "student" && (
          <p className="text-sm text-center w-full text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline transition-colors duration-200"
            >
              Register here
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
