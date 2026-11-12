import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPostBySlug } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { formatDate, mediaUrl } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug)
  if (!post) return {}
  return buildMetadata({ title: post.title, description: post.summary, image: post.cover, seo: post.seo, path: `/posts/${post.slug}` })
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug)
  if (!post) notFound()
  const cover = mediaUrl(post.cover, 'hero')
  return (
    <article className="stack prose">
      <p className="muted">{formatDate(post.publishedAt)}</p>
      <h1>{post.title}</h1>
      <p className="lead">{post.summary}</p>
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element -- sizes come from Payload's image sizes
        <img src={cover} alt={typeof post.cover === 'object' ? (post.cover?.alt ?? '') : ''} className="cover" />
      )}
      {post.body && <RichText data={post.body} />}
    </article>
  )
}
