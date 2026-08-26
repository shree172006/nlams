"""
NLAMS Statutory Workflow & Valuation Engine
Implements RFCTLARR Act 2013 First Schedule (Sections 26-30) and Sectoral Acts (NH Act 1956).
"""
from datetime import datetime
from typing import Dict, Any, List
from backend.schemas import ValuationRequest, ValuationResponse

# 9 Statutory Workflow Stages under RFCTLARR Act 2013
STATUTORY_STAGES = [
    "1. Proposal Ingestion & Alignment Scrutiny",
    "2. Social Impact Assessment (SIA)",
    "3. Preliminary Notification & Freezing (Sec 11/3A)",
    "4. Objection Management & Inquiry (Sec 15/3C)",
    "5. Declaration of Acquisition (Sec 19/3D)",
    "6. Valuation, Award & Compensation (Sec 23/26-30/3G)",
    "7. Rehabilitation & Resettlement (R&R)",
    "8. Physical Possession & Land Mutation (Sec 38/3E)",
    "9. Dispute & Reference Monitoring (Sec 51-74)"
]

RURAL_MULTIPLIERS = {
    "URBAN": 1.00,
    "RURAL_CLOSE": 1.25,
    "RURAL_MID": 1.50,
    "RURAL_REMOTE": 2.00
}

def calculate_statutory_valuation(req: ValuationRequest) -> ValuationResponse:
    """
    Computes statutory award under RFCTLARR Act 2013 First Schedule:
    1. Baseline Market Value = max(Circle Rate, Avg 3-Yr Deeds, PPP Rate) * Acquired Area
    2. Multiplication Factor = 1.00 (Urban) to 2.00 (Rural)
    3. Adjusted Market Value = Baseline Market Value * Multiplication Factor
    4. Base Compensation = Adjusted Market Value + Assets (Trees + Structures + Crops)
    5. Solatium = 100% of Base Compensation (Sec 30(1))
    6. Additional Amount = 12% p.a. on Market Value from Sec 11 to Award Date (Sec 30(3))
    7. Total Gross Award = Base Compensation + Solatium + Additional Amount
    """
    # 1. Base rate per sq.m determination
    base_rate_per_sqm = max(
        req.circle_rate_per_sqm,
        req.avg_registered_sale_rate_per_sqm,
        req.ppp_consented_rate_per_sqm
    )
    base_market_value_total = round(base_rate_per_sqm * req.acquired_area_sqm, 2)

    # 2. Multiplication Factor
    mult_factor = RURAL_MULTIPLIERS.get(req.land_type.upper(), 1.50)
    adjusted_market_value = round(base_market_value_total * mult_factor, 2)

    # 3. Immovable Assets (Sec 29)
    assets_total = round(req.structure_valuation + req.tree_valuation + req.crop_valuation, 2)

    # 4. Base Compensation
    base_compensation = round(adjusted_market_value + assets_total, 2)

    # 5. Mandatory 100% Solatium (Sec 30(1))
    solatium_amount = round(base_compensation * 1.0, 2)

    # 6. Additional Amount (Sec 30(3) - 12% per annum)
    try:
        d1 = datetime.strptime(req.notification_date, "%Y-%m-%d")
        d2 = datetime.strptime(req.award_date, "%Y-%m-%d")
        days_elapsed = max(0, (d2 - d1).days)
    except Exception:
        days_elapsed = 290

    annual_rate = 0.12
    additional_amount_12pct = round(base_market_value_total * annual_rate * (days_elapsed / 365.0), 2)

    # 7. Total Gross Award
    gross_total_award = round(base_compensation + solatium_amount + additional_amount_12pct, 2)

    return ValuationResponse(
        owner_name=req.owner_name,
        acquired_area_sqm=req.acquired_area_sqm,
        land_type=req.land_type,
        base_market_value_per_sqm=base_rate_per_sqm,
        base_market_value_total=base_market_value_total,
        multiplication_factor=mult_factor,
        adjusted_market_value=adjusted_market_value,
        assets_valuation_total=assets_total,
        base_compensation=base_compensation,
        solatium_amount=solatium_amount,
        additional_amount_12pct=additional_amount_12pct,
        days_elapsed_notif_to_award=days_elapsed,
        gross_total_award=gross_total_award
    )


def advance_project_state(project, db) -> Dict[str, Any]:
    """
    Advances a project to the next statutory stage and executes stage-specific actions:
    - Section 11: Activates encumbrance locks on all parcels in state registry
    - Section 38: Completes title mutation and physical possession
    """
    curr_idx = -1
    for idx, stg in enumerate(STATUTORY_STAGES):
        if project.current_stage.startswith(stg.split('.')[0]):
            curr_idx = idx
            break

    if curr_idx == -1:
        curr_idx = 0

    if curr_idx >= len(STATUTORY_STAGES) - 1:
        return {"advanced": False, "message": "Project is already at final statutory stage (Sec 51-74)"}

    next_stage = STATUTORY_STAGES[curr_idx + 1]
    project.current_stage = next_stage
    project.stage_progress_pct = round(((curr_idx + 2) / len(STATUTORY_STAGES)) * 100, 1)

    # Stage side-effects
    if "Sec 11" in next_stage:
        for parcel in project.parcels:
            parcel.encumbrance_locked = True
            parcel.status = "NOTIFIED"
    elif "Sec 38" in next_stage:
        project.physical_possession_pct = 100.0
        for parcel in project.parcels:
            parcel.encumbrance_locked = False
            parcel.status = "ACQUIRED"

    db.commit()
    db.refresh(project)

    return {
        "advanced": True,
        "new_stage": project.current_stage,
        "progress_pct": project.stage_progress_pct
    }
