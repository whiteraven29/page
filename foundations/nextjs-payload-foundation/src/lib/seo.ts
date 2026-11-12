import type { Metadata } from 'next'

import { mediaUrl } from './site'

type Seo = { metaTitle?: string | null; metaDescription?: string | null; ogImage?: unknown } | null | undefined

/** One metadata builder for every detail page: SEO group first, then the document's own fields. */
export function buildMetadata({ title, description, image, seo, path }: { title: string; description?: string | null; image?: unknown; seo?: Seo; path: string }): Metadata {
  const ogImage = mediaUrl(seo?.ogImage, 'og') || mediaUrl(image, 'og')
  const finalTitle = seo?.metaTitle || title
  const finalDescription = seo?.metaDescription || description || undefined
  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: path },
    openGraph: { title: finalTitle, description: finalDescription, url: path, images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined },
  }
}
