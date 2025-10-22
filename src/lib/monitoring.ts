// Error tracking and monitoring utilities

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  severity: "low" | "medium" | "high" | "critical";
  context?: Record<string, unknown>;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private isProduction = process.env.NODE_ENV === "production";

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  // Log error to console and external service
  logError(
    error: Error,
    context?: Record<string, unknown>,
    severity: ErrorReport["severity"] = "medium"
  ) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== "undefined" ? window.location.href : "server",
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "server",
      timestamp: new Date().toISOString(),
      severity,
      context,
    };

    // Always log to console
    console.error("Error tracked:", errorReport);

    // In production, send to external service
    if (this.isProduction) {
      this.sendToExternalService(errorReport);
    }
  }

  // Log authentication failures
  logAuthFailure(reason: string, context?: Record<string, unknown>) {
    this.logError(
      new Error(`Authentication failed: ${reason}`),
      {
        type: "auth_failure",
        ...context,
      },
      "high"
    );
  }

  // Log database errors
  logDatabaseError(error: Error, query?: string) {
    this.logError(
      error,
      {
        type: "database_error",
        query,
      },
      "critical"
    );
  }

  // Log API errors
  logApiError(error: Error, endpoint: string, method: string) {
    this.logError(
      error,
      {
        type: "api_error",
        endpoint,
        method,
      },
      "high"
    );
  }

  // Send to external monitoring service (Sentry, LogRocket, etc.)
  private async sendToExternalService(errorReport: ErrorReport) {
    try {
      // Example: Send to your logging service
      // await fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });

      // For now, we'll use a simple endpoint
      if (typeof window !== "undefined") {
        fetch("/api/monitoring/error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(errorReport),
        }).catch(() => {
          // Silently fail if logging service is down
        });
      }
    } catch (err) {
      // Silently fail if external service is unavailable
      console.warn("Failed to send error to external service:", err);
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track page load performance
  trackPageLoad(pageName: string) {
    if (typeof window === "undefined") return;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics = {
        page: pageName,
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        timestamp: new Date().toISOString(),
      };

      console.log("Performance metrics:", metrics);

      // Send to analytics
      if (process.env.NODE_ENV === "production") {
        this.sendPerformanceData(metrics);
      }
    }
  }

  // Track API response times
  trackApiCall(endpoint: string, duration: number, success: boolean) {
    const metrics = {
      type: "api_call",
      endpoint,
      duration,
      success,
      timestamp: new Date().toISOString(),
    };

    console.log("API metrics:", metrics);

    if (process.env.NODE_ENV === "production") {
      this.sendPerformanceData(metrics);
    }
  }

  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaint = paintEntries.find(
      (entry) => entry.name === "first-paint"
    );
    return firstPaint ? firstPaint.startTime : null;
  }

  private async sendPerformanceData(metrics: Record<string, unknown>) {
    try {
      await fetch("/api/monitoring/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metrics),
      });
    } catch (err) {
      // Silently fail
      console.warn("Failed to send performance data:", err);
    }
  }
}

// Export singleton instances
export const errorTracker = ErrorTracker.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();

// Global error handler for unhandled errors
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    errorTracker.logError(
      event.error || new Error(event.message),
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      "high"
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    errorTracker.logError(
      new Error(event.reason),
      {
        type: "unhandled_promise_rejection",
      },
      "high"
    );
  });
}
