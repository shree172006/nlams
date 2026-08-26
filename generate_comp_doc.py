import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_comp_doc():
    doc = docx.Document()

    # Page Margins
    for section in doc.sections:
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
    r_main.font.size = Pt(18)
    r_main.font.bold = True
    r_main.font.color.rgb = navy

    r_doc = p_title.add_run("COMPREHENSIVE COMPETITIVE ANALYSIS & MARKET ADVANTAGE\nSmart India Hackathon (SIH) — Problem Statement ID: 26016\n")
    r_doc.font.name = "Arial"
    r_doc.font.size = Pt(11)
    r_doc.font.bold = True
    r_doc.font.color.rgb = saffron

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # Summary Callout Box
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    p_box = cell.paragraphs[0]
    r_box_title = p_box.add_run("📌 STRATEGIC MARKET CONTEXT\n")
    r_box_title.bold = True
    r_box_title.font.color.rgb = navy
    r_box_desc = p_box.add_run(
        "In India's current governance ecosystem, public land acquisition is plagued by fragmented, siloed, and state-specific legacy systems. "
        "NLAMS replaces paper-based delays and disjointed portals with a unified, statutory digital infrastructure that connects Central Ministries, "
        "State Revenue Departments, District Collectors, Competent Authorities (CALAs), and affected Citizens."
    )
    r_box_desc.font.size = Pt(9.5)
    r_box_desc.font.color.rgb = slate

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Section 1: Detailed Comparison Table
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)
    r1 = h1.add_run("1. COMPETITIVE COMPARISON MATRIX")
    r1.font.name = "Arial"
    r1.font.size = Pt(13)
    r1.font.bold = True
    r1.font.color.rgb = navy

    comp_table = doc.add_table(rows=1, cols=4)
    comp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Existing System / Platform", "Current Focus & Scope", "Critical Gaps & Limitations", "Why NLAMS is Superior"]
    for i, h in enumerate(headers):
        c = comp_table.cell(0, i)
        set_cell_background(c, "071426")
        set_cell_margins(c, top=100, bottom=100, left=120, right=120)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    comp_data = [
        (
            "BhoomiRashi\n(MoRTH / NIC)",
            "National Highways Only (NH Act 1956)",
            "• Limited exclusively to NHAI highway projects.\n• Zero multi-sector RFCTLARR Act 2013 coverage.\n• No real-time GIS parcel vector overlays.\n• No Second Schedule R&R tracking.\n• No Section 64 LARRDA tribunal docketing.",
            "Unified multi-sector platform (Highways, Railways, Industrial Corridors, State Infra) with live cadastral GIS overlays and automated R&R ledgers."
        ),
        (
            "State Bhulekh Portals\n(UP Bhulekh, MahaBhulekh, Bhoomi KA)",
            "State Land Records & Tehsil Mutation",
            "• Fragmented across 28 states with zero national standardization.\n• Cannot manage multi-district linear infrastructure corridors.\n• No automated First Schedule statutory valuation math.",
            "Integrates 14-digit ULPIN (Bhu-Aadhaar) to automatically lock records across state registries the instant Section 11 is notified."
        ),
        (
            "PM Gati Shakti NMP\n(MoCI / BISAG-N)",
            "Macro Multi-Modal Infrastructure Planning",
            "• High-level macro planning tool only.\n• Does not handle micro-level compensation, Section 15 inquiries, award slips, or PFMS DBT payouts.",
            "Operates at the grassroots micro-execution level, executing actual awards, public hearings, and PFMS direct benefit transfers."
        ),
        (
            "Commercial Systems\n(Trimble Landfolio, Esri Parcel Fabric)",
            "Global Proprietary Enterprise Land Mgmt",
            "• Multi-million dollar proprietary licensing costs.\n• Not customized for Indian statutory acts (RFCTLARR 2013).\n• Zero native integration with PFMS, Aadhaar, or ULPIN.",
            "Purpose-built on modern open-source web and mobile technologies, customized for Indian statutory compliance at zero license fee."
        )
    ]

    for row_idx, row in enumerate(comp_data):
        r_elem = comp_table.add_row()
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
            elif col_idx == 3:
                r.bold = True
                r.font.color.rgb = RGBColor(5, 150, 105)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Section 2: The 4 Winning Differentiators
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(6)
    r2 = h2.add_run("2. THE 4 UNMATCHED WINNING DIFFERENTIATORS OF NLAMS")
    r2.font.name = "Arial"
    r2.font.size = Pt(13)
    r2.font.bold = True
    r2.font.color.rgb = navy

    differentiators = [
        ("1. Automated 14-Digit ULPIN Encumbrance Locking", 
         "Existing systems permit fraudulent property sales after acquisition notices because registry databases are disconnected. NLAMS automatically locks the parcel in the state Bhulekh registry the instant Section 11 is notified, blocking illicit transfers."),
        ("2. End-to-End Quasi-Judicial Dispute Resolution (LARRDA & High Court)", 
         "80% of project delays in India stem from litigation lost in paper files. NLAMS provides dedicated tribunal docketing under Section 64 with mandatory 90-day Collector timers and 60-day High Court appeal windows (Section 74)."),
        ("3. On-Ground Mobile Survey App with Offline Caching (Flutter)", 
         "Surveyors traditionally use physical registers, creating 6 to 12 months of manual data entry lag. NLAMS mobile app captures GPS geo-coordinates, tree/structure asset enumerations, and auto-syncs to the cloud."),
        ("4. Predictive AI Delay-Risk Engine", 
         "Existing tools only provide retrospective reporting after delays occur. NLAMS AI forecasting engine predicts milestone lag in months and prescribes proactive administrative and legal mitigations.")
    ]

    for title, desc in differentiators:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(4)
        r_t = p.add_run(f"{title}: ")
        r_t.bold = True
        r_t.font.color.rgb = saffron
        r_t.font.size = Pt(9.5)
        r_d = p.add_run(desc)
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = slate

    doc.add_paragraph().paragraph_format.space_after = Pt(20)

    # Footer note
    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_foot = p_foot.add_run("— END OF COMPETITIVE ANALYSIS DOCUMENT —\nNational Land Acquisition & Management System (NLAMS) • Ministry of Rural Development")
    r_foot.font.size = Pt(8.5)
    r_foot.font.color.rgb = slate
    r_foot.italic = True

    # Save in both G: and F:\sih_proj\TECH_INFO\
    paths_to_save = [
        r"G:\NLAMS_COMP.docx",
        r"f:\sih_proj\TECH_INFO\NLAMS_COMP.docx"
    ]

    for path in paths_to_save:
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            doc.save(path)
            print(f"Successfully saved: {path}")
        except Exception as e:
            print(f"Error saving to {path}: {e}")

if __name__ == "__main__":
    create_comp_doc()
