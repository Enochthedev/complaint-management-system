"use client";

// Simple in-memory cache for client-side data
class ClientCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();
  private static instance: ClientCache;

  static getInstance(): ClientCache {
    if (!ClientCache.instance) {
      ClientCache.instance = new ClientCache();
    }
    return ClientCache.instance;
  }

  // Set cache with TTL (time to live) in milliseconds
  set(key: string, data: any, ttl: number = 5 * 60 * 1000) {
    // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Get from cache
  get(key: string): any | null {
    const item = this.cache.get(key);

    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Clear specific key
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const clientCache = ClientCache.getInstance();

// Cache keys constants
export const CACHE_KEYS = {
  DASHBOARD_STATS: "dashboard_stats",
  USER_PROFILE: "user_profile",
  COMPLAINTS_LIST: "complaints_list",
  NOTIFICATIONS: "notifications",
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

// Utility functions for common caching patterns
export const cacheUtils = {
  // Get or fetch pattern
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    // Try to get from cache first
    const cached = clientCache.get(key);
    if (cached) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetchFn();

    // Cache the result
    clientCache.set(key, data, ttl);

    return data;
  },

  // Invalidate related cache keys
  invalidatePattern(pattern: string): void {
    const keys = Array.from(clientCache["cache"].keys());
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        clientCache.delete(key);
      }
    });
  },

  // Cache with stale-while-revalidate pattern
  async staleWhileRevalidate<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    const cached = clientCache.get(key);

    // If we have cached data, return it immediately
    if (cached) {
      // But also fetch fresh data in the background
      fetchFn()
        .then((freshData) => {
          clientCache.set(key, freshData, ttl);
        })
        .catch((error) => {
          console.warn("Background refresh failed:", error);
        });

      return cached;
    }

    // No cached data, fetch fresh
    const data = await fetchFn();
    clientCache.set(key, data, ttl);
    return data;
  },
};

// Auto cleanup every 10 minutes
if (typeof window !== "undefined") {
  setInterval(() => {
    clientCache.cleanup();
  }, 10 * 60 * 1000);
}
