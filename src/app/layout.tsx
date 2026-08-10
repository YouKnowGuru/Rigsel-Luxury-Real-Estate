import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { RouteAwareLayout } from "@/components/layout/RouteAwareLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import "@/lib/fonts";
export const metadata: Metadata = {
  title: "PHOJAA95 Real Estate | Trusted Properties in Bhutan",
  description:
    "Discover land and properties across Bhutan. PHOJAA95 Real Estate offers transparent and reliable services to connect buyers and sellers.",
  keywords: [
    "Bhutan real estate",
    "property Bhutan",
    "buy property Bhutan",
    "land for sale Bhutan",
    "PHOJAA95 Real Estate",
    "Bhutan property listings",
  ],
  authors: [{ name: "PHOJAA95 Real Estate" }],
  creator: "PHOJAA95 Real Estate",
  publisher: "PHOJAA95 Real Estate",
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
    siteName: "PHOJAA95 Real Estate",
    title: "PHOJAA95 Real Estate | Trusted Properties in Bhutan",
    description:
      "Discover land and properties across Bhutan. Connect with genuine buyers and sellers through PHOJAA95 Real Estate.",
    images: [
      {
        url: "https://phojaa95realestate.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PHOJAA95 Real Estate — Properties in Bhutan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PHOJAA95 Real Estate | Properties in Bhutan",
    description:
      "Discover land and properties across Bhutan with PHOJAA95 Real Estate.",
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
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >

      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
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
              name: "PHOJAA95 Real Estate",
              description:
                "Trusted real estate agency in Bhutan offering transparent property services",
              url: "https://phojaa95realestate.com",
              logo: "https://phojaa95realestate.com/image/logo.png",
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
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SettingsProvider>
            <MotionProvider>
              <RouteAwareLayout>{children}</RouteAwareLayout>
              <ScrollToTop />
              <Toaster />
            </MotionProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
