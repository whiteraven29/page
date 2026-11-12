## What changed
<!-- One or two sentences. Link the issue: Closes #12 -->

## How I tested it
- [ ] `make check` passes
- [ ] Tried it in the browser, on a phone-width screen too

## Checklist
- [ ] Every new collection/global uses helpers from `src/access/` (no inline rules)
- [ ] Access test added in `tests/int/` for anonymous, editor and admin
- [ ] Public reads go through `src/lib/queries.ts` (`overrideAccess: false`)
- [ ] `src/payload-types.ts` regenerated; migration added if the schema changed
- [ ] Docs updated if behaviour changed
