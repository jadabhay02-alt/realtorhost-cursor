-- Realtor Host RLS policies (run after prisma db push)
-- Enable RLS on all app tables; scope by organization membership or client portal.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Helper: realtor org ids for authenticated user
CREATE OR REPLACE FUNCTION public.user_organization_ids()
RETURNS SETOF text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.organization_id::text
  FROM memberships m
  JOIN users u ON u.id = m.user_id
  WHERE u.supabase_id = auth.uid()::text
    AND m.is_active = true
    AND m.role != 'CLIENT';
$$;

-- Clients: realtors see org clients; portal users see own client row
CREATE POLICY clients_realtor_select ON clients
  FOR SELECT USING (organization_id = ANY (ARRAY(SELECT user_organization_ids())));

CREATE POLICY clients_portal_select ON clients
  FOR SELECT USING (portal_user_id = auth.uid()::text);

-- Homes: via client access
CREATE POLICY homes_realtor_select ON homes
  FOR SELECT USING (organization_id = ANY (ARRAY(SELECT user_organization_ids())));

CREATE POLICY homes_portal_select ON homes
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE portal_user_id = auth.uid()::text)
  );

-- Notes, ratings, favorites: same org or portal client homes
CREATE POLICY home_notes_select ON home_notes
  FOR SELECT USING (
    home_id IN (
      SELECT h.id FROM homes h
      WHERE h.organization_id = ANY (ARRAY(SELECT user_organization_ids()))
         OR h.client_id IN (SELECT id FROM clients WHERE portal_user_id = auth.uid()::text)
    )
  );

CREATE POLICY home_ratings_select ON home_ratings
  FOR SELECT USING (
    home_id IN (
      SELECT h.id FROM homes h
      WHERE h.organization_id = ANY (ARRAY(SELECT user_organization_ids()))
         OR h.client_id IN (SELECT id FROM clients WHERE portal_user_id = auth.uid()::text)
    )
  );

CREATE POLICY home_favorites_select ON home_favorites
  FOR SELECT USING (
    home_id IN (
      SELECT h.id FROM homes h
      WHERE h.organization_id = ANY (ARRAY(SELECT user_organization_ids()))
         OR h.client_id IN (SELECT id FROM clients WHERE portal_user_id = auth.uid()::text)
    )
  );

-- Listings, transactions, tasks, leads: org scoped (realtors only via app server for writes)
CREATE POLICY listings_org_select ON listings
  FOR SELECT USING (organization_id = ANY (ARRAY(SELECT user_organization_ids())));

CREATE POLICY transactions_org_select ON transactions
  FOR SELECT USING (organization_id = ANY (ARRAY(SELECT user_organization_ids())));

CREATE POLICY tasks_org_select ON tasks
  FOR SELECT USING (organization_id = ANY (ARRAY(SELECT user_organization_ids())));

CREATE POLICY leads_org_select ON leads
  FOR SELECT USING (organization_id = ANY (ARRAY(SELECT user_organization_ids())));

-- Note: MVP writes go through Next.js server actions with Prisma (service role / direct DB).
-- Extend with INSERT/UPDATE policies when exposing Supabase client writes from the browser.
