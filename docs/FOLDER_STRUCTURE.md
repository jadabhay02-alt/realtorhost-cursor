# Realtor Host — Folder Structure

```
realtor-host/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FOLDER_STRUCTURE.md
│   └── MVP_PLAN.md
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Public auth routes
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/            # Authenticated app shell
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── contacts/
│   │   │   ├── properties/
│   │   │   ├── deals/
│   │   │   ├── showings/
│   │   │   ├── tasks/
│   │   │   ├── templates/
│   │   │   ├── commissions/
│   │   │   ├── team/
│   │   │   ├── documents/
│   │   │   ├── analytics/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   ├── (marketing)/            # Landing, pricing
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/callback/
│   │   │   └── webhooks/stripe/
│   │   ├── auth/
│   │   │   └── signout/route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/              # Sidebar, header, stat cards
│   │   ├── auth/                   # Login/signup forms
│   │   └── ui/                     # shadcn primitives
│   ├── hooks/
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── session.ts
│   │   │   ├── permissions.ts
│   │   │   └── onboarding.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── stripe/
│   │   │   └── config.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── supabase/
│   └── migrations/                 # RLS policies (Phase 2)
├── .env.example
├── components.json
├── prisma.config.ts
└── package.json
```
