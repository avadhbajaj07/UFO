import { site, absUrl } from "../site";
import type { Locale } from "./config";

const CTX = "https://schema.org";

export const organizationLd = () => ({
  "@context": CTX,
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: absUrl(site.logo),
  ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
});

export const webApplicationLd = (o: { name: string; description: string; path: string; locale: Locale }) => ({
  "@context": CTX,
  "@type": "WebApplication",
  name: o.name,
  description: o.description,
  url: absUrl(o.path),
  inLanguage: o.locale,
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
  publisher: { "@type": "Organization", name: site.name, url: site.url },
});

export const webPageLd = (o: { name: string; path: string; locale: Locale; updated: string }) => ({
  "@context": CTX,
  "@type": "WebPage",
  name: o.name,
  url: absUrl(o.path),
  inLanguage: o.locale,
  dateModified: o.updated,
  lastReviewed: o.updated,
  reviewedBy: { "@type": "Person", name: site.reviewer.name, jobTitle: site.reviewer.role },
});

export const faqLd = (faq: { q: string; a: string }[]) => ({
  "@context": CTX,
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": CTX,
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absUrl(it.path),
  })),
});

export const itemListLd = (items: { name: string; path: string }[]) => ({
  "@context": CTX,
  "@type": "ItemList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absUrl(it.path) })),
});
