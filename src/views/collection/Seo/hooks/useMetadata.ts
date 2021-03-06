import { useLocation } from '@reach/router'
import { useMemo } from 'react'
import { useSession } from '@faststore/sdk'
import { useSearch } from 'src/sdk/search/useSearch'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

export interface Options {
  title?: string
  titleTemplate?: string
  description?: string
  canonical?: string
}

type GatsbySEOProps = ComponentPropsWithoutRef<typeof GatsbySeo>

export const useMetadata = ({
  title,
  titleTemplate,
  description,
  canonical,
}: Options): GatsbySEOProps => {
  const { locale } = useSession()
  const { host } = useLocation()
  const {
    pageInfo: { nextPage, prevPage },
    searchParams,
  } = useSearch()

  // According to Google, one should use either noindex or canonical, never both.
  // Also, we generate relative canonicals in the HTML. These will be hydrated to absolute URLs via JS
  const canonicalTags = useMemo(() => {
    // We still don't support canonalizing other pagination rather then the first one
    if (typeof canonical === 'string' && searchParams.page === 0) {
      return {
        canonical:
          host !== undefined ? `https://${host}${canonical}` : canonical,
        noindex: false,
        nofollow: false,
      }
    }

    return { canonical: undefined, noindex: true, nofollow: false }
  }, [canonical, host, searchParams.page])

  const linkTags = useMemo(() => {
    const tags: GatsbySEOProps['linkTags'] = []

    if (prevPage !== false) {
      tags.push({ rel: 'prev', href: prevPage.link })
    }

    if (nextPage !== false) {
      tags.push({ rel: 'next', href: nextPage.link })
    }

    return tags
  }, [nextPage, prevPage])

  return {
    ...canonicalTags,
    linkTags,
    language: locale,
    title,
    titleTemplate,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
    },
  }
}
