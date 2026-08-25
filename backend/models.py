from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class StageEnum(str, Enum):
    PROPOSAL = "1. Proposal Ingestion & Alignment Scrutiny"
    SIA = "2. Social Impact Assessment (SIA)"
    PRELIMINARY_NOTIFICATION = "3. Preliminary Notification & Freezing (Sec 11/3A)"
    OBJECTION_MANAGEMENT = "4. Objection Management & Inquiry (Sec 15/3C)"
    DECLARATION = "5. Declaration of Acquisition (Sec 19/3D)"
    VALUATION_AWARD = "6. Valuation, Award & Compensation (Sec 23/26-30/3G)"
    REHABILITATION_RESETTLEMENT = "7. Rehabilitation & Resettlement (R&R)"
    POSSESSION_MUTATION = "8. Physical Possession & Land Mutation (Sec 38/3E)"
    DISPUTE_MONITORING = "9. Dispute & Reference Monitoring (Sec 51-74)"

class StatutoryActEnum(str, Enum):
    RFCTLARR_2013 = "RFCTLARR Act, 2013"
    NH_ACT_1956 = "National Highways Act, 1956"
    RAILWAYS_ACT_1989 = "Railways Act, 1989"

class LandTypeEnum(str, Enum):
    URBAN = "URBAN"
    RURAL_CLOSE = "RURAL_CLOSE"      # 0 - 10 km from urban boundary
    RURAL_MID = "RURAL_MID"          # 10 - 20 km
    RURAL_REMOTE = "RURAL_REMOTE"    # > 20 km

class StateNomenclature(str, Enum):
    UP_MP_DELHI = "Khasra / Khatauni"
    MAHARASHTRA_GUJARAT = "7/12 & 8A Extract"
    KARNATAKA = "RTC (Pahani)"
    TAMIL_NADU_AP = "Patta / Chitta"
    PUNJAB_HARYANA = "Jamabandi / Khasra Girdawari"

class ParcelRecord(BaseModel):
    ulpin: str = Field(..., description="14-digit Unique Land Parcel Identification Number (Bhu-Aadhaar)")
    state: str
    district: str
    taluk_tehsil: str
    village: str
    nomenclature_type: StateNomenclature
    local_record_no: str  # e.g., "Khasra No. 402/1" or "Survey No. 89/A"
    owner_name: str
    owner_aadhaar_masked: str
    bank_account_verified: bool = True
    bank_ifsc: str
    bank_account_no_masked: str
    total_parcel_area_sqm: float
    acquired_area_sqm: float
    land_type: LandTypeEnum
    circle_rate_per_sqm: float
    avg_registered_sale_rate_per_sqm: float
    ppp_consented_rate_per_sqm: Optional[float] = 0.0
    structure_valuation: float = 0.0
    tree_valuation: float = 0.0
    crop_valuation: float = 0.0
    encumbrance_locked: bool = False
    encumbrance_lock_timestamp: Optional[str] = None
    coordinates_polygon: List[List[float]] = [] # GeoJSON polygon coordinates [[lat, lng], ...]
    is_dropout_in_sec19: bool = False

class ValuationBreakdown(BaseModel):
    ulpin: str
    owner_name: str
    acquired_area_sqm: float
    base_market_value_per_sqm: float
    base_market_value_total: float
    multiplication_factor: float
    adjusted_market_value: float
    assets_valuation_total: float  # Structures + Trees + Crops
    base_compensation: float       # Adjusted MV + Assets
    solatium_amount: float         # 100% of base_compensation
    days_elapsed_notif_to_award: int
    additional_amount_12pct: float # 12% p.a. on base MV
    gross_total_award: float
    calculation_formula_audit: Dict[str, Any]

class ObjectionRecord(BaseModel):
    id: str
    project_id: str
    ulpin: str
    claimant_name: str
    contact_phone: str
    grounds_category: str  # "Measurement Discrepancy", "Title Dispute", "Inadequate Valuation", "Public Utility Conflict"
    objection_details: str
    filing_date: str
    hearing_date: Optional[str] = None
    cala_jurisdiction: str
    status: str = "PENDING"  # PENDING, HEARING_SCHEDULED, DISPOSED_UPHELD, DISPOSED_REJECTED
    reasoned_order_summary: Optional[str] = None
    disposal_timestamp: Optional[str] = None

class RREntitlement(BaseModel):
    family_id: str
    head_of_family: str
    category: str  # "SC/ST", "BPL", "General", "Agricultural Labourer"
    is_displaced: bool
    monetary_entitlements_settled: int = Field(0, description="Out of 11 mandatory 2nd Schedule entitlements")
    total_rr_assistance_inr: float
    resettlement_amenities_allocated: List[str] = [] # e.g. ["Piped Drinking Water", "Electricity", "Primary School"]

class Project(BaseModel):
    id: str
    title: str
    acquiring_agency: str  # e.g., "NHAI", "Ministry of Railways (DFCCIL)", "Ministry of Power"
    sector: str            # "Highways", "Railways", "Power Grid", "Renewable Energy"
    statutory_act: StatutoryActEnum
    state: str
    districts: List[str]
    current_stage: StageEnum
    stage_progress_pct: float
    total_length_km: Optional[float] = None
    total_corridor_area_ha: float
    parcels: List[ParcelRecord]
    objections: List[ObjectionRecord] = []
    rr_families: List[RREntitlement] = []
    sec11_notification_date: Optional[str] = None
    sec11_gazette_id: Optional[str] = None
    sec19_declaration_date: Optional[str] = None
    award_date: Optional[str] = None
    total_compensation_assessed_cr: float = 0.0
    total_compensation_disbursed_cr: float = 0.0
    pfs_dbt_batch_id: Optional[str] = None
    physical_possession_pct: float = 0.0
    mutation_completed_pct: float = 0.0
    active_court_cases: int = 0
    contingent_liability_cr: float = 0.0
    created_at: str
    alignment_coordinates: List[List[float]] = []  # Polyline [[lat, lng], ...]

class VikasScoreResult(BaseModel):
    state: str
    total_score: float = Field(..., ge=0, le=140)
    process_velocity_score: float       # max 40
    financial_dbt_score: float          # max 40
    social_rr_score: float              # max 40
    spatial_mutation_score: float       # max 20
    penalties_deducted: float
    breakdown_details: Dict[str, Any]
