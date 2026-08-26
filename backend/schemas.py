"""
Pydantic Validation Schemas for NLAMS
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Any

# --- Parcel Schemas ---
class ParcelBase(BaseModel):
    ulpin: str = Field(..., min_length=14, max_length=14, description="14-digit Bhu-Aadhaar ULPIN")
    local_record_no: str
    village: str
    district: str
    state: str
    land_type: str = "RURAL_REMOTE"
    acquired_area_sqm: float
    circle_rate_per_sqm: float
    avg_registered_sale_rate_per_sqm: float
    owner_name: str
    owner_aadhaar_masked: str
    bank_ifsc: str = "SBIN0001234"
    bank_account_masked: str = "XXXX-XXXX-9876"
    encumbrance_locked: bool = False
    status: str = "PROPOSED"
    coordinates_polygon: List[List[float]] = []

class ParcelResponse(ParcelBase):
    project_id: str

    model_config = {"from_attributes": True}

# --- Objection Schemas ---
class ObjectionCreate(BaseModel):
    ulpin: str
    claimant_name: str
    contact_phone: str
    grounds_category: str
    objection_details: str

class ObjectionResponse(BaseModel):
    id: str
    project_id: str
    ulpin: str
    claimant_name: str
    contact_phone: str
    grounds_category: str
    objection_details: str
    filing_date: str
    status: str
    hearing_date: Optional[str] = None
    cala_jurisdiction: str
    reasoned_order_summary: Optional[str] = None

    model_config = {"from_attributes": True}

# --- R&R Schemas ---
class RRFamilyResponse(BaseModel):
    family_id: str
    project_id: str
    head_of_family: str
    category: str
    is_displaced: bool
    monetary_entitlements_settled: int
    total_rr_assistance_inr: float
    resettlement_amenities_allocated: List[str] = []

    model_config = {"from_attributes": True}

class RRTrackingSummary(BaseModel):
    project_id: str
    total_affected_families: int
    displaced_families: int
    fully_settled_families: int
    settlement_percentage: float
    total_rr_assistance_budget_lakhs: float
    families: List[RRFamilyResponse]

# --- Project Schemas ---
class ProjectResponse(BaseModel):
    id: str
    title: str
    acquiring_agency: str
    statutory_act: str
    state: str
    district: str
    total_length_km: float
    total_corridor_area_ha: float
    current_stage: str
    stage_progress_pct: float
    total_compensation_assessed_cr: float
    total_compensation_disbursed_cr: float
    physical_possession_pct: float
    alignment_coordinates: List[List[float]] = []
    parcels: List[ParcelResponse] = []

    model_config = {"from_attributes": True}

# --- Statutory Valuation Schemas ---
class ValuationRequest(BaseModel):
    owner_name: str = "Shri Ramcharan Yadav"
    acquired_area_sqm: float = 3500.0
    land_type: str = "RURAL_REMOTE"  # URBAN, RURAL_CLOSE, RURAL_MID, RURAL_REMOTE
    circle_rate_per_sqm: float = 1850.0
    avg_registered_sale_rate_per_sqm: float = 2400.0
    ppp_consented_rate_per_sqm: float = 0.0
    structure_valuation: float = 350000.0
    tree_valuation: float = 45000.0
    crop_valuation: float = 25000.0
    notification_date: str = "2025-05-15"
    award_date: str = "2026-03-01"

class ValuationResponse(BaseModel):
    owner_name: str
    acquired_area_sqm: float
    land_type: str
    base_market_value_per_sqm: float
    base_market_value_total: float
    multiplication_factor: float
    adjusted_market_value: float
    assets_valuation_total: float
    base_compensation: float
    solatium_amount: float
    additional_amount_12pct: float
    days_elapsed_notif_to_award: int
    gross_total_award: float

# --- AI Delay Risk Schemas ---
class DelayPredictionRequest(BaseModel):
    area_ha: float
    num_parcels: int
    disputed_parcels_count: int
    multiplication_factor: float = 1.5
    forest_overlap_flag: int = 0  # 0 or 1
    dwell_time_days: int = 120

class DelayPredictionResponse(BaseModel):
    predicted_delay_days: int
    predicted_delay_months: float
    risk_score: int  # 0-100
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    bottleneck_stage: str
    risk_factors: List[str]
    prescriptive_mitigations: List[str]

# --- National Dashboard Metrics ---
class NationalMetricsResponse(BaseModel):
    total_active_projects: int
    total_notified_area_ha: float
    total_cadastral_parcels_tracked: int
    total_compensation_assessed_cr: float
    total_compensation_disbursed_cr: float
    dbt_disbursal_ratio_pct: float
    ulpin_encumbrance_locks_active: int
    average_physical_possession_pct: float
    active_disputes_and_references: int
