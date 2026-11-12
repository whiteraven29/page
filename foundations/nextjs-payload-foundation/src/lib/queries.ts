/**
 * All public data reads in one file, so the rule "published only unless previewing" lives in
 * one place. Pages call these; they never call payload.find() themselves.
 */
import { cache } from 'react'

import { getPayloadClient, readOptions } from './payload'

export const listPosts = cache(async (page = 1, limit = 12) => {
  const payload = await getPayloadClient()
  return payload.find({ collection: 'posts', sort: '-publishedAt', page, limit, depth: 1, ...(await readOptions()) })
})

export const getPostBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    ...(await readOptions()),
  })
  return docs[0] ?? null
})
