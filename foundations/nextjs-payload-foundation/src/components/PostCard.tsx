import Link from 'next/link'

import type { Post } from '@/payload-types'
import { formatDate, mediaUrl } from '@/lib/site'

export function PostCard({ post }: { post: Post }) {
  const cover = mediaUrl(post.cover, 'card')
  return (
    <article className="card">
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element -- Payload generates the sized file
        <img src={cover} alt="" loading="lazy" className="card-img" />
      )}
      <div className="card-body stack-sm">
        <span className="muted small">{formatDate(post.publishedAt)}</span>
        <h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
        <p className="muted small">{post.summary}</p>
      </div>
    </article>
  )
}
