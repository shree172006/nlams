"""
Pre-seeded representative projects for NLAMS demonstration
"""

from typing import List
from datetime import datetime
from .models import (
    Project, ParcelRecord, ObjectionRecord, RREntitlement,
    StageEnum, StatutoryActEnum, LandTypeEnum, StateNomenclature
)
from .spatial_cadastral import mock_intersect_alignment_corridor
from .valuation import calculate_parcel_award

def get_initial_seed_projects() -> List[Project]:
    # Project 1: NHAI Delhi-Amritsar Expressway (Sec 19 Declaration stage)
    p1_parcels = mock_intersect_alignment_corridor(
        "Delhi-Amritsar Expressway Segment 4", "Punjab", "Ludhiana", "Doraha", 6.5
    )
    # Give some valuations
    p1_objections = [
        ObjectionRecord(
            id="OBJ-2026-001",
            project_id="PRJ-NHAI-01",
            ulpin=p1_parcels[0].ulpin,
            claimant_name=p1_parcels[0].owner_name,
            contact_phone="+91 98765 43210",
            grounds_category="Measurement Discrepancy",
            objection_details="Survey team marked 4,200 sq.m whereas original Jamabandi record reflects 3,850 sq.m. Joint physical boundary re-verification requested.",
            filing_date="2026-02-10",
            hearing_date="2026-02-25",
            cala_jurisdiction="CALA / SDM Ludhiana West",
            status="DISPOSED_UPHELD",
            reasoned_order_summary="Joint boundary re-survey conducted on 2026-02-20 with NAKSHA DGPS kit. Cadastral map updated to 3,850 sq.m. Objection disposed favorably.",
            disposal_timestamp="2026-02-22T14:30:00"
        ),
        ObjectionRecord(
            id="OBJ-2026-002",
            project_id="PRJ-NHAI-01",
            ulpin=p1_parcels[1].ulpin,
            claimant_name=p1_parcels[1].owner_name,
            contact_phone="+91 98111 22334",
            grounds_category="Inadequate Valuation",
            objection_details="Circle rate of ₹2,200/sq.m does not reflect recent commercial development near bypass. Requesting highest registered sale deed rate.",
            filing_date="2026-02-14",
            hearing_date="2026-02-28",
            cala_jurisdiction="CALA / SDM Ludhiana West",
            status="DISPOSED_UPHELD",
            reasoned_order_summary="Section 26 statutory rule applied: System picked top 50% avg 3-year sale deed value of ₹3,150/sq.m with 100% Solatium. Compensation enhanced accordingly.",
            disposal_timestamp="2026-02-26T16:00:00"
        )
    ]
    p1_rr = [
        RREntitlement(
            family_id="FAM-PB-001",
            head_of_family=p1_parcels[0].owner_name,
            category="General",
            is_displaced=True,
            monetary_entitlements_settled=11,
            total_rr_assistance_inr=500000.0,
            resettlement_amenities_allocated=["Piped Water", "Power Supply", "Primary School Road"]
        ),
        RREntitlement(
            family_id="FAM-PB-002",
            head_of_family=p1_parcels[1].owner_name,
            category="SC/ST",
            is_displaced=False,
            monetary_entitlements_settled=8,
            total_rr_assistance_inr=300000.0,
            resettlement_amenities_allocated=["Subsidized Farm Input Hub", "Community Center Access"]
        )
    ]

    p1 = Project(
        id="PRJ-NHAI-01",
        title="Delhi-Amritsar-Katra Expressway (Package 4B - Ludhiana Bypass)",
        acquiring_agency="National Highways Authority of India (NHAI)",
        sector="Highways",
        statutory_act=StatutoryActEnum.NH_ACT_1956,
        state="Punjab",
        districts=["Ludhiana", "Jalandhar"],
        current_stage=StageEnum.VALUATION_AWARD,
        stage_progress_pct=66.7,
        total_length_km=34.2,
        total_corridor_area_ha=84.5,
        parcels=p1_parcels,
        objections=p1_objections,
        rr_families=p1_rr,
        sec11_notification_date="2025-10-15",
        sec11_gazette_id="DL-(N)-04/2025/GZ-NHAI01",
        sec19_declaration_date="2026-01-20",
        award_date="2026-03-01",
        total_compensation_assessed_cr=42.8,
        total_compensation_disbursed_cr=38.5,
        pfs_dbt_batch_id="PFMS-DBT-2026-PB-0941",
        physical_possession_pct=85.0,
        mutation_completed_pct=72.0,
        active_court_cases=1,
        contingent_liability_cr=1.2,
        created_at="2025-08-01",
        alignment_coordinates=[
            [30.9010, 75.8573],
            [30.9250, 75.8900],
            [30.9600, 75.9200],
            [31.0100, 75.9600]
        ]
    )

    # Project 2: Dedicated Freight Corridor (Maharashtra - Jawaharlal Nehru Port Trust Link)
    p2_parcels = mock_intersect_alignment_corridor(
        "Western DFC - Palghar to JNPT Freight Corridor", "Maharashtra", "Palghar", "Dahanu", 8.0
    )
    p2 = Project(
        id="PRJ-DFCCIL-02",
        title="Western Dedicated Freight Corridor (Palghar-Vasai Heavy Freight Line)",
        acquiring_agency="Dedicated Freight Corridor Corporation of India (DFCCIL) / MoR",
        sector="Railways",
        statutory_act=StatutoryActEnum.RFCTLARR_2013,
        state="Maharashtra",
        districts=["Palghar", "Thane"],
        current_stage=StageEnum.POSSESSION_MUTATION,
        stage_progress_pct=88.9,
        total_length_km=48.6,
        total_corridor_area_ha=112.4,
        parcels=p2_parcels,
        objections=[],
        rr_families=[],
        sec11_notification_date="2025-04-10",
        sec11_gazette_id="MH-(W)-02/2025/GZ-DFC02",
        sec19_declaration_date="2025-09-18",
        award_date="2025-12-05",
        total_compensation_assessed_cr=89.4,
        total_compensation_disbursed_cr=89.4,
        pfs_dbt_batch_id="PFMS-DBT-2025-MH-8812",
        physical_possession_pct=100.0,
        mutation_completed_pct=95.0,
        active_court_cases=0,
        contingent_liability_cr=0.0,
        created_at="2025-02-15",
        alignment_coordinates=[
            [19.6967, 72.7699],
            [19.6200, 72.8200],
            [19.4500, 72.8800],
            [19.3400, 72.9300]
        ]
    )

    # Project 3: Kanpur-Lucknow Expressway (Uttar Pradesh - Sec 11 Notification Stage)
    p3_parcels = mock_intersect_alignment_corridor(
        "Kanpur-Lucknow Greenfield Expressway", "Uttar Pradesh", "Unnao", "Nawabganj", 5.0
    )
    p3 = Project(
        id="PRJ-NHAI-03",
        title="Kanpur-Lucknow 6-Lane Access Controlled Greenfield Expressway",
        acquiring_agency="National Highways Authority of India (NHAI)",
        sector="Highways",
        statutory_act=StatutoryActEnum.NH_ACT_1956,
        state="Uttar Pradesh",
        districts=["Unnao", "Lucknow"],
        current_stage=StageEnum.PRELIMINARY_NOTIFICATION,
        stage_progress_pct=33.3,
        total_length_km=62.8,
        total_corridor_area_ha=145.0,
        parcels=p3_parcels,
        objections=[],
        rr_families=[],
        sec11_notification_date="2026-02-01",
        sec11_gazette_id="UP-(E)-01/2026/GZ-KL03",
        sec19_declaration_date=None,
        award_date=None,
        total_compensation_assessed_cr=64.2,
        total_compensation_disbursed_cr=0.0,
        physical_possession_pct=0.0,
        mutation_completed_pct=0.0,
        active_court_cases=0,
        contingent_liability_cr=0.0,
        created_at="2025-11-20",
        alignment_coordinates=[
            [26.4499, 80.3319],
            [26.6200, 80.5500],
            [26.7800, 80.7500],
            [26.8467, 80.9462]
        ]
    )

    # Project 4: Green Energy Super Grid Feeder (Rajasthan - Proposal Stage)
    p4_parcels = mock_intersect_alignment_corridor(
        "Bhadla Ultra Mega Solar Transmission Line", "Rajasthan", "Jodhpur", "Bhadla", 4.0
    )
    p4 = Project(
        id="PRJ-PGCIL-04",
        title="Bhadla-Fatehgarh 765kV Green Energy Corridor High Voltage Transmission Line",
        acquiring_agency="Power Grid Corporation of India (PGCIL)",
        sector="Power Grid",
        statutory_act=StatutoryActEnum.RFCTLARR_2013,
        state="Rajasthan",
        districts=["Jodhpur", "Jaisalmer"],
        current_stage=StageEnum.PROPOSAL,
        stage_progress_pct=11.1,
        total_length_km=78.0,
        total_corridor_area_ha=52.0,
        parcels=p4_parcels,
        objections=[],
        rr_families=[],
        sec11_notification_date=None,
        sec11_gazette_id=None,
        sec19_declaration_date=None,
        award_date=None,
        total_compensation_assessed_cr=18.5,
        total_compensation_disbursed_cr=0.0,
        physical_possession_pct=0.0,
        mutation_completed_pct=0.0,
        active_court_cases=0,
        contingent_liability_cr=0.0,
        created_at="2026-01-10",
        alignment_coordinates=[
            [27.5300, 71.9100],
            [27.3500, 71.7200],
            [27.1000, 71.5000]
        ]
    )

    return [p1, p2, p3, p4]
