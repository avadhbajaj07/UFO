'use client'

import React from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { useTranslation } from '@/lib/i18n/context'
import { getLocalePath } from '@/lib/i18n/config'

export interface LocalizedLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>,
    NextLinkProps {
  children?: React.ReactNode
}

export const Link = React.forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ href, ...rest }, ref) => {
    const { locale } = useTranslation()

    let resolvedHref = href
    if (typeof href === 'string') {
      // Do not alter external links, mailto, tel, or pure anchor hashes
      if (
        !href.startsWith('http://') &&
        !href.startsWith('https://') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('#')
      ) {
        resolvedHref = getLocalePath(href, locale)
      }
    } else if (typeof href === 'object' && href.pathname) {
      resolvedHref = {
        ...href,
        pathname: getLocalePath(href.pathname, locale),
      }
    }

    return <NextLink ref={ref} href={resolvedHref} {...rest} />
  }
)

Link.displayName = 'Link'
export default Link
