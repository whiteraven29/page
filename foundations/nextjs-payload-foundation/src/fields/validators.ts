/**
 * Validation rules that prevent the problems seen on other institutions' sites:
 * placeholder `#` links and SHOUTING titles. Plain functions so they are easy to unit test.
 */

/** A link must be a site path (`/admissions`) or a full https URL. Empty or `#` is rejected. */
export function validateHref(value: unknown, { required = true } = {}): true | string {
  const href = String(value ?? '').trim()
  if (!href) return required ? 'Add a link: a page path such as /admissions, or a full https:// address.' : true
  if (href.startsWith('#')) return 'Placeholder links (#) are not allowed. Link to a real page.'
  if (href.startsWith('/') && !href.startsWith('//')) return true
  if (/^(mailto:|tel:)/i.test(href)) return true
  try {
    const url = new URL(href)
    return url.protocol === 'https:' ? true : 'External links must start with https://'
  } catch {
    return 'Use a page path such as /admissions, or a full https:// address.'
  }
}

/** Share of letters that are upper case. Used to warn about ALL-CAPS titles. */
export function uppercaseRatio(text: string): number {
  const letters = text.replace(/[^\p{L}]/gu, '')
  if (letters.length === 0) return 0
  const upper = letters.replace(/[^\p{Lu}]/gu, '')
  return upper.length / letters.length
}

/**
 * Titles must be in sentence case. Rejects text with no lower-case letters at all ("SELECTED APPLICANTS"),
 * or where more than 60 % of letters are capitals once acronyms (all-caps words of up to 7 letters,
 * such as NACTVET or BPHIST) are set aside.
 */
export function validateSentenceCase(value: unknown): true | string {
  const text = String(value ?? '')
  const message = 'Please write the title in sentence case, not ALL CAPS.'
  const letters = text.replace(/[^\p{L}]/gu, '')
  if (letters.length < 8) return true
  if (!/\p{Ll}/u.test(text)) return message
  const withoutAcronyms = text
    .split(/\s+/)
    .filter((word) => !/^[\p{Lu}\d]{1,7}[^\p{L}]*$/u.test(word))
    .join(' ')
  return uppercaseRatio(withoutAcronyms) > 0.6 ? message : true
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
