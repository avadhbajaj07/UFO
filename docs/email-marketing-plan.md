# UFO LABZ: Calculator Email Capture & Marketing System Plan

## 1. Executive Summary & Brand Alignment
- **Brand Tokens**:
  - Palette: Dark Space (`#06080F`, `#0A0E1A`), Alien Green Neon (`#00FF88`, `#1FFFB3`), Nebula Violet (`#7B2FBE`, `#C850FF`), Pure White (`#FFFFFF`), Muted Slate (`#94A3B8`).
  - Typography: System font fallbacks (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`), Font Mono for metrics.
  - Logo: `/images/ufo-logo-new.png`.
- **Target Audience**: Athletes, fitness enthusiasts, bodybuilders, crossfit athletes in Switzerland (CH) and Europe (EU).
- **Compliance**: Swiss nLPD (Federal Act on Data Protection) + GDPR compliant double opt-in, one-click unsubscribe headers, non-medical educational disclaimer.

## 2. System Architecture

```
[Storefront /tools/:slug]
       │
       ▼ (Inputs & Results)
[EmailResultsCard Component]
       │
       ▼ POST /api/tools/email-results
┌──────────────────────────────────────────────┐
│  • Zod Validation & Normalization            │
│  • Rate Limiting (IP & Email)                │
│  • Honeypot Bot Detection                    │
│  • Upsert to `calculator_leads`              │
│  • Upsert to `subscribers` (pending/trans)   │
│  • Resend Dispatch: Localized Results Email  │
│  • Double Opt-In Token Generation            │
└──────────────────────────────────────────────┘
       │
       ├─── Results Email with Interactive Result Gauge + Product Recommendations
       │
       ▼ (Marketing Opt-In Click)
[/email/confirm/[token]] ──> Status: `subscribed` ──> Activates Automated Nurture Drip

[Admin Cockpit /admin/marketing]
       │
       ├── Dashboard (Growth, Captures, Metrics)
       ├── Subscribers (Search, Filter, CSV Import/Export, Tagging)
       ├── Segments (Visual Rule Engine)
       ├── Templates (Dynamic Blocks + Live Preview)
       ├── Campaigns (Batch Dispatch via Vercel Cron)
       ├── Automations (Calculator Nurture Day 0..14)
       └── Analytics & Settings (SPF/DKIM/DMARC, Webhooks, Suppressions)
```

## 3. Database Schema Overview
- `subscribers`: Unified audience table with status lifecycle (`pending`, `subscribed`, `unsubscribed`, `bounced`, `complained`, `transactional_only`).
- `calculator_leads`: Detailed logs of inputs, results, calculator slug, UTM tags, and timestamp.
- `subscriber_tags` & `tags`: Flexible tagging system for custom segmentation.
- `segments`: Dynamic audience definitions based on filter rules.
- `email_templates`: Reusable block templates with HTML pre-render caching.
- `campaigns` & `campaign_recipients`: Scheduled and sent broadcasts with delivery stats.
- `automations`, `automation_steps`, `automation_runs`: Multi-stage drip pipelines.
- `email_events`: Granular webhook event logs (delivered, opened, clicked, bounced).
- `suppressions`: Global blacklist preventing accidental dispatch.

## 4. Execution Phases
- **Phase 1**: Calculator email-capture frontend UI + API + database integration.
- **Phase 2**: High-conversion responsive email templates (FR + EN) + template preview suite.
- **Phase 3**: Admin marketing suite at `/admin/marketing` + CSV management + Resend webhooks.
- **Phase 4**: SEO / AEO / GEO enhancements on all 10 tools + `/llms.txt` + robots.txt alignment.
