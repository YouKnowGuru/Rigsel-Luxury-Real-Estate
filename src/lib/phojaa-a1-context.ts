import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import Property from "@/models/Property";
import PropertyType from "@/models/PropertyType";
import Announcement from "@/models/Announcement";
import Blog from "@/models/Blog";
import TeamMember from "@/models/TeamMember";
import SolutionProject from "@/models/SolutionProject";
import { SERVICE_TYPE_LABELS } from "@/lib/solution-labels";
import type { SolutionServiceType } from "@/lib/solution-types";
import {
  BHUTAN_REAL_ESTATE_KNOWLEDGE,
  WEBSITE_KNOWLEDGE_STATIC,
} from "@/lib/bhutan-real-estate-knowledge";
import { formatPrice } from "@/lib/utils";
import {
  detectQueryIntent,
  selectRelevantListings,
  type ListingRecord,
} from "@/lib/phojaa-a1-retrieval";

const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_BLOGS = 6;
const MAX_ANNOUNCEMENTS = 6;
const MAX_SOLUTIONS = 8;

type LiveDataCache = {
  expiresAt: number;
  settings: Record<string, string>;
  properties: ListingRecord[];
  propertyTypes: { name: string; slug: string; areaLabel: string }[];
  announcements: { title: string; summary: string; category: string }[];
  blogs: { title: string; slug: string; tags: string[] }[];
  team: { name: string; role: string; desc: string }[];
  solutions: {
    title: string;
    slug: string;
    summary: string;
    serviceType: SolutionServiceType;
  }[];
  totalActive: number;
};

let liveDataCache: LiveDataCache | null = null;

const RESPONSE_STYLE = `
## How to reply (follow strictly)
- **Length:** 2–5 short sentences for simple questions; use bullets only when listing 2+ items.
- **Structure:** Direct answer first → supporting detail → one clear next step.
- **Listings:** Max 3 properties per reply unless user asks for more. Format each as:
  **Title** — Price — District — [View listing](/properties/MONGODB_ID)
- **Legal:** Max 4 bullets + one-line disclaimer (not legal advice; confirm with NLCS/lawyer).
- **Contact:** Give phone and email from LIVE CONTACT when relevant.
- **Solutions:** For websites, apps, or software — use PHOJAA95 SOLUTIONS data; link /phojaa95-solutions and /phojaa95-solutions#request-project for new projects.
- **Honesty:** Only use data in this prompt. If unsure, say so and point to /contact, /properties, or /phojaa95-solutions.
- **No** filler phrases, apologies, or repeating the user's question.`;

const PHOJAA_A1_CORE = `You are **Phojaa A1**, AI assistant for PHOJAA95 (Bhutan) — real estate plus **Phojaa95 Solutions** (web, mobile app, and custom software development).
Help with: website navigation, live property listings, Bhutan land rules (general only), land calculator (/land-calculator), and Phojaa95 Solutions portfolio / project requests (/phojaa95-solutions).
Tone: warm, expert, concise. Optional once: Kuzuzangpo.`;

function stripHtml(text: string, maxLen: number): string {
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > maxLen ? `${plain.slice(0, maxLen)}…` : plain;
}

function siteBaseUrl(): string {
  const url =
    process.env.OPENROUTER_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://phojaarealestate.com";
  return url.replace(/\/$/, "");
}

async function loadLiveData(): Promise<LiveDataCache> {
  const now = Date.now();
  if (liveDataCache && liveDataCache.expiresAt > now) {
    return liveDataCache;
  }

  await connectDB();

  const [settingsDoc, properties, propertyTypes, announcements, blogs, team, solutions, totalActive] =
    await Promise.all([
      Settings.findOne({ key: "site_settings" }).lean(),
      Property.find({ isSold: { $ne: true } })
        .sort({ featured: -1, createdAt: -1 })
        .limit(80)
        .select(
          "title price location district bedrooms bathrooms area propertyType featured loanAvailable loanAmount description features"
        )
        .lean(),
      PropertyType.find({})
        .sort({ name: 1 })
        .select("name slug areaLabel")
        .lean(),
      Announcement.find({
        isPublished: true,
        $or: [
          { expiresAt: null },
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } },
        ],
      })
        .sort({ isPinned: -1, publishedAt: -1 })
        .limit(MAX_ANNOUNCEMENTS)
        .select("title summary category")
        .lean(),
      Blog.find({ published: true })
        .sort({ createdAt: -1 })
        .limit(MAX_BLOGS)
        .select("title slug tags")
        .lean(),
      TeamMember.find({}).sort({ order: 1 }).select("name role desc").lean(),
      SolutionProject.find({ isPublished: true })
        .sort({ isFeatured: -1, isPinned: -1, order: -1, publishedAt: -1 })
        .limit(MAX_SOLUTIONS)
        .select("title slug summary serviceType")
        .lean(),
      Property.countDocuments({ isSold: { $ne: true } }),
    ]);

  liveDataCache = {
    expiresAt: now + CACHE_TTL_MS,
    settings: ((settingsDoc as any)?.value as Record<string, string>) ?? {},
    properties: properties as unknown as ListingRecord[],
    propertyTypes: propertyTypes.map((t) => ({
      name: t.name,
      slug: t.slug,
      areaLabel: t.areaLabel || "Area",
    })),
    announcements: announcements.map((a) => ({
      title: a.title,
      summary: stripHtml(String(a.summary), 120),
      category: a.category,
    })),
    blogs: blogs.map((b) => ({
      title: b.title,
      slug: b.slug,
      tags: b.tags || [],
    })),
    team: team.map((m) => ({
      name: m.name,
      role: m.role,
      desc: stripHtml(String(m.desc || ""), 100),
    })),
    solutions: solutions.map((p) => ({
      title: p.title,
      slug: p.slug,
      summary: stripHtml(String(p.summary), 100),
      serviceType: p.serviceType as SolutionServiceType,
    })),
    totalActive,
  };

  return liveDataCache;
}

function formatCompactListing(p: ListingRecord, base: string): string {
  const id = String(p._id);
  const loan = p.loanAvailable ? " | loan" : "";
  return `${p.title} | ${formatPrice(p.price)} | ${p.propertyType} | ${p.district}, ${p.location} | ${p.bedrooms}b/${p.bathrooms}ba | area ${p.area}${loan} | ${base}/properties/${id}`;
}

function buildContextSections(
  data: LiveDataCache,
  userQuery: string
): { listings: string; extras: string; intent: string } {
  const base = siteBaseUrl();
  const intent = detectQueryIntent(userQuery);
  const s = data.settings;

  const contact = `Phone: ${s.phone || "+975 16 111 999"} | Email: ${s.email || "phojaa95realestate@gmail.com"} | Address: ${s.address || "Paro, Bhutan"} | ${base}/contact`;

  let listings = "";
  if (intent === "listings" || intent === "general") {
    const relevant = selectRelevantListings(data.properties, userQuery, 12);
    listings =
      relevant.length > 0
        ? relevant.map((p) => formatCompactListing(p, base)).join("\n")
        : "No matching listings — browse /properties or /contact.";
    if (data.totalActive > relevant.length) {
      listings += `\n(${data.totalActive} active total at ${base}/properties)`;
    }
  } else {
    listings = `(User not asking listings — omit unless they ask. ${data.totalActive} active at /properties)`;
  }

  const parts: string[] = [`LIVE CONTACT: ${contact}`];

  if (intent === "contact" || intent === "general") {
    parts.push(
      `TEAM: ${data.team.map((m) => `${m.name} (${m.role})`).join("; ") || "see /about"}`
    );
  }

  if (intent === "general") {
    parts.push(
      `TYPES: ${data.propertyTypes.map((t) => t.name).join(", ")}`,
      data.announcements.length
        ? `NEWS: ${data.announcements.map((a) => `${a.title} (${a.category})`).join("; ")}`
        : "",
      data.blogs.length
        ? `BLOG: ${data.blogs.map((b) => `${b.title} → /blog/${b.slug}`).join("; ")}`
        : ""
    );
  }

  if (intent === "solutions" || intent === "general") {
    const base = siteBaseUrl();
    if (data.solutions.length) {
      parts.push(
        `PHOJAA95 SOLUTIONS (web/app/software portfolio): ${data.solutions
          .map(
            (p) =>
              `${p.title} (${SERVICE_TYPE_LABELS[p.serviceType]}) — ${p.summary} → ${base}/phojaa95-solutions/${p.slug}`
          )
          .join("; ")}`
      );
    }
    parts.push(
      `SOLUTIONS SERVICES: Web development, App development (iOS/Android/PWA), Software development (custom tools, dashboards, APIs).`,
      `REQUEST PROJECT: ${base}/phojaa95-solutions#request-project — form for website/app/software briefs (name, email, phone, requirements).`
    );
  }

  return {
    listings,
    extras: parts.filter(Boolean).join("\n"),
    intent,
  };
}

export async function buildPhojaaA1SystemPrompt(
  userQuery: string
): Promise<string> {
  const intent = detectQueryIntent(userQuery);

  let data: LiveDataCache;
  try {
    data = await loadLiveData();
  } catch (err) {
    console.error("[Phojaa A1] Failed to load live context:", err);
    return [
      PHOJAA_A1_CORE,
      RESPONSE_STYLE,
      WEBSITE_KNOWLEDGE_STATIC,
      BHUTAN_REAL_ESTATE_KNOWLEDGE,
      "LIVE DATA: unavailable — suggest /contact and /properties.",
    ].join("\n\n");
  }

  const { listings, extras, intent: detected } = buildContextSections(data, userQuery);

  const includeFullLegal = intent === "legal" || detected === "legal";

  return [
    PHOJAA_A1_CORE,
    RESPONSE_STYLE,
    WEBSITE_KNOWLEDGE_STATIC,
    includeFullLegal ? BHUTAN_REAL_ESTATE_KNOWLEDGE : BHUTAN_LAW_SUMMARY,
    extras,
    `RELEVANT LISTINGS:\n${listings}`,
    `USER QUESTION CONTEXT: Answer specifically for: "${userQuery.slice(0, 300)}"`,
  ].join("\n\n");
}

const BHUTAN_LAW_SUMMARY = `
## Bhutan land (short reference)
- Citizens hold land under Land Act 2007; foreigners generally cannot buy freehold land.
- Verify **thram** (owner, area, use class) before paying; register via **NLCS**.
- Sale steps: verify thram → agreement → NLCS approval → taxes → registration → possession.
- 1 decimal ≈ 40.47 m²; 100 decimals = 1 acre (site calculator).
- PHOJAA95 is a facilitator — listings are informational; use a lawyer for binding advice.
`;

export function invalidatePhojaaA1ContextCache(): void {
  liveDataCache = null;
}

/** Warm DB cache so first message is faster */
export async function warmupPhojaaA1Context(): Promise<void> {
  await loadLiveData();
}
