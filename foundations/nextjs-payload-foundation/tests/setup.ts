process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'file:./.tmp/test.db'
process.env.PAYLOAD_SECRET = 'test-only-secret'
process.env.PAYLOAD_DISABLE_JOBS = 'true'
