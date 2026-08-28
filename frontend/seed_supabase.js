import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '../.env' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zhzkzqzkshkmrefrdyrq.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_hGt0BxoAK1gl_xXghF7Vrw_hc8PgSOk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const projects = [
  {
    id: "PRJ-NHAI-2026-UP01",
    title: "Varanasi Ring Road Phase-II Corridor",
    acquiring_agency: "National Highways Authority of India (NHAI)",
    statutory_act: "National Highways Act, 1956",
    state: "Uttar Pradesh",
    district: "Varanasi",
    total_corridor_area_ha: 145.8,
    total_compensation_assessed_cr: 84.5,
    total_compensation_disbursed_cr: 58.2,
    current_stage: "6. Valuation & Award",
    stage_progress_pct: 66.7
  },
  {
    id: "PRJ-DFCC-2026-MH02",
    title: "Western Dedicated Freight Corridor (JNPT-Vadodara)",
    acquiring_agency: "DFCCIL / Ministry of Railways",
    statutory_act: "Railways Act, 1989",
    state: "Maharashtra",
    district: "Palghar",
    total_corridor_area_ha: 210.4,
    total_compensation_assessed_cr: 142.8,
    total_compensation_disbursed_cr: 110.5,
    current_stage: "7. PFMS Direct Disbursal",
    stage_progress_pct: 77.8
  },
  {
    id: "PRJ-SIDC-2026-KA03",
    title: "Bengaluru-Chennai Expressway (Hosakote Sector)",
    acquiring_agency: "NHAI / KIADB",
    statutory_act: "RFCTLARR Act, 2013",
    state: "Karnataka",
    district: "Bengaluru Rural",
    total_corridor_area_ha: 98.2,
    total_compensation_assessed_cr: 65.4,
    total_compensation_disbursed_cr: 48.9,
    current_stage: "5. Section 15 Objection Hearing",
    stage_progress_pct: 55.6
  }
];

const parcels = [
  {
    ulpin: "IN09UP23456701",
    project_id: "PRJ-NHAI-2026-UP01",
    local_record_no: "Khasra No. 342/1",
    owner_name: "Shri Ramcharan Yadav (Joint Khata)",
    village: "Shivpur",
    tehsil: "Varanasi Tehsil",
    district: "Varanasi",
    state: "Uttar Pradesh",
    acquired_area_sqm: 3200.0,
    circle_rate_per_sqm: 2100.0,
    market_value_total: 9120000.0,
    structure_valuation: 350000.0,
    tree_valuation: 45000.0,
    crop_valuation: 22000.0,
    total_statutory_award: 18940000.0,
    encumbrance_locked: true,
    disbursement_status: "DISBURSED",
    status: "AWARD_PASSED"
  },
  {
    ulpin: "IN09UP23456702",
    project_id: "PRJ-NHAI-2026-UP01",
    local_record_no: "Khasra No. 342/2",
    owner_name: "Smt. Shanti Devi",
    village: "Shivpur",
    tehsil: "Varanasi Tehsil",
    district: "Varanasi",
    state: "Uttar Pradesh",
    acquired_area_sqm: 1850.0,
    circle_rate_per_sqm: 2100.0,
    market_value_total: 5120000.0,
    structure_valuation: 120000.0,
    tree_valuation: 15000.0,
    crop_valuation: 8000.0,
    total_statutory_award: 10526000.0,
    encumbrance_locked: true,
    disbursement_status: "PENDING",
    status: "NOTIFIED"
  },
  {
    ulpin: "IN27MH45678901",
    project_id: "PRJ-DFCC-2026-MH02",
    local_record_no: "Gat No. 118/A",
    owner_name: "Shri Balasaheb Patil & Co-heirs",
    village: "Dahanu Rural",
    tehsil: "Dahanu",
    district: "Palghar",
    state: "Maharashtra",
    acquired_area_sqm: 4500.0,
    circle_rate_per_sqm: 1850.0,
    market_value_total: 10450000.0,
    structure_valuation: 480000.0,
    tree_valuation: 65000.0,
    crop_valuation: 35000.0,
    total_statutory_award: 22060000.0,
    encumbrance_locked: true,
    disbursement_status: "DISBURSED",
    status: "AWARD_PASSED"
  }
];

const objections = [
  {
    id: "OBJ-2026-UP-001",
    project_id: "PRJ-NHAI-2026-UP01",
    ulpin: "IN09UP23456701",
    claimant_name: "Shri Ramcharan Yadav",
    grounds_category: "Inadequate Valuation",
    objection_details: "Circle rate applied does not reflect recent commercial registration benchmarks along Highway frontage.",
    hearing_date: "2026-03-15",
    hearing_bench: "CALA Bench / ADM (Land Acquisition), Varanasi",
    status: "PETITION_UPHELD",
    reasoned_order_summary: "Multiplication factor updated from 1.25 to 1.50 under First Schedule Section 26(2) RFCTLARR."
  },
  {
    id: "OBJ-2026-UP-002",
    project_id: "PRJ-NHAI-2026-UP01",
    ulpin: "IN09UP23456702",
    claimant_name: "Smt. Shanti Devi",
    grounds_category: "Measurement Discrepancy",
    objection_details: "Field boundary includes irrigation borewell and unharvested standing wheat crop omitted in draft 3A.",
    hearing_date: "2026-03-22",
    hearing_bench: "CALA Bench / ADM (Land Acquisition), Varanasi",
    status: "HEARING_SCHEDULED",
    reasoned_order_summary: null
  }
];

const rr_families = [
  {
    id: "RR-PAF-2026-001",
    project_id: "PRJ-NHAI-2026-UP01",
    ulpin: "IN09UP23456701",
    family_head_name: "Shri Ramcharan Yadav",
    is_displaced: true,
    resettlement_colony_house_allotted: true,
    subsistence_grant_paid: true,
    cattle_shed_grant_paid: true,
    resettlement_allowance_paid: true,
    total_rr_package_amount: 550000.0
  },
  {
    id: "RR-PAF-2026-002",
    project_id: "PRJ-NHAI-2026-UP01",
    ulpin: "IN09UP23456702",
    family_head_name: "Smt. Shanti Devi",
    is_displaced: false,
    resettlement_colony_house_allotted: false,
    subsistence_grant_paid: true,
    cattle_shed_grant_paid: false,
    resettlement_allowance_paid: true,
    total_rr_package_amount: 180000.0
  }
];

const larrda_references = [
  {
    id: "LARRDA-REF-2026-01",
    case_no: "LARRDA/VNS/2026/042",
    project_id: "PRJ-NHAI-2026-UP01",
    ulpin: "IN09UP23456701",
    claimant_name: "Shri Ramcharan Yadav",
    ground_type: "VALUATION",
    status: "TRIBUNAL_HEARING",
    collector_referral_date: "2026-02-10",
    tribunal_bench: "Presiding Officer, LARRDA Judicial Bench, Prayagraj / Varanasi"
  }
];

const users = [
  {
    id: "USR-ADMIN-01",
    name: "Shri Ajay Tirkey, IAS",
    email: "secretary.dolr@nic.in",
    role: "ADMIN",
    designation: "Secretary, Department of Land Resources (DoLR)",
    district: "New Delhi",
    agency: "Ministry of Rural Development (Govt of India)"
  },
  {
    id: "USR-STATE-01",
    name: "Shri Manoj Kumar, IAS",
    email: "ps.revenue@up.gov.in",
    role: "STATE_OFFICER",
    designation: "Principal Secretary (Revenue) & State Nodal Officer",
    district: "Lucknow",
    agency: "Board of Revenue, Govt of Uttar Pradesh"
  },
  {
    id: "USR-COLL-01",
    name: "Shri S. Rajalingam, IAS",
    email: "collector@nlams.gov.in",
    role: "COLLECTOR",
    designation: "District Collector & Magistrate",
    district: "Varanasi",
    agency: "Department of Revenue & Disaster Management, GoUP"
  },
  {
    id: "USR-CALA-01",
    name: "Dr. Alok Kumar Verma, PCS",
    email: "cala@nlams.gov.in",
    role: "CALA",
    designation: "Competent Authority Land Acquisition (CALA) / ADM",
    district: "Varanasi",
    agency: "Ministry of Road Transport & Highways (CALA Cell)"
  },
  {
    id: "USR-SURV-01",
    name: "Shri S. K. Sharma",
    email: "surveyor@nlams.gov.in",
    role: "SURVEYOR",
    designation: "Senior Revenue Inspector & Field Surveyor",
    district: "Varanasi",
    agency: "District Land Records & Cadastral Survey Division"
  }
];

async function seedData() {
  console.log('🌱 Starting Full Relational Supabase Seeding Process...');

  console.log('1. Seeding Projects...');
  for (const proj of projects) {
    const { error } = await supabase.from('projects').upsert(proj);
    if (error) console.error(`❌ Project ${proj.id}:`, error.message);
    else console.log(`✅ Project: ${proj.id}`);
  }

  console.log('2. Seeding Land Parcels...');
  for (const parcel of parcels) {
    const { error } = await supabase.from('parcels').upsert(parcel);
    if (error) console.error(`❌ Parcel ${parcel.ulpin}:`, error.message);
    else console.log(`✅ Parcel: ${parcel.ulpin}`);
  }

  console.log('3. Seeding Objections...');
  for (const obj of objections) {
    const { error } = await supabase.from('objections').upsert(obj);
    if (error) console.error(`❌ Objection ${obj.id}:`, error.message);
    else console.log(`✅ Objection: ${obj.id}`);
  }

  console.log('4. Seeding R&R Families...');
  for (const fam of rr_families) {
    const { error } = await supabase.from('rr_families').upsert(fam);
    if (error) console.error(`❌ R&R Family ${fam.id}:`, error.message);
    else console.log(`✅ R&R Family: ${fam.id}`);
  }

  console.log('5. Seeding LARRDA References...');
  for (const ref of larrda_references) {
    const { error } = await supabase.from('larrda_references').upsert(ref);
    if (error) console.error(`❌ LARRDA Ref ${ref.id}:`, error.message);
    else console.log(`✅ LARRDA Ref: ${ref.id}`);
  }

  console.log('6. Seeding Officers & Users...');
  for (const u of users) {
    const { error } = await supabase.from('users').upsert(u);
    if (error) console.error(`❌ User ${u.id}:`, error.message);
    else console.log(`✅ User: ${u.id}`);
  }

  console.log('🎉 Full Supabase Seeding Finished!');
}

seedData();
