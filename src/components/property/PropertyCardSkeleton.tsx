import { cn } from "@/lib/utils";

export function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white/70 dark:bg-ink-800/50 backdrop-blur-md rounded-2xl md:rounded-3xl overflow-hidden border border-ink-100/80 dark:border-white/10",
        className
      )}
    >
      {/* Image skeleton */}
      <div className="relative h-48 sm:h-56 md:h-60 overflow-hidden bg-ink-100/80 dark:bg-ink-700/40">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
      </div>

      {/* Content skeleton */}
      <div className="p-5 sm:p-6 space-y-3">
        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-sky/15 rounded-full" />
          <div className="h-5 w-8 bg-sky/10 rounded" />
        </div>
        {/* Title */}
        <div className="h-6 bg-ink-100/80 dark:bg-ink-700/40 rounded-lg w-4/5" />
        {/* Location */}
        <div className="h-4 bg-ink-100/60 dark:bg-ink-700/30 rounded w-3/5" />
        {/* Price */}
        <div className="pt-1">
          <div className="h-7 bg-ink-100/80 dark:bg-ink-700/40 rounded w-2/5" />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-9 bg-ink-100/60 dark:bg-ink-700/30 rounded-xl" />
          ))}
        </div>
        {/* CTA row */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 w-20 bg-sky/15 rounded" />
          <div className="h-8 w-16 bg-ink-100/60 dark:bg-ink-700/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
