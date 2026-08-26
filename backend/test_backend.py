"""
NLAMS Backend Statutory & Unit Tests
Verifies RFCTLARR First Schedule math, state machine transitions, and AI risk predictor.
"""
import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.statutory_engine import calculate_statutory_valuation
from backend.schemas import ValuationRequest, DelayPredictionRequest
from backend.ml_delay_predictor import predict_project_delay

client = TestClient(app)

def test_statutory_first_schedule_math():
    """Verifies statutory compensation formula under RFCTLARR Act 2013 First Schedule."""
    req = ValuationRequest(
        owner_name="Shri Ramcharan Yadav",
        acquired_area_sqm=3500.0,
        land_type="RURAL_REMOTE",  # 2.0x
        circle_rate_per_sqm=1850.0,
        avg_registered_sale_rate_per_sqm=2400.0,
        ppp_consented_rate_per_sqm=0.0,
        structure_valuation=350000.0,
        tree_valuation=45000.0,
        crop_valuation=25000.0,
        notification_date="2025-05-15",
        award_date="2026-03-01"
    )
    val = calculate_statutory_valuation(req)

    # 1. Base rate = max(1850, 2400, 0) = 2400
    assert val.base_market_value_per_sqm == 2400.0
    # 2. Base market value = 2400 * 3500 = 8,400,000
    assert val.base_market_value_total == 8400000.0
    # 3. Multiplication factor = 2.0
    assert val.multiplication_factor == 2.0
    # 4. Adjusted MV = 8,400,000 * 2.0 = 16,800,000
    assert val.adjusted_market_value == 16800000.0
    # 5. Assets = 350,000 + 45,000 + 25,000 = 420,000
    assert val.assets_valuation_total == 420000.0
    # 6. Base compensation = 16,800,000 + 420,000 = 17,220,000
    assert val.base_compensation == 17220000.0
    # 7. Solatium = 100% = 17,220,000
    assert val.solatium_amount == 17220000.0
    # 8. Additional amount > 0
    assert val.additional_amount_12pct > 0.0
    # 9. Gross award = 17,220,000 + 17,220,000 + additional amount
    assert val.gross_total_award == round(val.base_compensation + val.solatium_amount + val.additional_amount_12pct, 2)


def test_national_metrics_api():
    res = client.get("/api/national-metrics")
    assert res.status_code == 200
    data = res.json()
    assert data["total_active_projects"] >= 4
    assert data["total_cadastral_parcels_tracked"] >= 4


def test_projects_list_and_details():
    res = client.get("/api/projects")
    assert res.status_code == 200
    projects = res.json()
    assert len(projects) >= 4
    prj_id = projects[0]["id"]

    res_single = client.get(f"/api/projects/{prj_id}")
    assert res_single.status_code == 200
    assert res_single.json()["id"] == prj_id


def test_ai_delay_predictor_endpoint():
    payload = {
        "area_ha": 350.0,
        "num_parcels": 120,
        "disputed_parcels_count": 18,
        "multiplication_factor": 1.5,
        "forest_overlap_flag": 1,
        "dwell_time_days": 140
    }
    res = client.post("/api/predict-delay", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "predicted_delay_days" in data
    assert "risk_score" in data
    assert "risk_level" in data
    assert len(data["prescriptive_mitigations"]) > 0


def test_citizen_lookup_search():
    res = client.get("/api/citizen-lookup?query=Ramcharan")
    assert res.status_code == 200
    records = res.json()
    assert len(records) > 0
    assert "Ramcharan" in records[0]["parcel"]["owner_name"]


def test_objections_lifecycle():
    # 1. File an objection
    res_file = client.post("/api/projects/PRJ-NHAI-2026-UP01/objections?claimant_name=TestClaimant&contact_phone=9999988888&ulpin=IN09UP23456701&grounds_category=Inadequate%20Valuation&objection_details=TestDetails")
    assert res_file.status_code == 200
    obj_id = res_file.json()["objection_id"]

    # 2. Schedule hearing
    res_sched = client.post(f"/api/projects/PRJ-NHAI-2026-UP01/objections/{obj_id}/schedule-hearing?hearing_date=2026-04-10")
    assert res_sched.status_code == 200
    assert res_sched.json()["objection"]["status"] == "HEARING_SCHEDULED"

    # 3. Dispose objection
    res_disp = client.post(f"/api/projects/PRJ-NHAI-2026-UP01/objections/{obj_id}/dispose?status=DISPOSED_UPHELD&reasoned_order_summary=AwardAdjusted")
    assert res_disp.status_code == 200
    assert res_disp.json()["status"] == "DISPOSED_UPHELD"
