import Link from 'next/link'

export function Pagination({ basePath, page, totalPages, query = {} }: { basePath: string; page: number; totalPages: number; query?: Record<string, string | undefined> }) {
  if (totalPages <= 1) return null
  const href = (p: number) => {
    const params = new URLSearchParams(Object.entries({ ...query, page: String(p) }).filter(([, v]) => v) as [string, string][])
    return `${basePath}?${params.toString()}`
  }
  return (
    <nav aria-label="Pagination" className="row pagination">
      {page > 1 ? <Link href={href(page - 1)} rel="prev">← Newer</Link> : <span />}
      <span className="muted small">Page {page} of {totalPages}</span>
      {page < totalPages ? <Link href={href(page + 1)} rel="next">Older →</Link> : <span />}
    </nav>
  )
}
