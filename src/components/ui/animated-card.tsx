import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import * as React from "react";

interface AnimatedCardProps extends React.ComponentProps<"div"> {
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({
  className,
  delay = 0,
  hover = true,
  children,
  ...props
}: AnimatedCardProps) {
  return (
    <Card
      className={cn(
        "animate-in fade-in-50 slide-in-from-bottom-4 duration-500",
        hover &&
          "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Card>
  );
}
