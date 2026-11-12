import type { Metadata } from 'next'

import { Pagination } from '@/components/Pagination'
import { PostCard } from '@/components/PostCard'
import { listPosts } from '@/lib/queries'

export const metadata: Metadata = { title: 'Posts', alternates: { canonical: '/posts' } }

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1)
  const result = await listPosts(page)
  return (
    <div className="stack">
      <h1>Posts</h1>
      {result.docs.length === 0 ? (
        <p className="muted">Nothing published yet.</p>
      ) : (
        <div className="grid">{result.docs.map((post) => <PostCard key={post.id} post={post} />)}</div>
      )}
      <Pagination basePath="/posts" page={result.page ?? 1} totalPages={result.totalPages} />
    </div>
  )
}
