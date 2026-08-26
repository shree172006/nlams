"""
NLAMS - Official Smart India Hackathon (SIH) Standard Template Presentation Generator
Strictly adheres to the Official SIH PPT Submission Format:
1. Title Slide (PS ID: SIH26016, PS Title, Team Name: APEX, Team Members, Theme, Category, Ministry)
2. Idea / Solution Description (Core Concept & USP)
3. Technical Approach & Architecture (Tech Stack, Methodology & Process Flow)
4. Feasibility & Viability (Technical, Operational & Financial Feasibility)
5. Impact & Benefits (Direct Stakeholder & National Macroeconomic Impact)
6. Research & Prior Art / Competitive Matrix (Comparison with Existing Systems like BhoomRaashi)
7. Potential Challenges & Risks with Mitigations
8. Future Scope & Roadmap (National Rollout & DILRMP Conclusive Titling)
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_sih_official_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.5)
    
    # Official SIH Sovereign Palette
    NAVY_DARK = RGBColor(7, 20, 38)
    NAVY_SURFACE = RGBColor(11, 30, 54)
    SAFFRON = RGBColor(234, 88, 12)
    GREEN = RGBColor(5, 150, 105)
    BLUE_ACCENT = RGBColor(37, 99, 235)
    WHITE = RGBColor(255, 255, 255)
    GRAY_SUB = RGBColor(148, 163, 184)
    CARD_BG = RGBColor(255, 255, 255)
    BORDER_MAIN = RGBColor(226, 232, 240)
    BODY_TEXT = RGBColor(51, 65, 85)

    blank_layout = prs.slide_layouts[6]

    def add_official_sih_header(slide, title_text, slide_num_str):
        # Top banner
        header_box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.33), Inches(1.1))
        header_box.fill.solid()
        header_box.fill.fore_color.rgb = NAVY_DARK
        header_box.line.color.rgb = NAVY_DARK
        
        # Tricolor Line
        s_s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(1.1), Inches(4.44), Inches(0.06))
        s_s.fill.solid()
        s_s.fill.fore_color.rgb = SAFFRON
        s_s.line.color.rgb = SAFFRON
        
        s_w = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(4.44), Inches(1.1), Inches(4.44), Inches(0.06))
        s_w.fill.solid()
        s_w.fill.fore_color.rgb = WHITE
        s_w.line.color.rgb = WHITE
        
        s_g = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(8.88), Inches(1.1), Inches(4.45), Inches(0.06))
        s_g.fill.solid()
        s_g.fill.fore_color.rgb = GREEN
        s_g.line.color.rgb = GREEN

        # Header Title
        tx = slide.shapes.add_textbox(Inches(0.8), Inches(0.1), Inches(11.73), Inches(0.9))
        tf = tx.text_frame
        tf.word_wrap = True
        
        p0 = tf.paragraphs[0]
        p0.text = f"SMART INDIA HACKATHON 2026 • PS ID: SIH26016 • TEAM: APEX • SLIDE {slide_num_str}"
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = RGBColor(253, 186, 116)
        
        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.size = Pt(19)
        p1.font.bold = True
        p1.font.color.rgb = WHITE

    # =========================================================================
    # SLIDE 1: OFFICIAL SIH MANDATORY TITLE SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.33), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = NAVY_DARK
    bg1.line.color.rgb = NAVY_DARK

    # Top SIH Tag
    t1 = s1.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.73), Inches(0.5))
    tf1 = t1.text_frame
    p = tf1.paragraphs[0]
    p.text = "SMART INDIA HACKATHON 2026 — IDEA / SOLUTION PRESENTATION"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(253, 186, 116)

    # Tricolor line
    tl = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.9), Inches(11.73), Inches(0.06))
    tl.fill.solid()
    tl.fill.fore_color.rgb = SAFFRON
    tl.line.color.rgb = SAFFRON

    # Metadata Grid (Left Card)
    meta_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.15), Inches(5.7), Inches(5.9))
    meta_card.fill.solid()
    meta_card.fill.fore_color.rgb = NAVY_SURFACE
    meta_card.line.color.rgb = RGBColor(30, 58, 95)
    
    mtx = s1.shapes.add_textbox(Inches(1.0), Inches(1.3), Inches(5.3), Inches(5.6))
    mtf = mtx.text_frame
    mtf.word_wrap = True

    p = mtf.paragraphs[0]
    p.text = "PROBLEM STATEMENT DETAILS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = SAFFRON
    p.space_after = Pt(8)

    fields = [
        ("Problem Statement ID", "SIH26016"),
        ("Problem Statement Title", "Real-Time National Land Acquisition & Management System (NLAMS)"),
        ("Ministry / Department", "Ministry of Rural Development\nDepartment of Land Resources (DoLR)"),
        ("Theme / Domain", "Smart Governance, Infrastructure & Geospatial Systems"),
        ("Category", "Software Edition (Web, GIS & AI)")
    ]

    for label, val in fields:
        p = mtf.add_paragraph()
        p.text = f"{label}:"
        p.font.size = Pt(10)
        p.font.color.rgb = RGBColor(148, 163, 184)
        
        p = mtf.add_paragraph()
        p.text = val
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.space_after = Pt(6)

    # Team Grid (Right Card)
    team_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.15), Inches(5.73), Inches(5.9))
    team_card.fill.solid()
    team_card.fill.fore_color.rgb = NAVY_SURFACE
    team_card.line.color.rgb = RGBColor(30, 58, 95)

    ttx = s1.shapes.add_textbox(Inches(7.0), Inches(1.3), Inches(5.3), Inches(5.6))
    ttf = ttx.text_frame
    ttf.word_wrap = True

    p = ttf.paragraphs[0]
    p.text = "TEAM DETAILS — TEAM APEX"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = GREEN
    p.space_after = Pt(8)

    members = [
        ("Team Name", "APEX"),
        ("Team Leader", "Team Leader (Full-Stack & Statutory Workflow Lead)"),
        ("Member 2", "Geospatial & Cadastral GIS Architect (Leaflet / PostGIS)"),
        ("Member 3", "Backend & Financial Integration Engineer (FastAPI / PFMS)"),
        ("Member 4", "AI/ML Engineer (Scikit-Learn Delay Predictor)"),
        ("Member 5", "UI/UX & GIGW 3.0 Accessibility Designer"),
        ("Member 6", "QA, Database & Cloud Security Lead")
    ]

    for role, desc in members:
        p = ttf.add_paragraph()
        p.text = f"• {role}: {desc}"
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p.space_before = Pt(3)

    p = ttf.add_paragraph()
    p.text = "\nInstitute: Engineering & Technology Department"
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(148, 163, 184)

    # =========================================================================
    # SLIDE 2: PROPOSED SOLUTION / IDEA DESCRIPTION
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_official_sih_header(s2, "Idea / Solution Description — Core Innovation & Novelty", "02/08")

    # Left Box: Problem & Solution Concept
    c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(5.7), Inches(5.6))
    c1.fill.solid()
    c1.fill.fore_color.rgb = CARD_BG
    c1.line.color.rgb = BORDER_MAIN
    
    t1 = s2.shapes.add_textbox(Inches(0.95), Inches(1.5), Inches(5.4), Inches(5.3))
    tf = t1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "The Core Idea"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = NAVY_DARK

    bullets1 = [
        "NLAMS is a unified statutory enterprise platform digitizing India's public land acquisition lifecycle end-to-end under the RFCTLARR Act, 2013 and sector-specific central legislations (National Highways Act 1956, Railways Act 1989).",
        "Eliminates the 66% judicial pendency bottleneck by replacing subjective paper processes with deterministic mathematical engines and spatial verification.",
        "Directly addresses capital lock-in of ₹85,000+ Cr and slashes corridor acquisition time from 36 months down to 4 months."
    ]
    for b in bullets1:
        p = tf.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(11)
        p.font.color.rgb = BODY_TEXT
        p.space_before = Pt(6)

    # Right Box: Novelty / USP
    c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.35), Inches(5.73), Inches(5.6))
    c2.fill.solid()
    c2.fill.fore_color.rgb = CARD_BG
    c2.line.color.rgb = SAFFRON
    
    t2 = s2.shapes.add_textbox(Inches(6.95), Inches(1.5), Inches(5.4), Inches(5.3))
    tf2 = t2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Key Novelty & Unique Selling Proposition (USP)"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = SAFFRON

    usps = [
        "1. 14-Digit ULPIN Bhu-Aadhaar Spatial Lock: Instant API encumbrance lock on State RoRs (Bhulekh) upon Section 11 gazette, preventing fraudulent duplicate sales.",
        "2. Deterministic 9-Stage Legal Gatekeeper: Enforces strict legal sequence (SIA -> Sec 11 -> Sec 15 Inquiry -> Sec 19 -> Sec 23/3G Award -> Sec 38 Mutation).",
        "3. Audited First Schedule Valuation: Transparent arithmetic picking max(Circle Rate, 3-Yr Deeds, PPP) × Rural Multiplier + Assets + 100% Solatium + 12% Addl.",
        "4. PFMS Direct Benefit Transfer (DBT): ISO 20022 XML batch payments crediting farmers directly, eliminating intermediate commercial bank deposit floats.",
        "5. Inline Scikit-Learn Delay Predictor: Forecasts bottleneck stage and delays in days/months with prescriptive administrative mitigations."
    ]
    for u in usps:
        p = tf2.add_paragraph()
        p.text = f"★ {u}"
        p.font.size = Pt(10.5)
        p.font.color.rgb = BODY_TEXT
        p.space_before = Pt(5)

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH & ARCHITECTURE
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_official_sih_header(s3, "Technical Approach & Architecture — Methodology & Stack", "03/08")

    tech_cards = [
        ("Frontend Tier", "React 18 • Vite • Leaflet.js • Tailwind", [
            "GIGW 3.0 Government accessibility compliance.",
            "Dynamic A-/A/A+ font scaler & bilingual English/Hindi toggle.",
            "Interactive Leaflet GeoJSON cadastral polygon visualizer.",
            "Reactive parameter sliders for First Schedule award calculation."
        ], BLUE_ACCENT),
        ("Backend & ORM", "Python FastAPI • SQLAlchemy 2.0", [
            "Async REST architecture with Pydantic v2 validation.",
            "PostgreSQL / PostGIS geospatial engine with SQLite fallback.",
            "Deterministic 9-stage statutory workflow state machine.",
            "Class-3 DSC digital signatures and SHA-256 e-Gazette hash."
        ], SAFFRON),
        ("AI & Integrations", "Scikit-Learn • PM GatiShakti • PFMS", [
            "Scikit-Learn Random Forest delay prediction engine.",
            "Multi-variable risk scoring (Acreage, disputes, multiplier, forest).",
            "PFMS ISO 20022 XML batch direct bank credit generator.",
            "Automated state registry webhooks (UP Bhulekh, 7/12, Bhoomi)."
        ], GREEN)
    ]

    for i, (title, sub, bullets, clr) in enumerate(tech_cards):
        cx = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 3.98), Inches(1.35), Inches(3.8), Inches(5.6))
        cx.fill.solid()
        cx.fill.fore_color.rgb = CARD_BG
        cx.line.color.rgb = clr
        cx.line.width = Pt(1.5)
        
        ctx = s3.shapes.add_textbox(Inches(0.95 + i * 3.98), Inches(1.5), Inches(3.5), Inches(5.3))
        ctf = ctx.text_frame
        ctf.word_wrap = True
        
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        
        p = ctf.add_paragraph()
        p.text = sub
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = clr
        p.space_after = Pt(8)

        for b in bullets:
            p = ctf.add_paragraph()
            p.text = f"• {b}"
            p.font.size = Pt(10.5)
            p.font.color.rgb = BODY_TEXT
            p.space_before = Pt(4)

    # =========================================================================
    # SLIDE 4: FEASIBILITY & VIABILITY
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_official_sih_header(s4, "Feasibility & Viability — Technical, Operational & Economic", "04/08")

    feasibility = [
        ("Technical Feasibility", "100% Proven Open Stack", [
            "Built entirely on standard open-source tools (FastAPI, React, Leaflet, Scikit-Learn) with zero proprietary licensing costs.",
            "Microservices architecture enables seamless cloud containerization (Docker/Kubernetes) on NIC MeghRaj Government Cloud.",
            "Standard REST APIs with OpenAPI / Swagger documentation ready for immediate integration."
        ], BLUE_ACCENT),
        ("Operational Feasibility", "Full Legal & Institutional Alignment", [
            "Strictly maps to existing revenue roles: Requiring Bodies (NHAI/DFCCIL), CALA / District Collectors, SROs, and Landowners.",
            "Generates statutory bilingual e-Gazette (Form 11A) and Section 15 quasi-judicial hearing notices matching Indian court norms.",
            "Citizen-friendly portal requires zero login credentials for public ULPIN transparency."
        ], SAFFRON),
        ("Economic Viability", "High ROI & Macroeconomic Savings", [
            "Eliminates ₹ thousands of crores in idle commercial bank CALA parking floats via direct PFMS DBT.",
            "Reduces corridor project delay costs by an estimated ₹12,000+ Cr across national highway & railway packages.",
            "Zero operational cost for farmers accessing compensation estimate slips."
        ], GREEN)
    ]

    for i, (title, sub, bullets, clr) in enumerate(feasibility):
        cx = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 3.98), Inches(1.35), Inches(3.8), Inches(5.6))
        cx.fill.solid()
        cx.fill.fore_color.rgb = CARD_BG
        cx.line.color.rgb = clr
        cx.line.width = Pt(1.5)
        
        ctx = s4.shapes.add_textbox(Inches(0.95 + i * 3.98), Inches(1.5), Inches(3.5), Inches(5.3))
        ctf = ctx.text_frame
        ctf.word_wrap = True
        
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        
        p = ctf.add_paragraph()
        p.text = sub
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = clr
        p.space_after = Pt(8)

        for b in bullets:
            p = ctf.add_paragraph()
            p.text = f"• {b}"
            p.font.size = Pt(10.5)
            p.font.color.rgb = BODY_TEXT
            p.space_before = Pt(4)

    # =========================================================================
    # SLIDE 5: IMPACT & BENEFITS
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_official_sih_header(s5, "Impact & Benefits — Stakeholder & National Value", "05/08")

    impacts = [
        ("Farmers & Landowners", "Trust & Zero Leakage", [
            "Instant clarity on land acquisition stage via 14-digit ULPIN lookup.",
            "Printable statutory compensation breakdown slips detailing circle rate, solatium, and additional 12% amounts.",
            "Transparent online Section 15 grievance filing with guaranteed quasi-judicial hearing notices.",
            "Direct bank account credit via PFMS without intermediate bribery or delay."
        ], GREEN),
        ("Government & CALA Officers", "Speed & Legal Immunity", [
            "Automated state machine prevents procedural violations that cause high court stay orders.",
            "Automated bilingual gazette drafting and instant State RoR encumbrance locking.",
            "R&R tracking dashboard monitoring Second Schedule monetary grants and Third Schedule civic amenities.",
            "AI bottleneck forecaster alerts leadership before projects exceed statutory 12-month lapse limits."
        ], BLUE_ACCENT),
        ("National Economy", "Accelerating Viksit Bharat 2047", [
            "Slashes public infrastructure land acquisition cycle from 36 months to 4 months.",
            "Reduces land acquisition civil litigation by an estimated 80%.",
            "Ensures seamless delivery of PM GatiShakti National Master Plan corridor targets.",
            "Creates conclusive, drone-verified state land titles under DILRMP."
        ], SAFFRON)
    ]

    for i, (title, sub, bullets, clr) in enumerate(impacts):
        cx = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 3.98), Inches(1.35), Inches(3.8), Inches(5.6))
        cx.fill.solid()
        cx.fill.fore_color.rgb = CARD_BG
        cx.line.color.rgb = clr
        cx.line.width = Pt(1.5)
        
        ctx = s5.shapes.add_textbox(Inches(0.95 + i * 3.98), Inches(1.5), Inches(3.5), Inches(5.3))
        ctf = ctx.text_frame
        ctf.word_wrap = True
        
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        
        p = ctf.add_paragraph()
        p.text = sub
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = clr
        p.space_after = Pt(8)

        for b in bullets:
            p = ctf.add_paragraph()
            p.text = f"• {b}"
            p.font.size = Pt(10.5)
            p.font.color.rgb = BODY_TEXT
            p.space_before = Pt(4)

    # =========================================================================
    # SLIDE 6: RESEARCH & PRIOR ART / COMPETITIVE MATRIX
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_official_sih_header(s6, "Research & Prior Art — Comparative Analysis", "06/08")

    # Left: Comparison Table
    c_comp = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(7.5), Inches(5.6))
    c_comp.fill.solid()
    c_comp.fill.fore_color.rgb = CARD_BG
    c_comp.line.color.rgb = BORDER_MAIN
    
    t_comp = s6.shapes.add_textbox(Inches(0.95), Inches(1.5), Inches(7.2), Inches(5.3))
    tf_c = t_comp.text_frame
    tf_c.word_wrap = True
    
    p = tf_c.paragraphs[0]
    p.text = "Competitive Benchmark: Existing Portals vs NLAMS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = NAVY_DARK
    p.space_after = Pt(10)

    features = [
        ("Feature / Capability", "BhoomRaashi (MoRTH)", "State RoRs (Bhulekh)", "NLAMS (Team APEX)"),
        ("1. Multi-Ministry Coverage", "NHAI Only", "Single State Only", "Universal (NHAI, Rail, Power, State)"),
        ("2. Cadastral GIS Polygons", "No (PDF Only)", "Tabular Only", "Live GeoJSON Vector Cadastre"),
        ("3. ULPIN Auto-Encumbrance", "No", "Manual", "Real-Time API Locking on Sec 11"),
        ("4. Statutory First Schedule Math", "Manual Entry", "N/A", "Automated Audited Evaluator"),
        ("5. PFMS DBT ISO 20022", "Bank Deposit Float", "Manual Voucher", "Automated Direct Bank Credit"),
        ("6. AI Delay-Risk Predictor", "None", "None", "Scikit-Learn Random Forest Engine"),
        ("7. R&R 2nd/3rd Schedule", "Ignored", "Not Tracked", "Full PAF & Civic Amenities Ledger")
    ]

    for f, b_m, s_r, nl in features:
        p = tf_c.add_paragraph()
        p.text = f"{f:32} | {b_m:18} | {s_r:16} | {nl}"
        p.font.size = Pt(9.5)
        p.font.name = "JetBrains Mono"
        p.font.color.rgb = NAVY_DARK if "NLAMS" in nl else BODY_TEXT
        p.space_before = Pt(2)

    # Right: Why Others Fail
    c_why = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.5), Inches(1.35), Inches(4.03), Inches(5.6))
    c_why.fill.solid()
    c_why.fill.fore_color.rgb = CARD_BG
    c_why.line.color.rgb = SAFFRON
    
    t_why = s6.shapes.add_textbox(Inches(8.65), Inches(1.5), Inches(3.7), Inches(5.3))
    tf_w = t_why.text_frame
    tf_w.word_wrap = True
    
    p = tf_w.paragraphs[0]
    p.text = "Why Existing Systems Fail"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = SAFFRON
    p.space_after = Pt(8)

    reasons = [
        "Siloed Islands: BhoomRaashi only digitizes gazette drafting for highways, leaving valuation, disputes, and R&R disconnected.",
        "Manual Valuation Discretion: Manual rate calculations create massive discrepancies leading to high court litigation.",
        "No Registry Synchronization: Landowners sell notified parcels to unsuspecting buyers because state land registries aren't locked automatically.",
        "NLAMS solves all 4 failure points in a single sovereign platform."
    ]
    for r in reasons:
        p = tf_w.add_paragraph()
        p.text = f"• {r}"
        p.font.size = Pt(10.5)
        p.font.color.rgb = BODY_TEXT
        p.space_before = Pt(4)

    # =========================================================================
    # SLIDE 7: POTENTIAL CHALLENGES & RISKS WITH MITIGATIONS
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_official_sih_header(s7, "Potential Challenges & Risks with Mitigations", "07/08")

    challenges = [
        ("1. Heterogeneous State Revenue Formats", "Challenge: Different states use varying nomenclature (Khasra in UP, Gat in MH, Survey No in KA).\n\nMitigation: NLAMS implements a Unified Revenue Adapter layer normalizing all regional records into 14-digit ULPIN standards.", BLUE_ACCENT),
        ("2. Digital Divide in Rural Areas", "Challenge: Smallholder farmers may lack digital literacy or smartphone access.\n\nMitigation: GIGW 3.0 accessibility standards, full Hindi/English bilingual UI, CSC (Common Service Center) kiosk mode, and zero-login ULPIN lookup.", SAFFRON),
        ("3. Title Disputes & Co-parcenary Claims", "Challenge: Multiple heirs claiming ownership on a single notified Khasra parcel.\n\nMitigation: Section 15 quasi-judicial objection tribunal with Section 77 escrow court deposit mechanisms to prevent corridor stalls.", GREEN),
        ("4. Cybersecurity & Record Tampering", "Challenge: Threat of unauthorized alteration of compensation amounts or land boundaries.\n\nMitigation: Class-3 DSC digital signatures, SHA-256 integrity logs, and read-only immutable audit trails.", RGBColor(185, 28, 28))
    ]

    for i, (title, desc, clr) in enumerate(challenges):
        row = i // 2
        col = i % 2
        
        cx = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + col * 5.95), Inches(1.35 + row * 2.85), Inches(5.75), Inches(2.65))
        cx.fill.solid()
        cx.fill.fore_color.rgb = CARD_BG
        cx.line.color.rgb = clr
        cx.line.width = Pt(1.5)
        
        ctx = s7.shapes.add_textbox(Inches(0.95 + col * 5.95), Inches(1.45 + row * 2.85), Inches(5.45), Inches(2.45))
        ctf = ctx.text_frame
        ctf.word_wrap = True
        
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = clr
        p.space_after = Pt(4)

        for line in desc.split("\n\n"):
            p = ctf.add_paragraph()
            p.text = line
            p.font.size = Pt(10.5)
            p.font.color.rgb = BODY_TEXT
            p.space_before = Pt(2)

    # =========================================================================
    # SLIDE 8: FUTURE SCOPE & ROADMAP
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_official_sih_header(s8, "Future Scope & Roadmap — National Deployment Plan", "08/08")

    roadmap = [
        ("Phase 1: Working Prototype", "Months 1 - 3 (Current SIH Stage)", [
            "8 core functional modules built and tested.",
            "Tested across 4 real national corridors (Varanasi, Nagpur, Bengaluru Rural, Ludhiana).",
            "Scikit-learn delay-risk predictor active."
        ], GREEN),
        ("Phase 2: State RoR Pilot", "Months 4 - 6", [
            "Live API pilot integration with UP Bhulekh and MahaBhulekh 7/12.",
            "CALA Digital Tribunal rollout in 10 high-density infrastructure districts.",
            "PFMS Aadhaar Payment Bridge (APBS) live settlement."
        ], BLUE_ACCENT),
        ("Phase 3: National GatiShakti Scale", "Months 7 - 12", [
            "Pan-India integration with PM GatiShakti NMP (BiSAG-N) platform.",
            "Drone-based SVAMITVA high-resolution 3D parcel boundary integration.",
            "Transition to Conclusive Land Titling with state-backed title guarantees under DILRMP."
        ], SAFFRON)
    ]

    for i, (title, sub, bullets, clr) in enumerate(roadmap):
        cx = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 3.98), Inches(1.35), Inches(3.8), Inches(4.3))
        cx.fill.solid()
        cx.fill.fore_color.rgb = CARD_BG
        cx.line.color.rgb = clr
        cx.line.width = Pt(1.5)
        
        ctx = s8.shapes.add_textbox(Inches(0.95 + i * 3.98), Inches(1.5), Inches(3.5), Inches(4.0))
        ctf = ctx.text_frame
        ctf.word_wrap = True
        
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        
        p = ctf.add_paragraph()
        p.text = sub
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = clr
        p.space_after = Pt(8)

        for b in bullets:
            p = ctf.add_paragraph()
            p.text = f"• {b}"
            p.font.size = Pt(10.5)
            p.font.color.rgb = BODY_TEXT
            p.space_before = Pt(4)

    # Bottom summary box
    sum_box = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.8), Inches(11.73), Inches(1.15))
    sum_box.fill.solid()
    sum_box.fill.fore_color.rgb = NAVY_DARK
    sum_box.line.color.rgb = NAVY_DARK

    stx = s8.shapes.add_textbox(Inches(1.0), Inches(5.85), Inches(11.3), Inches(1.0))
    stf = stx.text_frame
    stf.word_wrap = True
    p = stf.paragraphs[0]
    p.text = "TEAM APEX CONCLUSION — SMART INDIA HACKATHON 2026 (SIH26016)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(253, 186, 116)
    
    p = stf.add_paragraph()
    p.text = "NLAMS delivers a sovereign, auditable digital infrastructure for India's public land acquisition—cutting timelines by 85%, eliminating 80% litigation, and protecting farmers' statutory rights under the Ministry of Rural Development (DoLR). Thank you!"
    p.font.size = Pt(11.5)
    p.font.color.rgb = WHITE
    p.space_before = Pt(2)

    # Save presentation
    output_path = os.path.join(os.path.dirname(__file__), "NLAMS_SIH_Official_Template.pptx")
    prs.save(output_path)
    print(f"Successfully generated Official SIH 8-Slide Presentation at: {output_path}")

    # Also attempt to update NLAMS_SIH_Presentation.pptx if not locked
    alt_path = os.path.join(os.path.dirname(__file__), "NLAMS_SIH_Presentation.pptx")
    try:
        prs.save(alt_path)
        print(f"Successfully synchronized: {alt_path}")
    except PermissionError:
        print(f"Note: {alt_path} is currently open in PowerPoint; saved to {output_path}")

if __name__ == "__main__":
    create_sih_official_deck()
