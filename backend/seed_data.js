/**
 * Realistic Indian Land Records & Officer Profiles Seed Data for NLAMS (JavaScript)
 * Aligned with DoLR RFCTLARR Act 2013 PDF specifications.
 */

const db = require('./db');

function seedDatabase() {
  // Always ensure official users are seeded
  seedOfficers();

  if (db.countProjects() > 0) {
    return;
  }

  // 1. Project 1: Varanasi Ring Road (UP)
  const p1 = {
    id: "PRJ-NHAI-2026-UP01",
    title: "Varanasi Ring Road Phase-II Corridor",
    acquiring_agency: "National Highways Authority of India (NHAI)",
    statutory_act: "National Highways Act, 1956 (Sec 3A to 3J) & RFCTLARR Act 2013",
    state: "Uttar Pradesh",
    district: "Varanasi",
    total_length_km: 42.5,
    total_corridor_area_ha: 145.8,
    current_stage: "6. Valuation, Award & Compensation (Sec 23/26-30/3G)",
    stage_progress_pct: 66.7,
    total_compensation_assessed_cr: 84.5,
    total_compensation_disbursed_cr: 58.2,
    physical_possession_pct: 62.0,
    alignment_coordinates: [
      [25.3176, 82.9739],
      [25.3350, 83.0020],
      [25.3620, 83.0310],
      [25.3900, 83.0650]
    ]
  };

  const parcelsP1 = [
    {
      ulpin: "IN09UP23456701",
      project_id: "PRJ-NHAI-2026-UP01",
      local_record_no: "Khasra No. 342/1",
      village: "Shivpur",
      district: "Varanasi",
      state: "Uttar Pradesh",
      land_type: "RURAL_CLOSE",
      acquired_area_sqm: 3200.0,
      circle_rate_per_sqm: 2100.0,
      avg_registered_sale_rate_per_sqm: 2850.0,
      owner_name: "Shri Ramcharan Yadav (Joint Khata)",
      owner_aadhaar_masked: "XXXX-XXXX-8921",
      bank_ifsc: "PUNB0021400",
      bank_account_masked: "XXXX-XXXX-4512",
      encumbrance_locked: true,
      status: "NOTIFIED",
      coordinates_polygon: [
        [25.3160, 82.9720], [25.3190, 82.9720], [25.3190, 82.9755], [25.3160, 82.9755]
      ],
      structure_valuation: 350000.0,
      tree_valuation: 45000.0,
      crop_valuation: 25000.0,
      joint_khata_heirs: [
        { name: "Shri Ramcharan Yadav", relation: "Self / Elder Son", share_pct: 50.0, share_sqm: 1600.0, bank_account: "XXXX-XXXX-4512" },
        { name: "Shri Shyamcharan Yadav", relation: "Brother / Co-Heir", share_pct: 50.0, share_sqm: 1600.0, bank_account: "XXXX-XXXX-8821" }
      ],
      non_owner_claimants: [
        { name: "Shri Birju Paswan", type: "AGRICULTURAL_LABORER", years_dependent: 8, entitlement: "Subsistence + Resettlement Allowance" },
        { name: "Shri Mangal Kevat", type: "TENANT_CULTIVATOR", years_dependent: 5, entitlement: "Crop Share Compensation + R&R" }
      ],
      field_survey_photos: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400"
      ]
    },
    {
      ulpin: "IN09UP23456702",
      project_id: "PRJ-NHAI-2026-UP01",
      local_record_no: "Khasra No. 342/2",
      village: "Shivpur",
      district: "Varanasi",
      state: "Uttar Pradesh",
      land_type: "RURAL_CLOSE",
      acquired_area_sqm: 4100.0,
      circle_rate_per_sqm: 2100.0,
      avg_registered_sale_rate_per_sqm: 2900.0,
      owner_name: "Smt. Shanti Devi",
      owner_aadhaar_masked: "XXXX-XXXX-1142",
      bank_ifsc: "SBIN0004512",
      bank_account_masked: "XXXX-XXXX-7821",
      encumbrance_locked: true,
      status: "NOTIFIED",
      coordinates_polygon: [
        [25.3195, 82.9760], [25.3225, 82.9760], [25.3225, 82.9795], [25.3195, 82.9795]
      ],
      structure_valuation: 180000.0,
      tree_valuation: 30000.0,
      crop_valuation: 15000.0,
      joint_khata_heirs: [],
      non_owner_claimants: [],
      field_survey_photos: [
        "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400"
      ]
    },
    {
      ulpin: "IN09UP23456703",
      project_id: "PRJ-NHAI-2026-UP01",
      local_record_no: "Khasra No. 118",
      village: "Harahua",
      district: "Varanasi",
      state: "Uttar Pradesh",
      land_type: "RURAL_MID",
      acquired_area_sqm: 5800.0,
      circle_rate_per_sqm: 1650.0,
      avg_registered_sale_rate_per_sqm: 2200.0,
      owner_name: "Shri Vinod Kumar Mishra",
      owner_aadhaar_masked: "XXXX-XXXX-6731",
      bank_ifsc: "BARB0VARANA",
      bank_account_masked: "XXXX-XXXX-9923",
      encumbrance_locked: true,
      status: "DISPUTED",
      coordinates_polygon: [
        [25.3340, 83.0010], [25.3370, 83.0010], [25.3370, 83.0045], [25.3340, 83.0045]
      ],
      structure_valuation: 420000.0,
      tree_valuation: 85000.0,
      crop_valuation: 40000.0,
      joint_khata_heirs: [],
      non_owner_claimants: [],
      field_survey_photos: []
    }
  ];

  const objectionsAll = [
    {
      id: "OBJ-UP-2026-081",
      project_id: "PRJ-NHAI-2026-UP01",
      ulpin: "IN09UP23456703",
      claimant_name: "Shri Vinod Kumar Mishra",
      contact_phone: "+91 94152 78120",
      grounds_category: "Inadequate Valuation",
      objection_details: "Sub-Registrar circle rate of Harahua increased in 2025; proposed 3G rate does not reflect commercial potential along NH-31.",
      filing_date: "2026-01-18",
      status: "HEARING_SCHEDULED",
      hearing_date: "2026-03-12",
      cala_jurisdiction: "CALA / Competent Authority cum ADM (Land Acquisition), Varanasi",
      reasoned_order_summary: null
    },
    {
      id: "OBJ-MH-2026-012",
      project_id: "PRJ-MSRDC-2026-MH04",
      ulpin: "IN27MH89123401",
      claimant_name: "Shri Eknath Patil",
      contact_phone: "+91 98220 54321",
      grounds_category: "Measurement Discrepancy",
      objection_details: "Boundary overlap with adjacent Gat No 419/2; actual acquired area is 4,500 sq.m vs 4,200 sq.m recorded in notice.",
      filing_date: "2026-01-25",
      status: "PETITION_UPHELD",
      hearing_date: "2026-02-14",
      cala_jurisdiction: "CALA / Sub-Divisional Officer (SDO), Hingna, Nagpur",
      reasoned_order_summary: "Upon joint total-station survey with DLR inspector, area correction from 4,200 sq.m to 4,500 sq.m approved. Differential compensation of ₹5.4 Lakhs sanctioned."
    },
    {
      id: "OBJ-KA-2026-033",
      project_id: "PRJ-KRDCL-2026-KA08",
      ulpin: "IN29KA56789001",
      claimant_name: "Shri Manjunath Swamy",
      contact_phone: "+91 94480 12345",
      grounds_category: "Inadequate Valuation",
      objection_details: "Demanding non-agricultural commercial rate for agricultural parcel claiming future highway commercial frontage.",
      filing_date: "2026-02-02",
      status: "PETITION_REJECTED",
      hearing_date: "2026-02-20",
      cala_jurisdiction: "CALA / Special Land Acquisition Officer (SLAO), Bengaluru",
      reasoned_order_summary: "Claimant's demand for commercial rate rejected as revenue records classify land as dry agricultural land without Change of Land Use (CLU) approval on notification date."
    },
    {
      id: "OBJ-PB-2026-045",
      project_id: "PRJ-DFCCIL-2026-PB02",
      ulpin: "IN03PB11223301",
      claimant_name: "Sardar Gurdeep Singh",
      contact_phone: "+91 98140 98765",
      grounds_category: "Public Utility Conflict",
      objection_details: "DFCCIL alignment bisects private irrigation tubewell and tractor access path to remainder 4 acres.",
      filing_date: "2026-02-10",
      status: "PENDING",
      hearing_date: null,
      cala_jurisdiction: "CALA / Competent Authority cum SDM, Ludhiana",
      reasoned_order_summary: null
    }
  ];

  // R&R Families (Second Schedule) across All Corridor Locations
  const rrFamiliesAll = [
    // 1. Varanasi Ring Road Phase-II (UP)
    {
      family_id: "RR-VNS-01",
      project_id: "PRJ-NHAI-2026-UP01",
      head_of_family: "Shri Ramcharan Yadav",
      category: "OBC",
      is_displaced: true,
      claimant_type: "OWNER",
      monetary_entitlements_settled: 11,
      total_rr_assistance_inr: 550000.0,
      resettlement_amenities_allocated: ["Drinking Water", "Electricity", "Paved Access Road"]
    },
    {
      family_id: "RR-VNS-02",
      project_id: "PRJ-NHAI-2026-UP01",
      head_of_family: "Smt. Shanti Devi",
      category: "General",
      is_displaced: false,
      claimant_type: "OWNER",
      monetary_entitlements_settled: 8,
      total_rr_assistance_inr: 350000.0,
      resettlement_amenities_allocated: ["Access Road"]
    },
    {
      family_id: "RR-VNS-03",
      project_id: "PRJ-NHAI-2026-UP01",
      head_of_family: "Shri Birju Paswan",
      category: "SC/ST",
      is_displaced: true,
      claimant_type: "AGRICULTURAL_LABORER",
      monetary_entitlements_settled: 11,
      total_rr_assistance_inr: 436000.0,
      resettlement_amenities_allocated: ["Sanitation Unit", "Solar Street Lighting", "Drinking Water"]
    },

    // 2. Nagpur-Mumbai Samruddhi Expressway (Maharashtra)
    {
      family_id: "RR-NGP-01",
      project_id: "PRJ-MSRDC-2026-MH04",
      head_of_family: "Shri Eknath Patil",
      category: "OBC",
      is_displaced: true,
      claimant_type: "OWNER",
      monetary_entitlements_settled: 11,
      total_rr_assistance_inr: 680000.0,
      resettlement_amenities_allocated: ["Resettlement Colony Plot", "Farm Link Road", "Power Connection"]
    },
    {
      family_id: "RR-NGP-02",
      project_id: "PRJ-MSRDC-2026-MH04",
      head_of_family: "Shri Santosh Gaikwad",
      category: "SC/ST",
      is_displaced: true,
      claimant_type: "AGRICULTURAL_LABORER",
      monetary_entitlements_settled: 11,
      total_rr_assistance_inr: 480000.0,
      resettlement_amenities_allocated: ["Concrete House Grant", "Drinking Water", "Cattle Shed Allotment"]
    },
    {
      family_id: "RR-NGP-03",
      project_id: "PRJ-MSRDC-2026-MH04",
      head_of_family: "Smt. Vimalabai Deshmukh",
      category: "General",
      is_displaced: false,
      claimant_type: "TENANT",
      monetary_entitlements_settled: 9,
      total_rr_assistance_inr: 320000.0,
      resettlement_amenities_allocated: ["Paved Road", "Community Hall Access"]
    },

    // 3. Bengaluru Satellite Town Ring Road (Karnataka)
    {
      family_id: "RR-BLR-01",
      project_id: "PRJ-KRDCL-2026-KA08",
      head_of_family: "Shri Manjunath Swamy",
      category: "General",
      is_displaced: false,
      claimant_type: "OWNER",
      monetary_entitlements_settled: 11,
      total_rr_assistance_inr: 750000.0,
      resettlement_amenities_allocated: ["Commercial Stall Allotment", "Storm Water Drainage", "Fiber Optic Line"]
    },
    {
      family_id: "RR-BLR-02",
      project_id: "PRJ-KRDCL-2026-KA08",
      head_of_family: "Shri Venkateshappa",
      category: "SC/ST",
      is_displaced: true,
      claimant_type: "ARTISAN",
      monetary_entitlements_settled: 10,
      total_rr_assistance_inr: 525000.0,
      resettlement_amenities_allocated: ["Artisan Work Shed", "Solar Street Lighting", "Resettlement Housing"]
    },
    {
      family_id: "RR-BLR-03",
      project_id: "PRJ-KRDCL-2026-KA08",
      head_of_family: "Smt. Gowramma",
      category: "OBC",
      is_displaced: true,
      claimant_type: "AGRICULTURAL_LABORER",
      monetary_entitlements_settled: 11,
      total_rr_assistance_inr: 460000.0,
      resettlement_amenities_allocated: ["Drinking Water", "Paved Access Road", "Anganwadi Access"]
    },

    // 4. Delhi-Amritsar Dedicated Freight Corridor (Punjab)
    {
      family_id: "RR-LDH-01",
      project_id: "PRJ-DFCCIL-2026-PB02",
      head_of_family: "Sardar Gurdeep Singh",
      category: "General",
      is_displaced: false,
      claimant_type: "OWNER",
      monetary_entitlements_settled: 11,
      total_rr_assistance_inr: 820000.0,
      resettlement_amenities_allocated: ["Tractor Crossing Underpass", "Tubewell Power Connection"]
    },
    {
      family_id: "RR-LDH-02",
      project_id: "PRJ-DFCCIL-2026-PB02",
      head_of_family: "Shri Baldev Ram",
      category: "SC/ST",
      is_displaced: true,
      claimant_type: "AGRICULTURAL_LABORER",
      monetary_entitlements_settled: 11,
      total_rr_assistance_inr: 450000.0,
      resettlement_amenities_allocated: ["Pucca House Grant", "Drainage", "Community Centre Allotment"]
    },
    {
      family_id: "RR-LDH-03",
      project_id: "PRJ-DFCCIL-2026-PB02",
      head_of_family: "Smt. Jaswinder Kaur",
      category: "General",
      is_displaced: false,
      claimant_type: "SHOPKEEPER",
      monetary_entitlements_settled: 8,
      total_rr_assistance_inr: 380000.0,
      resettlement_amenities_allocated: ["Market Complex Booth Allotment", "Drinking Water"]
    }
  ];

  // LARRDA Reference under Section 64 (PDF statutory pillar)
  const larrda1 = {
    id: "REF-LARRDA-UP-2026-009",
    project_id: "PRJ-NHAI-2026-UP01",
    ulpin: "IN09UP23456703",
    claimant_name: "Shri Vinod Kumar Mishra",
    ground_type: "VALUATION",
    filing_date: "2026-01-20",
    collector_referral_date: "2026-02-10",
    tribunal_bench: "Uttar Pradesh Land Acquisition, Rehabilitation & Resettlement Authority (Varanasi Bench)",
    case_no: "LARRA/VNS/2026/882",
    hearing_date: "2026-04-18",
    status: "UNDER_ADJUDICATION",
    high_court_appeal_status: "ELIGIBLE_60_DAYS"
  };

  const larrda2 = {
    id: "REF-LARRDA-MH-2026-014",
    project_id: "PRJ-MSRDC-2026-MH04",
    ulpin: "IN27MH89123401",
    claimant_name: "Shri Eknath Patil",
    ground_type: "APPORTIONMENT",
    filing_date: "2026-02-05",
    collector_referral_date: "2026-02-28",
    tribunal_bench: "Maharashtra LARR Authority (Nagpur Divisional Bench)",
    case_no: "LARRA/NGP/2026/104",
    hearing_date: "2026-05-12",
    status: "UNDER_ADJUDICATION",
    high_court_appeal_status: "ELIGIBLE_60_DAYS"
  };

  const larrda3 = {
    id: "REF-LARRDA-KA-2026-022",
    project_id: "PRJ-KRDCL-2026-KA08",
    ulpin: "IN29KA56789001",
    claimant_name: "Shri Manjunath Swamy",
    ground_type: "REHABILITATION",
    filing_date: "2026-01-14",
    collector_referral_date: "2026-02-19",
    tribunal_bench: "Karnataka Land Acquisition Tribunal (Bengaluru Rural Bench)",
    case_no: "LARRA/BLR/2026/419",
    hearing_date: "2026-04-29",
    status: "DISPOSED",
    high_court_appeal_status: "APPEAL_FILED_HC"
  };

  const larrda4 = {
    id: "REF-LARRDA-PB-2026-031",
    project_id: "PRJ-DFCCIL-2026-PB02",
    ulpin: "IN03PB11223301",
    claimant_name: "Sardar Gurdeep Singh",
    ground_type: "MEASUREMENT_AREA",
    filing_date: "2026-02-12",
    collector_referral_date: "2026-03-01",
    tribunal_bench: "Punjab Land Acquisition Authority (Ludhiana Bench)",
    case_no: "LARRA/LDH/2026/711",
    hearing_date: "2026-05-04",
    status: "UNDER_ADJUDICATION",
    high_court_appeal_status: "ELIGIBLE_60_DAYS"
  };

  // 2. Project 2: Nagpur-Mumbai Samruddhi Mahamarg (Maharashtra)
  const p2 = {
    id: "PRJ-MSRDC-2026-MH04",
    title: "Nagpur-Mumbai Samruddhi Expressway (Package 12)",
    acquiring_agency: "MSRDC / GoM",
    statutory_act: "RFCTLARR Act, 2013",
    state: "Maharashtra",
    district: "Nagpur",
    total_length_km: 58.2,
    total_corridor_area_ha: 210.4,
    current_stage: "8. Physical Possession & Land Mutation (Sec 38/3E)",
    stage_progress_pct: 88.9,
    total_compensation_assessed_cr: 162.0,
    total_compensation_disbursed_cr: 154.8,
    physical_possession_pct: 94.5,
    alignment_coordinates: [
      [21.1458, 79.0882],
      [21.1210, 78.9850],
      [21.0850, 78.8520],
      [21.0420, 78.7110]
    ]
  };

  const parcelsP2 = [
    {
      ulpin: "IN27MH89123401",
      project_id: "PRJ-MSRDC-2026-MH04",
      local_record_no: "Gat No. 89/1A",
      village: "Hingna",
      district: "Nagpur",
      state: "Maharashtra",
      land_type: "RURAL_MID",
      acquired_area_sqm: 6500.0,
      circle_rate_per_sqm: 1250.0,
      avg_registered_sale_rate_per_sqm: 1950.0,
      owner_name: "Shri Eknath Patil",
      owner_aadhaar_masked: "XXXX-XXXX-9912",
      bank_ifsc: "MAHB0000124",
      bank_account_masked: "XXXX-XXXX-3341",
      encumbrance_locked: false,
      status: "ACQUIRED",
      coordinates_polygon: [
        [21.1440, 79.0860], [21.1475, 79.0860], [21.1475, 79.0900], [21.1440, 79.0900]
      ],
      structure_valuation: 220000.0,
      tree_valuation: 65000.0,
      crop_valuation: 35000.0
    }
  ];

  // 3. Project 3: Bengaluru Satellite Town Ring Road (Karnataka)
  const p3 = {
    id: "PRJ-KRDCL-2026-KA08",
    title: "Bengaluru Satellite Town Ring Road (STRR - NH 948A)",
    acquiring_agency: "NHAI / KRDCL",
    statutory_act: "National Highways Act, 1956",
    state: "Karnataka",
    district: "Bengaluru Rural",
    total_length_km: 76.0,
    total_corridor_area_ha: 312.0,
    current_stage: "3. Preliminary Notification & Freezing (Sec 11/3A)",
    stage_progress_pct: 33.3,
    total_compensation_assessed_cr: 240.0,
    total_compensation_disbursed_cr: 12.0,
    physical_possession_pct: 15.0,
    alignment_coordinates: [
      [13.1986, 77.7066],
      [13.2450, 77.6210],
      [13.3120, 77.5120],
      [13.3850, 77.4100]
    ]
  };

  const parcelsP3 = [
    {
      ulpin: "IN29KA56789001",
      project_id: "PRJ-KRDCL-2026-KA08",
      local_record_no: "Sy. No. 45/3",
      village: "Devanahalli",
      district: "Bengaluru Rural",
      state: "Karnataka",
      land_type: "RURAL_CLOSE",
      acquired_area_sqm: 5000.0,
      circle_rate_per_sqm: 4200.0,
      avg_registered_sale_rate_per_sqm: 5600.0,
      owner_name: "Shri Manjunath Swamy",
      owner_aadhaar_masked: "XXXX-XXXX-4532",
      bank_ifsc: "CNRB0001290",
      bank_account_masked: "XXXX-XXXX-9901",
      encumbrance_locked: true,
      status: "NOTIFIED",
      coordinates_polygon: [
        [13.1970, 77.7050], [13.2005, 77.7050], [13.2005, 77.7085], [13.1970, 77.7085]
      ],
      structure_valuation: 500000.0,
      tree_valuation: 120000.0,
      crop_valuation: 50000.0
    }
  ];

  // 4. Project 4: Delhi-Amritsar High Speed Rail / Freight Corridor (Punjab)
  const p4 = {
    id: "PRJ-DFCCIL-2026-PB02",
    title: "Delhi-Amritsar Dedicated Freight & Rail Corridor",
    acquiring_agency: "Dedicated Freight Corridor Corporation (DFCCIL)",
    statutory_act: "Railways Act, 1989 (Sec 20A-20P)",
    state: "Punjab",
    district: "Ludhiana",
    total_length_km: 84.0,
    total_corridor_area_ha: 393.9,
    current_stage: "4. Objection Management & Inquiry (Sec 15/3C)",
    stage_progress_pct: 44.4,
    total_compensation_assessed_cr: 195.0,
    total_compensation_disbursed_cr: 45.0,
    physical_possession_pct: 35.0,
    alignment_coordinates: [
      [30.9010, 75.8573],
      [30.9420, 75.7650],
      [30.9850, 75.6420],
      [31.0250, 75.5110]
    ]
  };

  const parcelsP4 = [
    {
      ulpin: "IN03PB11223301",
      project_id: "PRJ-DFCCIL-2026-PB02",
      local_record_no: "Murabba 14, Killa 8",
      village: "Sahnewal",
      district: "Ludhiana",
      state: "Punjab",
      land_type: "RURAL_MID",
      acquired_area_sqm: 7200.0,
      circle_rate_per_sqm: 2800.0,
      avg_registered_sale_rate_per_sqm: 3600.0,
      owner_name: "Sardar Gurdeep Singh",
      owner_aadhaar_masked: "XXXX-XXXX-3312",
      bank_ifsc: "PSIB0000412",
      bank_account_masked: "XXXX-XXXX-6623",
      encumbrance_locked: true,
      status: "NOTIFIED",
      coordinates_polygon: [
        [30.9000, 75.8550], [30.9035, 75.8550], [30.9035, 75.8590], [30.9000, 75.8590]
      ],
      structure_valuation: 380000.0,
      tree_valuation: 90000.0,
      crop_valuation: 45000.0
    }
  ];

  db.insertProjects([p1, p2, p3, p4]);
  db.insertParcels([...parcelsP1, ...parcelsP2, ...parcelsP3, ...parcelsP4]);
  objectionsAll.forEach(o => db.insertObjection(o));
  db.insertRRFamilies(rrFamiliesAll);
  db.insertLARRDAReferences([larrda1, larrda2, larrda3, larrda4]);
}

function seedOfficers() {
  const officers = [
    {
      id: "USR-ADMIN-01",
      name: "Shri Ajay Tirkey, IAS",
      email: "secretary.dolr@nic.in",
      role: "ADMIN",
      designation: "Secretary, Department of Land Resources (DoLR)",
      district: "New Delhi",
      agency: "Ministry of Rural Development (Govt of India)",
      token: "TOKEN-ADMIN-GOI"
    },
    {
      id: "USR-STATE-01",
      name: "Shri Manoj Kumar, IAS",
      email: "ps.revenue@up.gov.in",
      role: "STATE_OFFICER",
      designation: "Principal Secretary (Revenue) & State Nodal Officer",
      district: "Lucknow",
      agency: "Board of Revenue, Govt of Uttar Pradesh",
      token: "TOKEN-STATE-UP"
    },
    {
      id: "USR-COLL-01",
      name: "Shri S. Rajalingam, IAS",
      email: "collector@nlams.gov.in",
      role: "COLLECTOR",
      designation: "District Collector & Magistrate",
      district: "Varanasi",
      agency: "Department of Revenue & Disaster Management, GoUP",
      token: "TOKEN-COLLECTOR-VNS"
    },
    {
      id: "USR-CALA-01",
      name: "Dr. Alok Kumar Verma, PCS",
      email: "cala@nlams.gov.in",
      role: "CALA",
      designation: "Competent Authority Land Acquisition (CALA) / ADM",
      district: "Varanasi",
      agency: "Ministry of Road Transport & Highways (CALA Cell)",
      token: "TOKEN-CALA-VNS"
    },
    {
      id: "USR-SURV-01",
      name: "Shri S. K. Sharma",
      email: "surveyor@nlams.gov.in",
      role: "SURVEYOR",
      designation: "Senior Revenue Inspector & Field Surveyor",
      district: "Varanasi",
      agency: "District Land Records & Cadastral Survey Division",
      token: "TOKEN-SURVEYOR-VNS"
    },
    {
      id: "USR-AGENCY-01",
      name: "Er. Ramesh Chandra",
      email: "nhai@nlams.gov.in",
      role: "AGENCY",
      designation: "Chief Project General Manager (Civil)",
      district: "Regional Office East",
      agency: "National Highways Authority of India (NHAI)",
      token: "TOKEN-AGENCY-NHAI"
    }
  ];

  db.insertUsers(officers);
}

module.exports = {
  seedDatabase,
  seedOfficers
};
