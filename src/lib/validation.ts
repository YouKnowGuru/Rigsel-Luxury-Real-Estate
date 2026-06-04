import { z } from "zod";

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(1).max(20),
  email: z.string().email().max(100),
  message: z.string().min(10).max(2000),
  propertyId: z.string().optional().nullable(),
});

// Property validation
export const propertySchema = z.object({
  title: z.string().min(1).max(200),
  price: z.number().min(0),
  location: z.string().min(1),
  district: z.string().min(1),
  bedrooms: z.number().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  area: z.number().min(0),
  propertyType: z.string().min(1),
  description: z.string().min(50).max(20000),
  features: z.array(z.string()).default([]),
  specifications: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  images: z.array(z.string().url()).min(1).max(20),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  featured: z.boolean().optional(),
  loanAvailable: z.boolean().optional(),
  loanAmount: z.number().min(0).optional(),
  isSold: z.boolean().optional(),
});

// Blog validation
export const blogSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).optional(),
  content: z.string().min(1),
  coverImage: z.string().url(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().optional(),
});

// Review validation
export const reviewSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  content: z.string().min(10).max(2000),
  rating: z.number().min(1).max(5).default(5),
});

// Chat validation
export const chatSchema = z.object({
  propertyId: z.string().min(1),
  guestName: z.string().min(1).max(100),
  guestEmail: z.string().email().max(100),
});

export const messageSchema = z.object({
  text: z.string().min(1).max(2000),
});

// Admin setup validation
export const adminSetupSchema = z.object({
  username: z.string().min(3).max(50),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(100)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// Admin login validation
export const adminLoginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(100),
});

// Settings validation
export const settingsSchema = z.object({
  siteName: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().max(100).optional(),
  address: z.string().max(500).optional(),
  facebook: z.string().max(500).optional(),
  instagram: z.string().max(500).optional(),
  whatsapp: z.string().max(50).optional(),
  heroImage: z.string().url().optional(),
  heroImages: z.array(z.string().url()).optional(),
});

// Land calculator validation
export const landCalculatorSchema = z.object({
  pricePerDecimal: z.number().min(0).optional(),
  decimalToSqft: z.number().min(0).optional(),
  decimalToSqm: z.number().min(0).optional(),
  currency: z.string().max(10).optional(),
});

// Team member validation
export const teamMemberSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  image: z.string().url(),
  desc: z.string().max(1000).optional(),
  quote: z.string().max(1000).optional(),
  order: z.number().min(0).optional(),
});

// Gallery validation
export const gallerySchema = z.object({
  image: z.string().url(),
  title: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
});

// Announcement validation
export const announcementSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  summary: z.string().min(1).max(500),
  category: z.string().min(1).max(50),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  isPinned: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  author: z.string().min(1).max(100).default("Admin"),
});

const architectureSceneSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().min(1).max(100),
  panoramaUrl: z.string().url(),
});

export const architectureDesignSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(220).optional(),
  summary: z.string().min(1).max(500),
  description: z.string().max(20000).optional().default(""),
  category: z.string().min(1).max(50),
  location: z.string().max(200).optional().default(""),
  district: z.string().max(100).optional().default(""),
  architect: z.string().max(100).optional().default(""),
  coverImage: z.string().url().optional().nullable(),
  panoramaUrl: z.string().url(),
  scenes: z.array(architectureSceneSchema).max(12).optional().default([]),
  isPinned: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const solutionServiceType = z.enum([
  "web-development",
  "app-development",
  "software-development",
]);

export const solutionProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(220).optional(),
  summary: z.string().min(1).max(500),
  description: z.string().max(20000).optional().default(""),
  serviceType: solutionServiceType,
  technologies: z.array(z.string().max(80)).max(20).optional().default([]),
  coverImage: z.string().url().optional().or(z.literal("")).nullable(),
  galleryImages: z.array(z.string().url()).max(12).optional().default([]),
  projectUrl: z.string().url().optional().or(z.literal("")).nullable(),
  demoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  clientName: z.string().max(100).optional().default(""),
  isPinned: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

export const solutionInquirySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(100),
  phone: z.string().min(1).max(20),
  serviceType: solutionServiceType,
  projectTitle: z.string().max(200).optional().default(""),
  budget: z.string().max(100).optional().default(""),
  timeline: z.string().max(100).optional().default(""),
  requirements: z.string().min(20).max(5000),
});

// Property type validation
export const propertyTypeSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  requiresBedBath: z.boolean().optional(),
  areaLabel: z.string().max(100).optional(),
});

// Change password validation
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(100)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// Reply validation
export const replySchema = z.object({
  replyMessage: z.string().min(1).max(5000),
});
