import Link from "next/link";
import { Button } from "@/components/ui/button";

import { AnimatedCard } from "@/components/ui/animated-card";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Shield,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "University of Ibadan Computer Science Department Complaint Management System - Submit and track academic complaints efficiently",
  openGraph: {
    title: "UI CS Complaint System - Home",
    description:
      "Submit and track your academic complaints efficiently at University of Ibadan Computer Science Department",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <nav className="flex justify-between items-center animate-in fade-in-50 slide-in-from-top-4 duration-700">
          <div className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              UI CS Complaint System
            </span>
          </div>
          <Link href="/auth/login">
            <Button className="hover:shadow-lg transition-all duration-200 group">
              Login
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div>
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                University of Ibadan
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="text-gray-900 dark:text-white">
                Computer Science
              </span>
              <br />
              <span className="text-primary">Complaint System</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Submit and track your academic complaints efficiently. Get help
              with missing grades, result errors, and course registration
              issues.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <AnimatedCard
            delay={0}
            className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-xl hover:shadow-2xl group"
          >
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <FileText className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Submit Complaints
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                Easily submit complaints about grades, results, and academic
                records with our streamlined process
              </CardDescription>
            </CardHeader>
          </AnimatedCard>

          <AnimatedCard
            delay={200}
            className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-xl hover:shadow-2xl group"
          >
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Track Status
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                Monitor your complaint status in real-time with detailed updates
                and notifications
              </CardDescription>
            </CardHeader>
          </AnimatedCard>

          <AnimatedCard
            delay={400}
            className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-xl hover:shadow-2xl group"
          >
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Quick Resolution
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                Get faster responses from department administrators with
                priority handling
              </CardDescription>
            </CardHeader>
          </AnimatedCard>
        </div>
      </main>
    </div>
  );
}
