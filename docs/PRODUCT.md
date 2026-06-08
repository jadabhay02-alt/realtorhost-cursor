# Realtor Host — Product Architecture

Realtor Host is a **client collaboration platform** for real estate professionals—not a generic CRM.

## Core differentiator: Home Workspace

For clients with type **buyer** or **both**, realtors and clients collaborate in a shared workspace:

- Add homes (address, price, beds, baths, sqft, listing URL)
- Favorite homes
- Rate on 1–10 scale (overall, kitchen, layout, neighborhood, schools, commute, yard)
- Shared notes (author + role, edit/delete own only)
- Compare homes side-by-side

## Module map

| Sidebar | Purpose |
|---------|---------|
| Dashboard | Metrics, upcoming tasks with client names |
| Leads | Lightweight lead capture |
| **Clients** | Primary module — buyer/seller/both |
| **Listings** | Realtor inventory (not workspace homes) |
| Transactions | Simple deal tracking |
| Tasks | Optional client link + filters |
| Commissions | Placeholder |

## Client types

- `BUYER` → Home Workspace
- `SELLER` → Seller Workspace placeholder
- `BOTH` → Home Workspace + Seller placeholder

## Auth & access

- **Realtors:** Supabase auth → organization membership → server actions scoped by `organizationId`
- **Clients:** `Client.portalUserId` links to Supabase user → `/portal` shows only their Home Workspace
- **RLS:** `supabase/migrations/001_rls_policies.sql` (defense in depth)

## Not in MVP

- AI, MLS/Zillow, billing, full Seller Workspace, commissions engine
