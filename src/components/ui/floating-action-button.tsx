"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: "plus" | "arrow-up" | React.ReactNode;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  tooltip?: string;
  showOnScroll?: boolean;
  className?: string;
}

const positions = {
  "bottom-right": "fixed bottom-6 right-6",
  "bottom-left": "fixed bottom-6 left-6",
  "top-right": "fixed top-6 right-6",
  "top-left": "fixed top-6 left-6",
};

const sizes = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-16 w-16",
};

const variants = {
  primary:
    "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white",
  secondary:
    "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white",
  success:
    "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white",
  warning:
    "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white",
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white",
};

export function FloatingActionButton({
  onClick,
  icon = "plus",
  position = "bottom-right",
  size = "md",
  variant = "primary",
  tooltip,
  showOnScroll = false,
  className,
}: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);

  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOnScroll]);

  const renderIcon = () => {
    if (typeof icon === "string") {
      switch (icon) {
        case "plus":
          return <Plus className="h-6 w-6" />;
        case "arrow-up":
          return <ArrowUp className="h-6 w-6" />;
        default:
          return <Plus className="h-6 w-6" />;
      }
    }
    return icon;
  };

  if (!isVisible) return null;

  return (
    <div className={cn(positions[position], "z-50")}>
      <Button
        onClick={onClick}
        className={cn(
          sizes[size],
          variants[variant],
          "rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group",
          "animate-in slide-in-from-bottom-4 duration-500",
          "hover:scale-110 active:scale-95",
          className
        )}
        title={tooltip}
      >
        <div className="group-hover:rotate-90 transition-transform duration-300">
          {renderIcon()}
        </div>
      </Button>
    </div>
  );
}
