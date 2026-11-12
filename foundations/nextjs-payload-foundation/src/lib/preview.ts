/**
 * Builds the admin "Preview" link. The route at /next/preview checks that the visitor is a
 * signed-in CMS user before it turns on Next.js draft mode, so no secret is placed in the URL.
 */
export function previewPath(path: string): string {
  return `/next/preview?${new URLSearchParams({ path }).toString()}`
}
