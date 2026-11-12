/**
 * Proves the two-role permission matrix (docs/ARCHITECTURE.md#roles) against the real
 * access functions. Each test is one row of the matrix: anonymous, editor or admin.
 */
import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import type { User } from '@/payload-types'

import { as, makeUser, PASSWORD, testPayload } from '../helpers/payload'

let payload: Payload
let admin: User
let editor: User

beforeAll(async () => {
  payload = await testPayload()
  // The first account ever created becomes the admin, whatever role was asked for.
  admin = await makeUser(payload, { email: 'admin@example.com', role: 'editor' })
  editor = await makeUser(payload, { email: 'editor@example.com', role: 'editor' })
})

describe('users', () => {
  it('makes the first account an admin', () => {
    expect(admin.role).toBe('admin')
    expect(editor.role).toBe('editor')
  })

  it('hides every account from anonymous visitors', async () => {
    await expect(payload.find({ collection: 'users', ...as(null) })).rejects.toThrow()
  })

  it('lets an editor see only their own account', async () => {
    const { docs } = await payload.find({ collection: 'users', ...as(editor) })
    expect(docs.map((u) => u.email)).toEqual(['editor@example.com'])
  })

  it('stops an editor creating accounts', async () => {
    await expect(
      payload.create({ collection: 'users', data: { email: 'x@example.com', password: PASSWORD, name: 'X', role: 'editor' }, ...as(editor) }),
    ).rejects.toThrow()
  })

  it('stops an editor promoting themselves', async () => {
    const updated = await payload.update({ collection: 'users', id: editor.id, data: { role: 'admin', name: 'Still editor' }, ...as(editor) })
    expect(updated.name).toBe('Still editor')
    expect(updated.role).toBe('editor')
  })

  it('lets an admin change roles and disable accounts', async () => {
    const other = await makeUser(payload, { email: 'other@example.com' })
    const updated = await payload.update({ collection: 'users', id: other.id, data: { role: 'admin', active: false }, ...as(admin) })
    expect(updated.role).toBe('admin')
    expect(updated.active).toBe(false)
  })

  it('refuses to log in a disabled account', async () => {
    await makeUser(payload, { email: 'gone@example.com', active: false })
    await expect(payload.login({ collection: 'users', data: { email: 'gone@example.com', password: PASSWORD } })).rejects.toThrow(/disabled/i)
  })

  it('locks an account after five wrong passwords', async () => {
    await makeUser(payload, { email: 'locked@example.com' })
    const attempt = (password: string) => payload.login({ collection: 'users', data: { email: 'locked@example.com', password } })
    for (let i = 0; i < 5; i++) await expect(attempt('wrong-password')).rejects.toThrow()
    await expect(attempt(PASSWORD)).rejects.toThrow(/locked/i)
  })
})

describe('posts (any publishable collection follows this shape)', () => {
  it('shows anonymous visitors published posts only', async () => {
    await payload.create({ collection: 'posts', data: { title: 'Draft idea', summary: 'Not ready', _status: 'draft' }, draft: true })
    await payload.create({ collection: 'posts', data: { title: 'Live news', summary: 'Ready', _status: 'published' } })
    const publicView = await payload.find({ collection: 'posts', ...as(null) })
    expect(publicView.docs.map((p) => p.title)).toEqual(['Live news'])
    const staffView = await payload.find({ collection: 'posts', draft: true, ...as(editor) })
    expect(staffView.docs.map((p) => p.title).sort()).toEqual(['Draft idea', 'Live news'])
  })

  it('lets an editor create and publish, and sets the publish date', async () => {
    const post = await payload.create({ collection: 'posts', data: { title: 'Editor post', summary: 'By the editor', _status: 'published' }, ...as(editor) })
    expect(post.slug).toBe('editor-post')
    expect(post.publishedAt).toBeTruthy()
  })

  it('stops an editor hard-deleting, but lets an admin', async () => {
    const post = await payload.create({ collection: 'posts', data: { title: 'To remove', summary: 'x', _status: 'published' } })
    await expect(payload.delete({ collection: 'posts', id: post.id, ...as(editor) })).rejects.toThrow()
    await expect(payload.delete({ collection: 'posts', id: post.id, ...as(admin) })).resolves.toBeTruthy()
  })

  it('keeps the slug of a published post unless an admin changes it', async () => {
    const post = await payload.create({ collection: 'posts', data: { title: 'Stable link', summary: 'x', _status: 'published' } })
    const byEditor = await payload.update({ collection: 'posts', id: post.id, data: { slug: 'new-link' }, ...as(editor) })
    expect(byEditor.slug).toBe('stable-link')
    const byAdmin = await payload.update({ collection: 'posts', id: post.id, data: { slug: 'new-link' }, ...as(admin) })
    expect(byAdmin.slug).toBe('new-link')
  })

  it('rejects ALL-CAPS titles', async () => {
    const error = await payload
      .create({ collection: 'posts', data: { title: 'SELECTED APPLICANTS LIST', summary: 'x', _status: 'published' } })
      .catch((e) => e)
    expect(error.data.errors[0]).toMatchObject({ path: 'title', message: expect.stringMatching(/sentence case/i) })
  })

  it('stops a disabled editor from writing', async () => {
    const disabled = await makeUser(payload, { email: 'disabled-editor@example.com', active: false })
    await expect(
      payload.create({ collection: 'posts', data: { title: 'Sneaky', summary: 'x' }, ...as(disabled) }),
    ).rejects.toThrow()
  })
})
