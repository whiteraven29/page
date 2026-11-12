/** Site-wide constants read from the environment. Projects usually move most of this into a SiteSettings global. */
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Foundation'

export function siteUrl(path = ''): string {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  return `${base}${path}`
}

export function formatDate(value?: string | null): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}

/** Media URL from an upload field that may be an id (unpopulated) or a document. */
export function mediaUrl(media: unknown, size?: string): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { url?: string | null; sizes?: Record<string, { url?: string | null } | undefined> }
  return (size && m.sizes?.[size]?.url) || m.url || null
}
