# 🇮🇳 NLAMS: Technical Architecture & System Specifications
**Smart India Hackathon (SIH) — Problem Statement ID: 26016**  
**Ministry / Department:** Ministry of Rural Development / Department of Land Resources (DoLR)  
**System Name:** National Land Acquisition & Management System (NLAMS)

---

## 📌 1. Component-Wise Technology Stack

| Layer / Component | Technology / Framework | Version / Standard | Key Responsibility & Role |
|---|---|---|---|
| **Web Frontend** | React.js 18 + Vite | `v18.3` / `v8.2` | High-performance SPA with client-side routing, live state sync, bilingual UI, and accessibility engine. |
| **Design System** | Custom Vanilla CSS | CSS3 Custom Tokens | Bespoke Govt-of-India aesthetic (Saffron/Navy/Emerald) with zero framework bloat and instant load times. |
| **GIS Spatial Engine** | Leaflet.js + React-Leaflet | `v1.9.4` | Vector polyline corridor alignment overlays, village cadastral survey polygons, color-coded encumbrance locks, and full-screen view. |
| **Backend REST API** | Node.js + Express.js | Node `v24` / Express `v4.19` | High-concurrency RESTful microservices, RBAC middleware, statutory valuation mathematical calculations, and delay forecasting engines. |
| **Relational Database** | SQLite (`better-sqlite3`) | `v11.8` (ACID Compliant) | Zero-latency transactional persistence for projects, parcels, objections, R&R families, and tribunal dockets. |
| **Mobile Field App** | Flutter (Dart) | Flutter `3.x` / Dart `3.x` | Offline-first mobile survey tool with GPS geo-tagging, camera asset documentation, and automatic cloud sync. |
| **Cloud Frontend Host** | Firebase Hosting | Google Global Edge CDN | High-availability static CDN with HTTP/2, instant cache invalidation, and custom domain SSL. |
| **Cloud Backend Host** | Render.com Web Services | Docker Container / Linux | Automated GitHub CI/CD web service with `0.0.0.0` port binding, reverse proxy routing, and REST endpoint exposure. |

---

## ⚖️ 2. Statutory Mathematical Formulas & Algorithms (RFCTLARR Act 2013)

NLAMS implements the legally audited mathematical valuation framework defined under Sections 26 through 30 and the First Schedule of the RFCTLARR Act, 2013:

1. **Baseline Market Value Determination (Sec 26)**:
   $$\text{Market Value (MV)} = \max(\text{Circle Rate}, \text{Avg 3-Year Registered Sale Deeds for top 50\% transactions})$$
2. **Rural Multiplication Factor (Sec 26(2))**:
   $$\text{Multiplied Base Value} = \text{MV} \times \text{Factor F } (1.00 \text{ to } 2.00)$$
3. **On-Ground Field Asset Appraisals (Sec 29)**:
   $$\text{Total Assets (A)} = \text{Structures (PWD)} + \text{Trees (Forest Dept)} + \text{Standing Crops (Agri Dept)}$$
4. **Mandatory 100% Solatium (Sec 30(1))**:
   $$\text{Solatium Amount} = 100\% \times (\text{Multiplied Base Value} + \text{Total Assets})$$
5. **12% Additional Amount Interest (Sec 30(3))**:
   $$\text{Additional Interest} = 12\%\text{/year on MV from Sec 11 Notification to Award Date}$$
6. **Final Statutory Gross Award**:
   $$\text{Total Award} = (\text{Multiplied Base Value} + \text{Total Assets}) \times 2.00 + \text{Additional Interest}$$

---

## 🗄️ 3. Relational Database Schema & Entity Architecture

* `projects`: Master project corridor records, length in km, notified hectares, alignment vectors, and possession metrics.
* `parcels`: Cadastral land parcels linked via 14-digit Bhu-Aadhaar (ULPIN), circle rates, coordinates polygon, and automated encumbrance locks.
* `objections`: Section 15 quasi-judicial hearings, inquiry dates, and reasoned disposal orders.
* `rr_families`: Second Schedule R&R tracking covering affected and displaced families, monetary entitlements, and resettlement amenities.
* `larrda_references`: Section 64 Land Acquisition Tribunal dockets with 90-day Collector mandate and 60-day High Court appeal timers.
* `field_surveys`: Mobile on-ground asset valuations, GPS coordinates, and surveyor notes synced from field tablets.
* `users`: Multi-role RBAC profiles (Collector, CALA, Field Surveyor, NHAI GM).

---

## 🌐 4. RESTful API Directory

* `GET /api/national-metrics` — Consolidated national statistics (Acreage, DBT disbursed, ULPIN locks).
* `GET /api/projects` & `GET /api/projects/:id` — Linear corridor master records and parcel lists.
* `POST /api/calculate-valuation` — Statutory compensation calculation engine returning itemized award breakdown.
* `POST /api/predict-delay` — AI Decision-Support engine projecting delivery lag and prescriptive interventions.
* `GET /api/citizen-lookup?query=...` — Open citizen search returning landholding status and digital award slip.
* `POST /api/auth/login` — Role-Based Access Control session generation for officials.
* `GET / POST /api/projects/:id/objections` — Section 15 dispute lifecycle management.
* `GET / POST /api/projects/:id/rr-tracking` — Second Schedule R&R progress ledger and amenity allotments.
* `GET / POST /api/larrda-references` — Section 64 tribunal reference docketing.
* `POST /api/field-surveys/sync` — Mobile survey sync endpoint integrating Flutter on-ground app.
* `POST /api/parcels/:ulpin/split-khata` — Splitting joint-khata ancestral holdings among legal co-heirs.

---

## 📁 Document Location
* **DOCX File (Word Format)**: `f:\sih_proj\TECH_INFO\NLAMS_Technical_Architecture_and_Specifications.docx`
* **Markdown Document**: `f:\sih_proj\TECH_INFO\NLAMS_Technical_Architecture_and_Specifications.md`
