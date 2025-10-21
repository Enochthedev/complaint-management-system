// Environment-specific configuration

export const config = {
  // App configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "UI CS Complaint System",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    version: process.env.npm_package_version || "1.0.0",
  },

  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
  },

  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },

  // Security
  security: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  },

  // Features flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    enableErrorTracking:
      process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === "true",
    enablePerformanceMonitoring:
      process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true",
    enablePWA: process.env.NEXT_PUBLIC_ENABLE_PWA === "true",
  },

  // API configuration
  api: {
    timeout: 30000, // 30 seconds
    retries: 3,
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  },

  // Cache configuration
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // Maximum number of cached items
  },

  // UI configuration
  ui: {
    itemsPerPage: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
  },

  // Database configuration
  database: {
    maxConnections: process.env.DB_MAX_CONNECTIONS
      ? parseInt(process.env.DB_MAX_CONNECTIONS)
      : 10,
    connectionTimeout: 30000,
  },
} as const;

// Validation function to ensure required environment variables are set
export function validateConfig() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please check your .env.local file and ensure all required variables are set."
    );
  }

  // Validate URLs
  try {
    new URL(config.supabase.url);
    new URL(config.app.url);
  } catch (error) {
    throw new Error("Invalid URL in environment variables");
  }

  console.log("✅ Configuration validated successfully");
}

// Environment-specific settings
export const getEnvironmentConfig = () => {
  if (config.env.isDevelopment) {
    return {
      logLevel: "debug",
      enableDevTools: true,
      enableHotReload: true,
      apiTimeout: 60000, // Longer timeout for development
    };
  }

  if (config.env.isProduction) {
    return {
      logLevel: "error",
      enableDevTools: false,
      enableHotReload: false,
      apiTimeout: 30000,
    };
  }

  // Test environment
  return {
    logLevel: "silent",
    enableDevTools: false,
    enableHotReload: false,
    apiTimeout: 10000,
  };
};

// Export specific configurations for different environments
export const devConfig = {
  ...config,
  features: {
    ...config.features,
    enableAnalytics: false,
    enableErrorTracking: false,
  },
};

export const prodConfig = {
  ...config,
  features: {
    ...config.features,
    enableAnalytics: true,
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
  },
};

// Use appropriate config based on environment
export const activeConfig = config.env.isProduction ? prodConfig : devConfig;
