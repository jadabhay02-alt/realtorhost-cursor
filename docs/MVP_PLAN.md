# Realtor Host — MVP Implementation Plan

## Phase 0 — Foundation (current)

- [x] Next.js 15 + TypeScript + Tailwind + shadcn/ui
- [x] Prisma schema (full domain model)
- [x] Supabase auth (login, signup, callback, middleware)
- [x] Dashboard shell + RBAC types
- [ ] Connect Supabase project + run `prisma migrate dev`
- [ ] Stripe webhook + checkout (settings billing page)

## Phase 1 — CRM core (weeks 1–2)

| Feature | Scope |
|---------|--------|
| Leads | CRUD, list filters, assign agent, status pipeline |
| Contacts | Convert lead → contact, tags, search |
| Properties | Listing CRUD, status, basic media upload |
| Deals | Kanban by `DealStage`, drag-and-drop, deal detail |

**Exit criteria:** Agent can manage lead → deal on a property through closed stage.

## Phase 2 — Operations (weeks 3–4)

| Feature | Scope |
|---------|--------|
| Showings | Calendar view, link property + contact |
| Tasks | Due dates, priorities, link to deals |
| Email templates | CRUD + merge fields (contact name, property) |
| Documents | Supabase Storage upload per org/property |

## Phase 3 — Team & money (weeks 5–6)

| Feature | Scope |
|---------|--------|
| Team | Invite members, role assignment, seat limits |
| Commissions | Record splits per deal, status workflow |
| Analytics | Dashboard charts: pipeline value, leads by source |
| Stripe | Plans: Starter / Professional / Brokerage |

## Phase 4 — Client portal (week 7+)

- Separate `(portal)` route group for `CLIENT` role
- View assigned deals, documents, showing schedule
- Read-only property gallery

## Phase 5 — Production hardening

- Supabase RLS policies mirroring app RBAC
- E2E tests (Playwright): auth + create lead
- Observability (Sentry), rate limits on API routes
- Email transactional (Resend) for invites

## Priority order for next sprints

1. Database migrate + seed default deal stages
2. Leads list + create form
3. Deal Kanban board
4. Stripe trial checkout
5. Team invite flow
