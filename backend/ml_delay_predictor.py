"""
NLAMS AI Delay-Risk Predictor
Uses Scikit-Learn Random Forest Regression & Classification to forecast land acquisition delays.
"""
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, Any, List
from backend.schemas import DelayPredictionRequest, DelayPredictionResponse

# Initialize and train inline Random Forest on representative Indian infrastructure dataset
def _build_and_train_model():
    """
    Features:
    [area_ha, num_parcels, disputed_count, rural_multiplier, forest_overlap, dwell_days]
    Target:
    delay_days
    """
    X_train = np.array([
        [50.0,  15,  0, 1.0, 0,  30],  # Smooth urban bypass -> 15 days delay
        [120.0, 45,  2, 1.25, 0, 60],  # Minor rural delay -> 45 days delay
        [280.0, 95,  8, 1.5, 0,  110], # Moderate rural -> 120 days delay
        [450.0, 160, 22, 1.5, 1, 180], # Forest overlap + disputes -> 240 days delay
        [600.0, 240, 45, 2.0, 1, 270], # High dispute remote corridor -> 390 days delay
        [80.0,  25,  1, 1.0, 0,  40],  # Quick express entry -> 25 days delay
        [320.0, 110, 14, 1.5, 0, 140], # Standard state highway -> 150 days delay
        [510.0, 200, 35, 2.0, 0, 220], # Large highway package -> 310 days delay
        [190.0, 60,  5, 1.25, 1, 90],  # Wildlife sanctuary border -> 160 days delay
        [390.0, 140, 18, 1.5, 0, 160]  # Freight corridor rail -> 210 days delay
    ])
    y_train = np.array([15, 45, 120, 240, 390, 25, 150, 310, 160, 210])

    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)
    return model

_MODEL = _build_and_train_model()

def predict_project_delay(req: DelayPredictionRequest) -> DelayPredictionResponse:
    """
    Runs ML inference on project parameters to predict delay slip in days, months, and risk score.
    """
    X_input = np.array([[
        req.area_ha,
        req.num_parcels,
        req.disputed_parcels_count,
        req.multiplication_factor,
        req.forest_overlap_flag,
        req.dwell_time_days
    ]])

    predicted_days = int(max(5, round(_MODEL.predict(X_input)[0])))
    predicted_months = round(predicted_days / 30.0, 1)

    # Risk score calculation (0 to 100)
    risk_score = min(100, int(
        (req.disputed_parcels_count / max(1, req.num_parcels)) * 40 +
        (req.forest_overlap_flag * 25) +
        min(35, (req.dwell_time_days / 180.0) * 35)
    ))

    if risk_score >= 75 or predicted_days > 270:
        risk_level = "CRITICAL"
        bottleneck = "4. Objection Management & Inquiry (Sec 15/3C)"
    elif risk_score >= 50 or predicted_days > 150:
        risk_level = "HIGH"
        bottleneck = "6. Valuation, Award & Compensation (Sec 23/3G)"
    elif risk_score >= 25 or predicted_days > 60:
        risk_level = "MEDIUM"
        bottleneck = "7. Rehabilitation & Resettlement (R&R)"
    else:
        risk_level = "LOW"
        bottleneck = "8. Physical Possession & Land Mutation (Sec 38/3E)"

    # Identify primary risk factors
    risk_factors: List[str] = []
    if req.disputed_parcels_count > 0:
        dispute_pct = round((req.disputed_parcels_count / max(1, req.num_parcels)) * 100, 1)
        risk_factors.append(f"{req.disputed_parcels_count} parcels ({dispute_pct}%) have active Section 15 objections pending inquiry.")
    if req.forest_overlap_flag == 1:
        risk_factors.append("Forest / Restricted Zone overlap detected requiring Stage-II Forest Clearance.")
    if req.dwell_time_days > 90:
        risk_factors.append(f"Stage dwell time ({req.dwell_time_days} days) exceeds the 90-day statutory threshold.")
    if not risk_factors:
        risk_factors.append("All baseline legal clearances and statutory inquiry schedules on track.")

    # Prescriptive AI mitigations
    mitigations: List[str] = []
    if req.disputed_parcels_count > 0:
        mitigations.append("Deploy Special CALA Lok Adalat Bench to accelerate Section 15 valuation conciliations.")
    if req.forest_overlap_flag == 1:
        mitigations.append("Escalate Parivesh portal alignment clearance with MoEFCC Regional Office.")
    if req.dwell_time_days > 90:
        mitigations.append("Issue Section 77 Escrow court deposit to secure possession without stalling corridor construction.")
    if not mitigations:
        mitigations.append("Maintain active PFMS DBT disbursal schedule and initiate automated RoR mutations.")

    return DelayPredictionResponse(
        predicted_delay_days=predicted_days,
        predicted_delay_months=predicted_months,
        risk_score=risk_score,
        risk_level=risk_level,
        bottleneck_stage=bottleneck,
        risk_factors=risk_factors,
        prescriptive_mitigations=mitigations
    )
