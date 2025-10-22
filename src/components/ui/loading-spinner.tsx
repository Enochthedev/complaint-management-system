import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  className,
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "animate-spin rounded-full border-gray-200 dark:border-gray-700 border-t-primary border-r-primary",
          sizeClasses[size],
          className
        )}
      />
      <div
        className={cn(
          "absolute inset-0 animate-pulse rounded-full bg-primary/10",
          sizeClasses[size].split(" ")[0] +
            " " +
            sizeClasses[size].split(" ")[1]
        )}
      />
    </div>
  );
}
