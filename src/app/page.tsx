import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Shield, FileText } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">UI CS Complaint System</span>
          </div>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to UI Computer Science
            <br />
            <span className="text-primary">Complaint Management System</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Submit and track your academic complaints efficiently. Get help with
            missing grades, result errors, and course registration issues.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Submit Complaints</CardTitle>
              <CardDescription>
                Easily submit complaints about grades, results, and academic
                records
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Track Status</CardTitle>
              <CardDescription>
                Monitor your complaint status in real-time with detailed updates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Quick Resolution</CardTitle>
              <CardDescription>
                Get faster responses from department administrators
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
