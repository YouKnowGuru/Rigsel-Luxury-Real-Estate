"use client";

import Link from "next/link";

/** Lightweight formatting for Phojaa A1 replies (no extra markdown deps). */
export function AssistantMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => (
        <p key={i} className="leading-snug">
          <FormattedLine text={line} />
        </p>
      ))}
    </div>
  );
}

function FormattedLine({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return <br />;

  const bullet = trimmed.match(/^[-*•]\s+(.+)$/);
  const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
  const body = bullet?.[1] ?? numbered?.[1] ?? trimmed;

  const parts = body.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+|\/properties\/[a-f0-9]{24})/gi);

  const inner = parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const mdLink = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLink) {
      return <InlineLink key={idx} href={mdLink[2]} label={mdLink[1]} />;
    }
    if (part.startsWith("http") || part.startsWith("/properties/")) {
      const label =
        part.startsWith("/properties/") ? "View listing" : part.replace(/^https?:\/\//, "").slice(0, 40);
      return <InlineLink key={idx} href={part} label={label} />;
    }
    return <span key={idx}>{part}</span>;
  });

  if (bullet || numbered) {
    return (
      <span className="flex gap-2 pl-0.5">
        <span className="text-sky shrink-0">{numbered ? "•" : "•"}</span>
        <span>{inner}</span>
      </span>
    );
  }

  return <>{inner}</>;
}

function InlineLink({ href, label }: { href: string; label: string }) {
  const isInternal = href.startsWith("/");
  const className =
    "text-sky underline underline-offset-2 hover:text-sky/80 font-medium";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}
