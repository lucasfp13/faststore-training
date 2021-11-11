import type { Props } from '..'

type Options = Props

interface SiteLinksSearchBoxJSONLD {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  url: string
  potentialAction: {
    '@type': 'SearchAction'
    target: string
    'query-input': string
  }
}

export const useSiteLinksSearchBoxJsonLd = ({
  location: { host },
}: Options): SiteLinksSearchBoxJSONLD => {
  const url = `https://${host}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/s/{search_term_string}?map=ft`,
      'query-input': 'required name=search_term_string',
    },
  }
}
