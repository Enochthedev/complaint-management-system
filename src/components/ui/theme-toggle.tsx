"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (checked: boolean) => {
    // Add a subtle page transition
    document.documentElement.style.transition =
      "background-color 0.3s ease, color 0.3s ease";
    setTheme(checked ? "dark" : "light");

    // Remove transition after change
    setTimeout(() => {
      document.documentElement.style.transition = "";
    }, 300);
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 opacity-50">
        <Sun className="h-4 w-4" />
        <Switch disabled />
        <Moon className="h-4 w-4" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-500 ease-out",
          isDark
            ? "text-gray-400 scale-75 opacity-60"
            : "text-orange-500 scale-100 opacity-100"
        )}
      />

      <Switch
        checked={isDark}
        onCheckedChange={handleThemeChange}
        aria-label="Toggle dark mode"
        className="transition-all duration-300"
      />

      <Moon
        className={cn(
          "h-4 w-4 transition-all duration-500 ease-out",
          isDark
            ? "text-blue-400 scale-100 opacity-100"
            : "text-gray-400 scale-75 opacity-60"
        )}
      />
    </div>
  );
}
