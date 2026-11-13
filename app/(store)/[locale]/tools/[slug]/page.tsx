import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/tools/JsonLd";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { MacroCalculator } from "@/components/tools/calculators/MacroCalculator";
import { ProteinCalculator } from "@/components/tools/calculators/ProteinCalculator";
import { TdeeCalculator } from "@/components/tools/calculators/TdeeCalculator";
import { BmiCalculator } from "@/components/tools/calculators/BmiCalculator";
import { BodyFatCalculator } from "@/components/tools/calculators/BodyFatCalculator";
import { LbmCalculator } from "@/components/tools/calculators/LbmCalculator";
import { OrmCalculator } from "@/components/tools/calculators/OrmCalculator";
import { WaterCalculator } from "@/components/tools/calculators/WaterCalculator";
import { DeficitCalculator } from "@/components/tools/calculators/DeficitCalculator";
import { CreatineCalculator } from "@/components/tools/calculators/CreatineCalculator";
import { absUrl, site } from "@/lib/site";
import {
  LOCALES, TOOLS, TOOL_IDS, homePath, hubPath, isLocale, toolFromSlug, toolPath, type Locale, type ToolId,
} from "@/lib/tools/config";
import { CONTENT } from "@/lib/tools/content";
import { GOALS } from "@/lib/tools/formulas";
import { breadcrumbLd, faqLd, organizationLd, webApplicationLd, webPageLd } from "@/lib/tools/schema";
import { UI_STRINGS } from "@/lib/tools/ui-strings";
import type { ComponentType } from "react";
import type { CalcProps } from "@/components/tools/calculators/types";

type Params = { locale: string; slug: string };

const CALCULATORS: Record<ToolId, ComponentType<CalcProps>> = {
  protein: ProteinCalculator,
  tdee: TdeeCalculator,
  macro: MacroCalculator,
  bmi: BmiCalculator,
  bodyfat: BodyFatCalculator,
  lbm: LbmCalculator,
  orm: OrmCalculator,
  water: WaterCalculator,
  deficit: DeficitCalculator,
  creatine: CreatineCalculator,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => TOOL_IDS.map((id) => ({ locale, slug: TOOLS[id].slugs[locale] })));
}

function resolve(params: Params): { locale: Locale; id: ToolId } {
  if (!isLocale(params.locale)) notFound();
  const id = toolFromSlug(params.locale, params.slug);
  if (!id) notFound();
  return { locale: params.locale, id };
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const { locale, id } = resolve(params);
  const c = CONTENT[locale].tools[id];
  const path = toolPath(locale, id);
  const languages = Object.fromEntries(LOCALES.map((l) => [l, absUrl(toolPath(l, id))]));
  return {
    title: `${c.metaTitle} | ${site.name}`,
    description: c.metaDescription,
    alternates: { canonical: absUrl(path), languages: { ...languages, "x-default": absUrl(toolPath("en", id)) } },
    openGraph: {
      title: c.metaTitle, description: c.metaDescription, url: absUrl(path),
      siteName: site.name, type: "website", locale,
    },
    twitter: { card: "summary_large_image", title: c.metaTitle, description: c.metaDescription },
  };
}

export default function ToolPage({ params }: { params: Params }) {
  const { locale, id } = resolve(params);
  const c = CONTENT[locale].tools[id];
  const ui = UI_STRINGS[locale];
  const path = toolPath(locale, id);
  const Calculator = CALCULATORS[id];

  const products = Object.fromEntries(
    GOALS.map((g) => [g, { name: site.products[g].name[locale], href: site.products[g].href[locale] }]),
  ) as Record<(typeof GOALS)[number], { name: string; href: string }>;

  return (
    <>
      <JsonLd
        data={[
          organizationLd(),
          webPageLd({ name: c.h1, path, locale, updated: c.updated }),
          webApplicationLd({ name: c.h1, description: c.metaDescription, path, locale }),
          faqLd(c.faq),
          breadcrumbLd([
            { name: ui.home, path: homePath(locale) },
            { name: ui.tools, path: hubPath(locale) },
            { name: c.cardTitle, path },
          ]),
        ]}
      />
      <ToolLayout locale={locale} id={id}>
        <Calculator locale={locale} ui={ui} products={products} scoopG={site.scoopG} />
      </ToolLayout>
    </>
  );
}
