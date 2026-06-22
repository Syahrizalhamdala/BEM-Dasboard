-- =============================================
-- BEM Attendance System — Supabase PostgreSQL Schema
-- =============================================

-- 1. SETTINGS (campus coordinates for GPS validation)
CREATE TABLE IF NOT EXISTS settings (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
    ('campus_latitude', '-6.8564'),
    ('campus_longitude', '107.5889'),
    ('campus_radius', '100')
ON CONFLICT (key) DO NOTHING;

-- 2. ADD QR CODE COLUMNS TO JADWAL_RAPATS (agenda)
ALTER TABLE jadwal_rapats
ADD COLUMN IF NOT EXISTS qr_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_jadwal_rapats_qr_token ON jadwal_rapats(qr_token);

-- 3. ATTENDANCES TABLE
CREATE TABLE IF NOT EXISTS attendances (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agenda_id BIGINT NOT NULL REFERENCES jadwal_rapats(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ DEFAULT NOW(),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    distance DECIMAL(8, 2),
    verification_method TEXT DEFAULT 'qr_gps',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, agenda_id)
);

CREATE INDEX IF NOT EXISTS idx_attendances_agenda_id ON attendances(agenda_id);
CREATE INDEX IF NOT EXISTS idx_attendances_user_id ON attendances(user_id);
CREATE INDEX IF NOT EXISTS idx_attendances_check_in ON attendances(check_in_time);

-- 4. ACTIVITY LOGS (already exists, ensure proper columns)
-- ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS type TEXT;
-- ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS message TEXT;
-- ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS user_id BIGINT;
-- ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS user_name TEXT;
-- ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS metadata JSONB;

-- =============================================
-- HELPER: Haversine distance function
-- =============================================
CREATE OR REPLACE FUNCTION haversine_distance(
    lat1 DECIMAL, lon1 DECIMAL,
    lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
    R DECIMAL := 6371000;
    dlat DECIMAL := RADIANS(lat2 - lat1);
    dlon DECIMAL := RADIANS(lon2 - lon1);
    a DECIMAL;
    c DECIMAL;
BEGIN
    a := SIN(dlat / 2)^2 + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dlon / 2)^2;
    c := 2 * ASIN(SQRT(a));
    RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- HELPER: Check if attendance is within campus radius
-- =============================================
CREATE OR REPLACE FUNCTION is_within_campus(
    check_lat DECIMAL, check_lon DECIMAL
) RETURNS BOOLEAN AS $$
DECLARE
    campus_lat DECIMAL;
    campus_lon DECIMAL;
    radius_m DECIMAL;
    dist DECIMAL;
BEGIN
    SELECT value::DECIMAL INTO campus_lat FROM settings WHERE key = 'campus_latitude';
    SELECT value::DECIMAL INTO campus_lon FROM settings WHERE key = 'campus_longitude';
    SELECT value::DECIMAL INTO radius_m FROM settings WHERE key = 'campus_radius';

    dist := haversine_distance(check_lat, check_lon, campus_lat, campus_lon);
    RETURN dist <= radius_m;
END;
$$ LANGUAGE plpgsql STABLE;
