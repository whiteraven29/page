import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="stack">
      <h1>Page not found</h1>
      <p className="muted">The page may have moved. Try one of these instead:</p>
      <p><Link href="/">Home</Link> · <Link href="/posts">Posts</Link></p>
    </div>
  )
}
