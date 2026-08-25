"""
NLAMS - National Land Acquisition & Management System Core Backend API
Ministry of Rural Development / Department of Land Resources (DoLR)
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from .models import (
    Project, ParcelRecord, ObjectionRecord, ValuationBreakdown,
    VikasScoreResult, StageEnum, StatutoryActEnum, LandTypeEnum, StateNomenclature
)
from .valuation import calculate_parcel_award, get_multiplication_factor
from .statutory_workflow import advance_project_stage, check_stage_transition_eligibility
from .spatial_cadastral import mock_intersect_alignment_corridor, generate_ulpin
from .vikas_ranking import rank_all_states, compute_state_vikas_score
from .integrations import (
    generate_egazette_bilingual_notice, generate_pfms_dbt_batch, simulate_state_registry_mutation
)
from .seed_data import get_initial_seed_projects

app = FastAPI(
    title="National Land Acquisition & Management System (NLAMS) API",
    description="Enterprise statutory microservice backend conforming to RFCTLARR Act 2013 & NH Act 1956.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory repository seeded with realistic data
PROJECTS_DB: Dict[str, Project] = {p.id: p for p in get_initial_seed_projects()}

@app.get("/")
def root():
    return {
        "system": "National Land Acquisition & Management System (NLAMS)",
        "nodal_authority": "Department of Land Resources (DoLR), MoRD, Govt. of India",
        "statutory_framework": "RFCTLARR Act 2013 / NH Act 1956 / Railways Act 1989",
        "status": "OPERATIONAL",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/national-metrics")
def get_national_metrics():
    projects = list(PROJECTS_DB.values())
    total_projects = len(projects)
    total_corridor_ha = sum(p.total_corridor_area_ha for p in projects)
    total_parcels = sum(len(p.parcels) for p in projects)
    total_assessed_cr = sum(p.total_compensation_assessed_cr for p in projects)
    total_disbursed_cr = sum(p.total_compensation_disbursed_cr for p in projects)
    total_court_cases = sum(p.active_court_cases for p in projects)
    total_contingent_liability_cr = sum(p.contingent_liability_cr for p in projects)
    
    # Average physical possession
    avg_possession = sum(p.physical_possession_pct for p in projects) / total_projects if total_projects else 0.0

    return {
        "total_active_projects": total_projects,
        "total_notified_area_ha": round(total_corridor_ha, 2),
        "total_cadastral_parcels_tracked": total_parcels,
        "total_compensation_assessed_cr": round(total_assessed_cr, 2),
        "total_compensation_disbursed_cr": round(total_disbursed_cr, 2),
        "dbt_disbursal_ratio_pct": round((total_disbursed_cr / total_assessed_cr * 100.0) if total_assessed_cr > 0 else 0.0, 1),
        "average_physical_possession_pct": round(avg_possession, 1),
        "active_disputes_and_references": total_court_cases,
        "contingent_liability_cr": round(total_contingent_liability_cr, 2),
        "ulpin_encumbrance_locks_active": sum(sum(1 for parcel in p.parcels if parcel.encumbrance_locked) for p in projects)
    }

@app.get("/api/projects", response_model=List[Project])
def list_projects(state: Optional[str] = None, sector: Optional[str] = None):
    results = list(PROJECTS_DB.values())
    if state:
        results = [p for p in results if p.state.lower() == state.lower()]
    if sector:
        results = [p for p in results if p.sector.lower() == sector.lower()]
    return results

@app.get("/api/projects/{project_id}", response_model=Project)
def get_project(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    return PROJECTS_DB[project_id]

@app.post("/api/projects/propose")
def propose_new_project(
    title: str,
    acquiring_agency: str,
    sector: str,
    statutory_act: StatutoryActEnum,
    state: str,
    district: str,
    village: str,
    corridor_length_km: float,
    corridor_area_ha: float
):
    project_id = f"PRJ-{acquiring_agency[:4].upper()}-{str(uuid.uuid4())[:4].upper()}"
    parcels = mock_intersect_alignment_corridor(title, state, district, village, corridor_length_km)
    
    new_project = Project(
        id=project_id,
        title=title,
        acquiring_agency=acquiring_agency,
        sector=sector,
        statutory_act=statutory_act,
        state=state,
        districts=[district],
        current_stage=StageEnum.PROPOSAL,
        stage_progress_pct=11.1,
        total_length_km=corridor_length_km,
        total_corridor_area_ha=corridor_area_ha,
        parcels=parcels,
        created_at=datetime.now().strftime("%Y-%m-%d")
    )
    PROJECTS_DB[project_id] = new_project
    return {"message": "Project proposal and spatial corridor ingested successfully", "project": new_project}

@app.post("/api/projects/{project_id}/advance-stage")
def advance_stage_endpoint(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = PROJECTS_DB[project_id]
    success, msg, updated_project = advance_project_stage(project)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
        
    PROJECTS_DB[project_id] = updated_project
    return {"success": True, "message": msg, "project": updated_project}

@app.get("/api/projects/{project_id}/valuations", response_model=List[ValuationBreakdown])
def get_project_valuations(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = PROJECTS_DB[project_id]
    notif_dt = project.sec11_notification_date or "2025-10-01"
    award_dt = project.award_date or datetime.now().strftime("%Y-%m-%d")
    
    valuations = [calculate_parcel_award(p, notif_dt, award_dt) for p in project.parcels]
    return valuations

@app.post("/api/calculate-single-valuation")
def calculate_custom_valuation(
    owner_name: str = "Test Landholder",
    acquired_area_sqm: float = 2500.0,
    land_type: LandTypeEnum = LandTypeEnum.RURAL_MID,
    circle_rate_per_sqm: float = 1800.0,
    avg_registered_sale_rate_per_sqm: float = 2400.0,
    ppp_consented_rate_per_sqm: float = 0.0,
    structure_valuation: float = 250000.0,
    tree_valuation: float = 45000.0,
    crop_valuation: float = 20000.0,
    notification_date: str = "2025-06-01",
    award_date: str = "2026-03-01"
):
    dummy_parcel = ParcelRecord(
        ulpin="IN07DH99812401",
        state="Sample State",
        district="Sample District",
        taluk_tehsil="Tehsil 1",
        village="Sample Village",
        nomenclature_type=StateNomenclature.UP_MP_DELHI,
        local_record_no="Khasra No. 123/1",
        owner_name=owner_name,
        owner_aadhaar_masked="XXXX-XXXX-1234",
        bank_account_verified=True,
        bank_ifsc="SBIN0001000",
        bank_account_no_masked="XXXX9876",
        total_parcel_area_sqm=acquired_area_sqm * 1.5,
        acquired_area_sqm=acquired_area_sqm,
        land_type=land_type,
        circle_rate_per_sqm=circle_rate_per_sqm,
        avg_registered_sale_rate_per_sqm=avg_registered_sale_rate_per_sqm,
        ppp_consented_rate_per_sqm=ppp_consented_rate_per_sqm,
        structure_valuation=structure_valuation,
        tree_valuation=tree_valuation,
        crop_valuation=crop_valuation
    )
    return calculate_parcel_award(dummy_parcel, notification_date, award_date)

@app.post("/api/projects/{project_id}/objections")
def file_objection(
    project_id: str,
    ulpin: str,
    claimant_name: str,
    contact_phone: str,
    grounds_category: str,
    objection_details: str
):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = PROJECTS_DB[project_id]
    obj_id = f"OBJ-{datetime.now().strftime('%Y')}-{str(uuid.uuid4())[:4].upper()}"
    new_obj = ObjectionRecord(
        id=obj_id,
        project_id=project_id,
        ulpin=ulpin,
        claimant_name=claimant_name,
        contact_phone=contact_phone,
        grounds_category=grounds_category,
        objection_details=objection_details,
        filing_date=datetime.now().strftime("%Y-%m-%d"),
        cala_jurisdiction=f"CALA Office, {project.state}",
        status="PENDING"
    )
    project.objections.append(new_obj)
    return {"message": "Section 15 objection filed successfully", "objection": new_obj}

@app.post("/api/projects/{project_id}/objections/{obj_id}/dispose")
def dispose_objection(
    project_id: str,
    obj_id: str,
    status: str,  # DISPOSED_UPHELD or DISPOSED_REJECTED
    reasoned_order_summary: str
):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = PROJECTS_DB[project_id]
    obj = next((o for o in project.objections if o.id == obj_id), None)
    if not obj:
        raise HTTPException(status_code=404, detail="Objection record not found")
        
    obj.status = status
    obj.reasoned_order_summary = reasoned_order_summary
    obj.disposal_timestamp = datetime.now().isoformat()
    return {"message": "Quasi-judicial disposal order recorded", "objection": obj}

@app.post("/api/projects/{project_id}/generate-egazette")
def generate_egazette_endpoint(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    project = PROJECTS_DB[project_id]
    return generate_egazette_bilingual_notice(project)

@app.post("/api/projects/{project_id}/disburse-pfms-dbt")
def disburse_dbt_endpoint(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    project = PROJECTS_DB[project_id]
    notif_dt = project.sec11_notification_date or "2025-10-01"
    award_dt = project.award_date or datetime.now().strftime("%Y-%m-%d")
    valuations = [calculate_parcel_award(p, notif_dt, award_dt) for p in project.parcels]
    
    dbt_result = generate_pfms_dbt_batch(project, valuations)
    # Update project financials
    project.total_compensation_assessed_cr = dbt_result["total_amount_cr"]
    project.total_compensation_disbursed_cr = dbt_result["total_amount_cr"]
    project.pfs_dbt_batch_id = dbt_result["batch_id"]
    
    return dbt_result

@app.post("/api/projects/{project_id}/trigger-mutation")
def trigger_mutation_endpoint(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    project = PROJECTS_DB[project_id]
    result = simulate_state_registry_mutation(project)
    project.mutation_completed_pct = 100.0
    project.physical_possession_pct = 100.0
    return result

@app.get("/api/vikas-rankings", response_model=List[VikasScoreResult])
def get_vikas_rankings():
    projects = list(PROJECTS_DB.values())
    return rank_all_states(projects)

@app.get("/api/citizen-lookup")
def citizen_lookup(query: str = Query(..., description="ULPIN, Khasra/Survey No, or Owner Name")):
    q = query.lower().strip()
    matched_results = []
    
    for p in PROJECTS_DB.values():
        for parcel in p.parcels:
            if (q in parcel.ulpin.lower() or 
                q in parcel.local_record_no.lower() or 
                q in parcel.owner_name.lower()):
                
                # compute valuation
                val = calculate_parcel_award(parcel, p.sec11_notification_date or "2025-10-01", p.award_date or datetime.now().strftime("%Y-%m-%d"))
                matched_results.append({
                    "project_id": p.id,
                    "project_title": p.title,
                    "current_stage": p.current_stage,
                    "parcel": parcel,
                    "valuation_estimate": val,
                    "encumbrance_status": "LOCKED - ACQUISITION IN PROGRESS" if parcel.encumbrance_locked else "FREE / NOT LOCKED",
                    "sec11_gazette_id": p.sec11_gazette_id
                })
    return matched_results
