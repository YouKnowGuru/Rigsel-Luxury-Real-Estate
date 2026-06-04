/** Client-safe constants — do not import mongoose models in UI code */

export const SOLUTION_SERVICE_TYPES = [
  "web-development",
  "app-development",
  "software-development",
] as const;

export type SolutionServiceType = (typeof SOLUTION_SERVICE_TYPES)[number];

export const SOLUTION_INQUIRY_STATUSES = [
  "new",
  "in-review",
  "contacted",
  "closed",
] as const;

export type SolutionInquiryStatus = (typeof SOLUTION_INQUIRY_STATUSES)[number];
