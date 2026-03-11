# Rigsel Real Estate - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rigsel-realestate?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 3. Setup Admin User

After starting the development server, create an admin user:

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-secure-password"}'
```

Or use the provided setup script:

```bash
node scripts/setup-admin.js
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Production Deployment

### Build

```bash
npm run build
```

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_SECRET=your-production-nextauth-secret
NEXTAUTH_URL=https://rigselrealestate.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Project Structure

```
rigsel-realestate/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   ├── models/          # Mongoose models
│   ├── sections/        # Page sections
│   └── types/           # TypeScript types
├── public/              # Static assets
└── package.json
```

## Features

- ✅ Modern luxury design with glassmorphism
- ✅ Responsive mobile-first layout
- ✅ Smooth animations with Framer Motion
- ✅ Property listings with advanced filters
- ✅ Land calculator (sqm, decimal, acre, sqft)
- ✅ Interactive map with Leaflet
- ✅ Admin dashboard with JWT auth
- ✅ Contact form with MongoDB storage
- ✅ SEO optimized with meta tags
- ✅ Cloudinary image upload

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- Framer Motion
- shadcn/ui
- Leaflet.js
- JWT Authentication
