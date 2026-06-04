import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Apple-style "shop"-class CTA button. Kept under the legacy `LuxuryButton`
 * name so existing pages don't need to change their imports.
 */
export function LuxuryButton({
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant="default"
      className={cn(
        "btn-primary-lg",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
