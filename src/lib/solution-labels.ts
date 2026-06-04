import type { SolutionServiceType } from "@/lib/solution-types";

export const SERVICE_TYPE_LABELS: Record<SolutionServiceType, string> = {
  "web-development": "Web Development",
  "app-development": "App Development",
  "software-development": "Software Development",
};

export const SERVICE_TYPE_DESCRIPTIONS: Record<SolutionServiceType, string> = {
  "web-development": "Websites, e-commerce, landing pages, and web platforms",
  "app-development": "Mobile apps (iOS & Android) and progressive web apps",
  "software-development": "Custom software, dashboards, APIs, and business tools",
};
