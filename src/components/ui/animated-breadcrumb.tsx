"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface AnimatedBreadcrumbProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

export function AnimatedBreadcrumb({
  className,
  customItems,
}: AnimatedBreadcrumbProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    ];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Capitalize and format segment
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {breadcrumbs.map((item, index) => (
        <div
          key={item.href}
          className="flex items-center animate-in slide-in-from-left-4 duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}

          {index === breadcrumbs.length - 1 ? (
            // Current page - not clickable
            <span className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
              {item.icon}
              {item.label}
            </span>
          ) : (
            // Clickable breadcrumb
            <Link
              href={item.href}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors duration-200 hover:scale-105 transform"
            >
              {item.icon}
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
