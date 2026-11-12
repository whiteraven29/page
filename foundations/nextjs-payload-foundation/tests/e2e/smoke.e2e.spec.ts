import { expect, test } from '@playwright/test'

test('home page renders with one h1 and no horizontal scroll', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveCount(1)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)
})

test('health endpoint reports ok', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.ok()).toBe(true)
  expect((await res.json()).status).toBe('ok')
})

test('admin login screen loads', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible()
})
