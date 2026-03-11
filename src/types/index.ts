// Property Types
export interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: "house" | "apartment" | "land" | "commercial" | "villa";
  description: string;
  features: string[];
  images: string[];
  latitude: number;
  longitude: number;
  featured?: boolean;
  loanAvailable?: boolean;
  loanAmount?: number;
  isSold?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData {
  title: string;
  price: number;
  location: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: "house" | "apartment" | "land" | "commercial" | "villa";
  description: string;
  features: string[];
  images: string[];
  latitude: number;
  longitude: number;
  featured?: boolean;
  loanAvailable?: boolean;
  loanAmount?: number;
  isSold?: boolean;
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  isRead?: boolean;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  propertyId?: string;
}

// Admin Types
export interface Admin {
  _id: string;
  username: string;
  password: string;
  role: "admin" | "superadmin";
  createdAt: string;
}

export interface AdminLoginData {
  username: string;
  password: string;
}

// Filter Types
export interface PropertyFilters {
  location?: string;
  district?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
}

// Testimonial Types
export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  location: string;
  rating: number;
  isApproved?: boolean;
  createdAt: string;
}

// Category Types
export interface PropertyCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

// Land Calculator Types
export interface LandConversion {
  squareMeters: number;
  decimals: number;
  acres: number;
  squareFeet: number;
}

// Map Types
export interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  properties: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// JWT Types
export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalProperties: number;
  totalInquiries: number;
  recentListings: number;
  totalViews: number;
}

// Team Member Types
export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  desc: string;
  quote: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberFormData {
  name: string;
  role: string;
  image: string;
  desc: string;
  quote: string;
  order: number;
}
