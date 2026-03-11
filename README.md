# Rigsel Real Estate - Bhutan

A luxury, modern, high-performance real estate platform for Rigsel Real Estate in Bhutan.

## Features

- **Modern Luxury Design**: Glassmorphism cards, soft shadows, elegant spacing
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for scroll reveals, hover effects, page transitions
- **Property Listings**: Advanced filtering by location, type, price, bedrooms, bathrooms
- **Land Calculator**: Smart conversion between square meters, decimals, acres, square feet
- **Interactive Map**: Leaflet.js with property markers across Bhutan
- **Admin Dashboard**: Secure JWT authentication for property management
- **SEO Optimized**: Meta tags, Open Graph, Schema markup
- **Contact Forms**: Integrated inquiry system

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui components
- React Icons
- Swiper.js
- Leaflet.js

### Backend
- Next.js API Routes
- MongoDB with Mongoose
- JWT Authentication
- bcrypt.js for password hashing

### Tools & Services
- Cloudinary (image upload)
- Vercel (deployment)
- MongoDB Atlas (database)

## Project Structure

```
rigsel-realestate/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── admin/
│   │   │   ├── contact/
│   │   │   └── properties/
│   │   ├── admin/             # Admin pages
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── land-calculator/   # Land calculator page
│   │   ├── properties/        # Property pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # UI components (shadcn)
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── models/               # Mongoose models
│   ├── sections/             # Page sections
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (optional, for image uploads)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rigsel-realestate.git
cd rigsel-realestate
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Creating an Admin User

To create an admin user, you can use the following API endpoint or directly insert into MongoDB:

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "yourpassword"}'
```

## Pages

### Public Pages
- **Home** (`/`) - Hero, featured properties, categories, testimonials
- **Properties** (`/properties`) - Property listings with filters
- **Property Detail** (`/properties/[id]`) - Individual property page
- **About** (`/about`) - Company information, mission, team
- **Contact** (`/contact`) - Contact form and information
- **Land Calculator** (`/land-calculator`) - Land conversion tool

### Admin Pages
- **Login** (`/admin`) - Admin authentication
- **Dashboard** (`/admin/dashboard`) - Overview statistics
- **Properties** (`/admin/properties`) - Manage properties
- **Add Property** (`/admin/properties/new`) - Create new property
- **Inquiries** (`/admin/inquiries`) - View contact messages

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `POST /api/properties` - Create new property (Admin)
- `GET /api/properties/[id]` - Get single property
- `PUT /api/properties/[id]` - Update property (Admin)
- `DELETE /api/properties/[id]` - Delete property (Admin)

### Contact
- `GET /api/contact` - Get all messages (Admin)
- `POST /api/contact` - Create new message

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics (Admin)

## Design System

### Colors
- **Primary**: Deep Red (#8B0000)
- **Secondary**: Gold (#D4AF37)
- **Background**: White (#FFFFFF)
- **Text**: Dark Gray (#1a1a1a)
- **Accent**: Beige (#F5F5DC)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- Glassmorphism cards with backdrop blur
- Luxury buttons with gradient backgrounds
- Soft shadows and rounded corners
- Smooth hover transitions

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## SEO Optimization

The website includes:
- Meta titles and descriptions
- Open Graph tags
- Twitter Cards
- Schema.org structured data
- Semantic HTML
- Optimized images with Next.js Image component

## Performance

- Next.js Image optimization
- Lazy loading for images
- Code splitting
- Server-side rendering
- Static site generation where applicable

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and confidential. All rights reserved by Rigsel Real Estate.

## Contact

For support or inquiries:
- Email: info@rigselrealestate.com
- Phone: +975 XX XX XX XX
- Address: Thimphu, Bhutan
