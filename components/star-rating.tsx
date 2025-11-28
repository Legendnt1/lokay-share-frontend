import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showLabel = false,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-zinc-300 dark:text-zinc-600"
          )}
        />
      ))}
      {showLabel && (
        <span className="ml-1 text-sm font-medium text-zinc-900 dark:text-white">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  );
}
