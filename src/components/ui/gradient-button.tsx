import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";
import * as React from "react";

interface GradientButtonProps
  extends Omit<React.ComponentProps<"button">, "variant"> {
  gradient?: "primary" | "success" | "warning" | "danger";
  glow?: boolean;
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  asChild?: boolean;
}

const gradients = {
  primary:
    "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
  success:
    "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
  warning:
    "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
};

const glows = {
  primary:
    "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
  success:
    "shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30",
  warning:
    "shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30",
  danger: "shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30",
};

export const GradientButton = forwardRef<
  HTMLButtonElement,
  GradientButtonProps
>(
  (
    { className, gradient = "primary", glow = true, children, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        className={cn(
          gradients[gradient],
          glow && glows[gradient],
          "text-white border-0 transition-all duration-200 group",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GradientButton.displayName = "GradientButton";
