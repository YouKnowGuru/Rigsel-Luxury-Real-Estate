import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency (Bhutanese Ngultrum)
export function formatPrice(price: number): string {
  return `Nu. ${price.toLocaleString("en-IN")}`;
}

// Format area with unit
export function formatArea(area: number, unit: string = "sqm"): string {
  const units: Record<string, string> = {
    sqm: "m²",
    sqft: "ft²",
    decimal: "decimal",
    acre: "acre",
  };
  return `${area.toLocaleString("en-IN")} ${units[unit] || unit}`;
}

// Format date
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Generate slug from string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Get property type label
export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    house: "House",
    apartment: "Apartment",
    land: "Land",
    commercial: "Commercial",
    villa: "Villa",
  };
  return labels[type] || type;
}

// Get district label
export function getDistrictLabel(district: string): string {
  const labels: Record<string, string> = {
    Thimphu: "Thimphu",
    Paro: "Paro",
    Punakha: "Punakha",
    Phuntsholing: "Phuntsholing",
    Gelephu: "Gelephu",
    "Wangdue Phodrang": "Wangdue Phodrang",
    Trongsa: "Trongsa",
    Bumthang: "Bumthang",
    Trashigang: "Trashigang",
    Mongar: "Mongar",
    "Samdrup Jongkhar": "Samdrup Jongkhar",
    Other: "Other",
  };
  return labels[district] || district;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

// Validate phone number (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

// Scroll to element smoothly
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Generate meta title
export function generateMetaTitle(title: string): string {
  return `${title} | Phojaa Real Estate - Bhutan`;
}

// Generate meta description
export function generateMetaDescription(description: string): string {
  const maxLength = 160;
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + "...";
}

// Land conversion utilities
export const landConversions = {
  // Square meters to decimals (1 decimal = 40.47 sqm)
  sqmToDecimal: (sqm: number): number => sqm / 40.47,
  // Decimals to acres (1 acre = 100 decimals)
  decimalToAcre: (decimal: number): number => decimal / 100,
  // Acres to decimals
  acreToDecimal: (acre: number): number => acre * 100,
  // Decimals to square meters
  decimalToSqm: (decimal: number): number => decimal * 40.47,
  // Square meters to square feet (1 sqm = 10.76 sqft)
  sqmToSqft: (sqm: number): number => sqm * 10.7639,
  // Square feet to square meters
  sqftToSqm: (sqft: number): number => sqft / 10.7639,
};

// Calculate land price
export function calculateLandPrice(decimals: number, pricePerDecimal: number): number {
  return decimals * pricePerDecimal;
}

// Sleep/delay utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Check if element is in viewport
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Random ID generator
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}
