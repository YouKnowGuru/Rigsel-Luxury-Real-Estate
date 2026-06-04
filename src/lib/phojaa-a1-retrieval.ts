const DISTRICTS = [
  "bumthang",
  "chhukha",
  "dagana",
  "gasa",
  "haa",
  "lhuentse",
  "mongar",
  "paro",
  "pema gatshel",
  "punakha",
  "samdrup jongkhar",
  "samtse",
  "sarpang",
  "thimphu",
  "trashigang",
  "trashi yangtse",
  "trongsa",
  "tsirang",
  "wangdue phodrang",
  "zhemgang",
];

const TYPE_KEYWORDS: Record<string, string[]> = {
  land: ["land", "plot", "decimal", "acre"],
  house: ["house", "home", "villa", "bungalow"],
  apartment: ["apartment", "flat", "condo"],
  commercial: ["commercial", "shop", "office", "business"],
  hotel: ["hotel", "hospitality", "resort", "homestay"],
};

export type ListingRecord = {
  _id: unknown;
  title: string;
  price: number;
  location: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  featured?: boolean;
  loanAvailable?: boolean;
  loanAmount?: number;
  description?: string;
  features?: string[];
};

export function detectQueryIntent(
  query: string
): "listings" | "legal" | "contact" | "solutions" | "general" {
  const q = query.toLowerCase();
  if (
    /website|web app|web development|mobile app|android|ios|software|custom app|build an app|build a site|e-commerce|ecommerce|dashboard|api development|phojaa95 solutions|digital product|portfolio project|request a project|need a developer/.test(
      q
    )
  ) {
    return "solutions";
  }
  if (
    /list|property|properties|house|land|apartment|commercial|hotel|price|budget|bedroom|bhk|buy|rent|sale|featured|available|listing/.test(
      q
    )
  ) {
    return "listings";
  }
  if (
    /thram|nlcs|land act|law|legal|foreign|citizen|transfer|tax|registration|lease|approval|regulation/.test(
      q
    )
  ) {
    return "legal";
  }
  if (
    /contact|phone|email|whatsapp|call|office|address|team|reach|speak|agent/.test(q)
  ) {
    return "contact";
  }
  return "general";
}

export function selectRelevantListings(
  properties: ListingRecord[],
  query: string,
  limit = 12
): ListingRecord[] {
  if (properties.length === 0) return [];

  const q = query.toLowerCase().trim();
  const tokens = q.split(/\W+/).filter((t) => t.length > 2);

  const priceMatch = q.match(/(?:under|below|max|budget)\s*(?:nu\.?|nu)?\s*([\d,]+)/i);
  const maxBudget = priceMatch
    ? Number(priceMatch[1].replace(/,/g, ""))
    : null;

  const scored = properties.map((p) => {
    let score = p.featured ? 1 : 0;
    const hay = [
      p.title,
      p.district,
      p.location,
      p.propertyType,
      p.description || "",
      ...(p.features || []),
    ]
      .join(" ")
      .toLowerCase();

    for (const token of tokens) {
      if (hay.includes(token)) score += 3;
    }

    for (const district of DISTRICTS) {
      if (q.includes(district) && p.district.toLowerCase().includes(district)) {
        score += 8;
      }
    }

    for (const [, keywords] of Object.entries(TYPE_KEYWORDS)) {
      if (keywords.some((kw) => q.includes(kw))) {
        if (
          keywords.some((kw) => hay.includes(kw) || p.propertyType.toLowerCase().includes(kw))
        ) {
          score += 6;
        }
      }
    }

    if (maxBudget != null && !Number.isNaN(maxBudget) && p.price <= maxBudget) {
      score += 4;
    }
    if (maxBudget != null && p.price > maxBudget) {
      score -= 2;
    }

    if (/cheapest|affordable|low price|budget/.test(q)) {
      score += p.price < 5_000_000 ? 2 : 0;
    }
    if (/luxury|premium|expensive|high end/.test(q)) {
      score += p.price > 20_000_000 ? 2 : 0;
    }

    return { p, score };
  });

  const ranked = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || (b.p.featured ? 1 : 0) - (a.p.featured ? 1 : 0))
    .map((s) => s.p);

  if (ranked.length >= 3) return ranked.slice(0, limit);

  const featured = properties.filter((p) => p.featured).slice(0, 4);
  const rest = properties.filter((p) => !featured.includes(p)).slice(0, limit);
  const merged = [...featured, ...rest];
  const seen = new Set<string>();
  return merged.filter((p) => {
    const id = String(p._id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  }).slice(0, limit);
}
