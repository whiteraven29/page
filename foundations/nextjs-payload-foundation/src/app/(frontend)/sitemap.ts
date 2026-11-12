import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

/** Published documents only (overrideAccess: false applies the collections' read rules). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const posts = await payload.find({ collection: 'posts', limit: 1000, depth: 0, overrideAccess: false, select: { slug: true, updatedAt: true } })
  return [
    { url: siteUrl('/'), changeFrequency: 'weekly' },
    { url: siteUrl('/posts'), changeFrequency: 'weekly' },
    ...posts.docs.map((p) => ({ url: siteUrl(`/posts/${p.slug}`), lastModified: p.updatedAt })),
  ]
}
