"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Google Analytics
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

    if (!GA_ID) return;

    // Track page views
    const url = pathname + searchParams.toString();

    if (typeof window.gtag !== "undefined") {
      window.gtag("config", GA_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  // Only render in production
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  if (!GA_ID) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Custom event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track complaint submissions
export const trackComplaintSubmission = (type: string) => {
  trackEvent("submit_complaint", "engagement", type);
};

// Track login events
export const trackLogin = (userType: "student" | "admin") => {
  trackEvent("login", "engagement", userType);
};

// Track page performance
export const trackPerformance = () => {
  if (typeof window !== "undefined" && "performance" in window) {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      trackEvent(
        "page_load_time",
        "performance",
        window.location.pathname,
        Math.round(loadTime)
      );
    }
  }
};
