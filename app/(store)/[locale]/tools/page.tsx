import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "@/components/tools/tools.css";
import { JsonLd } from "@/components/tools/JsonLd";
import { absUrl, site } from "@/lib/site";
import { LOCALES, TOOL_IDS, homePath, hubPath, isLocale, toolPath, type Locale } from "@/lib/tools/config";
import { CONTENT } from "@/lib/tools/content";
import { breadcrumbLd, itemListLd, organizationLd } from "@/lib/tools/schema";
import { UI_STRINGS } from "@/lib/tools/ui-strings";
import type { CSSProperties } from "react";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function loc(p: { locale: string }): Locale {
  if (!isLocale(p.locale)) notFound();
  return p.locale;
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = loc(params);
  const h = CONTENT[locale].hub;
  const languages = Object.fromEntries(LOCALES.map((l) => [l, absUrl(hubPath(l))]));
  return {
    title: `${h.metaTitle} | ${site.name}`,
    description: h.metaDescription,
    alternates: { canonical: absUrl(hubPath(locale)), languages: { ...languages, "x-default": absUrl(hubPath("en")) } },
    openGraph: { title: h.metaTitle, description: h.metaDescription, url: absUrl(hubPath(locale)), siteName: site.name, type: "website", locale },
  };
}

export default function ToolsHub({ params }: { params: { locale: string } }) {
  const locale = loc(params);
  const c = CONTENT[locale];
  const ui = UI_STRINGS[locale];
  return (
    <>
      <JsonLd
        data={[
          organizationLd(),
          breadcrumbLd([{ name: ui.home, path: homePath(locale) }, { name: ui.tools, path: hubPath(locale) }]),
          itemListLd(TOOL_IDS.map((id) => ({ name: c.tools[id].cardTitle, path: toolPath(locale, id) }))),
        ]}
      />
      <div className="tl-root" style={{ "--tl-accent": site.accent } as CSSProperties}>
        <main className="tl-wrap">
          <nav className="tl-crumbs" aria-label="Breadcrumb">
            <Link href={homePath(locale)}>{ui.home}</Link> › {ui.tools}
          </nav>
          <h1 className="tl-h1">{c.hub.h1}</h1>
          <p className="tl-answer">{c.hub.intro}</p>
          <section className="tl-section">
            <h2>{c.hub.groupNutrition}</h2>
            <div className="tl-cards">
              {TOOL_IDS.map((id) => (
                <Link key={id} href={toolPath(locale, id)}>
                  {c.tools[id].cardTitle}
                  <small>{c.tools[id].cardBlurb}</small>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
