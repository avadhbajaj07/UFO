/**
 * UFO LABZ Email Template System
 * Fully localized for fr (default), en, de, it, with CHF / EUR support.
 */

import {
  EmailTemplateKey,
  ALL_EMAIL_TEMPLATE_KEYS,
  buildLocalizedEmailHtml,
} from './i18n-templates'
import { Locale, DEFAULT_LOCALE } from '@/lib/i18n/config'
import { SupportedCurrency } from '@/lib/config/pricing'

export type { EmailTemplateKey }
export { ALL_EMAIL_TEMPLATE_KEYS }

export function renderEmail(
  key: EmailTemplateKey,
  variables: Record<string, any> = {},
  locale: Locale = DEFAULT_LOCALE,
  currency: SupportedCurrency = 'CHF'
): { subject: string; html: string; title: string } {
  const result = buildLocalizedEmailHtml({
    templateKey: key,
    locale,
    currency,
    variables,
  })

  return {
    subject: result.subject,
    html: result.html,
    title: key,
  }
}
