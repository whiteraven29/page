import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { User } from '@/payload-types'

export const PASSWORD = 'Correct-Horse-42'

let instance: Payload | null = null

export async function testPayload(): Promise<Payload> {
  instance ??= await getPayload({ config })
  return instance
}

/** Create a user directly (as the system), ignoring access rules. */
export async function makeUser(payload: Payload, data: Partial<User> & { email: string }): Promise<User> {
  return payload.create({
    collection: 'users',
    data: { name: data.email.split('@')[0], password: PASSWORD, role: 'editor', ...data } as never,
  })
}

/** Local API options that act as `user` with access rules switched on. */
export const as = (user: User | null) => ({ user: user ?? undefined, overrideAccess: false }) as const
