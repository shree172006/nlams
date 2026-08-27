/**
 * NLAMS Statutory Fallback Seed Data & Client Calculation Engine
 * Guarantees zero blank screens, zero hanging loops, and instant offline/client-side computation.
 */

export const FALLBACK_METRICS = {
  total_corridor_projects: 4,
  total_notified_area_ha: 393.9,
  total_compensation_assessed_cr: 279.4,
  total_compensation_disbursed_cr: 127.9,
  total_cadastral_parcels_tracked: 34,
  active_encumbrance_locks_count: 22,
  average_possession_time_months: 11.4,
  system_state: "PRODUCTION_ACTIVE",
  statutory_compliance_score: 98.4
};

export const FALLBACK_PROJECTS = [
  {
    id: "PRJ-NH19-VARANASI-BYPASS",
    title: "Varanasi Ring Road Phase-II Bypass Corridor",
    statutory_act: "National Highways Act 1956 (Sec 3A-3J)",
    acquiring_agency: "National Highways Authority of India (NHAI)",
    state: "Uttar Pradesh",
    district: "Varanasi",
    total_corridor_area_ha: 84.5,
    total_length_km: 29.4,
    current_stage: "Stage 3 (Section 15 / 3C Hearing)",
    stage_progress_pct: 35.0,
    total_compensation_assessed_cr: 68.4,
    total_compensation_disbursed_cr: 24.2,
    alignment_coordinates: [
      [25.3176, 82.9739],
      [25.3289, 82.9912],
      [25.3412, 83.0125],
      [25.3587, 83.0389]
    ],
    parcels: [
      {
        ulpin: "IN09UP23456701",
        project_id: "PRJ-NH19-VARANASI-BYPASS",
        local_record_no: "Khasra 412/1",
        nomenclature_type: "Khasra",
        owner_name: "Ram Chandra Yadav",
        owner_aadhaar_masked: "XXXX-XXXX-4589",
        village: "Shivpur",
        tehsil: "Sadar",
        district: "Varanasi",
        state: "Uttar Pradesh",
        acquired_area_sqm: 1240.0,
        land_type: "RURAL_CLOSE",
        circle_rate_per_sqm: 2200.0,
        avg_registered_sale_rate_per_sqm: 2850.0,
        structure_valuation: 450000.0,
        tree_valuation: 35000.0,
        crop_valuation: 18000.0,
        status: "NOTIFIED",
        encumbrance_locked: true,
        bank_ifsc: "SBIN0001234",
        coordinates_polygon: [
          [25.3176, 82.9739],
          [25.3195, 82.9748],
          [25.3188, 82.9765],
          [25.3169, 82.9752]
        ],
        joint_khata_heirs: [
          { name: "Ram Chandra Yadav", relation: "Self / Head", share_pct: 60.0, share_sqm: 744.0 },
          { name: "Shyam Yadav", relation: "Brother (Co-heir)", share_pct: 40.0, share_sqm: 496.0 }
        ],
        non_owner_claimants: [
          { name: "Mangat Ram", type: "Tenant Farmer (Bataidar)", share_entitlement: "R&R Livelihood Grant" }
        ],
        field_survey_photos: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400&auto=format&fit=crop&q=60"
        ]
      },
      {
        ulpin: "IN09UP23456702",
        project_id: "PRJ-NH19-VARANASI-BYPASS",
        local_record_no: "Khasra 412/2",
        nomenclature_type: "Khasra",
        owner_name: "Kailash Nath Mishra",
        owner_aadhaar_masked: "XXXX-XXXX-9821",
        village: "Shivpur",
        tehsil: "Sadar",
        district: "Varanasi",
        state: "Uttar Pradesh",
        acquired_area_sqm: 980.0,
        land_type: "RURAL_CLOSE",
        circle_rate_per_sqm: 2200.0,
        avg_registered_sale_rate_per_sqm: 2900.0,
        structure_valuation: 0.0,
        tree_valuation: 22000.0,
        crop_valuation: 14000.0,
        status: "NOTIFIED",
        encumbrance_locked: true,
        bank_ifsc: "PUNB0123456",
        coordinates_polygon: [
          [25.3289, 82.9912],
          [25.3308, 82.9921],
          [25.3301, 82.9938],
          [25.3282, 82.9925]
        ]
      },
      {
        ulpin: "IN09UP23456703",
        project_id: "PRJ-NH19-VARANASI-BYPASS",
        local_record_no: "Khasra 413/1",
        nomenclature_type: "Khasra",
        owner_name: "Sunita Devi",
        owner_aadhaar_masked: "XXXX-XXXX-1144",
        village: "Babatpur",
        tehsil: "Pindra",
        district: "Varanasi",
        state: "Uttar Pradesh",
        acquired_area_sqm: 1650.0,
        land_type: "RURAL_MID",
        circle_rate_per_sqm: 1950.0,
        avg_registered_sale_rate_per_sqm: 2600.0,
        structure_valuation: 820000.0,
        tree_valuation: 65000.0,
        crop_valuation: 25000.0,
        status: "DISPUTED",
        encumbrance_locked: true,
        bank_ifsc: "BARB0VABABA",
        coordinates_polygon: [
          [25.3412, 83.0125],
          [25.3431, 83.0134],
          [25.3424, 83.0151],
          [25.3405, 83.0138]
        ]
      },
      {
        ulpin: "IN09UP23456704",
        project_id: "PRJ-NH19-VARANASI-BYPASS",
        local_record_no: "Khasra 414",
        nomenclature_type: "Khasra",
        owner_name: "Gram Sabha Shivpur",
        owner_aadhaar_masked: "N/A (Public Land)",
        village: "Shivpur",
        tehsil: "Sadar",
        district: "Varanasi",
        state: "Uttar Pradesh",
        acquired_area_sqm: 2400.0,
        land_type: "RURAL_CLOSE",
        circle_rate_per_sqm: 2200.0,
        avg_registered_sale_rate_per_sqm: 2850.0,
        structure_valuation: 0.0,
        tree_valuation: 110000.0,
        crop_valuation: 0.0,
        status: "ACQUIRED",
        encumbrance_locked: false,
        bank_ifsc: "N/A",
        coordinates_polygon: [
          [25.3587, 83.0389],
          [25.3606, 83.0398],
          [25.3599, 83.0415],
          [25.3580, 83.0402]
        ]
      }
    ]
  },
  {
    id: "PRJ-DFCCIL-DOW-MGS",
    title: "Eastern Dedicated Freight Corridor (Sonnagar-Dankuni)",
    statutory_act: "Railways Act 1989 (Sec 20A-20P)",
    acquiring_agency: "Dedicated Freight Corridor Corp of India (DFCCIL)",
    state: "Bihar",
    district: "Rohtas",
    total_corridor_area_ha: 142.0,
    total_length_km: 74.2,
    current_stage: "Stage 6 (Section 23 / 20F Award Declaration)",
    stage_progress_pct: 68.0,
    total_compensation_assessed_cr: 94.2,
    total_compensation_disbursed_cr: 61.5,
    alignment_coordinates: [
      [24.9542, 84.1876],
      [24.9689, 84.2145],
      [24.9812, 84.2412],
      [24.9987, 84.2789]
    ],
    parcels: [
      {
        ulpin: "IN10BR78901201",
        project_id: "PRJ-DFCCIL-DOW-MGS",
        local_record_no: "Khata 58, Plot 302",
        nomenclature_type: "Khata/Plot",
        owner_name: "Lal Bihari Singh",
        owner_aadhaar_masked: "XXXX-XXXX-6712",
        village: "Dehri",
        tehsil: "Dehri",
        district: "Rohtas",
        state: "Bihar",
        acquired_area_sqm: 3100.0,
        land_type: "RURAL_REMOTE",
        circle_rate_per_sqm: 1450.0,
        avg_registered_sale_rate_per_sqm: 1900.0,
        structure_valuation: 210000.0,
        tree_valuation: 54000.0,
        crop_valuation: 32000.0,
        status: "ACQUIRED",
        encumbrance_locked: false,
        bank_ifsc: "SBIN0004521",
        coordinates_polygon: [
          [24.9542, 84.1876],
          [24.9565, 84.1888],
          [24.9558, 84.1905],
          [24.9535, 84.1892]
        ]
      }
    ]
  },
  {
    id: "PRJ-MTHL-JNPT-EXPR",
    title: "Atal Setu (MTHL) JNPT Multi-Modal Logistics Expressway",
    statutory_act: "RFCTLARR Act, 2013 (Central Act 30 of 2013)",
    acquiring_agency: "Mumbai Metropolitan Region Development Authority (MMRDA)",
    state: "Maharashtra",
    district: "Raigad",
    total_corridor_area_ha: 62.4,
    total_length_km: 18.2,
    current_stage: "Stage 7 (Section 38 Possession & Mutation)",
    stage_progress_pct: 82.0,
    total_compensation_assessed_cr: 112.5,
    total_compensation_disbursed_cr: 98.4,
    alignment_coordinates: [
      [18.9482, 72.9614],
      [18.9567, 72.9845],
      [18.9689, 73.0112],
      [18.9812, 73.0389]
    ],
    parcels: [
      {
        ulpin: "IN27MH89123401",
        project_id: "PRJ-MTHL-JNPT-EXPR",
        local_record_no: "Gat No. 142/A",
        nomenclature_type: "Gat Number",
        owner_name: "Tukaram Pandurang Patil",
        owner_aadhaar_masked: "XXXX-XXXX-3341",
        village: "Chirle",
        tehsil: "Uran",
        district: "Raigad",
        state: "Maharashtra",
        acquired_area_sqm: 1850.0,
        land_type: "URBAN",
        circle_rate_per_sqm: 6500.0,
        avg_registered_sale_rate_per_sqm: 8200.0,
        structure_valuation: 1450000.0,
        tree_valuation: 85000.0,
        crop_valuation: 0.0,
        status: "ACQUIRED",
        encumbrance_locked: false,
        bank_ifsc: "MAHB0000845",
        coordinates_polygon: [
          [18.9482, 72.9614],
          [18.9502, 72.9625],
          [18.9495, 72.9642],
          [18.9475, 72.9629]
        ]
      }
    ]
  },
  {
    id: "PRJ-BENGALURU-CHENNAI-EXP",
    title: "Bengaluru-Chennai Expressway (NE-7 Phase-I)",
    statutory_act: "National Highways Act 1956 (Sec 3A-3J)",
    acquiring_agency: "National Highways Authority of India (NHAI)",
    state: "Karnataka",
    district: "Kolar",
    total_corridor_area_ha: 105.0,
    total_length_km: 42.0,
    current_stage: "Stage 2 (Section 11 / 3A Notification)",
    stage_progress_pct: 22.0,
    total_compensation_assessed_cr: 84.3,
    total_compensation_disbursed_cr: 12.0,
    alignment_coordinates: [
      [13.1342, 78.1345],
      [13.1489, 78.1612],
      [13.1612, 78.1878],
      [13.1789, 78.2145]
    ],
    parcels: [
      {
        ulpin: "IN29KA45678901",
        project_id: "PRJ-BENGALURU-CHENNAI-EXP",
        local_record_no: "Survey No. 89/2",
        nomenclature_type: "Survey Number",
        owner_name: "Muniswamy Gowda",
        owner_aadhaar_masked: "XXXX-XXXX-7723",
        village: "Bangarapet",
        tehsil: "Bangarapet",
        district: "Kolar",
        state: "Karnataka",
        acquired_area_sqm: 2150.0,
        land_type: "RURAL_MID",
        circle_rate_per_sqm: 2100.0,
        avg_registered_sale_rate_per_sqm: 2750.0,
        structure_valuation: 320000.0,
        tree_valuation: 95000.0,
        crop_valuation: 45000.0,
        status: "NOTIFIED",
        encumbrance_locked: true,
        bank_ifsc: "CNRB0001892",
        coordinates_polygon: [
          [13.1342, 78.1345],
          [13.1362, 78.1356],
          [13.1355, 78.1373],
          [13.1335, 78.1360]
        ]
      }
    ]
  }
];

export const FALLBACK_OBJECTIONS = [
  {
    id: "OBJ-2026-001",
    project_id: "PRJ-NH19-VARANASI-BYPASS",
    ulpin: "IN09UP23456703",
    claimant_name: "Sunita Devi",
    contact_phone: "+91 98765 43210",
    submission_date: "2026-06-12",
    grounds_category: "Inadequate Valuation",
    objection_details: "Circle rate of ₹1,950/sq.m does not reflect actual commercial highway corridor transactions of ₹3,400/sq.m recorded in Sub-Registrar deed #4412/2025.",
    status: "HEARING_SCHEDULED",
    hearing_date: "2026-08-30",
    order_reason: ""
  },
  {
    id: "OBJ-2026-002",
    project_id: "PRJ-NH19-VARANASI-BYPASS",
    ulpin: "IN09UP23456701",
    claimant_name: "Ram Chandra Yadav",
    contact_phone: "+91 98123 45678",
    submission_date: "2026-06-18",
    grounds_category: "Measurement Discrepancy",
    objection_details: "Cadastral map demarcates 1,240 sq.m whereas on-ground boundary pegging by surveyor takes 1,410 sq.m cutting into tube-well pump house.",
    status: "PETITION_UPHELD",
    hearing_date: "2026-07-15",
    order_reason: "Joint re-survey with CALA surveyor confirmed 1,410 sq.m acquired area. Section 19 declaration amended accordingly."
  },
  {
    id: "OBJ-2026-003",
    project_id: "PRJ-DFCCIL-DOW-MGS",
    ulpin: "IN10BR78901201",
    claimant_name: "Lal Bihari Singh",
    contact_phone: "+91 94310 98765",
    submission_date: "2026-05-10",
    grounds_category: "Title Dispute",
    objection_details: "Partition dispute pending in Civil Court between co-sharers; requested deposit of compensation in LARRDA escrow under Sec 77.",
    status: "PETITION_REJECTED",
    hearing_date: "2026-06-05",
    order_reason: "Title search confirmed registered Khata 58 mutated in favor of claimant. Civil suit had no stay order; disbursed directly."
  },
  {
    id: "OBJ-2026-004",
    project_id: "PRJ-BENGALURU-CHENNAI-EXP",
    ulpin: "IN29KA45678901",
    claimant_name: "Muniswamy Gowda",
    contact_phone: "+91 98450 12345",
    submission_date: "2026-08-01",
    grounds_category: "Ecological Concern / Wildlife",
    objection_details: "Expressway alignment cuts through ancient village sacred grove (Devara Kadu) with 40-year old teak and mango trees.",
    status: "PENDING",
    hearing_date: null,
    order_reason: ""
  }
];

export const FALLBACK_LARRDA = [
  {
    id: "LARRDA-REF-2026-001",
    case_no: "LARRDA/UP/VAR/2026/04",
    project_id: "PRJ-NH19-VARANASI-BYPASS",
    ulpin: "IN09UP23456703",
    claimant_name: "Sunita Devi",
    ground_type: "VALUATION",
    filing_date: "2026-07-20",
    collector_referral_date: "2026-08-10",
    status: "TRIBUNAL_HEARING",
    tribunal_bench: "Varanasi District Judge Bench #2",
    high_court_appeal_status: "Within 60-day limitation window (Section 74)"
  }
];

/**
 * Pure client-side mathematical statutory award calculator (First Schedule RFCTLARR Act, 2013)
 */
export function calculateClientStatutoryAward(inputs) {
  const area = Math.max(1, parseFloat(inputs.acquired_area_sqm) || 1000);
  const circleRate = Math.max(1, parseFloat(inputs.circle_rate_per_sqm) || 2000);
  const saleRate = Math.max(1, parseFloat(inputs.avg_registered_sale_rate_per_sqm) || 2500);
  const pppRate = parseFloat(inputs.ppp_consented_rate_per_sqm) || 0;
  
  // Base Market Value = max(Circle Rate, 3-Yr Avg Deed Rate, Consented Rate)
  const baseRate = Math.max(circleRate, saleRate, pppRate);
  const baseLandValue = area * baseRate;

  // Rural location multiplier
  let factor = 1.0;
  if (inputs.land_type === 'RURAL_CLOSE') factor = 1.25;
  else if (inputs.land_type === 'RURAL_MID') factor = 1.50;
  else if (inputs.land_type === 'RURAL_REMOTE') factor = 2.00;

  const adjustedLandValue = baseLandValue * factor;
  const structures = parseFloat(inputs.structure_valuation) || 0;
  const trees = parseFloat(inputs.tree_valuation) || 0;
  const crops = parseFloat(inputs.crop_valuation) || 0;
  const attachedAssets = structures + trees + crops;

  const baseCompensation = adjustedLandValue + attachedAssets;
  const solatium = baseCompensation * 1.00; // Mandatory 100% under Sec 30(1)

  // 12% p.a. additional interest from Sec 11 to Award
  let days = 289;
  if (inputs.notification_date && inputs.award_date) {
    const diff = new Date(inputs.award_date) - new Date(inputs.notification_date);
    days = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }
  const additionalInterest = baseLandValue * 0.12 * (days / 365.0);
  const grossAward = Math.round(baseCompensation + solatium + additionalInterest);

  return {
    owner_name: inputs.owner_name || "Landholder",
    acquired_area_sqm: area,
    base_market_value_per_sqm: baseRate,
    base_market_value_total: baseLandValue,
    multiplication_factor: factor,
    adjusted_market_value: adjustedLandValue,
    assets_valuation_total: attachedAssets,
    base_compensation: baseCompensation,
    solatium_amount: solatium,
    days_elapsed_notif_to_award: days,
    additional_amount_12pct: Math.round(additionalInterest),
    gross_total_award: grossAward
  };
}
