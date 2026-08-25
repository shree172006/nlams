"""
First Schedule Valuation Engine
Governed by RFCTLARR Act, 2013 (Sections 26, 27, 28, 29, 30) & NH Act 1956 Section 3G.
"""

from typing import Dict, Any
from datetime import datetime
from .models import ParcelRecord, ValuationBreakdown, LandTypeEnum

def get_multiplication_factor(land_type: LandTypeEnum) -> float:
    """
    Statutory Multiplication Factor (Sec 26(2) of RFCTLARR Act 2013):
    - Urban: 1.0
    - Rural (0-10 km from urban border): 1.25
    - Rural (10-20 km from urban border): 1.50
    - Rural (Remote > 20 km): 2.00
    """
    if land_type == LandTypeEnum.URBAN:
        return 1.0
    elif land_type == LandTypeEnum.RURAL_CLOSE:
        return 1.25
    elif land_type == LandTypeEnum.RURAL_MID:
        return 1.50
    elif land_type == LandTypeEnum.RURAL_REMOTE:
        return 2.00
    return 1.0

def calculate_parcel_award(
    parcel: ParcelRecord,
    sec11_notification_date_str: str,
    award_date_str: str
) -> ValuationBreakdown:
    """
    Calculates statutory compensation for an acquired land parcel.
    Formula:
    1. Baseline Unit Rate = Max(Circle Rate, Avg Registered Sale Deeds Top 50% 3-yr, PPP Consented)
    2. Base Market Value = Baseline Unit Rate * Acquired Area (sq.m)
    3. Adjusted Market Value = Base Market Value * Multiplication Factor
    4. Assets = Structures + Trees + Standing Crops
    5. Base Compensation (C_base) = Adjusted Market Value + Assets
    6. Solatium (Sec 30(1)) = 100% * C_base
    7. Additional Amount (Sec 30(3)) = 12% * Base Market Value * (Days / 365)
    8. Gross Total Compensation = C_base + Solatium + Additional Amount
    """
    # 1. Baseline Unit Market Value (Sec 26)
    candidates = [
        ("Stamp Act Circle Rate", parcel.circle_rate_per_sqm),
        ("Average Registered Sale Deeds (Top 50% 3-Year)", parcel.avg_registered_sale_rate_per_sqm),
    ]
    if parcel.ppp_consented_rate_per_sqm and parcel.ppp_consented_rate_per_sqm > 0:
        candidates.append(("PPP Consented Agreed Rate", parcel.ppp_consented_rate_per_sqm))
    
    selected_rule, base_rate_per_sqm = max(candidates, key=lambda x: x[1])
    
    # 2. Base Market Value
    base_mv_total = base_rate_per_sqm * parcel.acquired_area_sqm
    
    # 3. Multiplication Factor (Sec 26(2))
    mf = get_multiplication_factor(parcel.land_type)
    adjusted_mv = base_mv_total * mf
    
    # 4. Attached Assets Valuation (Sec 29)
    assets_total = parcel.structure_valuation + parcel.tree_valuation + parcel.crop_valuation
    
    # 5. Base Compensation
    base_compensation = adjusted_mv + assets_total
    
    # 6. Solatium (Sec 30(1) - 100%)
    solatium = base_compensation * 1.0
    
    # 7. Additional Amount (Sec 30(3) - 12% per annum)
    try:
        d_notif = datetime.strptime(sec11_notification_date_str, "%Y-%m-%d")
        d_award = datetime.strptime(award_date_str, "%Y-%m-%d")
        days_elapsed = max(0, (d_award - d_notif).days)
    except Exception:
        days_elapsed = 180  # Default 6 months if dates missing
        
    additional_amount_12pct = (0.12 * base_mv_total) * (days_elapsed / 365.0)
    
    # 8. Gross Compensation
    gross_total = base_compensation + solatium + additional_amount_12pct

    return ValuationBreakdown(
        ulpin=parcel.ulpin,
        owner_name=parcel.owner_name,
        acquired_area_sqm=parcel.acquired_area_sqm,
        base_market_value_per_sqm=round(base_rate_per_sqm, 2),
        base_market_value_total=round(base_mv_total, 2),
        multiplication_factor=mf,
        adjusted_market_value=round(adjusted_mv, 2),
        assets_valuation_total=round(assets_total, 2),
        base_compensation=round(base_compensation, 2),
        solatium_amount=round(solatium, 2),
        days_elapsed_notif_to_award=days_elapsed,
        additional_amount_12pct=round(additional_amount_12pct, 2),
        gross_total_award=round(gross_total, 2),
        calculation_formula_audit={
            "selected_rate_criterion": selected_rule,
            "statutory_sections": "RFCTLARR Act 2013 Sec 26, 29, 30(1), 30(3)",
            "solatium_percentage": "100%",
            "additional_amount_rate": "12% p.a. from Sec 11 notification date",
            "rural_multiplication_factor_applied": mf
        }
    )
