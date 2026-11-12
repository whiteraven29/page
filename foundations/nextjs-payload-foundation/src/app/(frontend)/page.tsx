import Link from 'next/link'

import { PostCard } from '@/components/PostCard'
import { listPosts } from '@/lib/queries'

export default async function HomePage() {
  const { docs } = await listPosts(1, 3)
  return (
    <div className="stack">
      <section className="stack">
        <h1>It works</h1>
        <p className="muted">
          Next.js renders the pages, Payload holds the content. Sign in at <Link href="/admin">/admin</Link> to add a
          post. The first account you create becomes the admin.
        </p>
      </section>
      <section className="stack" aria-labelledby="latest">
        <div className="row">
          <h2 id="latest">Latest posts</h2>
          <span className="spacer" />
          <Link href="/posts">View all →</Link>
        </div>
        {docs.length === 0 ? (
          <p className="muted">No posts yet. Publish one in the admin and it appears here.</p>
        ) : (
          <div className="grid">{docs.map((post) => <PostCard key={post.id} post={post} />)}</div>
        )}
      </section>
    </div>
  )
}
