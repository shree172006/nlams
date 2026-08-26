# Real-Time National Land Acquisition & Management System (NLAMS)

> **Smart India Hackathon (SIH) 2026** • **Problem Statement ID: SIH26016**  
> **Team Name: APEX** • **Category: Software Edition**  
> **Ministry: Ministry of Rural Development • Department of Land Resources (DoLR)**  

[![SIH](https://img.shields.io/badge/SIH-2026-orange.svg)]()
[![Team](https://img.shields.io/badge/Team-APEX-blue.svg)]()
[![Statutory](https://img.shields.io/badge/Statutory-RFCTLARR%20Act%202013-red.svg)]()
[![Standards](https://img.shields.io/badge/GIGW%203.0-WCAG%202.1%20AA-green.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ⚡ Quick Start (Single Command Launcher)

To launch both the **FastAPI Backend (port 8000)** and **Vite React Frontend (port 5173)** concurrently:

```bash
# Option 1: Single command runner
node start-up.js

# Option 2: Using npm
npm start
```

### Accessing the Platform:
- 🌐 **Frontend Web Application**: [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend REST API**: [http://localhost:8000](http://localhost:8000)
- 📖 **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 🖥️ **SIH Presentation Deck**: [`pitch_kit/NLAMS_SIH_Official_Template.pptx`](file:///f:/sih_proj/pitch_kit/NLAMS_SIH_Official_Template.pptx) & [`pitch_kit/presentation_slides.html`](file:///f:/sih_proj/pitch_kit/presentation_slides.html)

### Running Automated Test Suite:
```bash
python -m pytest backend/test_backend.py -v
```

---

## 📌 Problem Context & National Imperative

In India, public infrastructure land acquisition for national highways, dedicated freight corridors, and power transmission suffers an average judicial pendency exceeding **20.3 years**, with **66% of all civil litigation** tied to land and property disputes. This structural bottleneck locks in capital equivalent to **1.3% of national GDP** annually.

**NLAMS** is a sovereign, unified digital enterprise platform governed by the **RFCTLARR Act, 2013** and sector-specific central legislations (**National Highways Act 1956**, **Railways Act 1989**), replacing slow, subjective paper processes with deterministic mathematical state machines, spatial 14-digit ULPIN Bhu-Aadhaar registry locks, and automated PFMS Direct Benefit Transfer (DBT).

---

## 🏛️ 8 Core Working Prototype Modules

1. **Officer Executive Dashboard**: Executive command console with real-time national KPIs (active corridors, notified acreage, DBT disbursals vs assessed award, possession %, active court cases).
2. **Cadastral GIS Parcel Map**: Interactive Leaflet map overlaying Right-of-Way alignments on village cadastral survey polygons with dynamic status color coding (🔵 Proposed, 🟡 Sec 11 Locked, 🔴 Sec 15 Disputed, 🟢 Acquired & Mutated) and single-click ULPIN Inspector.
3. **9-Stage Statutory Acquisition Workflow**: Deterministic legal state machine enforcing strict statutory gatekeeper compliance, e-Gazette generation with Class-3 DSC signatures, PFMS DBT batches, and automated State Land Registry mutation.
4. **Compensation Calculation Engine**: Audited RFCTLARR First Schedule valuation sandbox with real-time parameter sliders, rural multiplication factors ($1.0\times\text{--}2.0\times$), asset valuation, 100% Solatium, and 12% p.a. Additional Amount.
5. **Landowner Bhu-Aadhaar Portal**: Public self-service lookup by 14-digit ULPIN / Khasra / Name, printable official award estimate slips, and direct Section 15 objection filing.
6. **Section 15 Objection Tribunal**: Quasi-judicial inquiry bench for CALA officers to schedule hearings and record reasoned disposal orders under Section 15(2).
7. **R&R Tracking (Second & Third Schedule)**: Project Affected Families (PAFs) entitlement ledger tracking 11 mandatory financial packages and 25 resettlement colony civic amenities.
8. **AI Delay-Risk Predictor**: Scikit-Learn Random Forest regression & classification engine predicting project delay in days/months with prescriptive administrative mitigations.

---

## 📐 Statutory First Schedule Compensation Formula

$$\text{Base Market Value } (MV) = \max\left(\text{Circle Rate}, \text{Top 50\% 3-Yr Registered Sale Deeds}, \text{PPP Consented Rate}\right)$$

$$MV_{\text{adjusted}} = MV \times \text{Acquired Area} \times \text{Multiplication Factor } (1.0\text{ Urban to }2.0\text{ Rural})$$

$$\text{Base Compensation } (C_{\text{Base}}) = MV_{\text{adjusted}} + \text{Immovable Assets (Structures, Trees, Crops under Sec 29)}$$

$$\text{Solatium Amount (Sec 30(1))} = 100\% \times C_{\text{Base}}$$

$$\text{Additional Amount (Sec 30(3))} = 12\% \times MV_{\text{Base}} \times \left(\frac{T_{\text{Award}} - T_{\text{Notification}}}{365}\right)$$

$$\mathbf{\text{Gross Total Award Payable (PFMS DBT)}} = C_{\text{Base}} + \text{Solatium} + \text{Additional Amount}$$

---

## 🗺️ Live Tested Corridors in Seed Dataset

| Corridor Title | Acquiring Agency | Statutory Act | State | Notified Area | Key Stage |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Varanasi Ring Road Phase-II** | NHAI | NH Act 1956 | Uttar Pradesh | 145.8 Ha | Valuation, Award & Compensation (Sec 3G) |
| **Nagpur-Mumbai Samruddhi Expressway** | MSRDC | RFCTLARR 2013 | Maharashtra | 210.4 Ha | Physical Possession & Mutation (Sec 38) |
| **Bengaluru Satellite Town Ring Road (STRR)** | NHAI / KRDCL | NH Act 1956 | Karnataka | 312.0 Ha | Preliminary Notification & Freezing (Sec 11/3A) |
| **Delhi-Amritsar Freight Corridor** | DFCCIL | Railways Act 1989 | Punjab | 393.9 Ha | Objection Management & Inquiry (Sec 15/3C) |

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Leaflet.js, React-Leaflet, Lucide-React, GIGW 3.0 Accessible Scaler (A-, A, A+), English/Hindi Bilingual Dictionary.
- **Backend**: Python 3.10+, FastAPI (Asynchronous REST API), Pydantic v2 schemas.
- **Database / ORM**: SQLAlchemy 2.0 with PostGIS spatial extension & SQLite local fallback (`sqlite:///./nlams.db`).
- **Machine Learning**: Scikit-Learn `RandomForestRegressor` delay forecasting model.
- **Security & Integrity**: Class-3 DSC Digital Signatures, SHA-256 Gazette Hashing, ISO 20022 XML batch generator.

---

## 🏆 Smart India Hackathon Presentation Kit (`pitch_kit/`)

| File | Description |
| :--- | :--- |
| [`pitch_kit/NLAMS_SIH_Official_Template.pptx`](file:///f:/sih_proj/pitch_kit/NLAMS_SIH_Official_Template.pptx) | **Official SIH 8-Slide PowerPoint Presentation Deck** strictly adhering to the mandatory SIH submission format. |
| [`pitch_kit/presentation_slides.html`](file:///f:/sih_proj/pitch_kit/presentation_slides.html) | Interactive web slide deck with **1-click PDF export**. |
| [`pitch_kit/presentation_guide.md`](file:///f:/sih_proj/pitch_kit/presentation_guide.md) | **5-Minute Live Pitch Script** and **Top 5 Judge Defense Q&A Answers**. |
| [`pitch_kit/generate_ppt.py`](file:///f:/sih_proj/pitch_kit/generate_ppt.py) | Python automation script to regenerate slides. |

---

## 👥 Team Details — Team APEX

- **Team Name**: APEX
- **Problem Statement ID**: SIH26016
- **Problem Statement Title**: Real-Time National Land Acquisition & Management System (NLAMS)
- **Ministry**: Ministry of Rural Development • Department of Land Resources (DoLR)
