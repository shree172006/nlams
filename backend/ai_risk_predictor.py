"""
AI Delay-Risk Prediction Engine for NLAMS
Analyzes statutory stage duration, pending Section 15 objections, title disputes,
R&R settlement lag, and fiscal liabilities to forecast project delivery bottlenecks.
"""

from typing import Dict, Any, List
from .models import Project, DelayRiskAssessment, StageEnum

def calculate_project_delay_risk(project: Project) -> DelayRiskAssessment:
    """
    Evaluates multi-variable risk signals:
    1. Objection Volume & Resolution Velocity (Sec 15/3C)
    2. R&R Entitlements Settlement Lag (2nd Schedule)
    3. Active Court Cases & Contingent Liability Exposure
    4. Statutory Stage Dwell Time & Progression Velocity
    """
    risk_score = 0.0
    risk_factors: List[str] = []
    mitigations: List[str] = []
    
    total_parcels = len(project.parcels) if project.parcels else 1
    total_objs = len(project.objections)
    pending_objs = sum(1 for o in project.objections if o.status == "PENDING")
    hearing_objs = sum(1 for o in project.objections if o.status == "HEARING_SCHEDULED")
    unresolved_objs = pending_objs + hearing_objs

    # 1. Objection Risk (Max 35 pts)
    obj_ratio = unresolved_objs / total_parcels
    if unresolved_objs > 0:
        if obj_ratio > 0.4:
            risk_score += 35.0
            risk_factors.append(f"High dispute volume: {unresolved_objs} of {total_parcels} parcels have pending objections ({round(obj_ratio*100)}%).")
            mitigations.append("Deploy Additional Competent Authority (CALA) benches to fast-track Section 15 public hearings.")
        elif obj_ratio > 0.15:
            risk_score += 20.0
            risk_factors.append(f"Moderate dispute volume: {unresolved_objs} objections pending inquiry.")
            mitigations.append("Issue consolidated notice for joint land measurement and hearing under Section 15(2).")
        else:
            risk_score += 10.0
            risk_factors.append(f"{unresolved_objs} objections pending disposal.")
            mitigations.append("Conclude pending hearings within statutory 60-day window.")
    else:
        mitigations.append("Objection clearance maintained; keep grievance cell operational.")

    # 2. R&R Settlement Risk (Max 30 pts)
    total_rr = len(project.rr_families)
    if total_rr > 0:
        unsettled_rr = sum(1 for f in project.rr_families if f.monetary_entitlements_settled < 11)
        unsettled_ratio = unsettled_rr / total_rr
        if unsettled_ratio > 0.5:
            risk_score += 30.0
            risk_factors.append(f"Severe R&R lag: {unsettled_rr}/{total_rr} displaced/affected families awaiting full 2nd Schedule entitlement settlement.")
            mitigations.append("Convene District R&R Committee under District Collector to expedite 2nd Schedule monetary and housing allotments.")
        elif unsettled_ratio > 0.2:
            risk_score += 15.0
            risk_factors.append(f"{unsettled_rr} families have partial R&R entitlement disbursement.")
            mitigations.append("Complete pending subsistence allowance and vocational training packages for affected families.")
    elif project.current_stage in [StageEnum.REHABILITATION_RESETTLEMENT, StageEnum.POSSESSION_MUTATION]:
        risk_score += 15.0
        risk_factors.append("R&R baseline survey documentation is missing for active possession stage.")
        mitigations.append("Conduct rapid verification of affected project families as per RFCTLARR Section 16.")

    # 3. Court Cases & Legal Liability Risk (Max 25 pts)
    if project.active_court_cases > 0:
        if project.active_court_cases >= 3 or project.contingent_liability_cr > 20.0:
            risk_score += 25.0
            risk_factors.append(f"Litigation exposure: {project.active_court_cases} active High Court / Land Authority references with ₹{project.contingent_liability_cr} Cr contingent liability.")
            mitigations.append("Invoke RFCTLARR Section 77 provisional court deposit to prevent stay on physical possession.")
        else:
            risk_score += 12.0
            risk_factors.append(f"{project.active_court_cases} active court cases under Section 64 reference.")
            mitigations.append("Appoint Government Pleader to file counter-affidavits and expedite reference disposal.")

    # 4. Stage Progression & Possession Gap (Max 10 pts)
    if project.current_stage == StageEnum.POSSESSION_MUTATION and project.physical_possession_pct < 50.0:
        risk_score += 10.0
        risk_factors.append(f"Physical possession gap: Only {project.physical_possession_pct}% possession achieved at final stage.")
        mitigations.append("Coordinate with State Revenue Dept & Police for joint demarcation and peaceful possession under Section 38.")

    # Bound risk score 0 - 100
    risk_score = min(100.0, round(risk_score, 1))

    # Categorize Risk Level and Predicted Delay
    if risk_score >= 70.0:
        risk_level = "CRITICAL"
        predicted_delay_months = round(6.0 + (risk_score - 70.0) * 0.15, 1)
    elif risk_score >= 45.0:
        risk_level = "HIGH"
        predicted_delay_months = round(3.5 + (risk_score - 45.0) * 0.1, 1)
    elif risk_score >= 25.0:
        risk_level = "MEDIUM"
        predicted_delay_months = round(1.5 + (risk_score - 25.0) * 0.1, 1)
    else:
        risk_level = "LOW"
        predicted_delay_months = round(risk_score * 0.05, 1)

    if not risk_factors:
        risk_factors.append("Statutory timeline on track. No severe bottlenecks detected.")

    return DelayRiskAssessment(
        project_id=project.id,
        project_title=project.title,
        risk_score=risk_score,
        risk_level=risk_level,
        predicted_delay_months=predicted_delay_months,
        bottleneck_stage=project.current_stage.value,
        risk_factors=risk_factors,
        prescriptive_mitigations=mitigations
    )
