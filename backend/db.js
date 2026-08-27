/**
 * NLAMS Database Layer (SQLite via better-sqlite3)
 * Supports Users/Officers RBAC, Field Surveys, LARRDA References, and Land Parcels.
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'nlams.db');
const db = new Database(DB_PATH);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Initialize all tables
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL, -- COLLECTOR, SURVEYOR, CALA, AGENCY
      designation TEXT NOT NULL,
      district TEXT NOT NULL,
      agency TEXT NOT NULL,
      token TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      acquiring_agency TEXT NOT NULL,
      statutory_act TEXT NOT NULL,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      total_length_km REAL DEFAULT 0.0,
      total_corridor_area_ha REAL DEFAULT 0.0,
      current_stage TEXT DEFAULT 'DRAFT_PROPOSAL',
      stage_progress_pct REAL DEFAULT 0.0,
      total_compensation_assessed_cr REAL DEFAULT 0.0,
      total_compensation_disbursed_cr REAL DEFAULT 0.0,
      physical_possession_pct REAL DEFAULT 0.0,
      alignment_coordinates TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS parcels (
      ulpin TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      local_record_no TEXT NOT NULL,
      village TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      land_type TEXT DEFAULT 'RURAL_REMOTE',
      acquired_area_sqm REAL NOT NULL,
      circle_rate_per_sqm REAL NOT NULL,
      avg_registered_sale_rate_per_sqm REAL NOT NULL,
      owner_name TEXT NOT NULL,
      owner_aadhaar_masked TEXT NOT NULL,
      bank_ifsc TEXT DEFAULT 'SBIN0001234',
      bank_account_masked TEXT DEFAULT 'XXXX-XXXX-9876',
      encumbrance_locked INTEGER DEFAULT 0,
      status TEXT DEFAULT 'PROPOSED',
      coordinates_polygon TEXT DEFAULT '[]',
      structure_valuation REAL DEFAULT 0.0,
      tree_valuation REAL DEFAULT 0.0,
      crop_valuation REAL DEFAULT 0.0,
      joint_khata_heirs TEXT DEFAULT '[]',
      non_owner_claimants TEXT DEFAULT '[]',
      field_survey_photos TEXT DEFAULT '[]',
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS objections (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      ulpin TEXT NOT NULL,
      claimant_name TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      grounds_category TEXT NOT NULL,
      objection_details TEXT NOT NULL,
      filing_date TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      hearing_date TEXT,
      cala_jurisdiction TEXT DEFAULT 'District Land Acquisition Tribunal / CALA Bench',
      reasoned_order_summary TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (ulpin) REFERENCES parcels(ulpin) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS awards (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      ulpin TEXT NOT NULL UNIQUE,
      base_market_value_per_sqm REAL NOT NULL,
      multiplication_factor REAL DEFAULT 1.0,
      adjusted_market_value REAL NOT NULL,
      assets_valuation_total REAL DEFAULT 0.0,
      base_compensation REAL NOT NULL,
      solatium_amount REAL NOT NULL,
      additional_amount_12pct REAL DEFAULT 0.0,
      gross_total_award REAL NOT NULL,
      sanction_date TEXT NOT NULL,
      dbt_status TEXT DEFAULT 'PENDING',
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (ulpin) REFERENCES parcels(ulpin) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rr_families (
      family_id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      head_of_family TEXT NOT NULL,
      category TEXT DEFAULT 'SC/ST',
      is_displaced INTEGER DEFAULT 1,
      claimant_type TEXT DEFAULT 'OWNER', -- OWNER, AGRICULTURAL_LABORER, TENANT, ARTISAN
      monetary_entitlements_settled INTEGER DEFAULT 0,
      total_rr_assistance_inr REAL DEFAULT 500000.0,
      resettlement_amenities_allocated TEXT DEFAULT '[]',
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS field_surveys (
      id TEXT PRIMARY KEY,
      ulpin TEXT NOT NULL,
      project_id TEXT NOT NULL,
      surveyor_name TEXT NOT NULL,
      surveyor_id TEXT NOT NULL,
      structure_valuation REAL DEFAULT 0.0,
      tree_valuation REAL DEFAULT 0.0,
      crop_valuation REAL DEFAULT 0.0,
      asset_details TEXT DEFAULT '{}',
      non_owner_claimants TEXT DEFAULT '[]',
      joint_khata_heirs TEXT DEFAULT '[]',
      photo_urls TEXT DEFAULT '[]',
      survey_date TEXT NOT NULL,
      sync_status TEXT DEFAULT 'SYNCED',
      FOREIGN KEY (ulpin) REFERENCES parcels(ulpin) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS larrda_references (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      ulpin TEXT NOT NULL,
      claimant_name TEXT NOT NULL,
      ground_type TEXT NOT NULL, -- VALUATION, MEASUREMENT, TITLE_DISPUTE, RR_PACKAGE
      filing_date TEXT NOT NULL,
      collector_referral_date TEXT NOT NULL,
      tribunal_bench TEXT NOT NULL,
      case_no TEXT NOT NULL,
      hearing_date TEXT,
      status TEXT DEFAULT 'UNDER_ADJUDICATION',
      high_court_appeal_status TEXT DEFAULT 'NONE',
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // Auto-migrate any newly added columns if table already existed
  const alterStatements = [
    'ALTER TABLE parcels ADD COLUMN structure_valuation REAL DEFAULT 0.0',
    'ALTER TABLE parcels ADD COLUMN tree_valuation REAL DEFAULT 0.0',
    'ALTER TABLE parcels ADD COLUMN crop_valuation REAL DEFAULT 0.0',
    "ALTER TABLE parcels ADD COLUMN joint_khata_heirs TEXT DEFAULT '[]'",
    "ALTER TABLE parcels ADD COLUMN non_owner_claimants TEXT DEFAULT '[]'",
    "ALTER TABLE parcels ADD COLUMN field_survey_photos TEXT DEFAULT '[]'",
    "ALTER TABLE rr_families ADD COLUMN claimant_type TEXT DEFAULT 'OWNER'"
  ];

  for (const sql of alterStatements) {
    try {
      db.exec(sql);
    } catch (e) {
      // Column already exists, safe to ignore
    }
  }
}

initSchema();

function formatParcel(p) {
  if (!p) return null;
  return {
    ...p,
    encumbrance_locked: Boolean(p.encumbrance_locked),
    coordinates_polygon: typeof p.coordinates_polygon === 'string' ? JSON.parse(p.coordinates_polygon || '[]') : p.coordinates_polygon,
    joint_khata_heirs: typeof p.joint_khata_heirs === 'string' ? JSON.parse(p.joint_khata_heirs || '[]') : (p.joint_khata_heirs || []),
    non_owner_claimants: typeof p.non_owner_claimants === 'string' ? JSON.parse(p.non_owner_claimants || '[]') : (p.non_owner_claimants || []),
    field_survey_photos: typeof p.field_survey_photos === 'string' ? JSON.parse(p.field_survey_photos || '[]') : (p.field_survey_photos || [])
  };
}

function formatProject(p, includeParcels = true) {
  if (!p) return null;
  const res = {
    ...p,
    alignment_coordinates: typeof p.alignment_coordinates === 'string' ? JSON.parse(p.alignment_coordinates || '[]') : p.alignment_coordinates
  };
  if (includeParcels) {
    const rawParcels = db.prepare('SELECT * FROM parcels WHERE project_id = ?').all(p.id);
    res.parcels = rawParcels.map(formatParcel);
  }
  return res;
}

function formatObjection(o) {
  if (!o) return null;
  return { ...o };
}

function formatRRFamily(f) {
  if (!f) return null;
  return {
    ...f,
    is_displaced: Boolean(f.is_displaced),
    resettlement_amenities_allocated: typeof f.resettlement_amenities_allocated === 'string' 
      ? JSON.parse(f.resettlement_amenities_allocated || '[]') 
      : f.resettlement_amenities_allocated
  };
}

function formatFieldSurvey(s) {
  if (!s) return null;
  return {
    ...s,
    asset_details: typeof s.asset_details === 'string' ? JSON.parse(s.asset_details || '{}') : s.asset_details,
    non_owner_claimants: typeof s.non_owner_claimants === 'string' ? JSON.parse(s.non_owner_claimants || '[]') : s.non_owner_claimants,
    joint_khata_heirs: typeof s.joint_khata_heirs === 'string' ? JSON.parse(s.joint_khata_heirs || '[]') : s.joint_khata_heirs,
    photo_urls: typeof s.photo_urls === 'string' ? JSON.parse(s.photo_urls || '[]') : s.photo_urls
  };
}

// DAO Helpers
const dao = {
  // Users / Auth
  getAllUsers() {
    return db.prepare('SELECT * FROM users').all();
  },

  getUserByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  getUserById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  insertUsers(users) {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO users (id, name, email, role, designation, district, agency, token)
      VALUES (@id, @name, @email, @role, @designation, @district, @agency, @token)
    `);
    const tx = db.transaction((list) => {
      for (const u of list) {
        insert.run(u);
      }
    });
    tx(users);
  },

  // Projects
  countProjects() {
    return db.prepare('SELECT COUNT(*) AS count FROM projects').get().count;
  },

  getAllProjects() {
    const rows = db.prepare('SELECT * FROM projects').all();
    return rows.map(p => formatProject(p, true));
  },

  getProjectById(id) {
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    return row ? formatProject(row, true) : null;
  },

  updateProject(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return;
    const sets = keys.map(k => `${k} = @${k}`).join(', ');
    const params = { id, ...fields };
    if (params.alignment_coordinates && typeof params.alignment_coordinates !== 'string') {
      params.alignment_coordinates = JSON.stringify(params.alignment_coordinates);
    }
    db.prepare(`UPDATE projects SET ${sets} WHERE id = @id`).run(params);
  },

  // Parcels
  getAllParcels() {
    const rows = db.prepare('SELECT * FROM parcels').all();
    return rows.map(formatParcel);
  },

  getParcelByUlpin(ulpin) {
    const row = db.prepare('SELECT * FROM parcels WHERE ulpin = ?').get(ulpin);
    return row ? formatParcel(row) : null;
  },

  getParcelsByProject(projectId) {
    const rows = db.prepare('SELECT * FROM parcels WHERE project_id = ?').all(projectId);
    return rows.map(formatParcel);
  },

  updateParcel(ulpin, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return;
    const sets = keys.map(k => `${k} = @${k}`).join(', ');
    const params = { ulpin, ...fields };
    if (params.coordinates_polygon && typeof params.coordinates_polygon !== 'string') {
      params.coordinates_polygon = JSON.stringify(params.coordinates_polygon);
    }
    if (params.joint_khata_heirs && typeof params.joint_khata_heirs !== 'string') {
      params.joint_khata_heirs = JSON.stringify(params.joint_khata_heirs);
    }
    if (params.non_owner_claimants && typeof params.non_owner_claimants !== 'string') {
      params.non_owner_claimants = JSON.stringify(params.non_owner_claimants);
    }
    if (params.field_survey_photos && typeof params.field_survey_photos !== 'string') {
      params.field_survey_photos = JSON.stringify(params.field_survey_photos);
    }
    db.prepare(`UPDATE parcels SET ${sets} WHERE ulpin = @ulpin`).run(params);
    return this.getParcelByUlpin(ulpin);
  },

  updateParcelsByProject(projectId, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return;
    const sets = keys.map(k => `${k} = @${k}`).join(', ');
    const params = { projectId, ...fields };
    db.prepare(`UPDATE parcels SET ${sets} WHERE project_id = @projectId`).run(params);
  },

  searchParcels(query) {
    const cleanQ = (query || '').trim();
    const q = `%${cleanQ}%`;
    const noHyphenQ = `%${cleanQ.replace(/[-\s]/g, '')}%`;
    const rows = db.prepare(`
      SELECT * FROM parcels 
      WHERE ulpin LIKE ? 
         OR REPLACE(ulpin, '-', '') LIKE ? 
         OR local_record_no LIKE ? 
         OR owner_name LIKE ? 
         OR village LIKE ?
    `).all(q, noHyphenQ, q, q, q);
    return rows.map(formatParcel);
  },

  // Objections
  getAllObjections() {
    const rows = db.prepare('SELECT * FROM objections').all();
    return rows.map(formatObjection);
  },

  getObjectionsByProject(projectId) {
    const rows = db.prepare('SELECT * FROM objections WHERE project_id = ?').all(projectId);
    return rows.map(formatObjection);
  },

  getObjectionById(id) {
    const row = db.prepare('SELECT * FROM objections WHERE id = ?').get(id);
    return row ? formatObjection(row) : null;
  },

  createObjection(obj) {
    const stmt = db.prepare(`
      INSERT INTO objections (
        id, project_id, ulpin, claimant_name, contact_phone, grounds_category,
        objection_details, filing_date, status, hearing_date, cala_jurisdiction, reasoned_order_summary
      ) VALUES (
        @id, @project_id, @ulpin, @claimant_name, @contact_phone, @grounds_category,
        @objection_details, @filing_date, @status, @hearing_date, @cala_jurisdiction, @reasoned_order_summary
      )
    `);
    stmt.run({
      id: obj.id,
      project_id: obj.project_id,
      ulpin: obj.ulpin,
      claimant_name: obj.claimant_name,
      contact_phone: obj.contact_phone,
      grounds_category: obj.grounds_category,
      objection_details: obj.objection_details,
      filing_date: obj.filing_date,
      status: obj.status || 'PENDING',
      hearing_date: obj.hearing_date || null,
      cala_jurisdiction: obj.cala_jurisdiction || 'District Land Acquisition Tribunal / CALA Bench',
      reasoned_order_summary: obj.reasoned_order_summary || null
    });
    return this.getObjectionById(obj.id);
  },

  updateObjection(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return;
    const sets = keys.map(k => `${k} = @${k}`).join(', ');
    db.prepare(`UPDATE objections SET ${sets} WHERE id = @id`).run({ id, ...fields });
    return this.getObjectionById(id);
  },

  // R&R Tracking
  getRRTrackingByProject(projectId) {
    const rows = db.prepare('SELECT * FROM rr_families WHERE project_id = ?').all(projectId);
    return rows.map(formatRRFamily);
  },

  getRRFamilyById(familyId) {
    const row = db.prepare('SELECT * FROM rr_families WHERE family_id = ?').get(familyId);
    return row ? formatRRFamily(row) : null;
  },

  updateRRFamily(familyId, fields) {
    const params = { familyId, ...fields };
    if (params.resettlement_amenities_allocated && typeof params.resettlement_amenities_allocated !== 'string') {
      params.resettlement_amenities_allocated = JSON.stringify(params.resettlement_amenities_allocated);
    }
    const keys = Object.keys(fields);
    const sets = keys.map(k => `${k} = @${k}`).join(', ');
    db.prepare(`UPDATE rr_families SET ${sets} WHERE family_id = @familyId`).run(params);
    return this.getRRFamilyById(familyId);
  },

  // Field Surveys (from Mobile App)
  getAllFieldSurveys() {
    const rows = db.prepare('SELECT * FROM field_surveys').all();
    return rows.map(formatFieldSurvey);
  },

  getFieldSurveysByUlpin(ulpin) {
    const rows = db.prepare('SELECT * FROM field_surveys WHERE ulpin = ?').all(ulpin);
    return rows.map(formatFieldSurvey);
  },

  saveFieldSurvey(survey) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO field_surveys (
        id, ulpin, project_id, surveyor_name, surveyor_id,
        structure_valuation, tree_valuation, crop_valuation,
        asset_details, non_owner_claimants, joint_khata_heirs,
        photo_urls, survey_date, sync_status
      ) VALUES (
        @id, @ulpin, @project_id, @surveyor_name, @surveyor_id,
        @structure_valuation, @tree_valuation, @crop_valuation,
        @asset_details, @non_owner_claimants, @joint_khata_heirs,
        @photo_urls, @survey_date, @sync_status
      )
    `);

    stmt.run({
      id: survey.id,
      ulpin: survey.ulpin,
      project_id: survey.project_id,
      surveyor_name: survey.surveyor_name || 'Shri S. K. Sharma (Field Surveyor)',
      surveyor_id: survey.surveyor_id || 'SURV-UP-042',
      structure_valuation: parseFloat(survey.structure_valuation) || 0.0,
      tree_valuation: parseFloat(survey.tree_valuation) || 0.0,
      crop_valuation: parseFloat(survey.crop_valuation) || 0.0,
      asset_details: JSON.stringify(survey.asset_details || {}),
      non_owner_claimants: JSON.stringify(survey.non_owner_claimants || []),
      joint_khata_heirs: JSON.stringify(survey.joint_khata_heirs || []),
      photo_urls: JSON.stringify(survey.photo_urls || []),
      survey_date: survey.survey_date || new Date().toISOString().split('T')[0],
      sync_status: 'SYNCED'
    });

    // Also update parent parcel with surveyed valuations and attachments
    this.updateParcel(survey.ulpin, {
      structure_valuation: parseFloat(survey.structure_valuation) || 0.0,
      tree_valuation: parseFloat(survey.tree_valuation) || 0.0,
      crop_valuation: parseFloat(survey.crop_valuation) || 0.0,
      joint_khata_heirs: survey.joint_khata_heirs || [],
      non_owner_claimants: survey.non_owner_claimants || [],
      field_survey_photos: survey.photo_urls || []
    });

    return this.getFieldSurveysByUlpin(survey.ulpin);
  },

  // LARRDA References
  getAllLARRDAReferences() {
    return db.prepare('SELECT * FROM larrda_references').all();
  },

  createLARRDAReference(ref) {
    const stmt = db.prepare(`
      INSERT INTO larrda_references (
        id, project_id, ulpin, claimant_name, ground_type,
        filing_date, collector_referral_date, tribunal_bench, case_no,
        hearing_date, status, high_court_appeal_status
      ) VALUES (
        @id, @project_id, @ulpin, @claimant_name, @ground_type,
        @filing_date, @collector_referral_date, @tribunal_bench, @case_no,
        @hearing_date, @status, @high_court_appeal_status
      )
    `);
    stmt.run({
      id: ref.id,
      project_id: ref.project_id,
      ulpin: ref.ulpin,
      claimant_name: ref.claimant_name,
      ground_type: ref.ground_type || 'VALUATION',
      filing_date: ref.filing_date || new Date().toISOString().split('T')[0],
      collector_referral_date: ref.collector_referral_date || new Date().toISOString().split('T')[0],
      tribunal_bench: ref.tribunal_bench || 'State Land Acquisition, Rehabilitation & Resettlement Authority (LARRDA Bench)',
      case_no: ref.case_no || `LARRDA/REF/2026/${ref.ulpin.slice(-4)}`,
      hearing_date: ref.hearing_date || '2026-04-15',
      status: ref.status || 'UNDER_ADJUDICATION',
      high_court_appeal_status: ref.high_court_appeal_status || 'NONE'
    });
    return db.prepare('SELECT * FROM larrda_references WHERE id = ?').get(ref.id);
  },

  // Seed Batch Inserts
  insertProjects(projects) {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO projects (
        id, title, acquiring_agency, statutory_act, state, district,
        total_length_km, total_corridor_area_ha, current_stage, stage_progress_pct,
        total_compensation_assessed_cr, total_compensation_disbursed_cr,
        physical_possession_pct, alignment_coordinates
      ) VALUES (
        @id, @title, @acquiring_agency, @statutory_act, @state, @district,
        @total_length_km, @total_corridor_area_ha, @current_stage, @stage_progress_pct,
        @total_compensation_assessed_cr, @total_compensation_disbursed_cr,
        @physical_possession_pct, @alignment_coordinates
      )
    `);
    const tx = db.transaction((list) => {
      for (const p of list) {
        insert.run({
          ...p,
          alignment_coordinates: JSON.stringify(p.alignment_coordinates || [])
        });
      }
    });
    tx(projects);
  },

  insertParcels(parcels) {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO parcels (
        ulpin, project_id, local_record_no, village, district, state,
        land_type, acquired_area_sqm, circle_rate_per_sqm, avg_registered_sale_rate_per_sqm,
        owner_name, owner_aadhaar_masked, bank_ifsc, bank_account_masked,
        encumbrance_locked, status, coordinates_polygon,
        structure_valuation, tree_valuation, crop_valuation,
        joint_khata_heirs, non_owner_claimants, field_survey_photos
      ) VALUES (
        @ulpin, @project_id, @local_record_no, @village, @district, @state,
        @land_type, @acquired_area_sqm, @circle_rate_per_sqm, @avg_registered_sale_rate_per_sqm,
        @owner_name, @owner_aadhaar_masked, @bank_ifsc, @bank_account_masked,
        @encumbrance_locked, @status, @coordinates_polygon,
        @structure_valuation, @tree_valuation, @crop_valuation,
        @joint_khata_heirs, @non_owner_claimants, @field_survey_photos
      )
    `);
    const tx = db.transaction((list) => {
      for (const pr of list) {
        insert.run({
          ...pr,
          encumbrance_locked: pr.encumbrance_locked ? 1 : 0,
          coordinates_polygon: JSON.stringify(pr.coordinates_polygon || []),
          structure_valuation: pr.structure_valuation || 0.0,
          tree_valuation: pr.tree_valuation || 0.0,
          crop_valuation: pr.crop_valuation || 0.0,
          joint_khata_heirs: JSON.stringify(pr.joint_khata_heirs || []),
          non_owner_claimants: JSON.stringify(pr.non_owner_claimants || []),
          field_survey_photos: JSON.stringify(pr.field_survey_photos || [])
        });
      }
    });
    tx(parcels);
  },

  insertObjection(obj) {
    this.createObjection(obj);
  },

  insertRRFamilies(families) {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO rr_families (
        family_id, project_id, head_of_family, category, is_displaced,
        claimant_type, monetary_entitlements_settled, total_rr_assistance_inr, resettlement_amenities_allocated
      ) VALUES (
        @family_id, @project_id, @head_of_family, @category, @is_displaced,
        @claimant_type, @monetary_entitlements_settled, @total_rr_assistance_inr, @resettlement_amenities_allocated
      )
    `);
    const tx = db.transaction((list) => {
      for (const fam of list) {
        insert.run({
          ...fam,
          is_displaced: fam.is_displaced ? 1 : 0,
          claimant_type: fam.claimant_type || 'OWNER',
          resettlement_amenities_allocated: JSON.stringify(fam.resettlement_amenities_allocated || [])
        });
      }
    });
    tx(families);
  },

  insertLARRDAReferences(refs) {
    for (const r of refs) {
      this.createLARRDAReference(r);
    }
  },

  raw: db
};

module.exports = dao;
