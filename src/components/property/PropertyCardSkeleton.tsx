import { cn } from "@/lib/utils";

export function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl md:rounded-3xl overflow-hidden animate-pulse",
        className
      )}
    >
      <div className="h-48 sm:h-56 md:h-64 bg-ink-100/60 dark:bg-white/8" />
      <div className="p-4 sm:p-6 space-y-4">
        <div className="h-6 bg-ink-100/70 dark:bg-white/10 rounded w-2/3" />
        <div className="h-4 bg-ink-100/70 dark:bg-white/10 rounded w-1/2" />
        <div className="grid grid-cols-3 gap-2 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-ink-100/70 dark:bg-white/10 rounded" />
          ))}
        </div>
        <div className="h-12 bg-ink-100/70 dark:bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}
