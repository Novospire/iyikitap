# MVP Design Backlog

## Current confirmed technical state
- `/signin` credentials login works
- `/admin/import` is protected by session guard
- admin API routes are protected
- Prisma seed runs successfully
- Google Books import/search flow exists
- public list pages render cover images
- `/go/[itemId]` affiliate redirect exists

## Technical freeze for MVP presentation
No new technical architecture work should be started before the first design pass unless it directly blocks the MVP presentation screens.

## Non-blocking technical debt
These items are known but should NOT block the MVP design presentation:
- `<img>` lint warning cleanup
- Extra blank-line / cosmetic cleanup
- `generateStaticParams` / ISR review
- Middleware architecture review
- Role / permission system
- Detailed admin dashboard
- Improved import UX
- Test suite
- Deeper production hardening

## MVP design scope
The first design phase should focus only on the core editorial discovery flow:
1. Home page redesign
2. Category / list discovery page
3. List detail page with book cards

## Conditional / later screens
4. Book detail page — only if needed for the presentation narrative
5. Member registration — Phase 2, not immediate MVP
6. Member dashboard — Phase 2, not immediate MVP

## Design execution order
Recommended order:
1. Home page
2. Category/list page
3. List detail/book cards
4. Optional book detail
5. Registration/dashboard only after core editorial flow is convincing

## Agent working rules
- One prompt = one small ticket
- Small diff only
- Always verify with terminal and git diff
- Do not mix design work with technical debt
- Do not touch auth/admin/API unless the ticket explicitly says so
- Do not start membership/dashboard before core editorial screens are presentable
