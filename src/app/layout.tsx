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
  metadataBase: new URL("https://phojaarealestate.com"),
  title: {
    default: "PHOJAA95 Real Estate | Best Real Estate in Bhutan | Buy Property, Land & Homes",
    template: "%s | PHOJAA95 Real Estate",
  },
  description:
    "PHOJAA95 Real Estate — Bhutan's most trusted property agency. Browse verified land, houses, and commercial properties for sale across Thimphu, Paro, Punakha & all 20 dzongkhags. Expert guidance, transparent deals.",
  keywords: [
    "best real estate in Bhutan",
    "real estate in Bhutan",
    "Bhutan real estate",
    "property for sale in Bhutan",
    "buy property Bhutan",
    "land for sale Bhutan",
    "houses for sale Bhutan",
    "Bhutan property listings",
    "PHOJAA95 Real Estate",
    "Thimphu real estate",
    "Paro real estate",
    "Punakha property",
    "buy land Bhutan",
    "buy house Bhutan",
    "luxury homes Bhutan",
    "commercial property Bhutan",
    "property dealer Bhutan",
    "property agent Bhutan",
    "real estate agent Bhutan",
    "Bhutan property market",
    "affordable land Bhutan",
    "property investment Bhutan",
    "Bhutan property price",
    "land for sale Thimphu",
    "land for sale Paro",
    "property broker Bhutan",
    "Bhutan housing",
    "rent property Bhutan",
    "Wangdue property",
    "Bumthang real estate",
    "property registration Bhutan",
  ],
  authors: [{ name: "PHOJAA95 Real Estate", url: "https://phojaarealestate.com" }],
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
    url: "https://phojaarealestate.com",
    siteName: "PHOJAA95 Real Estate",
    title: "PHOJAA95 Real Estate | Best Real Estate in Bhutan",
    description:
      "Bhutan's most trusted real estate agency. Browse verified land, houses, and commercial properties for sale across all 20 dzongkhags. PHOJAA95 connects genuine buyers and sellers.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PHOJAA95 Real Estate — Best Real Estate in Bhutan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PHOJAA95 Real Estate | Best Real Estate in Bhutan",
    description:
      "Browse verified properties across Bhutan. Land, homes & commercial spaces in Thimphu, Paro, Punakha & more.",
    images: ["/opengraph-image"],
    creator: "@phojaa95realestate",
  },
  alternates: {
    canonical: "https://phojaarealestate.com",
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

        {/* Schema.org Structured Data — RealEstateAgent + Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["RealEstateAgent", "LocalBusiness"],
                  "@id": "https://phojaarealestate.com/#business",
                  name: "PHOJAA95 Real Estate",
                  alternateName: "Phojaa95 Real Estate Bhutan",
                  description:
                    "Bhutan's most trusted real estate agency. We connect genuine buyers and sellers of land, houses, and commercial properties across all 20 dzongkhags with transparent, reliable service.",
                  url: "https://phojaarealestate.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://phojaarealestate.com/image/logo.png",
                    width: 512,
                    height: 512,
                  },
                  image: "https://phojaarealestate.com/opengraph-image",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Below RRCO, Taju",
                    addressLocality: "Paro",
                    addressRegion: "Paro",
                    postalCode: "12001",
                    addressCountry: "BT",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 27.4305,
                    longitude: 89.4127,
                  },
                  telephone: "+975-16111999",
                  email: "phojaa95realestate@gmail.com",
                  priceRange: "Nu. 500K–Nu. 100M+",
                  currenciesAccepted: "BTN",
                  paymentAccepted: "Cash, Bank Transfer",
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      opens: "09:00",
                      closes: "18:00",
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: "Saturday",
                      opens: "09:00",
                      closes: "13:00",
                    },
                  ],
                  areaServed: [
                    { "@type": "Country", name: "Bhutan" },
                    { "@type": "City", name: "Thimphu" },
                    { "@type": "City", name: "Paro" },
                    { "@type": "City", name: "Punakha" },
                    { "@type": "City", name: "Wangdue Phodrang" },
                    { "@type": "City", name: "Bumthang" },
                  ],
                  sameAs: [
                    "https://www.facebook.com/share/1b2Fk7oC9q/",
                    "https://tiktok.com/@phojaa95realestate",
                  ],
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "500",
                    bestRating: "5",
                  },
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Bhutan Property Listings",
                    itemListElement: [
                      { "@type": "OfferCatalog", name: "Land for Sale" },
                      { "@type": "OfferCatalog", name: "Houses for Sale" },
                      { "@type": "OfferCatalog", name: "Commercial Properties" },
                      { "@type": "OfferCatalog", name: "Rental Properties" },
                    ],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://phojaarealestate.com/#website",
                  url: "https://phojaarealestate.com",
                  name: "PHOJAA95 Real Estate",
                  description: "Best real estate in Bhutan — buy property, land & homes",
                  publisher: { "@id": "https://phojaarealestate.com/#business" },
                  inLanguage: "en-US",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: "https://phojaarealestate.com/properties?search={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
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
