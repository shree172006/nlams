"""
140-Point Vikas Performance Ranking Framework
Under Department of Land Resources (DoLR) guidelines for State and District ranking.
"""

from typing import List, Dict, Any
from .models import Project, VikasScoreResult

def compute_state_vikas_score(state_name: str, projects: List[Project]) -> VikasScoreResult:
    """
    Computes real-time Vikas index score (out of 140 points) with automated penalties.
    """
    state_projects = [p for p in projects if p.state.lower() == state_name.lower()]
    
    if not state_projects:
        # Default baseline if no projects in state
        return VikasScoreResult(
            state=state_name,
            total_score=95.0,
            process_velocity_score=28.0,
            financial_dbt_score=26.0,
            social_rr_score=25.0,
            spatial_mutation_score=16.0,
            penalties_deducted=0.0,
            breakdown_details={"note": "Baseline reference performance"}
        )

    # 1. Process Velocity Score (Max 40 points)
    # Evaluates lifecycle velocity and stage completions
    avg_progress = sum(p.stage_progress_pct for p in state_projects) / len(state_projects)
    velocity_score = min(40.0, max(5.0, (avg_progress / 100.0) * 40.0))
    
    # 2. Financial & PFMS DBT Efficiency (Max 40 points)
    total_assessed = sum(p.total_compensation_assessed_cr for p in state_projects)
    total_disbursed = sum(p.total_compensation_disbursed_cr for p in state_projects)
    if total_assessed > 0:
        dbt_ratio = total_disbursed / total_assessed
        financial_score = min(40.0, max(0.0, dbt_ratio * 40.0))
    else:
        financial_score = 30.0

    # 3. Social Safeguards & R&R Delivery (Max 40 points)
    # Checks R&R progress across affected families
    total_families = sum(len(p.rr_families) for p in state_projects)
    if total_families > 0:
        settled_entitlements = sum(sum(f.monetary_entitlements_settled for f in p.rr_families) for p in state_projects)
        max_possible = total_families * 11.0
        rr_ratio = settled_entitlements / max_possible if max_possible > 0 else 1.0
        social_score = min(40.0, max(0.0, rr_ratio * 40.0))
    else:
        social_score = 34.0

    # 4. Spatial Compliance & Mutation Velocity (Max 20 points)
    total_parcels = sum(len(p.parcels) for p in state_projects)
    locked_parcels = sum(sum(1 for parcel in p.parcels if parcel.encumbrance_locked) for p in state_projects)
    spatial_ratio = (locked_parcels / total_parcels) if total_parcels > 0 else 0.8
    mutation_avg = sum(p.mutation_completed_pct for p in state_projects) / len(state_projects)
    spatial_score = min(20.0, ((spatial_ratio * 0.5) + ((mutation_avg / 100.0) * 0.5)) * 20.0)

    # 5. Automated Negative Marking Penalties
    penalties = 0.0
    active_disputes = sum(p.active_court_cases for p in state_projects)
    if active_disputes > 0:
        penalties += min(15.0, active_disputes * 2.5)  # 2.5 pts deducted per active court reference

    raw_total = velocity_score + financial_score + social_score + spatial_score - penalties
    final_total = max(0.0, min(140.0, round(raw_total, 1)))

    return VikasScoreResult(
        state=state_name,
        total_score=final_total,
        process_velocity_score=round(velocity_score, 1),
        financial_dbt_score=round(financial_score, 1),
        social_rr_score=round(social_score, 1),
        spatial_mutation_score=round(spatial_score, 1),
        penalties_deducted=round(penalties, 1),
        breakdown_details={
            "total_active_projects": len(state_projects),
            "total_parcels_tracked": total_parcels,
            "dbt_disbursal_ratio_pct": round((total_disbursed / total_assessed * 100.0) if total_assessed > 0 else 0.0, 1),
            "average_mutation_completion_pct": round(mutation_avg, 1),
            "active_litigation_cases": active_disputes
        }
    )

def rank_all_states(projects: List[Project]) -> List[VikasScoreResult]:
    """
    Ranks all Indian states based on their 140-point Vikas score.
    """
    all_states = [
        "Uttar Pradesh", "Maharashtra", "Gujarat", "Karnataka", 
        "Tamil Nadu", "Haryana", "Madhya Pradesh", "Punjab", "Rajasthan", "Bihar"
    ]
    scores = [compute_state_vikas_score(st, projects) for st in all_states]
    scores.sort(key=lambda s: s.total_score, reverse=True)
    return scores
