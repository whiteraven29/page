import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'

import { isActive } from '@/access'

/**
 * /next/preview?path=/posts/my-draft
 * Turns on draft mode for a signed-in CMS user, then opens the page. Anyone else gets 403.
 */
export async function GET(req: NextRequest): Promise<Response> {
  const path = req.nextUrl.searchParams.get('path') || ''
  // Only same-site relative paths: never redirect to another host.
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('Preview needs a relative path.', { status: 400 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  const draft = await draftMode()
  if (!isActive(user)) {
    draft.disable()
    return new Response('Sign in to the CMS to preview this page.', { status: 403 })
  }

  draft.enable()
  redirect(path)
}
