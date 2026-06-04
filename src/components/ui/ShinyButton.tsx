"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

interface ShinyButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
}

const sizeMap: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-10 px-5 text-[14px]",
  lg: "h-12 px-7 text-[15px]",
};

const variantMap: Record<Variant, string> = {
  primary:
    "bg-sky text-white hover:bg-sky-hover active:scale-[0.98]",
  ghost:
    "text-foreground hover:bg-ink-100/60 dark:hover:bg-ink-800/40 active:scale-[0.98]",
  outline:
    "bg-white text-foreground border border-ink-200 hover:bg-fog dark:bg-card dark:border-ink-700 dark:hover:bg-ink-800/40 active:scale-[0.98]",
  dark:
    "bg-ink-800 text-white hover:bg-ink-900 active:scale-[0.98]",
};

/**
 * Apple-style pill button. Kept under the legacy ShinyButton name for
 * backward compatibility.
 */
export const ShinyButton = forwardRef<HTMLButtonElement, ShinyButtonProps>(
  function ShinyButton(
    {
      variant = "primary",
      size = "md",
      href,
      external,
      className,
      children,
      onClick,
      type = "button",
      disabled,
      iconRight,
      iconLeft,
    },
    ref
  ) {
    const base =
      "inline-flex items-center justify-center gap-1.5 rounded-full font-medium leading-none whitespace-nowrap transition-all duration-fast ease-apple outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none no-tap";

    const cls = cn(base, sizeMap[size], variantMap[variant], className);

    const content = (
      <>
        {iconLeft && <span className="-ml-0.5">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span className="-mr-0.5">{iconRight}</span>}
      </>
    );

    if (href) {
      const linkProps = external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {};
      return (
        <Link href={href} className={cls} {...linkProps}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cls}
      >
        {content}
      </button>
    );
  }
);
