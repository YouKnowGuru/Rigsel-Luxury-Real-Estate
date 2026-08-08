import { cn } from "@/lib/utils";

type SectionVariant = "default" | "muted" | "dark" | "mesh" | "glass";

const variantClasses: Record<SectionVariant, string> = {
  default: "bg-background",
  muted: "bg-fog-light dark:bg-ink-900/40",
  dark: "bg-ink-900/70 backdrop-blur-2xl text-white",
  mesh: "bg-background bg-mesh-luxury",
  glass: "bg-transparent",
};

interface SectionProps {
  id?: string;
  className?: string;
  variant?: SectionVariant;
  padding?: "default" | "sm" | "none";
  children: React.ReactNode;
}

export function Section({
  id,
  className,
  variant = "default",
  padding = "default",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        padding === "default" && "section-padding",
        padding === "sm" && "section-padding-sm",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </section>
  );
}
