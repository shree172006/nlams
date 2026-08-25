import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # Set 16:9 widescreen slides (13.33 x 7.5 inches)
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.5)
    
    # Official Palette
    NAVY_DARK = RGBColor(7, 25, 51)
    NAVY_PRIMARY = RGBColor(10, 37, 88)
    SAFFRON = RGBColor(234, 88, 12)
    GREEN = RGBColor(10, 123, 62)
    WHITE = RGBColor(255, 255, 255)
    GRAY_TEXT = RGBColor(100, 116, 139)
    LIGHT_BG = RGBColor(245, 247, 250)
    CARD_BG = RGBColor(255, 255, 255)

    blank_layout = prs.slide_layouts[6] # completely blank layout

    def add_header(slide, title_text, category_text="STATUTORY ARCHITECTURE • SMART INDIA HACKATHON"):
        # Header background banner
        header_box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.33), Inches(1.15))
        header_box.fill.solid()
        header_box.fill.fore_color.rgb = NAVY_DARK
        header_box.line.color.rgb = NAVY_DARK
        
        # Tricolor accent stripe below header
        stripe_s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(1.15), Inches(4.44), Inches(0.06))
        stripe_s.fill.solid()
        stripe_s.fill.fore_color.rgb = SAFFRON
        stripe_s.line.color.rgb = SAFFRON
        
        stripe_w = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(4.44), Inches(1.15), Inches(4.44), Inches(0.06))
        stripe_w.fill.solid()
        stripe_w.fill.fore_color.rgb = WHITE
        stripe_w.line.color.rgb = WHITE
        
        stripe_g = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(8.88), Inches(1.15), Inches(4.45), Inches(0.06))
        stripe_g.fill.solid()
        stripe_g.fill.fore_color.rgb = GREEN
        stripe_g.line.color.rgb = GREEN

        # Title text
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.12), Inches(11.7), Inches(0.9))
        tf = txBox.text_frame
        tf.word_wrap = True
        
        p0 = tf.paragraphs[0]
        p0.text = category_text
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = RGBColor(253, 186, 116)
        
        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.size = Pt(20)
        p1.font.bold = True
        p1.font.color.rgb = WHITE

    # ================= SLIDE 1: TITLE SLIDE =================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.33), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = NAVY_DARK
    bg1.line.color.rgb = NAVY_DARK

    # Tricolor bar
    tb1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(11.73), Inches(0.08))
    tb1.fill.solid()
    tb1.fill.fore_color.rgb = SAFFRON
    tb1.line.color.rgb = SAFFRON

    # Title box
    tbox1 = slide1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.73), Inches(4.5))
    tf1 = tbox1.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "DEPARTMENT OF LAND RESOURCES (DoLR) • MINISTRY OF RURAL DEVELOPMENT"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = RGBColor(253, 186, 116)
    
    p = tf1.add_paragraph()
    p.text = "NLAMS: Real-Time National Land Acquisition & Management System"
    p.font.size = Pt(30)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.space_before = Pt(14)
    p.space_after = Pt(14)

    p = tf1.add_paragraph()
    p.text = "A Unified Statutory Microservice Platform Enforcing RFCTLARR Act 2013 & Sector-Specific Infrastructure Acts"
    p.font.size = Pt(15)
    p.font.color.rgb = RGBColor(203, 213, 225)
    
    # Metadata footer box
    meta_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.6), Inches(11.73), Inches(1.1))
    meta_box.fill.solid()
    meta_box.fill.fore_color.rgb = NAVY_PRIMARY
    meta_box.line.color.rgb = RGBColor(30, 58, 138)
    
    mtf = meta_box.text_frame
    mtf.word_wrap = True
    mp = mtf.paragraphs[0]
    mp.text = "Team: Technical Lead | Girl 1 (Lead) | Girl 2 (Researcher) | Girl 3 (Pitcher) | Girl 4 (Frontend) | Boy 1 (DevOps)"
    mp.font.size = Pt(11)
    mp.font.bold = True
    mp.font.color.rgb = WHITE
    
    mp2 = mtf.add_paragraph()
    mp2.text = "Core Standards: IndEA 2.0 • 14-Digit ULPIN (Bhu-Aadhaar) • PFMS Direct Benefit Transfer (DBT) • GIGW 3.0"
    mp2.font.size = Pt(10)
    mp2.font.color.rgb = RGBColor(147, 197, 253)

    # ================= SLIDE 2: THE PROBLEM =================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "The Real Problem: Macroeconomic Crisis in Public Land Acquisition", "STRATEGIC CONTEXT & BOTTLENECKS")
    
    # 3 Problem Cards
    card_data = [
        ("66% Civil Litigation", "Over two-thirds of all pending civil suits in Indian courts are tied to land and property acquisition disputes, causing massive infrastructure gridlocks.", SAFFRON),
        ("20-Year Judicial Pendency", "Contested land acquisition cases suffer an average delay of two decades, halting highways, freight corridors, and power transmission lines.", RGBColor(220, 38, 38)),
        ("1.3% GDP Macroeconomic Loss", "Cumulative capital lock-in from stalled projects and uncoordinated inter-agency clearances costs the Indian economy over ₹ trillions annually.", NAVY_PRIMARY)
    ]
    
    for i, (title, desc, color) in enumerate(card_data):
        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i*4.0), Inches(1.6), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = color
        card.line.width = Pt(2)
        
        ctf = card.text_frame
        ctf.word_wrap = True
        
        cp0 = ctf.paragraphs[0]
        cp0.text = f"0{i+1}"
        cp0.font.size = Pt(24)
        cp0.font.bold = True
        cp0.font.color.rgb = color
        
        cp1 = ctf.add_paragraph()
        cp1.text = title
        cp1.font.size = Pt(16)
        cp1.font.bold = True
        cp1.font.color.rgb = NAVY_DARK
        cp1.space_before = Pt(8)
        cp1.space_after = Pt(12)
        
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.size = Pt(12)
        cp2.font.color.rgb = GRAY_TEXT

    # ================= SLIDE 3: SOLUTION & ARCHITECTURE =================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "The Solution: Unified NLAMS Microservice Platform", "ENTERPRISE ARCHITECTURE")

    # 4 Architecture Pillars
    pillars = [
        ("1. Spatial Cadastral Ingestion", "Ingests KML/GeoJSON alignments and intersects with cadastral maps using 14-digit ULPIN (Bhu-Aadhaar)."),
        ("2. 9-Stage Statutory Gatekeeper", "Deterministic state machine enforcing RFCTLARR Act 2013 & NH Act 1956 milestones with zero illegal skipping."),
        ("3. First Schedule Valuation Engine", "Automated math: Max(Circle, Sales) × Rural Factor + Assets + 100% Solatium + 12% Additional Amount."),
        ("4. Direct PFMS DBT Settlement", "Direct bank account credit to project-affected landholders, eliminating intermediate CALA holding account floats.")
    ]
    for i, (p_title, p_desc) in enumerate(pillars):
        x = Inches(0.8 + (i % 2) * 5.9)
        y = Inches(1.6 + (i // 2) * 2.5)
        
        box = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.6), Inches(2.2))
        box.fill.solid()
        box.fill.fore_color.rgb = WHITE
        box.line.color.rgb = RGBColor(203, 213, 225)
        
        btf = box.text_frame
        btf.word_wrap = True
        bp0 = btf.paragraphs[0]
        bp0.text = p_title
        bp0.font.size = Pt(14)
        bp0.font.bold = True
        bp0.font.color.rgb = NAVY_PRIMARY
        
        bp1 = btf.add_paragraph()
        bp1.text = p_desc
        bp1.font.size = Pt(11.5)
        bp1.font.color.rgb = GRAY_TEXT
        bp1.space_before = Pt(6)

    # ================= SLIDE 4: 9-STAGE WORKFLOW =================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "Deterministic 9-Stage Statutory Gatekeeper Workflow", "LIFECYCLE ENGINEERING")

    stages_text = [
        "1. Proposal & Alignment (Sec 4 / 3A)",
        "2. Social Impact Assessment (SIA)",
        "3. Preliminary Gazette & ULPIN Lock (Sec 11)",
        "4. Objection Management & Inquiry (Sec 15)",
        "5. Final Declaration of Acquisition (Sec 19)",
        "6. First Schedule Award & PFMS DBT (Sec 23)",
        "7. R&R Schedules II & III Execution",
        "8. Physical Possession & RoR Mutation (Sec 38)",
        "9. Dispute Reference Sync with e-Courts"
    ]
    for i, st in enumerate(stages_text):
        row = i // 3
        col = i % 3
        s_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + col * 4.0), Inches(1.6 + row * 1.7), Inches(3.7), Inches(1.4))
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = WHITE
        s_box.line.color.rgb = SAFFRON if i in [2, 5, 7] else NAVY_PRIMARY
        
        stf = s_box.text_frame
        stf.word_wrap = True
        sp0 = stf.paragraphs[0]
        sp0.text = f"STAGE 0{i+1}"
        sp0.font.size = Pt(9)
        sp0.font.bold = True
        sp0.font.color.rgb = SAFFRON
        
        sp1 = stf.add_paragraph()
        sp1.text = st
        sp1.font.size = Pt(11)
        sp1.font.bold = True
        sp1.font.color.rgb = NAVY_DARK

    # ================= SLIDE 5: VALUATION MATH =================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "First Schedule Algorithmic Compensation Engine", "MATHEMATICAL FORMULATION")

    # Big Formula Card
    f_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(11.73), Inches(4.9))
    f_card.fill.solid()
    f_card.fill.fore_color.rgb = WHITE
    f_card.line.color.rgb = GREEN
    f_card.line.width = Pt(2)

    ftf = f_card.text_frame
    ftf.word_wrap = True
    
    fp0 = ftf.paragraphs[0]
    fp0.text = "STATUTORY MATHEMATICAL FORMULA (RFCTLARR ACT 2013 SEC 26-30):"
    fp0.font.size = Pt(12)
    fp0.font.bold = True
    fp0.font.color.rgb = GREEN
    
    fp1 = ftf.add_paragraph()
    fp1.text = "Gross Total Award = Base Compensation (C_Base) + 100% Solatium + 12% p.a. Additional Amount"
    fp1.font.size = Pt(16)
    fp1.font.bold = True
    fp1.font.color.rgb = NAVY_DARK
    fp1.space_before = Pt(8)
    
    items = [
        "1. Base Unit Market Value (Sec 26): Max(Stamp Act Circle Rate, Top 50% 3-Year Registered Sale Deeds, Consented PPP Rate)",
        "2. Multiplication Factor (Sec 26(2)): Urban = 1.0x | Rural 0-10 km = 1.25x | Rural 10-20 km = 1.50x | Rural >20 km = 2.00x",
        "3. Attached Assets (Sec 29): Structural Valuation + Standing Timber/Trees + Crop Yield Valuation",
        "4. Base Compensation (C_Base): (Base Unit Market Value × Area × Multiplication Factor) + Assets Valuation",
        "5. Mandatory Solatium (Sec 30(1)): 100% of Base Compensation (C_Base)",
        "6. Additional Amount (Sec 30(3)): 12% per annum on Base Market Value from Sec 11 Notification Date to Award Date"
    ]
    for item in items:
        p = ftf.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(11.5)
        p.font.color.rgb = GRAY_TEXT
        p.space_before = Pt(4)

    # ================= SLIDE 6: ULPIN & SPATIAL ENGINE =================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "14-Digit ULPIN (Bhu-Aadhaar) & State Land Record Sync", "SPATIAL FUSION")

    f_left = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(5.7), Inches(4.9))
    f_left.fill.solid()
    f_left.fill.fore_color.rgb = WHITE
    f_left.line.color.rgb = RGBColor(203, 213, 225)
    ltf = f_left.text_frame
    ltf.word_wrap = True
    
    lp0 = ltf.paragraphs[0]
    lp0.text = "ULPIN Encumbrance Locking"
    lp0.font.size = Pt(15)
    lp0.font.bold = True
    lp0.font.color.rgb = NAVY_PRIMARY
    
    l_points = [
        "• Automatic ULPIN Generation: 14-digit alphanumeric code generated for every surveyed cadastral parcel.",
        "• Section 11 Webhook Freezing: The moment CALA publishes preliminary notice, an API call locks the parcel in State Land Registries.",
        "• Stops Fraudulent Sales: Completely prevents distress sales or illegal constructions to claim inflated compensation.",
        "• Split Corridor Strips: Parent ULPIN subdivided into new child ULPIN for acquired Right-of-Way."
    ]
    for pt in l_points:
        p = ltf.add_paragraph()
        p.text = pt
        p.font.size = Pt(11.5)
        p.font.color.rgb = GRAY_TEXT
        p.space_before = Pt(6)

    f_right = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.6), Inches(5.7), Inches(4.9))
    f_right.fill.solid()
    f_right.fill.fore_color.rgb = WHITE
    f_right.line.color.rgb = RGBColor(203, 213, 225)
    rtf = f_right.text_frame
    rtf.word_wrap = True
    
    rp0 = rtf.paragraphs[0]
    rp0.text = "Pan-India Revenue Nomenclature Normalization"
    rp0.font.size = Pt(15)
    rp0.font.bold = True
    rp0.font.color.rgb = NAVY_PRIMARY
    
    states_nom = [
        "• Uttar Pradesh / MP / Delhi: Khasra / Khatauni (Bhulekh)",
        "• Maharashtra / Gujarat: 7/12 & 8A Extract (Mahabhulekh)",
        "• Karnataka: RTC (Pahani) / Bhoomi Mutation Extract",
        "• Tamil Nadu / Andhra Pradesh: Patta / Chitta (Meebhoomi)",
        "• Punjab / Haryana: Jamabandi / Khasra Girdawari (Fard)"
    ]
    for sn in states_nom:
        p = rtf.add_paragraph()
        p.text = sn
        p.font.size = Pt(11.5)
        p.font.color.rgb = GRAY_TEXT
        p.space_before = Pt(6)

    # ================= SLIDE 7: 140-POINT VIKAS FRAMEWORK =================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "140-Point Vikas Performance Scoring Matrix (DoLR)", "ACCOUNTABILITY & BENCHMARKING")

    vikas_items = [
        ("Process Velocity (40 Pts)", "Measures adherence to statutory stage-gate timelines from proposal to physical possession.", SAFFRON),
        ("Financial & DBT (40 Pts)", "Evaluates % of compensation paid directly via PFMS DBT; penalizes idle CALA holding account balances.", GREEN),
        ("Social & R&R (40 Pts)", "Tracks execution of 11 Second Schedule monetary entitlements and 25 Third Schedule civic amenities.", NAVY_PRIMARY),
        ("Spatial & Mutation (20 Pts)", "Scores % of parcels assigned 14-digit ULPINs and revenue record mutations within 30 days of possession.", RGBColor(124, 58, 237))
    ]
    for i, (v_title, v_desc, v_col) in enumerate(vikas_items):
        v_card = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i*2.95), Inches(1.6), Inches(2.8), Inches(4.8))
        v_card.fill.solid()
        v_card.fill.fore_color.rgb = WHITE
        v_card.line.color.rgb = v_col
        v_card.line.width = Pt(2)
        
        vtf = v_card.text_frame
        vtf.word_wrap = True
        
        vp0 = vtf.paragraphs[0]
        vp0.text = v_title
        vp0.font.size = Pt(13)
        vp0.font.bold = True
        vp0.font.color.rgb = v_col
        
        vp1 = vtf.add_paragraph()
        vp1.text = v_desc
        vp1.font.size = Pt(11)
        vp1.font.color.rgb = GRAY_TEXT
        vp1.space_before = Pt(10)

    # ================= SLIDE 8: JUDGE Q&A DEFENSES =================
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "Key Judge Q&A Defenses (Pitcher Strategy)", "COMPLIANCE & LEGAL RIGOR")

    qa_list = [
        ("Q: Land is a State subject. How does a Central portal force compliance?", "A: RFCTLARR Act 2013 is under Concurrent List (Entry 42). Central agencies fund 100% of compensation. NLAMS integrates with state land portals via open APIs and incentivizes states via 140-Point Vikas Scores."),
        ("Q: How does NLAMS eliminate financial corruption?", "A: PFMS Direct Benefit Transfer (DBT) routes funds directly from Central Ministry accounts to verified landholder bank accounts via Aadhaar Payment Bridge (APBS), eliminating intermediate CALA bank floats."),
        ("Q: How do you handle title disputes without stalling national projects?", "A: Section 64 reference mechanism deposits disputed funds into Civil Court / LARR Authority escrow, allowing physical possession (Sec 38) to proceed without delaying national corridor construction.")
    ]
    for i, (q, a) in enumerate(qa_list):
        qa_box = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6 + i*1.7), Inches(11.73), Inches(1.5))
        qa_box.fill.solid()
        qa_box.fill.fore_color.rgb = WHITE
        qa_box.line.color.rgb = RGBColor(203, 213, 225)
        
        qtf = qa_box.text_frame
        qtf.word_wrap = True
        qp0 = qtf.paragraphs[0]
        qp0.text = q
        qp0.font.size = Pt(12)
        qp0.font.bold = True
        qp0.font.color.rgb = NAVY_PRIMARY
        
        qp1 = qtf.add_paragraph()
        qp1.text = a
        qp1.font.size = Pt(11)
        qp1.font.color.rgb = GRAY_TEXT
        qp1.space_before = Pt(4)

    # ================= SLIDE 9: CONCLUSION =================
    slide9 = prs.slides.add_slide(blank_layout)
    bg9 = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.33), Inches(7.5))
    bg9.fill.solid()
    bg9.fill.fore_color.rgb = NAVY_DARK
    bg9.line.color.rgb = NAVY_DARK

    c_box = slide9.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.73), Inches(5.0))
    ctf = c_box.text_frame
    ctf.word_wrap = True
    
    cp0 = ctf.paragraphs[0]
    cp0.text = "TRANSFORMING INDIA'S INFRASTRUCTURE GOVERNANCE"
    cp0.font.size = Pt(13)
    cp0.font.bold = True
    cp0.font.color.rgb = RGBColor(253, 186, 116)
    
    cp1 = ctf.add_paragraph()
    cp1.text = "NLAMS: Transparent, Accountable & Conclusive Land Administration"
    cp1.font.size = Pt(28)
    cp1.font.bold = True
    cp1.font.color.rgb = WHITE
    cp1.space_before = Pt(10)
    
    cp2 = ctf.add_paragraph()
    cp2.text = "• Cycle Time Reduction: 36 months down to 4 months for complete statutory clearance\n• Litigation Drop: 80% decrease in land valuation disputes due to mathematical transparency\n• Fiscal Security: Eliminates ₹ thousands of crores in idle CALA deposit floats\n• Conclusive Titling: Accelerates India's transition to state-guaranteed titles under DILRMP"
    cp2.font.size = Pt(15)
    cp2.font.color.rgb = RGBColor(203, 213, 225)
    cp2.space_before = Pt(20)

    # Save presentation
    output_path = os.path.join(os.path.dirname(__file__), "NLAMS_SIH_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully at: {output_path}")

if __name__ == "__main__":
    create_deck()
