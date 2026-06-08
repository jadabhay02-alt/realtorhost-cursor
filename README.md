# Realtor Host

Client collaboration platform for real estate agents — Lovable-style UI with shared Home Workspace.

## Run locally

```powershell
cd C:\Users\jadab\Projects\realtor-host
npm install
# Set .env.local (Supabase + DATABASE_URL)
npx prisma db push
npm run dev:reset
```

Open **http://localhost:3000**

If the browser says it can't connect, the dev server isn't running. Start it with `npm run dev:reset` and keep that terminal open until you see `Ready`.

## Design system

- Cream/neutral background, deep forest green primary
- **Cormorant Garamond** headlines, **DM Sans** UI
- Thin borders, rounded-xl cards, minimal shadows

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing (Lovable layout) |
| `/login`, `/signup` | Auth |
| `/dashboard` | Overview |
| `/dashboard/clients` | Client CRM + Home Workspace |
| `/dashboard/pipeline` | Kanban board |
| `/dashboard/documents` | Upload / pre-approval / checklist placeholders |
| `/portal` | Buyer client portal |

## Project structure

```
src/
  components/
    marketing/     # Navbar, Hero, FeatureCard, BrandLogo
    clients/       # Client cards, profile tabs, badges
    homes/         # Workspace homes, ratings, notes
    dashboard/     # Sidebar, header
    ui/            # shadcn + AppCard
  lib/
    utils/format.ts   # Safe formatEnum()
    utils/labels.ts   # Badge labels with fallbacks
    actions/          # Server actions
```

See `docs/PRODUCT.md` for product architecture.
