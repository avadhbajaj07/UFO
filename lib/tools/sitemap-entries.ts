import type { MetadataRoute } from "next";
import { absUrl } from "../site";
import { LOCALES, TOOL_IDS, hubPath, toolPath, type Locale, type ToolId } from "./config";
import { CONTENT } from "./content";

const alt = (fn: (l: Locale) => string) => ({
  languages: { ...Object.fromEntries(LOCALES.map((l) => [l, absUrl(fn(l))])), "x-default": absUrl(fn("en")) },
});

/** Tool pages + hub for every language. Merge the result into your existing sitemap. */
export function toolsSitemapEntries(): MetadataRoute.Sitemap {
  const hub = LOCALES.map((l) => ({
    url: absUrl(hubPath(l)), lastModified: new Date(CONTENT[l].tools.protein.updated),
    changeFrequency: "monthly" as const, priority: 0.7, alternates: alt(hubPath),
  }));
  const tools = LOCALES.flatMap((l) =>
    TOOL_IDS.map((id: ToolId) => ({
      url: absUrl(toolPath(l, id)), lastModified: new Date(CONTENT[l].tools[id].updated),
      changeFrequency: "monthly" as const, priority: 0.8, alternates: alt((x) => toolPath(x, id)),
    })),
  );
  return [...hub, ...tools];
}
