import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    output_dir = r"f:\sih_proj\TECH_INFO"
    os.makedirs(output_dir, exist_ok=True)
    doc_path = os.path.join(output_dir, "NLAMS_Technical_Architecture_and_Specifications.docx")

    doc = docx.Document()

    # Page Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles
    navy = RGBColor(7, 20, 38)        # #071426
    saffron = RGBColor(234, 88, 12)    # #ea580c
    gold = RGBColor(180, 83, 9)        # #b45309
    slate = RGBColor(71, 85, 105)      # #475569

    # Document Header Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_title.add_run("GOVERNMENT OF INDIA • MINISTRY OF RURAL DEVELOPMENT\nDEPARTMENT OF LAND RESOURCES (DoLR)\n\n")
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(10)
    r_sub.font.bold = True
    r_sub.font.color.rgb = gold

    r_main = p_title.add_run("NATIONAL LAND ACQUISITION & MANAGEMENT SYSTEM (NLAMS)\n")
    r_main.font.name = "Arial"
    r_main.font.size = Pt(20)
    r_main.font.bold = True
    r_main.font.color.rgb = navy

    r_doc = p_title.add_run("COMPREHENSIVE TECHNICAL ARCHITECTURE & SYSTEM SPECIFICATIONS\nSmart India Hackathon (SIH) — Problem Statement ID: 26016\n")
    r_doc.font.name = "Arial"
    r_doc.font.size = Pt(11)
    r_doc.font.bold = True
    r_doc.font.color.rgb = saffron

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Summary Callout Box
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    p_box = cell.paragraphs[0]
    r_box_title = p_box.add_run("📌 SYSTEM OVERVIEW & EXECUTIVE ABSTRACT\n")
    r_box_title.bold = True
    r_box_title.font.color.rgb = navy
    r_box_desc = p_box.add_run(
        "NLAMS is a unified, statutory enterprise platform designed to digitize India's public land acquisition lifecycle "
        "end-to-end under the RFCTLARR Act, 2013 and sector-specific central legislations (National Highways Act 1956, Railways Act 1989). "
        "The platform eliminates physical bottlenecks through 14-digit ULPIN (Bhu-Aadhaar) automated encumbrance locking, "
        "GIS cadastral spatial fusion, automated statutory award mathematical engines, Second Schedule R&R entitlement ledgers, "
        "Section 64 LARRDA quasi-judicial tracking, and predictive AI delay-risk forecasting."
    )
    r_box_desc.font.size = Pt(9.5)
    r_box_desc.font.color.rgb = slate

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

    # Helper function for adding headings
    def add_sec_heading(num, title):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(16)
        h.paragraph_format.space_after = Pt(6)
        r = h.add_run(f"{num}. {title}")
        r.font.name = "Arial"
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = navy
        return h

    # Section 1: Technology Stack
    add_sec_heading("1", "COMPONENT-WISE TECHNOLOGY STACK & INFRASTRUCTURE")
    
    tech_table = doc.add_table(rows=1, cols=4)
    tech_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Layer / Component", "Technology / Framework", "Version / Standard", "Key Responsibility & Role"]
    for i, h in enumerate(headers):
        c = tech_table.cell(0, i)
        set_cell_background(c, "071426")
        set_cell_margins(c, top=100, bottom=100, left=120, right=120)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    tech_data = [
        ("Web Frontend", "React.js 18 + Vite", "v18.3 / v8.2", "High-performance SPA with client-side routing, live state sync, bilingual UI, and accessibility engine."),
        ("Design System", "Custom Vanilla CSS", "CSS3 Custom Tokens", "Bespoke Govt-of-India aesthetic (Saffron/Navy/Emerald) with zero framework bloat and instant load times."),
        ("GIS Spatial Engine", "Leaflet.js + React-Leaflet", "v1.9.4", "Vector polyline corridor alignment overlays, village cadastral survey polygons, color-coded encumbrance locks, and full-screen view."),
        ("Backend REST API", "Node.js + Express.js", "Node v24 / Express v4.19", "High-concurrency RESTful microservices, RBAC middleware, statutory valuation mathematical calculations, and delay forecasting engines."),
        ("Relational Database", "SQLite (better-sqlite3)", "v11.8 (ACID Compliant)", "Zero-latency transactional persistence for projects, parcels, objections, R&R families, and tribunal dockets."),
        ("Mobile Field App", "Flutter (Dart)", "Flutter 3.x / Dart 3.x", "Offline-first mobile survey tool with GPS geo-tagging, camera asset documentation, and automatic cloud sync."),
        ("Cloud Frontend Host", "Firebase Hosting", "Google Global Edge CDN", "High-availability static CDN with HTTP/2, instant cache invalidation, and custom domain SSL."),
        ("Cloud Backend Host", "Render.com Web Services", "Docker Container / Linux", "Automated GitHub CI/CD web service with 0.0.0.0 port binding, reverse proxy routing, and REST endpoint exposure.")
    ]

    for row_idx, row in enumerate(tech_data):
        r_elem = tech_table.add_row()
        bg = "F8FAFC" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, text in enumerate(row):
            c = r_elem.cells[col_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            p = c.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            r.font.color.rgb = slate
            if col_idx == 0:
                r.bold = True
                r.font.color.rgb = navy

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Section 2: Statutory Mathematical Formulas
    add_sec_heading("2", "STATUTORY MATHEMATICAL FORMULAS & ALGORITHMS (RFCTLARR ACT, 2013)")
    
    p_math = doc.add_paragraph()
    p_math.add_run(
        "NLAMS implements the legally audited mathematical valuation framework defined under Sections 26 through 30 "
        "and the First Schedule of the RFCTLARR Act, 2013, as well as Section 3G of the National Highways Act, 1956:\n"
    ).font.size = Pt(9.5)

    math_points = [
        ("Step 1: Baseline Market Value Determination (Sec 26)", 
         "Market Value (MV) = max(Circle Rate, Avg 3-Year Registered Sale Deeds for top 50% transactions)."),
        ("Step 2: Rural Multiplication Factor (Sec 26(2))", 
         "Multiplied Base Land Value = MV × Factor F (where F = 1.00 for Urban, 1.15 to 2.00 scaled by radial distance from urban boundary)."),
        ("Step 3: On-Ground Field Asset Appraisals (Sec 29)", 
         "Total Assets (A) = Valuation of Buildings/Structures (PWD Plinth Norms) + Timber/Horticulture Trees (Forest Dept) + Standing Crops (Agri Dept)."),
        ("Step 4: Mandatory 100% Solatium (Sec 30(1))", 
         "Solatium Amount = 100% × (Multiplied Base Land Value + Total Assets)."),
        ("Step 5: 12% Additional Amount (Sec 30(3))", 
         "Additional Interest = 12% per annum on Market Value from the date of Section 11 Notification to Award declaration date."),
        ("Step 6: Final Statutory Gross Award", 
         "Total Award = (Multiplied Base Land Value + Total Assets) × 2.00 + Additional Interest Amount.")
    ]

    for title, formula in math_points:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(4)
        r_t = p.add_run(f"{title}: ")
        r_t.bold = True
        r_t.font.color.rgb = saffron
        r_t.font.size = Pt(9)
        r_f = p.add_run(formula)
        r_f.font.size = Pt(9)
        r_f.font.color.rgb = navy

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Section 3: Database Entity Schema
    add_sec_heading("3", "RELATIONAL DATABASE SCHEMA & ENTITY ARCHITECTURE")

    schema_table = doc.add_table(rows=1, cols=4)
    schema_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    s_headers = ["Table Name", "Primary Key", "Key Attributes / Foreign Keys", "Domain Function & Purpose"]
    for i, h in enumerate(s_headers):
        c = schema_table.cell(0, i)
        set_cell_background(c, "071426")
        set_cell_margins(c, top=100, bottom=100, left=120, right=120)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    schema_data = [
        ("projects", "id (VARCHAR)", "title, agency, state, length_km, area_ha, stage, progress_pct, dbt_cr, alignment_coords (JSON)", "Linear corridor master records tracking total acreage, notified dates, and geospatial vectors."),
        ("parcels", "ulpin (CHAR 14)", "project_id (FK), record_no, owner_name, aadhaar_masked, circle_rate, encumbrance_locked, status, polygon (JSON)", "Cadastral land parcels linked via 14-digit Bhu-Aadhaar with automated encumbrance locking."),
        ("objections", "id (VARCHAR)", "project_id (FK), ulpin (FK), ground_type, hearing_date, status, reasoned_order_summary", "Section 15 quasi-judicial inquiry records and public dispute resolutions."),
        ("rr_families", "family_id (VARCHAR)", "project_id (FK), head_of_family, category, is_displaced, entitlements_settled, amenities (JSON)", "Second Schedule Rehabilitation & Resettlement tracking covering displaced and affected families."),
        ("larrda_references", "id (VARCHAR)", "project_id (FK), ulpin (FK), case_no, ground_type, referral_date, hearing_date, appeal_status", "Section 64 Land Acquisition Tribunal dockets with 90-day Collector mandate and High Court timers."),
        ("field_surveys", "id (VARCHAR)", "ulpin (FK), surveyor_name, gps_lat, gps_lng, structure_val, tree_val, crop_val, photos (JSON)", "Mobile app on-ground asset enumerations synced from surveyor field devices."),
        ("users", "id (VARCHAR)", "email, role (COLLECTOR/CALA/SURVEYOR/AGENCY), designation, district, token", "Role-Based Access Control credentials enforcing strict statutory approval rights.")
    ]

    for row_idx, row in enumerate(schema_data):
        r_elem = schema_table.add_row()
        bg = "F8FAFC" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, text in enumerate(row):
            c = r_elem.cells[col_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            p = c.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            r.font.color.rgb = slate
            if col_idx == 0:
                r.bold = True
                r.font.color.rgb = navy

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Section 4: REST API Endpoints Directory
    add_sec_heading("4", "RESTFUL API DIRECTORY & MICROSERVICES INTERFACE")

    api_table = doc.add_table(rows=1, cols=4)
    api_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    api_headers = ["HTTP Method", "API Route Path", "Parameters / Body", "Operation & Integration Scope"]
    for i, h in enumerate(api_headers):
        c = api_table.cell(0, i)
        set_cell_background(c, "071426")
        set_cell_margins(c, top=100, bottom=100, left=120, right=120)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    api_data = [
        ("GET", "/api/national-metrics", "None", "Returns consolidated national statistics: Total DBT disbursed, corridor acreage, and active ULPIN locks."),
        ("GET", "/api/projects", "None", "Retrieves all linear infrastructure corridors with vector alignment coordinates and stage progress."),
        ("GET", "/api/projects/:id", "project_id in path", "Fetches single project corridor details including cadastral parcel lists and possession status."),
        ("POST", "/api/calculate-valuation", "JSON payload (area, circle_rate, sale_rate, rural_multiplier, assets, solatium)", "Executes audited First Schedule statutory compensation formula and returns line-item award slip breakdown."),
        ("POST", "/api/predict-delay", "JSON payload (current_stage, dwell_days, objections, rr_progress)", "AI Decision-Support engine calculating projected delay months, critical bottleneck stage, and mitigation actions."),
        ("GET", "/api/citizen-lookup", "Query: ?query=ULPIN/Khasra/Name", "Open citizen search returning landholding status, encumbrance lock, and digital award estimate."),
        ("POST", "/api/auth/login", "JSON payload (email, role)", "Role-Based Access Control session generation for Collector, CALA, Surveyor, and NHAI GM."),
        ("GET / POST", "/api/projects/:id/objections", "JSON payload (ulpin, claimant, ground)", "Section 15 inquiry docketing, quasi-judicial hearing scheduling, and reasoned order generation."),
        ("GET / POST", "/api/projects/:id/rr-tracking", "JSON payload (family_id, entitlements_settled)", "Second Schedule R&R progress ledger, housing grant verification, and amenity allocations."),
        ("GET / POST", "/api/larrda-references", "JSON payload (ulpin, ground_type, case_no)", "Section 64 Land Acquisition Tribunal reference logging with 90-day Collector mandate and HC appeal tracking."),
        ("POST", "/api/field-surveys/sync", "JSON payload (ulpin, surveyor, assets, gps)", "Mobile on-ground survey synchronization endpoint integrating Flutter field tablets."),
        ("POST", "/api/parcels/:ulpin/split-khata", "JSON payload (heirs array with share %)", "Splits joint-khata ancestral holdings among legal co-heirs with individualized DBT shares.")
    ]

    for row_idx, row in enumerate(api_data):
        r_elem = api_table.add_row()
        bg = "F8FAFC" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, text in enumerate(row):
            c = r_elem.cells[col_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            p = c.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            r.font.color.rgb = slate
            if col_idx == 0:
                r.bold = True
                if text == "GET":
                    r.font.color.rgb = RGBColor(5, 150, 105)
                else:
                    r.font.color.rgb = RGBColor(234, 88, 12)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Section 5: SIH 26016 Compliance & Defense
    add_sec_heading("5", "SIH PROBLEM STATEMENT 26016 COMPLIANCE VERIFICATION")

    p_comp = doc.add_paragraph()
    p_comp.add_run(
        "NLAMS directly addresses every single mandatory requirement outlined by the Ministry of Rural Development:\n"
    ).font.size = Pt(9.5)

    comp_points = [
        ("End-to-End Digital Workflow", "Standardized 9-stage statutory pipeline from proposal scrutiny to final physical possession."),
        ("GIS Cadastral Spatial Fusion", "Vector Right-of-Way (RoW) overlays with village parcel polygons and color-coded status."),
        ("Real-Time 15 National Parameters", "Acreage, awards declared, DBT disbursed, possession %, displaced families, and timeline adherence."),
        ("Bhu-Aadhaar (ULPIN) Integration", "Prevents fraudulent parallel property transactions through automated registry encumbrance locks."),
        ("Mobile Field Survey Interface", "Flutter application enabling GPS geo-tagging, offline caching, and asset documentation."),
        ("AI Decision-Support System", "Predictive delay forecasting using stage dwell metrics and prescriptive mitigation interventions.")
    ]

    for title, desc in comp_points:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(4)
        r_t = p.add_run(f"{title}: ")
        r_t.bold = True
        r_t.font.color.rgb = navy
        r_t.font.size = Pt(9)
        r_d = p.add_run(desc)
        r_d.font.size = Pt(9)
        r_d.font.color.rgb = slate

    doc.add_paragraph().paragraph_format.space_after = Pt(20)

    # Footer note
    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_foot = p_foot.add_run("— END OF TECHNICAL SPECIFICATIONS DOCUMENT —\nNational Land Acquisition & Management System (NLAMS) • Ministry of Rural Development")
    r_foot.font.size = Pt(8.5)
    r_foot.font.color.rgb = slate
    r_foot.italic = True

    doc.save(doc_path)
    print(f"Document successfully created at: {doc_path}")

if __name__ == "__main__":
    create_document()
