"""
Realistic Indian Land Records Seed Data for NLAMS
Contains projects across Varanasi, Nagpur, Bengaluru Rural, and Ludhiana.
"""
from backend.models import Project, Parcel, Objection, Award, RRFamily
from backend.database import SessionLocal, engine, Base

def seed_database(db=None):
    """Initializes tables and seeds representative Indian infrastructure projects."""
    Base.metadata.create_all(bind=engine)
    
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        # Check if already seeded
        if db.query(Project).count() > 0:
            return

        # 1. Project 1: Varanasi Ring Road (UP)
        p1 = Project(
            id="PRJ-NHAI-2026-UP01",
            title="Varanasi Ring Road Phase-II Corridor",
            acquiring_agency="National Highways Authority of India (NHAI)",
            statutory_act="National Highways Act, 1956 (Sec 3A to 3J)",
            state="Uttar Pradesh",
            district="Varanasi",
            total_length_km=42.5,
            total_corridor_area_ha=145.8,
            current_stage="6. Valuation, Award & Compensation (Sec 23/26-30/3G)",
            stage_progress_pct=66.7,
            total_compensation_assessed_cr=84.5,
            total_compensation_disbursed_cr=58.2,
            physical_possession_pct=62.0,
            alignment_coordinates=[
                [25.3176, 82.9739],
                [25.3350, 83.0020],
                [25.3620, 83.0310],
                [25.3900, 83.0650]
            ]
        )

        # Parcels for Varanasi
        parcels_p1 = [
            Parcel(
                ulpin="IN09UP23456701",
                project_id="PRJ-NHAI-2026-UP01",
                local_record_no="Khasra No. 342/1",
                village="Shivpur",
                district="Varanasi",
                state="Uttar Pradesh",
                land_type="RURAL_CLOSE",
                acquired_area_sqm=3200.0,
                circle_rate_per_sqm=2100.0,
                avg_registered_sale_rate_per_sqm=2850.0,
                owner_name="Shri Ramcharan Yadav",
                owner_aadhaar_masked="XXXX-XXXX-8921",
                bank_ifsc="PUNB0021400",
                bank_account_masked="XXXX-XXXX-4512",
                encumbrance_locked=True,
                status="NOTIFIED",
                coordinates_polygon=[
                    [25.3160, 82.9720], [25.3190, 82.9720], [25.3190, 82.9755], [25.3160, 82.9755]
                ]
            ),
            Parcel(
                ulpin="IN09UP23456702",
                project_id="PRJ-NHAI-2026-UP01",
                local_record_no="Khasra No. 342/2",
                village="Shivpur",
                district="Varanasi",
                state="Uttar Pradesh",
                land_type="RURAL_CLOSE",
                acquired_area_sqm=4100.0,
                circle_rate_per_sqm=2100.0,
                avg_registered_sale_rate_per_sqm=2900.0,
                owner_name="Smt. Shanti Devi",
                owner_aadhaar_masked="XXXX-XXXX-1142",
                bank_ifsc="SBIN0004512",
                bank_account_masked="XXXX-XXXX-7821",
                encumbrance_locked=True,
                status="NOTIFIED",
                coordinates_polygon=[
                    [25.3195, 82.9760], [25.3225, 82.9760], [25.3225, 82.9795], [25.3195, 82.9795]
                ]
            ),
            Parcel(
                ulpin="IN09UP23456703",
                project_id="PRJ-NHAI-2026-UP01",
                local_record_no="Khasra No. 118",
                village="Harahua",
                district="Varanasi",
                state="Uttar Pradesh",
                land_type="RURAL_MID",
                acquired_area_sqm=5800.0,
                circle_rate_per_sqm=1650.0,
                avg_registered_sale_rate_per_sqm=2200.0,
                owner_name="Shri Vinod Kumar Mishra",
                owner_aadhaar_masked="XXXX-XXXX-6731",
                bank_ifsc="BARB0VARANA",
                bank_account_masked="XXXX-XXXX-9923",
                encumbrance_locked=True,
                status="DISPUTED",
                coordinates_polygon=[
                    [25.3340, 83.0010], [25.3370, 83.0010], [25.3370, 83.0045], [25.3340, 83.0045]
                ]
            )
        ]

        # Objections for Varanasi
        obj1 = Objection(
            id="OBJ-UP-2026-081",
            project_id="PRJ-NHAI-2026-UP01",
            ulpin="IN09UP23456703",
            claimant_name="Shri Vinod Kumar Mishra",
            contact_phone="+91 94152 78120",
            grounds_category="Inadequate Valuation",
            objection_details="Sub-Registrar circle rate of Harahua increased in 2025; proposed 3G rate does not reflect commercial potential along NH-31.",
            filing_date="2026-01-18",
            status="HEARING_SCHEDULED",
            hearing_date="2026-03-12",
            cala_jurisdiction="CALA / Competent Authority cum ADM (Land Acquisition), Varanasi",
            reasoned_order_summary=None
        )

        # R&R Families for Varanasi
        rr1 = RRFamily(
            family_id="RR-VNS-01",
            project_id="PRJ-NHAI-2026-UP01",
            head_of_family="Shri Ramcharan Yadav",
            category="OBC",
            is_displaced=True,
            monetary_entitlements_settled=11,
            total_rr_assistance_inr=550000.0,
            resettlement_amenities_allocated=["Drinking Water", "Electricity", "Paved Access Road"]
        )
        rr2 = RRFamily(
            family_id="RR-VNS-02",
            project_id="PRJ-NHAI-2026-UP01",
            head_of_family="Smt. Shanti Devi",
            category="General",
            is_displaced=False,
            monetary_entitlements_settled=8,
            total_rr_assistance_inr=350000.0,
            resettlement_amenities_allocated=["Access Road"]
        )

        # 2. Project 2: Nagpur-Mumbai Samruddhi Mahamarg (Maharashtra)
        p2 = Project(
            id="PRJ-MSRDC-2026-MH04",
            title="Nagpur-Mumbai Samruddhi Expressway (Package 12)",
            acquiring_agency="MSRDC / GoM",
            statutory_act="RFCTLARR Act, 2013",
            state="Maharashtra",
            district="Nagpur",
            total_length_km=58.2,
            total_corridor_area_ha=210.4,
            current_stage="8. Physical Possession & Land Mutation (Sec 38/3E)",
            stage_progress_pct=88.9,
            total_compensation_assessed_cr=162.0,
            total_compensation_disbursed_cr=154.8,
            physical_possession_pct=94.5,
            alignment_coordinates=[
                [21.1458, 79.0882],
                [21.1210, 78.9850],
                [21.0850, 78.8520],
                [21.0420, 78.7110]
            ]
        )

        parcels_p2 = [
            Parcel(
                ulpin="IN27MH89123401",
                project_id="PRJ-MSRDC-2026-MH04",
                local_record_no="Gat No. 89/1A",
                village="Hingna",
                district="Nagpur",
                state="Maharashtra",
                land_type="RURAL_MID",
                acquired_area_sqm=6500.0,
                circle_rate_per_sqm=1250.0,
                avg_registered_sale_rate_per_sqm=1950.0,
                owner_name="Shri Eknath Patil",
                owner_aadhaar_masked="XXXX-XXXX-9912",
                bank_ifsc="MAHB0000124",
                bank_account_masked="XXXX-XXXX-3341",
                encumbrance_locked=False,
                status="ACQUIRED",
                coordinates_polygon=[
                    [21.1440, 79.0860], [21.1475, 79.0860], [21.1475, 79.0900], [21.1440, 79.0900]
                ]
            )
        ]

        # 3. Project 3: Bengaluru Satellite Town Ring Road (Karnataka)
        p3 = Project(
            id="PRJ-KRDCL-2026-KA08",
            title="Bengaluru Satellite Town Ring Road (STRR - NH 948A)",
            acquiring_agency="NHAI / KRDCL",
            statutory_act="National Highways Act, 1956",
            state="Karnataka",
            district="Bengaluru Rural",
            total_length_km=76.0,
            total_corridor_area_ha=312.0,
            current_stage="3. Preliminary Notification & Freezing (Sec 11/3A)",
            stage_progress_pct=33.3,
            total_compensation_assessed_cr=240.0,
            total_compensation_disbursed_cr=12.0,
            physical_possession_pct=15.0,
            alignment_coordinates=[
                [13.1986, 77.7066],
                [13.2450, 77.6210],
                [13.3120, 77.5120],
                [13.3850, 77.4100]
            ]
        )

        parcels_p3 = [
            Parcel(
                ulpin="IN29KA56789001",
                project_id="PRJ-KRDCL-2026-KA08",
                local_record_no="Sy. No. 45/3",
                village="Devanahalli",
                district="Bengaluru Rural",
                state="Karnataka",
                land_type="RURAL_CLOSE",
                acquired_area_sqm=5000.0,
                circle_rate_per_sqm=4200.0,
                avg_registered_sale_rate_per_sqm=5600.0,
                owner_name="Shri Manjunath Swamy",
                owner_aadhaar_masked="XXXX-XXXX-4532",
                bank_ifsc="CNRB0001290",
                bank_account_masked="XXXX-XXXX-9901",
                encumbrance_locked=True,
                status="NOTIFIED",
                coordinates_polygon=[
                    [13.1970, 77.7050], [13.2005, 77.7050], [13.2005, 77.7085], [13.1970, 77.7085]
                ]
            )
        ]

        # 4. Project 4: Delhi-Amritsar High Speed Rail / Freight Corridor (Punjab)
        p4 = Project(
            id="PRJ-DFCCIL-2026-PB02",
            title="Delhi-Amritsar Dedicated Freight & Rail Corridor",
            acquiring_agency="Dedicated Freight Corridor Corporation (DFCCIL)",
            statutory_act="Railways Act, 1989 (Sec 20A-20P)",
            state="Punjab",
            district="Ludhiana",
            total_length_km=84.0,
            total_corridor_area_ha=393.9,
            current_stage="4. Objection Management & Inquiry (Sec 15/3C)",
            stage_progress_pct=44.4,
            total_compensation_assessed_cr=195.0,
            total_compensation_disbursed_cr=45.0,
            physical_possession_pct=35.0,
            alignment_coordinates=[
                [30.9010, 75.8573],
                [30.9420, 75.7650],
                [30.9850, 75.6420],
                [31.0250, 75.5110]
            ]
        )

        parcels_p4 = [
            Parcel(
                ulpin="IN03PB11223301",
                project_id="PRJ-DFCCIL-2026-PB02",
                local_record_no="Murabba 14, Killa 8",
                village="Sahnewal",
                district="Ludhiana",
                state="Punjab",
                land_type="RURAL_MID",
                acquired_area_sqm=7200.0,
                circle_rate_per_sqm=2800.0,
                avg_registered_sale_rate_per_sqm=3600.0,
                owner_name="Sardar Gurdeep Singh",
                owner_aadhaar_masked="XXXX-XXXX-3312",
                bank_ifsc="PSIB0000412",
                bank_account_masked="XXXX-XXXX-6623",
                encumbrance_locked=True,
                status="NOTIFIED",
                coordinates_polygon=[
                    [30.9000, 75.8550], [30.9035, 75.8550], [30.9035, 75.8590], [30.9000, 75.8590]
                ]
            )
        ]

        db.add_all([p1, p2, p3, p4])
        db.add_all(parcels_p1 + parcels_p2 + parcels_p3 + parcels_p4)
        db.add(obj1)
        db.add_all([rr1, rr2])
        db.commit()

    finally:
        if close_db:
            db.close()
