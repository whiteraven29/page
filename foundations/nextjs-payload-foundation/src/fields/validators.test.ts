import { describe, expect, it } from 'vitest'

import { slugify, validateHref, validateSentenceCase } from './validators'

describe('validateHref', () => {
  it.each(['/admissions', 'https://www.nactvet.go.tz/', 'mailto:info@example.com', 'tel:+255700000000'])('accepts %s', (href) => {
    expect(validateHref(href)).toBe(true)
  })
  it.each(['', '#', '#contact', 'http://insecure.example.com', '//evil.example.com', 'javascript:alert(1)'])('rejects "%s"', (href) => {
    expect(validateHref(href)).not.toBe(true)
  })
  it('allows empty when optional', () => expect(validateHref('', { required: false })).toBe(true))
})

describe('validateSentenceCase', () => {
  it('rejects shouting', () => expect(validateSentenceCase('SELECTED APPLICANTS 2027')).not.toBe(true))
  it('rejects shouting even when every word is short', () => expect(validateSentenceCase('TANGAZO LA KAZI')).not.toBe(true))
  it('accepts titles that contain acronyms', () => {
    expect(validateSentenceCase('About BPHIST')).toBe(true)
    expect(validateSentenceCase('NACTVET CAS opens for NTA 4')).toBe(true)
  })
  it('accepts sentence case and short acronyms', () => {
    expect(validateSentenceCase('Selected applicants for NTA 4')).toBe(true)
    expect(validateSentenceCase('HESLB')).toBe(true)
  })
})

describe('slugify', () => {
  it('makes readable URLs', () => {
    expect(slugify('Tangazo la Nafasi za Kazi: Mkufunzi')).toBe('tangazo-la-nafasi-za-kazi-mkufunzi')
    expect(slugify('Fees & Charges 2026/27')).toBe('fees-and-charges-2026-27')
  })
})
