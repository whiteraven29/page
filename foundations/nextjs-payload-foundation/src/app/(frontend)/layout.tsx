import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { isPreview } from '@/lib/payload'
import { SITE_NAME, siteUrl } from '@/lib/site'

import './styles.css'

// Pages render on request, so a publish shows up on the next page view and `next build`
// never needs a database. See docs/adr/0003-render-on-request.md before adding caching.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: 'A Next.js + Payload CMS foundation.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preview = await isPreview()
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {preview && (
          <div className="preview-bar" role="status">
            Preview mode: you are seeing unpublished drafts.{' '}
            {/* A plain <a>: a full request lets the route handler clear the draft cookie. */}
            <a href="/next/exit-preview">Exit preview</a>
          </div>
        )}
        <header className="site-header">
          <div className="wrap row">
            <Link href="/" className="brand">{SITE_NAME}</Link>
            <nav aria-label="Main" className="row">
              <Link href="/posts">Posts</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main id="main" className="wrap">{children}</main>
        <footer className="site-footer">
          <div className="wrap">© {new Date().getFullYear()} {SITE_NAME}</div>
        </footer>
      </body>
    </html>
  )
}
