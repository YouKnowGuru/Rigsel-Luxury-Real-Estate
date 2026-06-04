import { cn } from "@/lib/utils";

export function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#1B1E23] rounded-2xl md:rounded-3xl overflow-hidden shadow-soft animate-pulse border border-gray-100 dark:border-white/5",
        className
      )}
    >
      <div className="h-48 sm:h-56 md:h-64 bg-gray-200 dark:bg-white/10" />
      <div className="p-4 sm:p-6 space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
        <div className="grid grid-cols-3 gap-2 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-white/10 rounded" />
          ))}
        </div>
        <div className="h-12 bg-gray-200 dark:bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}
