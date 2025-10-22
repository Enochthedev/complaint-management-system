"use client";

import { cn } from "@/lib/utils";
import { getStaggerDelay } from "@/lib/animations";

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  animation?: "slideInUp" | "slideInLeft" | "fadeIn";
}

export function AnimatedList({
  children,
  className,
  itemClassName,
  staggerDelay = 100,
  animation = "slideInUp",
}: AnimatedListProps) {
  const animationClass = {
    slideInUp: "animate-in slide-in-from-bottom-4 duration-500",
    slideInLeft: "animate-in slide-in-from-left-4 duration-500",
    fadeIn: "animate-in fade-in duration-500",
  }[animation];

  return (
    <div className={cn("space-y-4", className)}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(animationClass, itemClassName)}
          style={{ animationDelay: getStaggerDelay(index, staggerDelay) }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
