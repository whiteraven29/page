/**
 * npm run seed: creates the first admin (from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD) and a sample post.
 * Safe to run twice: it skips anything that already exists.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD
if (email && password) {
  const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } } })
  if (!totalDocs) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Administrator', role: 'admin' } })
    payload.logger.info(`Created admin ${email}`)
  }
} else {
  payload.logger.warn('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set: no admin created. Use the /admin screen instead.')
}

const { totalDocs: posts } = await payload.count({ collection: 'posts' })
if (!posts) {
  await payload.create({
    collection: 'posts',
    data: { title: 'Hello from the foundation', summary: 'A sample post created by the seed script.', _status: 'published' },
  })
  payload.logger.info('Created a sample post')
}

process.exit(0)
