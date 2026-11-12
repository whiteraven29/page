import type { Endpoint } from 'payload'

/** GET /api/health: for uptime monitors and the deploy script. Public, reveals nothing. */
export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req) => {
    let database = 'ok'
    try {
      await req.payload.count({ collection: 'users', overrideAccess: true })
    } catch {
      database = 'unavailable'
    }
    const healthy = database === 'ok'
    return Response.json(
      { status: healthy ? 'ok' : 'degraded', database, version: process.env.APP_VERSION || '0.1.0' },
      { status: healthy ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
    )
  },
}
