import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

/** The Payload Local API: direct database access inside the Next.js server, no HTTP hop. */
export const getPayloadClient = cache(async () => getPayload({ config }))

export const isPreview = cache(async (): Promise<boolean> => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false // called outside a request (scripts, tests)
  }
})

/**
 * Options for every public read. The Local API skips access rules by default, so public pages
 * must pass `overrideAccess: false`: the collection's `read` rule then limits results to
 * published documents. In draft mode (already checked in /next/preview) drafts are shown.
 */
export async function readOptions() {
  const preview = await isPreview()
  return preview ? ({ draft: true, overrideAccess: true } as const) : ({ draft: false, overrideAccess: false } as const)
}
