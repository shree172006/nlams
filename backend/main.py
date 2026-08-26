"""
NLAMS - National Land Acquisition & Management System
Main FastAPI Application Server
"""
import uuid
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.database import engine, Base, get_db
from backend.models import Project, Parcel, Objection, Award, RRFamily
from backend.schemas import (
    ProjectResponse, ParcelResponse, ObjectionCreate, ObjectionResponse,
    ValuationRequest, ValuationResponse, DelayPredictionRequest, DelayPredictionResponse,
    NationalMetricsResponse, RRTrackingSummary, RRFamilyResponse
)
from backend.statutory_engine import calculate_statutory_valuation, advance_project_state
from backend.ml_delay_predictor import predict_project_delay
from backend.seed_data import seed_database

# Initialize database schema and dummy seed data
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="National Land Acquisition & Management System (NLAMS)",
    description="Department of Land Resources (DoLR) • Production-ready REST API for Land Acquisition",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "system": "National Land Acquisition & Management System (NLAMS)",
        "department": "Department of Land Resources (DoLR), Ministry of Rural Development",
        "statutory_framework": "RFCTLARR Act, 2013 & Sectoral Acts",
        "docs_url": "/docs"
    }


# ================= 1. NATIONAL DASHBOARD METRICS =================
@app.get("/api/national-metrics", response_model=NationalMetricsResponse)
def get_national_metrics(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    parcels = db.query(Parcel).all()
    objections = db.query(Objection).filter(Objection.status.in_(["PENDING", "HEARING_SCHEDULED"])).all()

    total_area = sum(p.total_corridor_area_ha for p in projects)
    total_assessed = sum(p.total_compensation_assessed_cr for p in projects)
    total_disbursed = sum(p.total_compensation_disbursed_cr for p in projects)
    locked_parcels = sum(1 for pr in parcels if pr.encumbrance_locked)
    avg_possession = sum(p.physical_possession_pct for p in projects) / max(1, len(projects))
    dbt_ratio = round((total_disbursed / max(0.1, total_assessed)) * 100, 1)

    return NationalMetricsResponse(
        total_active_projects=len(projects),
        total_notified_area_ha=round(total_area, 1),
        total_cadastral_parcels_tracked=len(parcels),
        total_compensation_assessed_cr=round(total_assessed, 1),
        total_compensation_disbursed_cr=round(total_disbursed, 1),
        dbt_disbursal_ratio_pct=dbt_ratio,
        ulpin_encumbrance_locks_active=locked_parcels,
        average_physical_possession_pct=round(avg_possession, 1),
        active_disputes_and_references=len(objections)
    )


# ================= 2. PROJECT CORRIDORS =================
@app.get("/api/projects", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


@app.get("/api/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    prj = db.query(Project).filter(Project.id == project_id).first()
    if not prj:
        raise HTTPException(status_code=404, detail="Project corridor not found")
    return prj


@app.post("/api/projects/{project_id}/advance-stage")
def advance_stage(project_id: str, db: Session = Depends(get_db)):
    prj = db.query(Project).filter(Project.id == project_id).first()
    if not prj:
        raise HTTPException(status_code=404, detail="Project not found")

    result = advance_project_state(prj, db)
    return {
        "status": "success" if result["advanced"] else "noop",
        "detail": result.get("message", f"Advanced to {prj.current_stage}"),
        "project": prj
    }


# ================= 3. STATUTORY VALUATION CALCULATOR =================
@app.post("/api/calculate-valuation", response_model=ValuationResponse)
@app.post("/api/calculate-single-valuation", response_model=ValuationResponse)
def calculate_valuation(
    owner_name: str = Query("Shri Ramcharan Yadav"),
    acquired_area_sqm: float = Query(3500.0),
    land_type: str = Query("RURAL_REMOTE"),
    circle_rate_per_sqm: float = Query(1850.0),
    avg_registered_sale_rate_per_sqm: float = Query(2400.0),
    ppp_consented_rate_per_sqm: float = Query(0.0),
    structure_valuation: float = Query(350000.0),
    tree_valuation: float = Query(45000.0),
    crop_valuation: float = Query(25000.0),
    notification_date: str = Query("2025-05-15"),
    award_date: str = Query("2026-03-01")
):
    req = ValuationRequest(
        owner_name=owner_name,
        acquired_area_sqm=acquired_area_sqm,
        land_type=land_type,
        circle_rate_per_sqm=circle_rate_per_sqm,
        avg_registered_sale_rate_per_sqm=avg_registered_sale_rate_per_sqm,
        ppp_consented_rate_per_sqm=ppp_consented_rate_per_sqm,
        structure_valuation=structure_valuation,
        tree_valuation=tree_valuation,
        crop_valuation=crop_valuation,
        notification_date=notification_date,
        award_date=award_date
    )
    return calculate_statutory_valuation(req)


# ================= 4. AI DELAY-RISK PREDICTOR =================
@app.post("/api/predict-delay", response_model=DelayPredictionResponse)
def predict_delay_endpoint(req: DelayPredictionRequest):
    return predict_project_delay(req)


@app.get("/api/projects/{project_id}/delay-risk")
def get_project_delay_risk(project_id: str, db: Session = Depends(get_db)):
    prj = db.query(Project).filter(Project.id == project_id).first()
    if not prj:
        raise HTTPException(status_code=404, detail="Project not found")

    disputed = db.query(Objection).filter(
        Objection.project_id == project_id,
        Objection.status.in_(["PENDING", "HEARING_SCHEDULED"])
    ).count()

    req = DelayPredictionRequest(
        area_ha=prj.total_corridor_area_ha,
        num_parcels=max(1, len(prj.parcels)),
        disputed_parcels_count=disputed,
        multiplication_factor=1.5,
        forest_overlap_flag=1 if "Forest" in prj.title or "Varanasi" in prj.district else 0,
        dwell_time_days=110
    )
    pred = predict_project_delay(req)

    return {
        "project_id": prj.id,
        "project_title": prj.title,
        "predicted_delay_days": pred.predicted_delay_days,
        "predicted_delay_months": pred.predicted_delay_months,
        "risk_score": pred.risk_score,
        "risk_level": pred.risk_level,
        "bottleneck_stage": pred.bottleneck_stage,
        "risk_factors": pred.risk_factors,
        "prescriptive_mitigations": pred.prescriptive_mitigations
    }


@app.get("/api/delay-risks")
def list_all_delay_risks(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    results = []
    for prj in projects:
        disputed = db.query(Objection).filter(
            Objection.project_id == prj.id,
            Objection.status.in_(["PENDING", "HEARING_SCHEDULED"])
        ).count()

        req = DelayPredictionRequest(
            area_ha=prj.total_corridor_area_ha,
            num_parcels=max(1, len(prj.parcels)),
            disputed_parcels_count=disputed,
            multiplication_factor=1.5,
            forest_overlap_flag=1 if "Forest" in prj.title or "Varanasi" in prj.district else 0,
            dwell_time_days=95
        )
        pred = predict_project_delay(req)
        results.append({
            "project_id": prj.id,
            "project_title": prj.title,
            "predicted_delay_months": pred.predicted_delay_months,
            "risk_score": pred.risk_score,
            "risk_level": pred.risk_level,
            "bottleneck_stage": pred.bottleneck_stage
        })
    return results


# ================= 5. CITIZEN & LANDOWNER PORTAL =================
@app.get("/api/citizen-lookup")
def citizen_lookup(query: str, db: Session = Depends(get_db)):
    """Search land records by 14-digit ULPIN, Khasra/Survey No, or Landowner Name."""
    query_str = f"%{query.strip()}%"
    parcels = db.query(Parcel).filter(
        (Parcel.ulpin.ilike(query_str)) |
        (Parcel.local_record_no.ilike(query_str)) |
        (Parcel.owner_name.ilike(query_str))
    ).all()

    results = []
    for pr in parcels:
        prj = db.query(Project).filter(Project.id == pr.project_id).first()
        val_req = ValuationRequest(
            owner_name=pr.owner_name,
            acquired_area_sqm=pr.acquired_area_sqm,
            land_type=pr.land_type,
            circle_rate_per_sqm=pr.circle_rate_per_sqm,
            avg_registered_sale_rate_per_sqm=pr.avg_registered_sale_rate_per_sqm
        )
        val = calculate_statutory_valuation(val_req)

        results.append({
            "parcel": pr,
            "project_title": prj.title if prj else "Highway Corridor",
            "current_stage": prj.current_stage if prj else "Notification",
            "encumbrance_status": "LOCKED (Under Sec 11 Acquisition)" if pr.encumbrance_locked else "FREE",
            "sec11_gazette_id": f"GAZ/2026/SEC11/{pr.ulpin[:6]}",
            "valuation_estimate": val
        })

    return results


# ================= 6. SECTION 15 OBJECTIONS =================
@app.get("/api/objections")
def list_all_objections(db: Session = Depends(get_db)):
    objs = db.query(Objection).all()
    results = []
    for o in objs:
        prj = db.query(Project).filter(Project.id == o.project_id).first()
        results.append({
            "objection": o,
            "project_title": prj.title if prj else "National Highway"
        })
    return results


@app.post("/api/projects/{project_id}/objections")
def file_objection(
    project_id: str,
    claimant_name: str = Query(...),
    contact_phone: str = Query(...),
    ulpin: str = Query(...),
    grounds_category: str = Query("Inadequate Valuation"),
    objection_details: str = Query(...),
    db: Session = Depends(get_db)
):
    obj = Objection(
        id=f"OBJ-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        project_id=project_id,
        ulpin=ulpin,
        claimant_name=claimant_name,
        contact_phone=contact_phone,
        grounds_category=grounds_category,
        objection_details=objection_details,
        filing_date=datetime.now().strftime("%Y-%m-%d"),
        status="PENDING",
        cala_jurisdiction="District Land Acquisition Tribunal / CALA Bench"
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return {"status": "success", "objection_id": obj.id, "objection": obj}


@app.post("/api/projects/{project_id}/objections/{objection_id}/schedule-hearing")
def schedule_hearing(
    project_id: str,
    objection_id: str,
    hearing_date: str = Query("2026-03-25"),
    db: Session = Depends(get_db)
):
    obj = db.query(Objection).filter(Objection.id == objection_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Objection not found")

    obj.status = "HEARING_SCHEDULED"
    obj.hearing_date = hearing_date
    db.commit()
    db.refresh(obj)
    return {"status": "success", "hearing_date": hearing_date, "objection": obj}


@app.post("/api/projects/{project_id}/objections/{objection_id}/dispose")
def dispose_objection(
    project_id: str,
    objection_id: str,
    status: str = Query("DISPOSED_UPHELD"),
    reasoned_order_summary: str = Query(...),
    db: Session = Depends(get_db)
):
    obj = db.query(Objection).filter(Objection.id == objection_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Objection not found")

    obj.status = status
    obj.reasoned_order_summary = reasoned_order_summary
    db.commit()
    db.refresh(obj)
    return {"status": "success", "status": obj.status, "objection": obj}


# ================= 7. R&R TRACKING =================
@app.get("/api/projects/{project_id}/rr-tracking", response_model=RRTrackingSummary)
def get_rr_tracking(project_id: str, db: Session = Depends(get_db)):
    families = db.query(RRFamily).filter(RRFamily.project_id == project_id).all()
    total = len(families)
    displaced = sum(1 for f in families if f.is_displaced)
    settled = sum(1 for f in families if f.monetary_entitlements_settled >= 11)
    budget = sum(f.total_rr_assistance_inr for f in families) / 100000.0

    return RRTrackingSummary(
        project_id=project_id,
        total_affected_families=total,
        displaced_families=displaced,
        fully_settled_families=settled,
        settlement_percentage=round((settled / max(1, total)) * 100, 1),
        total_rr_assistance_budget_lakhs=round(budget, 2),
        families=families
    )


@app.post("/api/projects/{project_id}/rr-tracking/settle-family")
def settle_family_entitlement(
    project_id: str,
    family_id: str = Query(...),
    entitlements_settled: int = Query(11),
    additional_amenity: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    fam = db.query(RRFamily).filter(RRFamily.family_id == family_id).first()
    if not fam:
        raise HTTPException(status_code=404, detail="Family record not found")

    fam.monetary_entitlements_settled = entitlements_settled
    if additional_amenity:
        amenities = list(fam.resettlement_amenities_allocated or [])
        if additional_amenity not in amenities:
            amenities.append(additional_amenity)
            fam.resettlement_amenities_allocated = amenities

    db.commit()
    db.refresh(fam)
    return {"status": "success", "family": fam}


# ================= 8. STATUTORY E-GOV INTEGRATIONS =================
@app.post("/api/projects/{project_id}/generate-egazette")
def generate_egazette(project_id: str, db: Session = Depends(get_db)):
    prj = db.query(Project).filter(Project.id == project_id).first()
    if not prj:
        raise HTTPException(status_code=404, detail="Project not found")

    return {
        "gazette_id": f"DL-E-26082026-{prj.id[-4:]}",
        "project_id": prj.id,
        "signing_authority": f"Competent Authority Land Acquisition (CALA), {prj.district}",
        "dsc_digital_signature_hash": f"SHA256:{uuid.uuid4().hex[:32].upper()}",
        "english_text": f"MINISTRY OF RURAL DEVELOPMENT / NHAI\nNOTIFICATION\nNew Delhi, the 26th August, 2026\n\nS.O. 1422(E).—In exercise of the powers conferred by sub-section (1) of Section 11 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013, the Central Government hereby notifies land acquisition for the {prj.title} across {len(prj.parcels)} cadastral parcels in {prj.district}, {prj.state}.\n\nSCHEDULE OF PARCELS:\n" + "\n".join(f"- ULPIN: {p.ulpin} | Record: {p.local_record_no} | Owner: {p.owner_name} | Area: {p.acquired_area_sqm} sq.m" for p in prj.parcels),
        "hindi_text": f"ग्रामीण विकास मंत्रालय / भारतीय राष्ट्रीय राजमार्ग प्राधिकरण\nअधिसूचना\nनई दिल्ली, 26 अगस्त, 2026\n\nका.आ. 1422(अ).—भूमि अर्जन, पुनर्वासन और पुनर्व्यवस्थापन में उचित प्रतिकर और पारदर्शिता का अधिकार अधिनियम, 2013 की धारा 11 की उप-धारा (1) द्वारा प्रदत्त शक्तियों का प्रयोग करते हुए केंद्र सरकार एतद्द्वारा {prj.title} हेतु {prj.district}, {prj.state} में कुल {len(prj.parcels)} भू-पार्सलों के अधिग्रहण की घोषणा करती है।"
    }


@app.post("/api/projects/{project_id}/disburse-pfms-dbt")
def disburse_pfms_dbt(project_id: str, db: Session = Depends(get_db)):
    prj = db.query(Project).filter(Project.id == project_id).first()
    if not prj:
        raise HTTPException(status_code=404, detail="Project not found")

    prj.total_compensation_disbursed_cr = prj.total_compensation_assessed_cr
    db.commit()

    return {
        "status": "SUCCESS_CREDITED",
        "batch_id": f"PFMS/DBT/2026/{prj.id[-4:]}/001",
        "total_amount_cr": prj.total_compensation_disbursed_cr,
        "total_beneficiaries": len(prj.parcels),
        "settlement_channel": "RBI Aadhaar Payment Bridge System (APBS)",
        "xml_payload": f'<?xml version="1.0" encoding="UTF-8"?>\n<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">\n  <GrpHdr>\n    <MsgId>PFMS-DBT-{prj.id}-20260826</MsgId>\n    <CreDtTm>{datetime.now().isoformat()}</CreDtTm>\n    <NbOfTxs>{len(prj.parcels)}</NbOfTxs>\n    <CtrlSum>{prj.total_compensation_disbursed_cr * 10000000}</CtrlSum>\n  </GrpHdr>\n</Document>'
    }


@app.post("/api/projects/{project_id}/trigger-mutation")
def trigger_mutation(project_id: str, db: Session = Depends(get_db)):
    prj = db.query(Project).filter(Project.id == project_id).first()
    if not prj:
        raise HTTPException(status_code=404, detail="Project not found")

    records = []
    for p in prj.parcels:
        p.encumbrance_locked = False
        p.status = "ACQUIRED"
        records.append({
            "ulpin": p.ulpin,
            "old_owner": p.owner_name,
            "new_owner": f"President of India (c/o {prj.acquiring_agency})",
            "mutation_order_no": f"MUT/{prj.state[:2].upper()}/2026/{p.ulpin[-6:]}",
            "state_portal_sync": "SYNCED_BHULEKH"
        })

    prj.physical_possession_pct = 100.0
    db.commit()

    return {
        "status": "MUTATION_RECORDED",
        "state": prj.state,
        "total_mutated_parcels": len(records),
        "records": records
    }
