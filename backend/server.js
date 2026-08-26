/**
 * NLAMS - National Land Acquisition & Management System
 * Production REST API Server (Node.js / Express)
 * Department of Land Resources (DoLR) • Ministry of Rural Development
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./db');
const { calculateStatutoryValuation, advanceProjectState } = require('./statutory_engine');
const { predictProjectDelay } = require('./ml_delay_predictor');
const { seedDatabase } = require('./seed_data');

// Initialize database schema and dummy seed data
seedDatabase();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for Vite frontend, Flutter mobile app, and external consumers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to extract param from query or body
function getParam(req, name, defaultValue = undefined) {
  if (req.query && req.query[name] !== undefined) return req.query[name];
  if (req.body && req.body[name] !== undefined) return req.body[name];
  return defaultValue;
}

// ================= ROOT / METADATA =================
app.get('/', (req, res) => {
  res.json({
    system: "National Land Acquisition & Management System (NLAMS)",
    department: "Department of Land Resources (DoLR), Ministry of Rural Development",
    statutory_framework: "RFCTLARR Act, 2013 & Sectoral Acts",
    runtime: "Node.js (Express)",
    mobile_app_endpoint: "/api/field-surveys/sync",
    auth_endpoints: ["/api/auth/login", "/api/auth/me", "/api/auth/officers"]
  });
});

// ================= AUTHENTICATION & RBAC =================
app.post('/api/auth/login', (req, res) => {
  const email = (getParam(req, 'email') || '').trim().toLowerCase();
  const role = (getParam(req, 'role') || '').trim().toUpperCase();

  let user = null;
  if (email) {
    user = db.getUserByEmail(email);
  }
  if (!user && role) {
    user = db.getAllUsers().find(u => u.role === role);
  }

  if (!user) {
    // Default fallback to Collector if demo login
    user = db.getAllUsers()[0];
  }

  res.json({
    status: "success",
    message: `Logged in as ${user.designation}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      district: user.district,
      agency: user.agency,
      token: user.token || `AUTH-TOKEN-${user.id}`
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = db.getAllUsers().find(u => u.token === token || `AUTH-TOKEN-${u.id}` === token);
    if (user) {
      return res.json({ status: "authenticated", user });
    }
  }

  // Default to public citizen access
  res.json({
    status: "public_citizen",
    user: {
      role: "CITIZEN",
      name: "Public Citizen / Landowner",
      access_level: "OPEN_ACCESS_READ_ONLY"
    }
  });
});

app.get('/api/auth/officers', (req, res) => {
  res.json(db.getAllUsers());
});

// ================= 1. NATIONAL DASHBOARD METRICS =================
app.get('/api/national-metrics', (req, res) => {
  const projects = db.getAllProjects();
  const parcels = db.getAllParcels();
  const objections = db.getAllObjections().filter(o => o.status === 'PENDING' || o.status === 'HEARING_SCHEDULED');

  const totalArea = projects.reduce((acc, p) => acc + (p.total_corridor_area_ha || 0), 0);
  const totalAssessed = projects.reduce((acc, p) => acc + (p.total_compensation_assessed_cr || 0), 0);
  const totalDisbursed = projects.reduce((acc, p) => acc + (p.total_compensation_disbursed_cr || 0), 0);
  const lockedParcels = parcels.filter(pr => pr.encumbrance_locked).length;
  const avgPossession = projects.length > 0 
    ? projects.reduce((acc, p) => acc + (p.physical_possession_pct || 0), 0) / projects.length 
    : 0;
  const dbtRatio = totalAssessed > 0 ? +((totalDisbursed / Math.max(0.1, totalAssessed)) * 100).toFixed(1) : 0;

  res.json({
    total_active_projects: projects.length,
    total_notified_area_ha: +(totalArea).toFixed(1),
    total_cadastral_parcels_tracked: parcels.length,
    total_compensation_assessed_cr: +(totalAssessed).toFixed(1),
    total_compensation_disbursed_cr: +(totalDisbursed).toFixed(1),
    dbt_disbursal_ratio_pct: dbtRatio,
    ulpin_encumbrance_locks_active: lockedParcels,
    average_physical_possession_pct: +(avgPossession).toFixed(1),
    active_disputes_and_references: objections.length
  });
});

// ================= 2. PROJECT CORRIDORS =================
app.get('/api/projects', (req, res) => {
  const projects = db.getAllProjects();
  res.json(projects);
});

app.get('/api/projects/:project_id', (req, res) => {
  const prj = db.getProjectById(req.params.project_id);
  if (!prj) {
    return res.status(404).json({ detail: "Project corridor not found" });
  }
  res.json(prj);
});

app.post('/api/projects/:project_id/advance-stage', (req, res) => {
  const prj = db.getProjectById(req.params.project_id);
  if (!prj) {
    return res.status(404).json({ detail: "Project not found" });
  }

  const result = advanceProjectState(prj, db);
  res.json({
    status: result.advanced ? "success" : "noop",
    detail: result.message || `Advanced to ${result.new_stage}`,
    project: result.project || prj
  });
});

// ================= 3. STATUTORY VALUATION CALCULATOR =================
const handleValuation = (req, res) => {
  const params = {
    owner_name: getParam(req, 'owner_name', 'Shri Ramcharan Yadav'),
    acquired_area_sqm: parseFloat(getParam(req, 'acquired_area_sqm', 3500.0)),
    land_type: getParam(req, 'land_type', 'RURAL_REMOTE'),
    circle_rate_per_sqm: parseFloat(getParam(req, 'circle_rate_per_sqm', 1850.0)),
    avg_registered_sale_rate_per_sqm: parseFloat(getParam(req, 'avg_registered_sale_rate_per_sqm', 2400.0)),
    ppp_consented_rate_per_sqm: parseFloat(getParam(req, 'ppp_consented_rate_per_sqm', 0.0)),
    structure_valuation: parseFloat(getParam(req, 'structure_valuation', 350000.0)),
    tree_valuation: parseFloat(getParam(req, 'tree_valuation', 45000.0)),
    crop_valuation: parseFloat(getParam(req, 'crop_valuation', 25000.0)),
    notification_date: getParam(req, 'notification_date', '2025-05-15'),
    award_date: getParam(req, 'award_date', '2026-03-01')
  };

  const result = calculateStatutoryValuation(params);
  res.json(result);
};

app.post('/api/calculate-valuation', handleValuation);
app.post('/api/calculate-single-valuation', handleValuation);
app.get('/api/calculate-valuation', handleValuation);

// ================= 4. AI DELAY-RISK PREDICTOR =================
app.post('/api/predict-delay', (req, res) => {
  const payload = {
    area_ha: parseFloat(getParam(req, 'area_ha', 100.0)),
    num_parcels: parseInt(getParam(req, 'num_parcels', 10)),
    disputed_parcels_count: parseInt(getParam(req, 'disputed_parcels_count', 0)),
    multiplication_factor: parseFloat(getParam(req, 'multiplication_factor', 1.5)),
    forest_overlap_flag: parseInt(getParam(req, 'forest_overlap_flag', 0)),
    dwell_time_days: parseInt(getParam(req, 'dwell_time_days', 90))
  };

  const pred = predictProjectDelay(payload);
  res.json(pred);
});

app.get('/api/projects/:project_id/delay-risk', (req, res) => {
  const prj = db.getProjectById(req.params.project_id);
  if (!prj) {
    return res.status(404).json({ detail: "Project not found" });
  }

  const disputed = db.getObjectionsByProject(prj.id).filter(o => 
    o.status === 'PENDING' || o.status === 'HEARING_SCHEDULED'
  ).length;

  const isForest = (prj.title && prj.title.includes('Forest')) || (prj.district && prj.district.includes('Varanasi')) ? 1 : 0;

  const pred = predictProjectDelay({
    area_ha: prj.total_corridor_area_ha,
    num_parcels: Math.max(1, (prj.parcels || []).length),
    disputed_parcels_count: disputed,
    multiplication_factor: 1.5,
    forest_overlap_flag: isForest,
    dwell_time_days: 110
  });

  res.json({
    project_id: prj.id,
    project_title: prj.title,
    predicted_delay_days: pred.predicted_delay_days,
    predicted_delay_months: pred.predicted_delay_months,
    risk_score: pred.risk_score,
    risk_level: pred.risk_level,
    bottleneck_stage: pred.bottleneck_stage,
    risk_factors: pred.risk_factors,
    prescriptive_mitigations: pred.prescriptive_mitigations
  });
});

app.get('/api/delay-risks', (req, res) => {
  const projects = db.getAllProjects();
  const results = projects.map(prj => {
    const disputed = db.getObjectionsByProject(prj.id).filter(o => 
      o.status === 'PENDING' || o.status === 'HEARING_SCHEDULED'
    ).length;

    const isForest = (prj.title && prj.title.includes('Forest')) || (prj.district && prj.district.includes('Varanasi')) ? 1 : 0;

    const pred = predictProjectDelay({
      area_ha: prj.total_corridor_area_ha,
      num_parcels: Math.max(1, (prj.parcels || []).length),
      disputed_parcels_count: disputed,
      multiplication_factor: 1.5,
      forest_overlap_flag: isForest,
      dwell_time_days: 95
    });

    return {
      project_id: prj.id,
      project_title: prj.title,
      predicted_delay_months: pred.predicted_delay_months,
      risk_score: pred.risk_score,
      risk_level: pred.risk_level,
      bottleneck_stage: pred.bottleneck_stage
    };
  });

  res.json(results);
});

// ================= 5. CITIZEN & LANDOWNER PORTAL (FREE ACCESS) =================
app.get('/api/citizen-lookup', (req, res) => {
  const query = (req.query.query || '').trim();
  if (!query) {
    return res.json([]);
  }

  const parcels = db.searchParcels(query);
  const results = parcels.map(pr => {
    const prj = db.getProjectById(pr.project_id);
    const val = calculateStatutoryValuation({
      owner_name: pr.owner_name,
      acquired_area_sqm: pr.acquired_area_sqm,
      land_type: pr.land_type,
      circle_rate_per_sqm: pr.circle_rate_per_sqm,
      avg_registered_sale_rate_per_sqm: pr.avg_registered_sale_rate_per_sqm,
      structure_valuation: pr.structure_valuation || 0.0,
      tree_valuation: pr.tree_valuation || 0.0,
      crop_valuation: pr.crop_valuation || 0.0
    });

    return {
      parcel: pr,
      project_title: prj ? prj.title : "Highway Corridor",
      current_stage: prj ? prj.current_stage : "Notification",
      encumbrance_status: pr.encumbrance_locked ? "LOCKED (Under Sec 11 Acquisition)" : "FREE",
      sec11_gazette_id: `GAZ/2026/SEC11/${pr.ulpin.slice(0, 6)}`,
      valuation_estimate: val,
      joint_khata_heirs: pr.joint_khata_heirs || [],
      non_owner_claimants: pr.non_owner_claimants || [],
      field_survey_photos: pr.field_survey_photos || []
    };
  });

  res.json(results);
});

// ================= 6. SECTION 15 OBJECTIONS =================
app.get('/api/objections', (req, res) => {
  const objs = db.getAllObjections();
  const results = objs.map(o => {
    const prj = db.getProjectById(o.project_id);
    return {
      objection: o,
      project_title: prj ? prj.title : "National Highway"
    };
  });
  res.json(results);
});

app.post('/api/projects/:project_id/objections', (req, res) => {
  const projectId = req.params.project_id;
  const claimantName = getParam(req, 'claimant_name');
  const contactPhone = getParam(req, 'contact_phone');
  const ulpin = getParam(req, 'ulpin');
  const groundsCategory = getParam(req, 'grounds_category', 'Inadequate Valuation');
  const objectionDetails = getParam(req, 'objection_details');

  if (!claimantName || !contactPhone || !ulpin || !objectionDetails) {
    return res.status(400).json({ detail: "Missing required objection fields" });
  }

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const id = `OBJ-${timestamp}`;
  const filingDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const obj = db.createObjection({
    id,
    project_id: projectId,
    ulpin,
    claimant_name: claimantName,
    contact_phone: contactPhone,
    grounds_category: groundsCategory,
    objection_details: objectionDetails,
    filing_date: filingDate,
    status: "PENDING",
    cala_jurisdiction: "District Land Acquisition Tribunal / CALA Bench"
  });

  res.json({
    status: "success",
    objection_id: obj.id,
    objection: obj
  });
});

app.post('/api/projects/:project_id/objections/:objection_id/schedule-hearing', (req, res) => {
  const obj = db.getObjectionById(req.params.objection_id);
  if (!obj) {
    return res.status(404).json({ detail: "Objection not found" });
  }

  const hearingDate = getParam(req, 'hearing_date', '2026-03-25');
  const updated = db.updateObjection(obj.id, {
    status: "HEARING_SCHEDULED",
    hearing_date: hearingDate
  });

  res.json({
    status: "success",
    hearing_date: hearingDate,
    objection: updated
  });
});

app.post('/api/projects/:project_id/objections/:objection_id/dispose', (req, res) => {
  const obj = db.getObjectionById(req.params.objection_id);
  if (!obj) {
    return res.status(404).json({ detail: "Objection not found" });
  }

  const status = getParam(req, 'status', 'DISPOSED_UPHELD');
  const reasonedOrderSummary = getParam(req, 'reasoned_order_summary');

  if (!reasonedOrderSummary) {
    return res.status(400).json({ detail: "reasoned_order_summary is required" });
  }

  const updated = db.updateObjection(obj.id, {
    status,
    reasoned_order_summary: reasonedOrderSummary
  });

  res.json({
    status: "success",
    status: updated.status,
    objection: updated
  });
});

// ================= 7. R&R TRACKING =================
app.get('/api/projects/:project_id/rr-tracking', (req, res) => {
  const projectId = req.params.project_id;
  const families = db.getRRTrackingByProject(projectId);
  const total = families.length;
  const displaced = families.filter(f => f.is_displaced).length;
  const settled = families.filter(f => f.monetary_entitlements_settled >= 11).length;
  const budget = families.reduce((acc, f) => acc + (f.total_rr_assistance_inr || 0), 0) / 100000.0;

  res.json({
    project_id: projectId,
    total_affected_families: total,
    displaced_families: displaced,
    fully_settled_families: settled,
    settlement_percentage: total > 0 ? +((settled / total) * 100).toFixed(1) : 0.0,
    total_rr_assistance_budget_lakhs: +(budget).toFixed(2),
    families: families
  });
});

app.post('/api/projects/:project_id/rr-tracking/settle-family', (req, res) => {
  const familyId = getParam(req, 'family_id');
  if (!familyId) {
    return res.status(400).json({ detail: "family_id is required" });
  }

  const fam = db.getRRFamilyById(familyId);
  if (!fam) {
    return res.status(404).json({ detail: "Family record not found" });
  }

  const entitlementsSettled = parseInt(getParam(req, 'entitlements_settled', 11));
  const additionalAmenity = getParam(req, 'additional_amenity');

  const updates = { monetary_entitlements_settled: entitlementsSettled };
  if (additionalAmenity) {
    const amenities = Array.isArray(fam.resettlement_amenities_allocated) ? [...fam.resettlement_amenities_allocated] : [];
    if (!amenities.includes(additionalAmenity)) {
      amenities.push(additionalAmenity);
      updates.resettlement_amenities_allocated = amenities;
    }
  }

  const updated = db.updateRRFamily(familyId, updates);
  res.json({
    status: "success",
    family: updated
  });
});

// ================= 8. STATUTORY E-GOV INTEGRATIONS =================
app.post('/api/projects/:project_id/generate-egazette', (req, res) => {
  const prj = db.getProjectById(req.params.project_id);
  if (!prj) {
    return res.status(404).json({ detail: "Project not found" });
  }

  const hash = crypto.randomBytes(16).toString('hex').toUpperCase();
  const parcels = prj.parcels || [];
  const scheduleText = parcels.map(p => `- ULPIN: ${p.ulpin} | Record: ${p.local_record_no} | Owner: ${p.owner_name} | Area: ${p.acquired_area_sqm} sq.m`).join('\n');

  res.json({
    gazette_id: `DL-E-26082026-${prj.id.slice(-4)}`,
    project_id: prj.id,
    signing_authority: `Competent Authority Land Acquisition (CALA), ${prj.district}`,
    dsc_digital_signature_hash: `SHA256:${hash}`,
    english_text: `MINISTRY OF RURAL DEVELOPMENT / NHAI\nNOTIFICATION\nNew Delhi, the 26th August, 2026\n\nS.O. 1422(E).—In exercise of the powers conferred by sub-section (1) of Section 11 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013, the Central Government hereby notifies land acquisition for the ${prj.title} across ${parcels.length} cadastral parcels in ${prj.district}, ${prj.state}.\n\nSCHEDULE OF PARCELS:\n${scheduleText}`,
    hindi_text: `ग्रामीण विकास मंत्रालय / भारतीय राष्ट्रीय राजमार्ग प्राधिकरण\nअधिसूचना\nनई दिल्ली, 26 अगस्त, 2026\n\nका.आ. 1422(अ).—भूमि अर्जन, पुनर्वासन और पुनर्व्यवस्थापन में उचित प्रतिकर और पारदर्शिता का अधिकार अधिनियम, 2013 की धारा 11 की उप-धारा (1) द्वारा प्रदत्त शक्तियों का प्रयोग करते हुए केंद्र सरकार एतद्द्वारा ${prj.title} हेतु ${prj.district}, ${prj.state} में कुल ${parcels.length} भू-पार्सलों के अधिग्रहण की घोषणा करती है।`
  });
});

app.post('/api/projects/:project_id/disburse-pfms-dbt', (req, res) => {
  const prj = db.getProjectById(req.params.project_id);
  if (!prj) {
    return res.status(404).json({ detail: "Project not found" });
  }

  db.updateProject(prj.id, {
    total_compensation_disbursed_cr: prj.total_compensation_assessed_cr
  });

  const parcelsCount = (prj.parcels || []).length;
  const nowStr = new Date().toISOString();

  res.json({
    status: "SUCCESS_CREDITED",
    batch_id: `PFMS/DBT/2026/${prj.id.slice(-4)}/001`,
    total_amount_cr: prj.total_compensation_assessed_cr,
    total_beneficiaries: parcelsCount,
    settlement_channel: "RBI Aadhaar Payment Bridge System (APBS)",
    xml_payload: `<?xml version="1.0" encoding="UTF-8"?>\n<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">\n  <GrpHdr>\n    <MsgId>PFMS-DBT-${prj.id}-20260826</MsgId>\n    <CreDtTm>${nowStr}</CreDtTm>\n    <NbOfTxs>${parcelsCount}</NbOfTxs>\n    <CtrlSum>${prj.total_compensation_assessed_cr * 10000000}</CtrlSum>\n  </GrpHdr>\n</Document>`
  });
});

app.post('/api/projects/:project_id/trigger-mutation', (req, res) => {
  const prj = db.getProjectById(req.params.project_id);
  if (!prj) {
    return res.status(404).json({ detail: "Project not found" });
  }

  const parcels = prj.parcels || [];
  const records = [];

  for (const p of parcels) {
    records.push({
      ulpin: p.ulpin,
      old_owner: p.owner_name,
      new_owner: `President of India (c/o ${prj.acquiring_agency})`,
      mutation_order_no: `MUT/${prj.state.slice(0, 2).toUpperCase()}/2026/${p.ulpin.slice(-6)}`,
      state_portal_sync: "SYNCED_BHULEKH"
    });
  }

  db.updateParcelsByProject(prj.id, {
    encumbrance_locked: 0,
    status: "ACQUIRED"
  });

  db.updateProject(prj.id, {
    physical_possession_pct: 100.0
  });

  res.json({
    status: "MUTATION_RECORDED",
    state: prj.state,
    total_mutated_parcels: records.length,
    records: records
  });
});

// ================= 9. FIELD SURVEY OFFLINE SYNC (FOR FLUTTER MOBILE APP) =================
app.get('/api/field-surveys', (req, res) => {
  const surveys = db.getAllFieldSurveys();
  res.json(surveys);
});

app.get('/api/field-surveys/:ulpin', (req, res) => {
  const surveys = db.getFieldSurveysByUlpin(req.params.ulpin);
  res.json(surveys);
});

app.post('/api/field-surveys/sync', (req, res) => {
  const rawPayload = req.body;
  const surveyList = Array.isArray(rawPayload) ? rawPayload : (rawPayload.surveys || [rawPayload]);

  const syncedRecords = [];
  for (const item of surveyList) {
    if (!item.ulpin || !item.project_id) continue;
    const surveyId = item.id || `SRV-${Date.now()}-${item.ulpin.slice(-4)}`;
    const saved = db.saveFieldSurvey({ ...item, id: surveyId });
    syncedRecords.push(saved);
  }

  res.json({
    status: "SYNC_SUCCESS",
    synced_count: syncedRecords.length,
    timestamp: new Date().toISOString(),
    message: `Successfully synchronized ${syncedRecords.length} offline field survey(s) into national registry.`
  });
});

// ================= 10. LARRDA SECTION 64 DISPUTES & JOINT KHATA SPLITTING =================
app.get('/api/larrda-references', (req, res) => {
  const refs = db.getAllLARRDAReferences();
  res.json(refs);
});

app.post('/api/larrda-references', (req, res) => {
  const projectId = getParam(req, 'project_id');
  const ulpin = getParam(req, 'ulpin');
  const claimantName = getParam(req, 'claimant_name');
  const groundType = getParam(req, 'ground_type', 'VALUATION');

  if (!projectId || !ulpin || !claimantName) {
    return res.status(400).json({ detail: "Missing required reference fields" });
  }

  const id = `REF-${Date.now()}-${ulpin.slice(-4)}`;
  const ref = db.createLARRDAReference({
    id,
    project_id: projectId,
    ulpin,
    claimant_name: claimantName,
    ground_type: groundType,
    filing_date: new Date().toISOString().split('T')[0],
    collector_referral_date: new Date().toISOString().split('T')[0]
  });

  res.json({
    status: "success",
    reference_id: ref.id,
    reference: ref
  });
});

app.post('/api/parcels/:ulpin/split-khata', (req, res) => {
  const ulpin = req.params.ulpin;
  const parcel = db.getParcelByUlpin(ulpin);
  if (!parcel) {
    return res.status(404).json({ detail: "Parcel not found" });
  }

  const heirs = req.body.heirs || [];
  const updatedParcel = db.updateParcel(ulpin, {
    joint_khata_heirs: heirs
  });

  res.json({
    status: "success",
    ulpin,
    total_heirs: heirs.length,
    parcel: updatedParcel
  });
});

// Start listening if executed directly
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BACKEND] NLAMS Express REST API server running on port ${PORT}`);
  });
}

module.exports = app;
