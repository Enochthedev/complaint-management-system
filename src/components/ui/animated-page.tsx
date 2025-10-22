"use client";

import { cn } from "@/lib/utils";
import { animationClasses } from "@/lib/animations";

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fadeIn"
    | "slideInUp"
    | "slideInDown"
    | "slideInLeft"
    | "slideInRight";
  delay?: number;
}

export function AnimatedPage({
  children,
  className,
  animation = "fadeIn",
  delay = 0,
}: AnimatedPageProps) {
  return (
    <div
      className={cn(animationClasses[animation], className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
