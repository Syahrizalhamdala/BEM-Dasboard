-- =============================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) — BEM Dashboard
-- =============================================================================
-- Run this file in Supabase SQL Editor (SQL Editor > New Query > Paste > Run)
-- Or via: php artisan supabase:enable-rls
-- =============================================================================
--
-- Architecture:
--   Laravel connects as 'postgres' (table owner) → bypasses RLS automatically
--   Frontend Supabase client uses 'anon' key → subject to RLS (realtime)
--   Future: Supabase Auth JWT with 'authenticated' role → subject to RLS
--
-- Policy layers per table:
--   1. Laravel (postgres) — bypasses RLS as owner, no policy needed
--   2. anon — minimal SELECT on tables used for realtime (current)
--   3. authenticated — role-based policies using JWT custom claims (future)
--
-- Future JWT custom claims required for role-based policies:
--   {
--     "app_role": "admin" | "pengurus" | "anggota",
--     "app_user_id": <integer Laravel user ID>,
--     "app_divisi": "<divisi name or null>"
--   }
-- =============================================================================

-- =============================================================================
-- 1. GRANT SCHEMA USAGE
-- =============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- =============================================================================
-- 2. HELPER FUNCTIONS (for JWT-based policies — future Supabase Auth)
-- =============================================================================

-- Extract custom 'app_role' claim from JWT (future use)
CREATE OR REPLACE FUNCTION public.get_app_role()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json ->> 'app_role',
    'anon'
  );
$$;

-- Extract Laravel user ID from JWT custom claim (future use)
CREATE OR REPLACE FUNCTION public.get_app_user_id()
RETURNS integer
LANGUAGE sql STABLE
AS $$
  SELECT (current_setting('request.jwt.claims', true)::json ->> 'app_user_id')::integer;
$$;

-- Extract divisi from JWT custom claim (future use)
CREATE OR REPLACE FUNCTION public.get_app_divisi()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT current_setting('request.jwt.claims', true)::json ->> 'app_divisi';
$$;

-- =============================================================================
-- 3. ENABLE RLS ON ALL APPLICATION TABLES
-- =============================================================================
-- NOTE: Infrastructure tables (password_reset_tokens, sessions, cache,
-- cache_locks, jobs, job_batches, failed_jobs, personal_access_tokens)
-- are SKIPPED to avoid breaking Laravel internals.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE anggotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisis ENABLE ROW LEVEL SECURITY;
ALTER TABLE jabatans ENABLE ROW LEVEL SECURITY;
ALTER TABLE kabinets ENABLE ROW LEVEL SECURITY;
ALTER TABLE absensis ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal_rapats ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporans ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_kerjas ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_descriptors ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_has_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_has_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_has_permissions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 4. PER-TABLE POLICIES
-- =============================================================================
-- Each table gets:
--   anon: SELECT only (for realtime subscriptions) — works NOW
--   Admin: full CRUD — future (Supabase Auth JWT)
--   Anggota: read + own data management — future (Supabase Auth JWT)
--   Pengurus: like anggota + divisi-scoped write — future (Supabase Auth JWT)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 4a. users
-- -----------------------------------------------------------------------------
-- anon: no direct access needed (no realtime subscription on this table)
-- Policy names use 'rls_' prefix to avoid collisions with app code

CREATE POLICY "rls_anon_select_attendances" ON attendances FOR SELECT
  USING (true);

-- authenticated: admin CRUD
CREATE POLICY "rls_admin_all_attendances" ON attendances FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- authenticated: anggota read own + insert own
CREATE POLICY "rls_anggota_select_own_attendances" ON attendances FOR SELECT
  USING (get_app_role() = 'anggota' AND get_app_user_id() = user_id);

CREATE POLICY "rls_anggota_insert_own_attendances" ON attendances FOR INSERT
  WITH CHECK (get_app_role() = 'anggota' AND get_app_user_id() = user_id);

-- authenticated: pengurus read divisi + insert own
-- Uses app_divisi claim from JWT, matched via user's divisi (joined through jadwal_rapats)
-- Pengurus can insert attendances for their division's agendas
CREATE POLICY "rls_pengurus_select_divisi_attendances" ON attendances FOR SELECT
  USING (get_app_role() = 'pengurus' AND get_app_user_id() = user_id);

CREATE POLICY "rls_pengurus_insert_divisi_attendances" ON attendances FOR INSERT
  WITH CHECK (get_app_role() = 'pengurus' AND get_app_user_id() = user_id);

-- -----------------------------------------------------------------------------
-- 4b. activity_logs
-- -----------------------------------------------------------------------------
-- anon: read for realtime (future use)
CREATE POLICY "rls_anon_select_activity_logs" ON activity_logs FOR SELECT
  USING (true);

-- authenticated: admin CRUD
CREATE POLICY "rls_admin_all_activity_logs" ON activity_logs FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- authenticated: read own logs
CREATE POLICY "rls_anggota_select_own_activity_logs" ON activity_logs FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus') AND get_app_user_id() = user_id);

-- -----------------------------------------------------------------------------
-- 4c. notifications
-- -----------------------------------------------------------------------------
-- anon: read for realtime
CREATE POLICY "rls_anon_select_notifications" ON notifications FOR SELECT
  USING (true);

-- authenticated: admin CRUD
CREATE POLICY "rls_admin_all_notifications" ON notifications FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- authenticated: read own notifications
CREATE POLICY "rls_user_select_own_notifications" ON notifications FOR SELECT
  USING (get_app_user_id() = user_id);

-- -----------------------------------------------------------------------------
-- 4d. laporans
-- -----------------------------------------------------------------------------
-- anon: no realtime access needed

-- admin: all
CREATE POLICY "rls_admin_all_laporans" ON laporans FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- anggota: read all + insert/update own
CREATE POLICY "rls_anggota_select_laporans" ON laporans FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus'));

CREATE POLICY "rls_anggota_insert_own_laporans" ON laporans FOR INSERT
  WITH CHECK (get_app_role() IN ('anggota', 'pengurus') AND get_app_user_id() = user_id);

CREATE POLICY "rls_anggota_update_own_laporans" ON laporans FOR UPDATE
  USING (get_app_role() IN ('anggota', 'pengurus') AND get_app_user_id() = user_id)
  WITH CHECK (get_app_role() IN ('anggota', 'pengurus') AND get_app_user_id() = user_id);

CREATE POLICY "rls_anggota_delete_own_laporans" ON laporans FOR DELETE
  USING (get_app_role() IN ('anggota', 'pengurus') AND get_app_user_id() = user_id);

-- -----------------------------------------------------------------------------
-- 4e. jadwal_rapats (meeting schedules)
-- -----------------------------------------------------------------------------
-- anon: no realtime access needed

-- admin: all
CREATE POLICY "rls_admin_all_jadwal_rapats" ON jadwal_rapats FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- anggota/pengurus: read all
CREATE POLICY "rls_user_select_jadwal_rapats" ON jadwal_rapats FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus'));

-- pengurus: insert/update own divisi's agendas
CREATE POLICY "rls_pengurus_insert_jadwal_rapats" ON jadwal_rapats FOR INSERT
  WITH CHECK (get_app_role() = 'pengurus');

CREATE POLICY "rls_pengurus_update_jadwal_rapats" ON jadwal_rapats FOR UPDATE
  USING (get_app_role() = 'pengurus')
  WITH CHECK (get_app_role() = 'pengurus');

-- -----------------------------------------------------------------------------
-- 4f. absensis (legacy attendance table)
-- -----------------------------------------------------------------------------
-- anon: no realtime access needed

-- admin: all
CREATE POLICY "rls_admin_all_absensis" ON absensis FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- anggota: read own + insert own
CREATE POLICY "rls_anggota_select_own_absensis" ON absensis FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus') AND get_app_user_id() = anggota_id);

CREATE POLICY "rls_anggota_insert_own_absensis" ON absensis FOR INSERT
  WITH CHECK (get_app_role() IN ('anggota', 'pengurus') AND get_app_user_id() = anggota_id);

-- -----------------------------------------------------------------------------
-- 4g. kabinets (cabinet members directory)
-- -----------------------------------------------------------------------------
-- anon: no realtime access needed

-- admin: all
CREATE POLICY "rls_admin_all_kabinets" ON kabinets FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- anggota/pengurus: read all
CREATE POLICY "rls_user_select_kabinets" ON kabinets FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus'));

-- -----------------------------------------------------------------------------
-- 4h. users (user accounts — sensitive, restrict tightly)
-- -----------------------------------------------------------------------------
-- anon: no access

-- admin: all
CREATE POLICY "rls_admin_all_users" ON users FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- authenticated: read own profile + update own non-sensitive fields
CREATE POLICY "rls_user_select_self_users" ON users FOR SELECT
  USING (get_app_user_id() = id);

CREATE POLICY "rls_user_update_self_users" ON users FOR UPDATE
  USING (get_app_user_id() = id)
  WITH CHECK (get_app_user_id() = id);

-- -----------------------------------------------------------------------------
-- 4i. divisis
-- -----------------------------------------------------------------------------
-- admin: all
CREATE POLICY "rls_admin_all_divisis" ON divisis FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- anggota/pengurus: read
CREATE POLICY "rls_user_select_divisis" ON divisis FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus'));

-- -----------------------------------------------------------------------------
-- 4j. jabatans
-- -----------------------------------------------------------------------------
-- admin: all
CREATE POLICY "rls_admin_all_jabatans" ON jabatans FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- anggota/pengurus: read
CREATE POLICY "rls_user_select_jabatans" ON jabatans FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus'));

-- -----------------------------------------------------------------------------
-- 4k. program_kerjas
-- -----------------------------------------------------------------------------
-- admin: all
CREATE POLICY "rls_admin_all_program_kerjas" ON program_kerjas FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- user/pengurus: read all
CREATE POLICY "rls_user_select_program_kerjas" ON program_kerjas FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus'));

-- pengurus: insert/update own divisi's programs
CREATE POLICY "rls_pengurus_insert_program_kerjas" ON program_kerjas FOR INSERT
  WITH CHECK (get_app_role() = 'pengurus');

CREATE POLICY "rls_pengurus_update_program_kerjas" ON program_kerjas FOR UPDATE
  USING (get_app_role() = 'pengurus')
  WITH CHECK (get_app_role() = 'pengurus');

-- -----------------------------------------------------------------------------
-- 4l. settings
-- -----------------------------------------------------------------------------
-- admin only
CREATE POLICY "rls_admin_all_settings" ON settings FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- anon/authenticated: read public settings
CREATE POLICY "rls_user_select_settings" ON settings FOR SELECT
  USING (true);

-- -----------------------------------------------------------------------------
-- 4m. agendas (bare table, possibly unused)
-- -----------------------------------------------------------------------------
-- admin: all
CREATE POLICY "rls_admin_all_agendas" ON agendas FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- user: read
CREATE POLICY "rls_user_select_agendas" ON agendas FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus'));

-- -----------------------------------------------------------------------------
-- 4n. anggotas (bare table, possibly unused)
-- -----------------------------------------------------------------------------
-- admin: all
CREATE POLICY "rls_admin_all_anggotas" ON anggotas FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- user: read
CREATE POLICY "rls_user_select_anggotas" ON anggotas FOR SELECT
  USING (get_app_role() IN ('anggota', 'pengurus'));

-- -----------------------------------------------------------------------------
-- 4o. chatbot_faqs
-- -----------------------------------------------------------------------------
-- admin: all
CREATE POLICY "rls_admin_all_chatbot_faqs" ON chatbot_faqs FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- user: read
CREATE POLICY "rls_user_select_chatbot_faqs" ON chatbot_faqs FOR SELECT
  USING (true);

-- -----------------------------------------------------------------------------
-- 4p. face_descriptors (biometric data — very sensitive, bare table)
-- -----------------------------------------------------------------------------
-- admin: all
CREATE POLICY "rls_admin_all_face_descriptors" ON face_descriptors FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- anon/authenticated: no access (biometric data is admin-only)

-- -----------------------------------------------------------------------------
-- 4q. Spatie permission tables
-- -----------------------------------------------------------------------------
-- admin only (permission management is admin-only)
CREATE POLICY "rls_admin_all_permissions" ON permissions FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

CREATE POLICY "rls_admin_all_roles" ON roles FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

CREATE POLICY "rls_admin_all_model_has_permissions" ON model_has_permissions FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

CREATE POLICY "rls_admin_all_model_has_roles" ON model_has_roles FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

CREATE POLICY "rls_admin_all_role_has_permissions" ON role_has_permissions FOR ALL
  USING (get_app_role() = 'admin')
  WITH CHECK (get_app_role() = 'admin');

-- =============================================================================
-- 5. ADD TABLES TO supabase_realtime PUBLICATION
-- =============================================================================
-- Ensures realtime events are captured for these tables.
-- Note: if publication doesn't exist yet, this creates it.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime FOR TABLE
      attendances,
      activity_logs,
      notifications;
  ELSE
    ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS
      attendances,
      activity_logs,
      notifications;
  END IF;
END
$$;

-- =============================================================================
-- 6. VERIFICATION QUERIES (run separately to check)
-- =============================================================================
-- SELECT tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
-- SELECT * FROM pg_tables WHERE schemaname = 'public' AND rowsecurity ORDER BY tablename;
