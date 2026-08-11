import React from "react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `https://phojaa95realestate.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = "PHOJAA95 Real Estate",
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    url: url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: image ? [image] : undefined,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
      url: "https://phojaa95realestate.com",
    },
    publisher: {
      "@type": "Organization",
      name: "PHOJAA95 Real Estate",
      logo: {
        "@type": "ImageObject",
        url: "https://phojaa95realestate.com/image/logo.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface RealEstateListingProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  price?: number;
  currency?: string;
  addressLocality?: string;
  addressRegion?: string;
}

export function RealEstateListingJsonLd({
  title,
  description,
  url,
  image,
  price,
  currency = "BTN",
  addressLocality = "Bhutan",
  addressRegion = "Bhutan",
}: RealEstateListingProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    description: description,
    url: url,
    image: image ? [image] : undefined,
    offers: price
      ? {
          "@type": "Offer",
          price: price,
          priceCurrency: currency,
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString(),
        }
      : undefined,
    location: {
      "@type": "Place",
      name: `${addressLocality}, ${addressRegion}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: addressLocality,
        addressRegion: addressRegion,
        addressCountry: "BT",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
