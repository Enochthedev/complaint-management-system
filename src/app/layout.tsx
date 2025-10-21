import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "UI CS Complaint System",
    template: "%s | UI CS Complaint System",
  },
  description:
    "University of Ibadan Computer Science Department Complaint Management System - Submit and track academic complaints efficiently",
  keywords: [
    "University of Ibadan",
    "Computer Science",
    "Complaint System",
    "Academic Complaints",
    "Student Portal",
    "UI CS Department",
  ],
  authors: [{ name: "UI CS Department" }],
  creator: "UI CS Department",
  publisher: "University of Ibadan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://ui-cs-complaints.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "UI CS Complaint System",
    description:
      "University of Ibadan Computer Science Department Complaint Management System",
    siteName: "UI CS Complaint System",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UI CS Complaint System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UI CS Complaint System",
    description:
      "University of Ibadan Computer Science Department Complaint Management System",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
