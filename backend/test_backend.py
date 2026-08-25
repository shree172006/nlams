import pytest
from backend.models import ParcelRecord, LandTypeEnum, StateNomenclature, StageEnum, StatutoryActEnum
from backend.valuation import calculate_parcel_award, get_multiplication_factor
from backend.statutory_workflow import check_stage_transition_eligibility, advance_project_stage
from backend.vikas_ranking import compute_state_vikas_score
from backend.integrations import generate_pfms_dbt_batch
from backend.seed_data import get_initial_seed_projects

def test_multiplication_factors():
    assert get_multiplication_factor(LandTypeEnum.URBAN) == 1.0
    assert get_multiplication_factor(LandTypeEnum.RURAL_CLOSE) == 1.25
    assert get_multiplication_factor(LandTypeEnum.RURAL_MID) == 1.50
    assert get_multiplication_factor(LandTypeEnum.RURAL_REMOTE) == 2.00

def test_statutory_valuation_math():
    # Test case: Rural Remote land parcel
    # Base rate = max(2000, 2500) = 2500
    # Acquired Area = 1000 sqm
    # Base MV = 2,500,000
    # Adjusted MV = 2,500,000 * 2.0 = 5,000,000
    # Assets = 500,000 (structures) + 100,000 (trees) = 600,000
    # Base Compensation C_base = 5,000,000 + 600,000 = 5,600,000
    # Solatium = 100% * 5,600,000 = 5,600,000
    # Additional Amount = 12% * 2,500,000 * (365/365) = 300,000
    # Gross Award = 5,600,000 + 5,600,000 + 300,000 = 11,500,000
    parcel = ParcelRecord(
        ulpin="IN07PB12345678",
        state="Punjab",
        district="Ludhiana",
        taluk_tehsil="Sadar",
        village="Doraha",
        nomenclature_type=StateNomenclature.PUNJAB_HARYANA,
        local_record_no="Khasra 101",
        owner_name="Gurdeep Singh",
        owner_aadhaar_masked="XXXX-XXXX-9901",
        bank_account_verified=True,
        bank_ifsc="SBIN0001423",
        bank_account_no_masked="XXXX1109",
        total_parcel_area_sqm=2000.0,
        acquired_area_sqm=1000.0,
        land_type=LandTypeEnum.RURAL_REMOTE,
        circle_rate_per_sqm=2000.0,
        avg_registered_sale_rate_per_sqm=2500.0,
        ppp_consented_rate_per_sqm=0.0,
        structure_valuation=500000.0,
        tree_valuation=100000.0,
        crop_valuation=0.0
    )
    
    val = calculate_parcel_award(parcel, "2025-01-01", "2026-01-01")
    assert val.base_market_value_per_sqm == 2500.0
    assert val.base_market_value_total == 2500000.0
    assert val.multiplication_factor == 2.0
    assert val.adjusted_market_value == 5000000.0
    assert val.assets_valuation_total == 600000.0
    assert val.base_compensation == 5600000.0
    assert val.solatium_amount == 5600000.0
    assert val.additional_amount_12pct == 300000.0
    assert val.gross_total_award == 11500000.0

def test_stage_gate_precondition_enforcement():
    projects = get_initial_seed_projects()
    p_proposal = [p for p in projects if p.current_stage == StageEnum.PROPOSAL][0]
    
    # Attempting to jump directly to Declaration (Stage 5) from Proposal (Stage 1) must fail
    eligible, reason = check_stage_transition_eligibility(p_proposal, StageEnum.DECLARATION)
    assert not eligible
    assert "Illegal skip" in reason

def test_vikas_scoring_bounds():
    projects = get_initial_seed_projects()
    res = compute_state_vikas_score("Punjab", projects)
    assert 0 <= res.total_score <= 140
    assert 0 <= res.process_velocity_score <= 40
    assert 0 <= res.financial_dbt_score <= 40
    assert 0 <= res.social_rr_score <= 40
    assert 0 <= res.spatial_mutation_score <= 20

def test_pfms_dbt_batch():
    projects = get_initial_seed_projects()
    p = projects[0]
    vals = [calculate_parcel_award(parcel, "2025-01-01", "2026-01-01") for parcel in p.parcels]
    batch = generate_pfms_dbt_batch(p, vals)
    assert "PFMS-DBT-NLAMS" in batch["batch_id"]
    assert "<PFMS_DBT_Batch" in batch["xml_payload"]
    assert batch["total_beneficiaries"] == len(p.parcels)
