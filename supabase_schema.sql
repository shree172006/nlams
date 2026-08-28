-- ==========================================================
-- NLAMS - National Land Acquisition & Management System
-- Supabase PostgreSQL Relational Database Schema
-- Department of Land Resources (DoLR) • Ministry of Rural Development
-- ==========================================================

-- 1. Infrastructure Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    acquiring_agency TEXT NOT NULL,
    statutory_act TEXT NOT NULL,
    total_corridor_area_ha NUMERIC NOT NULL,
    total_compensation_assessed_cr NUMERIC NOT NULL,
    total_compensation_disbursed_cr NUMERIC NOT NULL,
    current_stage TEXT NOT NULL,
    stage_progress_pct NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cadastral Land Parcels Table (ULPIN / Bhu-Aadhaar)
CREATE TABLE IF NOT EXISTS parcels (
    ulpin TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    local_record_no TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    village TEXT NOT NULL,
    tehsil TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
    acquired_area_sqm NUMERIC NOT NULL,
    circle_rate_per_sqm NUMERIC NOT NULL,
    market_value_total NUMERIC NOT NULL,
    structure_valuation NUMERIC DEFAULT 0,
    tree_valuation NUMERIC DEFAULT 0,
    crop_valuation NUMERIC DEFAULT 0,
    total_statutory_award NUMERIC NOT NULL,
    encumbrance_locked BOOLEAN DEFAULT FALSE,
    disbursement_status TEXT DEFAULT 'PENDING',
    status TEXT DEFAULT 'NOTIFIED',
    field_survey_photos JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Section 15 Objections & Reasoned Orders Table
CREATE TABLE IF NOT EXISTS objections (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    ulpin TEXT REFERENCES parcels(ulpin) ON DELETE CASCADE,
    claimant_name TEXT NOT NULL,
    grounds_category TEXT NOT NULL,
    objection_details TEXT,
    hearing_date DATE,
    hearing_bench TEXT,
    status TEXT DEFAULT 'PENDING',
    reasoned_order_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Second Schedule R&R Displaced Families Table
CREATE TABLE IF NOT EXISTS rr_families (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    ulpin TEXT REFERENCES parcels(ulpin) ON DELETE CASCADE,
    family_head_name TEXT NOT NULL,
    is_displaced BOOLEAN DEFAULT TRUE,
    resettlement_colony_house_allotted BOOLEAN DEFAULT FALSE,
    subsistence_grant_paid BOOLEAN DEFAULT FALSE,
    cattle_shed_grant_paid BOOLEAN DEFAULT FALSE,
    resettlement_allowance_paid BOOLEAN DEFAULT FALSE,
    total_rr_package_amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Section 64 LARRDA Tribunal Judicial References Table
CREATE TABLE IF NOT EXISTS larrda_references (
    id TEXT PRIMARY KEY,
    case_no TEXT UNIQUE NOT NULL,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    ulpin TEXT REFERENCES parcels(ulpin) ON DELETE CASCADE,
    claimant_name TEXT NOT NULL,
    ground_type TEXT NOT NULL,
    status TEXT DEFAULT 'TRIBUNAL_HEARING',
    collector_referral_date DATE NOT NULL,
    tribunal_bench TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Mobile & On-Ground Field Surveys Table
CREATE TABLE IF NOT EXISTS field_surveys (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ulpin TEXT REFERENCES parcels(ulpin) ON DELETE CASCADE,
    project_id TEXT,
    surveyor_name TEXT NOT NULL,
    structure_valuation NUMERIC DEFAULT 0,
    tree_valuation NUMERIC DEFAULT 0,
    crop_valuation NUMERIC DEFAULT 0,
    borewell_count INT DEFAULT 0,
    photo_urls JSONB DEFAULT '[]',
    geo_lat NUMERIC,
    geo_lng NUMERIC,
    sync_status TEXT DEFAULT 'SYNCED',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Officer Users & RBAC Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    designation TEXT NOT NULL,
    district TEXT,
    agency TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Configuration with Full Read/Write Support
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE objections ENABLE ROW LEVEL SECURITY;
ALTER TABLE rr_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE larrda_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access projects" ON projects;
DROP POLICY IF EXISTS "Public Read Access parcels" ON parcels;
DROP POLICY IF EXISTS "Public Read Access objections" ON objections;
DROP POLICY IF EXISTS "Public Read Access rr_families" ON rr_families;
DROP POLICY IF EXISTS "Public Read Access larrda_references" ON larrda_references;
DROP POLICY IF EXISTS "Public Read Access field_surveys" ON field_surveys;
DROP POLICY IF EXISTS "Public Read Access users" ON users;

DROP POLICY IF EXISTS "Full Access projects" ON projects;
DROP POLICY IF EXISTS "Full Access parcels" ON parcels;
DROP POLICY IF EXISTS "Full Access objections" ON objections;
DROP POLICY IF EXISTS "Full Access rr_families" ON rr_families;
DROP POLICY IF EXISTS "Full Access larrda_references" ON larrda_references;
DROP POLICY IF EXISTS "Full Access field_surveys" ON field_surveys;
DROP POLICY IF EXISTS "Full Access users" ON users;

CREATE POLICY "Full Access projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access parcels" ON parcels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access objections" ON objections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access rr_families" ON rr_families FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access larrda_references" ON larrda_references FOR ALL USING (true);
CREATE POLICY "Full Access field_surveys" ON field_surveys FOR ALL USING (true);
CREATE POLICY "Full Access users" ON users FOR ALL USING (true);
