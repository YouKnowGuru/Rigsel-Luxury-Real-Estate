import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Phojaa Real Estate | Trusted Properties in Bhutan",
  description:
    "Discover land and properties across Bhutan. Phojaa Real Estate offers transparent and reliable services to connect buyers and sellers.",
  keywords: [
    "Bhutan real estate",
    "property Bhutan",
    "buy property Bhutan",
    "land for sale Bhutan",
    "Phojaa Real Estate",
    "Bhutan property listings",
  ],
  authors: [{ name: "Phojaa Real Estate" }],
  creator: "Phojaa Real Estate",
  publisher: "Phojaa Real Estate",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://phojaa95realestate.com",
    siteName: "Phojaa Real Estate",
    title: "Phojaa Real Estate | Trusted Properties in Bhutan",
    description:
      "Discover land and properties across Bhutan. Connect with genuine buyers and sellers through Phojaa Real Estate.",
    images: [
      {
        url: "https://phojaa95realestate.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Phojaa Real Estate - Properties in Bhutan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phojaa Real Estate | Properties in Bhutan",
    description:
      "Discover land and properties across Bhutan with Phojaa Real Estate.",
    images: ["https://phojaa95realestate.com/twitter-image.jpg"],
    creator: "@phojaa95realestate",
  },
  alternates: {
    canonical: "https://phojaa95realestate.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "real estate",
  classification: "Business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#8B0000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Inline script to prevent flash of unstyled theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Phojaa Real Estate",
              description:
                "Trusted real estate agency in Bhutan offering transparent property services",
              url: "https://phojaa95realestate.com",
              logo: "https://phojaa95realestate.com/logo.png",
              image: "https://phojaa95realestate.com/og-image.jpg",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Main Street",
                addressLocality: "Paro",
                addressRegion: "Paro",
                addressCountry: "BT",
              },
              telephone: "+975-16111999",
              email: "phojaa95realestate@gmail.com",
              priceRange: "Nu.",
              areaServed: {
                "@type": "Country",
                name: "Bhutan",
              },
              sameAs: [
                "https://www.facebook.com/share/1b2Fk7oC9q/ 2",
                "https://tiktok.com/@phojaa95realestate",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <SettingsProvider>
            <Navbar />
            <main className="relative">{children}</main>
            <Footer />
            <WhatsAppButton />
            <Toaster />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
