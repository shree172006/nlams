import React, { useState } from 'react';
import { 
  Building2, MapPin, IndianRupee, Lock, ShieldCheck, ArrowRight, Zap, 
  Users, CheckCircle2, AlertTriangle, Clock, RefreshCw, FileText, Check, ChevronRight,
  TrendingUp, BarChart3, Smartphone, Shield, Layers, Scale
} from 'lucide-react';

export default function OfficerDashboard({
  metrics,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  selectedProject,
  projectRisk,
  setActiveTab,
  t,
  langHindi,
  currentUser
}) {
  // Strict RBAC Tier Binding: User cannot switch tiers across governments
  const hierarchyTier = 
    (currentUser?.role === 'STATE_OFFICER' || currentUser?.role === 'STATE_GOVT') ? 'state' :
    (currentUser?.role === 'COLLECTOR' || currentUser?.role === 'CALA') ? 'district' :
    (currentUser?.role === 'AGENCY') ? 'pia' :
    (currentUser?.role === 'SURVEYOR') ? 'field' :
    'central';

  const [selectedState, setSelectedState] = useState('All');

  // National & State Data Model (aligned with SIH & NLAMS DoLR Specs)
  const STATE_METRICS = [
    { state: 'Maharashtra', projects: 240, landProposedHa: 12450, landAcquiredHa: 9821, acquisitionPct: 82, compensationPaidPct: 87, affectedFamilies: 12540, rrCompletedPct: 76 },
    { state: 'Uttar Pradesh', projects: 310, landProposedHa: 18200, landAcquiredHa: 10374, acquisitionPct: 57, compensationPaidPct: 62, affectedFamilies: 28400, rrCompletedPct: 49 },
    { state: 'Karnataka', projects: 180, landProposedHa: 9400, landAcquiredHa: 6956, acquisitionPct: 74, compensationPaidPct: 78, affectedFamilies: 9800, rrCompletedPct: 69 },
    { state: 'Gujarat', projects: 152, landProposedHa: 8100, landAcquiredHa: 7371, acquisitionPct: 91, compensationPaidPct: 93, affectedFamilies: 7600, rrCompletedPct: 88 },
    { state: 'Bihar', projects: 165, landProposedHa: 7800, landAcquiredHa: 4992, acquisitionPct: 64, compensationPaidPct: 59, affectedFamilies: 14200, rrCompletedPct: 52 }
  ];

  const CRITICAL_PROJECTS = [
    { name: 'Varanasi Ring Road Ph-2', code: 'PRJ-NH19-VARANASI', issue: '31 days delayed in Sec 15 hearing', severity: 'high', state: 'Uttar Pradesh' },
    { name: 'Patna-Gaya Corridor', code: 'PRJ-NH83-PATNA-GAYA', issue: 'Compensation DBT backlog of ₹18 Cr', severity: 'high', state: 'Bihar' },
    { name: 'Pune Outer Ring Road', code: 'PRJ-MSRDC-PUNE-RING', issue: 'R&R PAF colony allotment below target (42%)', severity: 'medium', state: 'Maharashtra' },
    { name: 'Bengaluru Suburban Line', code: 'PRJ-KRDCL-BENGALURU', issue: 'Forest clearance pending at KM 24.5', severity: 'medium', state: 'Karnataka' }
  ];

  const DISTRICT_PRIORITY_TASKS = [
    { id: 'TSK-101', title: '12 Parcels statutory deadline expiring in 3 days', type: 'DEADLINE', tag: 'High Urgency', color: '#ef4444' },
    { id: 'TSK-102', title: '8 Landowner compensation PFMS claims overdue', type: 'COMPENSATION', tag: 'Action Required', color: '#f59e0b' },
    { id: 'TSK-103', title: '17 Field survey on-ground verification submissions pending CALA seal', type: 'VERIFICATION', tag: 'Pending Review', color: '#3b82f6' },
    { id: 'TSK-104', title: 'Project NH-19 Section 15 Hearing Docket scheduled for today', type: 'HEARING', tag: 'Bench Today', color: '#8b5cf6' }
  ];

  // Tier Labels and Metadata
  const TIER_META = {
    central: {
      title: langHindi ? 'केंद्रीय मंत्रालय शीर्ष कमान डैशबोर्ड' : 'Central Ministry Apex Dashboard',
      subtitle: langHindi ? 'राष्ट्रीय राजमार्ग, रेलवे एवं सागरमाला अवसंरचना अधिग्रहण निगरानी' : 'National Infrastructure Corridors, Inter-State Benchmarking & National Monitoring',
      badge: langHindi ? 'केंद्रीय स्तर (DoLR / MoRD)' : 'Tier 1: Central Ministry (National)',
      color: '#1e3a8a',
      bg: '#eff6ff'
    },
    state: {
      title: langHindi ? 'राज्य सरकार भू-राजस्व नोडल डैशबोर्ड' : 'State Government Revenue Nodal Dashboard',
      subtitle: langHindi ? 'राज्य अधिकार अभिलेख (RoR), जिला समन्वय एवं दाखिल-खारिज निगरानी' : 'State RoR Integration, District CALA Review, Compensation & Mutation Tracking',
      badge: langHindi ? 'राज्य स्तर (Board of Revenue)' : 'Tier 2: State Government Nodal',
      color: '#065f46',
      bg: '#ecfdf5'
    },
    district: {
      title: langHindi ? 'जिला सक्षम प्राधिकारी (CALA / DM) कार्यपालक डैशबोर्ड' : 'District Authority (CALA / Collector) Executive Dashboard',
      subtitle: langHindi ? '14-अंकीय भू-आधार सत्यापन, धारा 15 आपत्तियां व पंचाट अवार्ड निष्पादन' : 'Cadastral Verification, Section 15 Objections, Hearing Dockets & Form-7 Award Execution',
      badge: langHindi ? 'जिला स्तर (CALA / DM)' : 'Tier 3: District Authority (CALA)',
      color: '#c2410c',
      bg: '#fff7ed'
    },
    pia: {
      title: langHindi ? 'परियोजना क्रियान्वयन एजेंसी (PIA / NHAI) डैशबोर्ड' : 'Project Implementing Agency (PIA / NHAI) Dashboard',
      subtitle: langHindi ? 'रेखीय गलियारा भूमि आवश्यकता, कब्जा प्रमाणपत्र एवं निर्माण हस्तांतरण' : 'Linear Corridor Land Requisition, Possession Handover & Right of Way Clearance',
      badge: langHindi ? 'एजेंसी स्तर (NHAI / MSRDC)' : 'Tier 4: Project Implementing Agency (PIA)',
      color: '#831843',
      bg: '#fdf2f8'
    },
    field: {
      title: langHindi ? 'फील्ड राजस्व निरीक्षक एवं ड्रोन सर्वेक्षक वर्कस्पेस' : 'Field Surveyor & Cadastral Inspection Workspace',
      subtitle: langHindi ? 'धरातलीय सत्यापन, मोबाइल ऑफलाइन सिंक व भू-टैग फोटोग्राफी' : 'Ground Verification, Mobile Offline Sync & Geo-Tagged Cadastral Photography',
      badge: langHindi ? 'फील्ड स्तर (Surveyor)' : 'Tier 5: Field Cadastral Surveyor',
      color: '#047857',
      bg: '#f0fdf4'
    }
  };

  const currentTierMeta = TIER_META[hierarchyTier] || TIER_META.central;

  return (
    <div>
      {/* 1. Header & Corridor Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#071426', fontWeight: 800, margin: 0 }}>
            {currentTierMeta.title}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {currentTierMeta.subtitle}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{t.activeProjectLabel}</span>
          <select 
            style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)', fontSize: '0.78rem', fontWeight: 700, background: '#ffffff' }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Official Role & Security Tier Clearance Banner (Strict RBAC Enforcement) */}
      <div style={{ 
        background: currentTierMeta.bg, 
        borderRadius: 8, 
        padding: '10px 14px', 
        marginBottom: 18, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        border: `1px solid ${currentTierMeta.color}30`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: currentTierMeta.color, color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800 }}>
            {currentTierMeta.badge}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#071426' }}>
              {currentUser?.name || 'Authorized Official'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {currentUser?.designation || 'Statutory Authority'} • {currentUser?.agency || 'Government of India'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: currentTierMeta.color, fontWeight: 700 }}>
          <ShieldCheck size={14} />
          <span>{langHindi ? 'RBAC विशेषाधिकार सुरक्षित (पृथक प्रशासनिक स्तर)' : 'Strict RBAC Tier Isolation Enforced (DPDP Compliant)'}</span>
        </div>
      </div>

      {/* ================= OFFICER QUICK GUIDE & NAVIGATION HELP ================= */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <FileText size={18} color="#2563eb" />
          {langHindi ? 'अधिकारी त्वरित मार्गदर्शिका (Officer Quick Guide)' : 'Officer Quick Guide & Navigation Help'}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '16px' }}>
          {langHindi 
            ? 'सिस्टम की विभिन्न सुविधाओं को समझने के लिए इस मार्गदर्शिका का उपयोग करें। नीचे दी गई तालिका से किसी भी कॉरिडोर का चयन कर "ओपन वर्कफ़्लो इंजन" पर क्लिक करें।' 
            : 'Welcome to your administrative workspace. Use the quick reference below to navigate the system modules. To manage a project, select it from the Corridor Table at the bottom and click "Open Workflow Engine".'
          }
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '4px' }}>1. Dashboard (Home)</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>High-level KPI monitoring, State benchmarking, and Active Corridor tracking.</div>
          </div>
          <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '4px' }}>2. Statutory Workflow</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Manage project stages (Sec 11 to Sec 38), generate e-Gazettes, and trigger PFMS DBT.</div>
          </div>
          <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '4px' }}>3. GIS Parcel Map</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Visualize land parcels, check Bhu-Aadhaar encumbrance locks, and print award slips.</div>
          </div>
          <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '4px' }}>4. Sec 15 Objections</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Manage citizen disputes, schedule quasi-judicial hearings, and record disposal orders.</div>
          </div>
          <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '4px' }}>5. LARRDA Tribunal</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Track Section 64 reference dockets, authority rulings, and High Court appeals.</div>
          </div>
          <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '4px' }}>6. R&R Tracking</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Track and fulfill Schedule II welfare entitlements for displaced & affected families.</div>
          </div>
        </div>
      </div>


      {/* ================= TIER 1: CENTRAL MINISTRY LEVEL DASHBOARD ================= */}
      {hierarchyTier === 'central' && (
        <div>
          {/* National Overview KPI Cards */}
          <div className="kpi-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 18 }}>
            <div className="kpi-metric-box border-blue">
              <div className="kpi-head">
                <span className="kpi-head-label">{langHindi ? 'कुल राष्ट्रीय परियोजनाएं' : 'Total National Projects'}</span>
                <div className="kpi-head-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}><Building2 size={15} /></div>
              </div>
              <div className="kpi-big-num">2,431</div>
              <div className="kpi-caption">NHAI, Railways, Port & Expressways</div>
            </div>

            <div className="kpi-metric-box border-saffron">
              <div className="kpi-head">
                <span className="kpi-head-label">{langHindi ? 'भूमि अधिग्रहण प्रगति' : 'Land Acquired Ratio'}</span>
                <div className="kpi-head-icon" style={{ background: '#ffedd5', color: '#ea580c' }}><MapPin size={15} /></div>
              </div>
              <div className="kpi-big-num">68.4%</div>
              <div className="kpi-caption">{metrics?.total_notified_area_ha || '48,250'} Ha Notified Area</div>
            </div>

            <div className="kpi-metric-box border-green">
              <div className="kpi-head">
                <span className="kpi-head-label">{langHindi ? 'वितरित मुआवजा (PFMS DBT)' : 'PFMS DBT Disbursed'}</span>
                <div className="kpi-head-icon" style={{ background: '#ecfdf5', color: '#059669' }}><IndianRupee size={15} /></div>
              </div>
              <div className="kpi-big-num">₹ {metrics?.total_compensation_disbursed_cr || '14,820'} <span style={{ fontSize: '0.85rem' }}>Cr</span></div>
              <div className="kpi-caption"><span style={{ color: '#059669', fontWeight: 700 }}>{metrics?.dbt_disbursal_ratio_pct || '72.4'}%</span> of Assessed Award</div>
            </div>

            <div className="kpi-metric-box border-navy">
              <div className="kpi-head">
                <span className="kpi-head-label">{langHindi ? 'भौतिक कब्जा (Sec 38)' : 'Physical Possession'}</span>
                <div className="kpi-head-icon" style={{ background: '#f1f5f9', color: '#071426' }}><ShieldCheck size={15} /></div>
              </div>
              <div className="kpi-big-num">61.2%</div>
              <div className="kpi-caption">91,204 Affected PAFs Tracked</div>
            </div>

            <div className="kpi-metric-box border-saffron">
              <div className="kpi-head">
                <span className="kpi-head-label">{langHindi ? 'R&R पुनर्वास पूर्ण' : 'R&R Settlement'}</span>
                <div className="kpi-head-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Users size={15} /></div>
              </div>
              <div className="kpi-big-num">73.5%</div>
              <div className="kpi-caption">Second Schedule Welfare Packages</div>
            </div>
          </div>

          {/* Grid: State Comparison & Critical Projects */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            {/* State Comparison Table */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <BarChart3 size={16} color="#071426" />
                  <span>{langHindi ? '1. राज्यवार प्रदर्शन तुलना (State Comparison)' : '1. Pan-India State Performance Comparison'}</span>
                </h3>
                <span className="badge-pill badge-blue">Ministry of Rural Development</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="nlams-data-table">
                  <thead>
                    <tr>
                      <th>{langHindi ? 'राज्य' : 'State'}</th>
                      <th>{langHindi ? 'परियोजनाएं' : 'Projects'}</th>
                      <th>{langHindi ? 'अधिग्रहण %' : 'Acquisition %'}</th>
                      <th>{langHindi ? 'मुआवजा DBT %' : 'Compensation %'}</th>
                      <th>{langHindi ? 'R&R पुनर्वास %' : 'R&R Progress %'}</th>
                      <th>{langHindi ? 'स्थिति' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STATE_METRICS.map(st => (
                      <tr key={st.state}>
                        <td><strong>{st.state}</strong></td>
                        <td>{st.projects}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 700 }}>{st.acquisitionPct}%</span>
                            <div style={{ flex: 1, height: 5, background: '#e2e8f0', borderRadius: 3, maxWidth: 60 }}>
                              <div style={{ width: `${st.acquisitionPct}%`, height: '100%', background: st.acquisitionPct >= 80 ? '#059669' : st.acquisitionPct >= 65 ? '#f59e0b' : '#ef4444', borderRadius: 3 }} />
                            </div>
                          </div>
                        </td>
                        <td><span style={{ color: '#059669', fontWeight: 700 }}>{st.compensationPaidPct}%</span></td>
                        <td><span style={{ color: '#0284c7', fontWeight: 700 }}>{st.rrCompletedPct}%</span></td>
                        <td>
                          <span className={`badge-pill ${st.acquisitionPct >= 80 ? 'badge-green' : st.acquisitionPct >= 65 ? 'badge-saffron' : 'badge-critical'}`}>
                            {st.acquisitionPct >= 80 ? 'Fast Track' : st.acquisitionPct >= 65 ? 'Moderate' : 'Bottleneck'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critical Delay Alerts */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <AlertTriangle size={16} color="#dc2626" />
                  <span>{langHindi ? '2. उच्च प्राथमिकता विलंब अलर्ट' : '2. Critical Project Alerts'}</span>
                </h3>
                <span className="badge-pill badge-critical">Action Needed</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CRITICAL_PROJECTS.map((cp, idx) => (
                  <div key={idx} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.8rem', color: '#991b1b' }}>{cp.name}</strong>
                      <span className="badge-pill badge-navy" style={{ fontSize: '0.62rem' }}>{cp.state}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#7f1d1d', marginTop: 4 }}>
                      ⚠️ {cp.issue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TIER 2: STATE GOVERNMENT LEVEL DASHBOARD ================= */}
      {hierarchyTier === 'state' && (
        <div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 14, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#071426', margin: 0 }}>
                {langHindi ? 'महाराष्ट्र राज्य भूमि अधिग्रहण निगरानी' : 'State Land Acquisition Directorate (Maharashtra & States)'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {langHindi ? 'राज्य स्तरीय नोडल अधिकारी डैशबोर्ड (जिला कलेक्टरों व CALA पीठों का पर्यवेक्षण)' : 'State Nodal Officer Directorate • Oversight across District Collectors & CALAs'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Gujarat', 'Bihar'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`btn-action ${selectedState === st || (selectedState === 'All' && st === 'Maharashtra') ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="kpi-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 18 }}>
            <div className="kpi-metric-box border-blue">
              <div className="kpi-head"><span className="kpi-head-label">State Projects</span><Building2 size={15} /></div>
              <div className="kpi-big-num">240</div>
              <div className="kpi-caption">12,450 Ha Proposed Land</div>
            </div>
            <div className="kpi-metric-box border-saffron">
              <div className="kpi-head"><span className="kpi-head-label">Acquired Land</span><MapPin size={15} /></div>
              <div className="kpi-big-num">9,821 Ha</div>
              <div className="kpi-caption">82% Acquisition Progress</div>
            </div>
            <div className="kpi-metric-box border-green">
              <div className="kpi-head"><span className="kpi-head-label">Compensation Paid</span><IndianRupee size={15} /></div>
              <div className="kpi-big-num">87%</div>
              <div className="kpi-caption">₹ 4,120 Cr Disbursed via PFMS</div>
            </div>
            <div className="kpi-metric-box border-navy">
              <div className="kpi-head"><span className="kpi-head-label">R&R Completed</span><Users size={15} /></div>
              <div className="kpi-big-num">76%</div>
              <div className="kpi-caption">12,540 Affected Families</div>
            </div>
          </div>

          <div className="section-panel-card">
            <div className="panel-card-head">
              <h3 className="panel-card-title">
                <MapPin size={16} color="#071426" />
                <span>{langHindi ? 'जिला स्तरीय प्रगति रिपोर्ट' : 'District Breakdown & CALA Bench Performance'}</span>
              </h3>
            </div>
            <table className="nlams-data-table">
              <thead>
                <tr>
                  <th>{langHindi ? 'जिला' : 'District'}</th>
                  <th>{langHindi ? 'सक्रिय परियोजनाएं' : 'Active Projects'}</th>
                  <th>{langHindi ? 'अधिग्रहण %' : 'Acquisition Progress'}</th>
                  <th>{langHindi ? 'मुआवजा स्थिति' : 'Compensation Disbursed'}</th>
                  <th>{langHindi ? 'कार्यवाही' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dist: 'Pune', prj: 18, pct: 91, comp: '₹ 840 Cr (92%)', badge: 'badge-green' },
                  { dist: 'Nashik', prj: 12, pct: 73, comp: '₹ 410 Cr (75%)', badge: 'badge-saffron' },
                  { dist: 'Nagpur', prj: 14, pct: 48, comp: '₹ 290 Cr (51%)', badge: 'badge-critical' },
                  { dist: 'Mumbai Suburban', prj: 8, pct: 94, comp: '₹ 1,120 Cr (96%)', badge: 'badge-green' }
                ].map(d => (
                  <tr key={d.dist}>
                    <td><strong>{d.dist}</strong></td>
                    <td>{d.prj} Projects</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700 }}>{d.pct}%</span>
                        <div style={{ width: 80, height: 5, background: '#e2e8f0', borderRadius: 3 }}>
                          <div style={{ width: `${d.pct}%`, height: '100%', background: d.pct >= 80 ? '#059669' : d.pct >= 60 ? '#f59e0b' : '#ef4444', borderRadius: 3 }} />
                        </div>
                      </div>
                    </td>
                    <td><strong style={{ color: '#059669' }}>{d.comp}</strong></td>
                    <td>
                      <button className="btn-action btn-outline" style={{ fontSize: '0.7rem', padding: '3px 8px' }} onClick={() => alert('Access Restricted: Detailed district oversight is natively managed by CALA and Collector nodes in Tier 3.')}>
                        <span>{langHindi ? 'जिला विवरण' : 'Inspect District'}</span> <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TIER 3: DISTRICT AUTHORITY / CALA LEVEL DASHBOARD ================= */}
      {hierarchyTier === 'district' && (
        <div>
          <div className="kpi-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 18 }}>
            <div className="kpi-metric-box border-blue">
              <div className="kpi-head"><span className="kpi-head-label">District Projects</span><Building2 size={15} /></div>
              <div className="kpi-big-num">18</div>
              <div className="kpi-caption">Pune / Varanasi Jurisdiction</div>
            </div>
            <div className="kpi-metric-box border-saffron">
              <div className="kpi-head"><span className="kpi-head-label">Pending Verification</span><FileText size={15} /></div>
              <div className="kpi-big-num">142</div>
              <div className="kpi-caption">Field On-Ground Submissions</div>
            </div>
            <div className="kpi-metric-box border-navy">
              <div className="kpi-head"><span className="kpi-head-label">Pending Approvals</span><Clock size={15} /></div>
              <div className="kpi-big-num">37</div>
              <div className="kpi-caption">Sec 15 & 19 Notifications</div>
            </div>
            <div className="kpi-metric-box border-green">
              <div className="kpi-head"><span className="kpi-head-label">Compensation Pending</span><IndianRupee size={15} /></div>
              <div className="kpi-big-num">81</div>
              <div className="kpi-caption">PFMS DBT Payment Slips</div>
            </div>
            <div className="kpi-metric-box border-critical">
              <div className="kpi-head"><span className="kpi-head-label">Possession Pending</span><Lock size={15} /></div>
              <div className="kpi-big-num">42</div>
              <div className="kpi-caption">Sec 38 Handover Cases</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Priority Tasks */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <AlertTriangle size={16} color="#dc2626" />
                  <span>{langHindi ? 'सक्षम प्राधिकारी (CALA) दैनिक प्राथमिकताएं' : 'District Authority Priority Action Queue'}</span>
                </h3>
                <span className="badge-pill badge-critical">4 Critical Tasks</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DISTRICT_PRIORITY_TASKS.map(tsk => (
                  <div key={tsk.id} style={{ background: '#ffffff', border: `1px solid ${tsk.color}40`, borderLeft: `4px solid ${tsk.color}`, borderRadius: 6, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#071426' }}>{tsk.title}</div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{tsk.id} • Assigned to ADM / CALA Bench</span>
                    </div>
                    <span style={{ background: `${tsk.color}15`, color: tsk.color, padding: '3px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700 }}>
                      {tsk.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions for CALA */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <ShieldCheck size={16} color="#059669" />
                  <span>{langHindi ? 'सक्षम प्राधिकारी अधिकार क्षेत्र' : 'District Authority Statutory Modules'}</span>
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button className="btn-action btn-outline" style={{ padding: 12, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4 }} onClick={() => setActiveTab('workbench')}>
                  <Building2 size={16} color="#0284c7" />
                  <strong style={{ fontSize: '0.78rem' }}>Process Workflow Stages</strong>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Advance 3A ➔ 3D ➔ 3G ➔ 3H</span>
                </button>
                <button className="btn-action btn-outline" style={{ padding: 12, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4 }} onClick={() => setActiveTab('objections')}>
                  <Scale size={16} color="#ea580c" />
                  <strong style={{ fontSize: '0.78rem' }}>Hear Sec 15 Objections</strong>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Schedule hearings & seal orders</span>
                </button>
                <button className="btn-action btn-outline" style={{ padding: 12, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4 }} onClick={() => setActiveTab('gis')}>
                  <Layers size={16} color="#059669" />
                  <strong style={{ fontSize: '0.78rem' }}>Cadastral GIS Map</strong>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>14-digit ULPIN encumbrance locks</span>
                </button>
                <button className="btn-action btn-outline" style={{ padding: 12, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4 }} onClick={() => setActiveTab('larrda')}>
                  <Scale size={16} color="#8b5cf6" />
                  <strong style={{ fontSize: '0.78rem' }}>LARRDA Referrals</strong>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Section 64 judicial disputes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TIER 4: PROJECT IMPLEMENTING AGENCY (PIA / NHAI) ================= */}
      {hierarchyTier === 'pia' && (
        <div>
          <div className="kpi-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 18 }}>
            <div className="kpi-metric-box border-blue">
              <div className="kpi-head"><span className="kpi-head-label">Required Land</span><MapPin size={15} /></div>
              <div className="kpi-big-num">500 <span style={{ fontSize: '0.85rem' }}>Ha</span></div>
              <div className="kpi-caption">NH-48 / Varanasi Alignment</div>
            </div>
            <div className="kpi-metric-box border-green">
              <div className="kpi-head"><span className="kpi-head-label">Acquired Land</span><ShieldCheck size={15} /></div>
              <div className="kpi-big-num">412 <span style={{ fontSize: '0.85rem' }}>Ha</span></div>
              <div className="kpi-caption">82.4% Handed Over to NHAI</div>
            </div>
            <div className="kpi-metric-box border-critical">
              <div className="kpi-head"><span className="kpi-head-label">Remaining Land</span><Clock size={15} /></div>
              <div className="kpi-big-num">88 <span style={{ fontSize: '0.85rem' }}>Ha</span></div>
              <div className="kpi-caption">Sec 38 Possession in Progress</div>
            </div>
            <div className="kpi-metric-box border-saffron">
              <div className="kpi-head"><span className="kpi-head-label">Total Parcels</span><Layers size={15} /></div>
              <div className="kpi-big-num">820</div>
              <div className="kpi-caption">671 Acquired • 149 Pending</div>
            </div>
          </div>

          <div className="section-panel-card">
            <div className="panel-card-head">
              <h3 className="panel-card-title">
                <Building2 size={16} color="#071426" />
                <span>{langHindi ? 'भूमि आवश्यकता बनाम अधिग्रहण प्रगति' : 'Land Required vs Land Acquired Visual Comparison'}</span>
              </h3>
            </div>
            <div style={{ padding: '16px 20px', background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>
                  <span>Total Corridor Required Land: 500 Ha</span>
                  <span>100%</span>
                </div>
                <div style={{ height: 16, background: '#071426', borderRadius: 4, width: '100%' }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>
                  <span style={{ color: '#059669' }}>Possession Handed Over to Agency: 412 Ha</span>
                  <span style={{ color: '#059669' }}>82.4%</span>
                </div>
                <div style={{ height: 16, background: '#e2e8f0', borderRadius: 4, width: '100%' }}>
                  <div style={{ height: '100%', width: '82.4%', background: '#059669', borderRadius: 4 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>
                  <span style={{ color: '#ef4444' }}>Pending Acquisition / Possession: 88 Ha</span>
                  <span style={{ color: '#ef4444' }}>17.6%</span>
                </div>
                <div style={{ height: 16, background: '#e2e8f0', borderRadius: 4, width: '100%' }}>
                  <div style={{ height: '100%', width: '17.6%', background: '#ef4444', borderRadius: 4 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TIER 5: FIELD SURVEYOR LEVEL DASHBOARD ================= */}
      {hierarchyTier === 'field' && (
        <div>
          <div className="kpi-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 18 }}>
            <div className="kpi-metric-box border-blue">
              <div className="kpi-head"><span className="kpi-head-label">Assigned Projects</span><Building2 size={15} /></div>
              <div className="kpi-big-num">4</div>
              <div className="kpi-caption">Active Corridor Sectors</div>
            </div>
            <div className="kpi-metric-box border-saffron">
              <div className="kpi-head"><span className="kpi-head-label">Pending Field Visits</span><Clock size={15} /></div>
              <div className="kpi-big-num">17</div>
              <div className="kpi-caption">Cadastral Ground Check</div>
            </div>
            <div className="kpi-metric-box border-green">
              <div className="kpi-head"><span className="kpi-head-label">Completed Today</span><CheckCircle2 size={15} /></div>
              <div className="kpi-big-num">6</div>
              <div className="kpi-caption">GPS Stamped & DSC Sealed</div>
            </div>
          </div>

          <div className="section-panel-card">
            <div className="panel-card-head">
              <h3 className="panel-card-title">
                <Smartphone size={16} color="#ea580c" />
                <span>{langHindi ? 'दैनिक फील्ड कार्य सूची (Today\'s On-Ground Tasks)' : 'Today\'s On-Ground Survey Tasks'}</span>
              </h3>
              <button className="btn-action btn-saffron" onClick={() => setActiveTab('survey')}>
                <Smartphone size={14} />
                <span>{langHindi ? 'ऑफलाइन सर्वे ऐप खोलें' : 'Open Field Survey PWA'}</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { parcel: 'IN09UP23456701 (Khasra 412/1)', task: 'Structure & Tree Valuation Verification', status: 'Pending Location Stamp', tag: 'High' },
                { parcel: 'IN09UP23456702 (Khasra 412/2)', task: 'Joint Khata Co-heirs KYC & Geo-tag Photo', status: 'Document Upload Required', tag: 'Medium' },
                { parcel: 'IN09UP23456703 (Khasra 413/1)', task: 'Re-verification requested by CALA Bench', status: 'Re-survey Scheduled', tag: 'Urgent' }
              ].map((ft, idx) => (
                <div key={idx} style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: 6, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: '#9a3412' }}>{ft.parcel}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#7c2d12' }}>{ft.task}</div>
                  </div>
                  <span className="badge-pill badge-saffron" style={{ fontSize: '0.65rem' }}>{ft.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Corridor Table & AI Delay Radar — visible only for management tiers */}
      {(hierarchyTier === 'central' || hierarchyTier === 'state' || hierarchyTier === 'district') && (
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginTop: 18 }}>
        <div className="section-panel-card">
          <div className="panel-card-head">
            <h3 className="panel-card-title">
              <Building2 size={16} color="#071426" />
              <span>{langHindi ? 'सक्रिय अवसंरचना कॉरिडोर' : 'Active Infrastructure Corridors'}</span>
            </h3>
            <span className="badge-pill badge-green">{projects.length} {langHindi ? 'ट्रैक की गई परियोजनाएं' : 'Tracked Projects'}</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="nlams-data-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>{langHindi ? 'क्र.सं.' : 'Sr.'}</th>
                  <th>{langHindi ? 'कॉरिडोर शीर्षक' : 'Corridor Title'}</th>
                  <th>{langHindi ? 'एजेंसी व अधिनियम' : 'Agency & Act'}</th>
                  <th>{langHindi ? 'राज्य' : 'State'}</th>
                  <th>{langHindi ? 'अधिग्रहण चरण' : 'Stage'}</th>
                  <th>{langHindi ? 'वितरित मुआवजा' : 'Disbursed'}</th>
                  <th>{langHindi ? 'कार्यवाही' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, idx) => (
                  <tr key={p.id} style={{ background: selectedProjectId === p.id ? '#f0f7ff' : 'transparent' }}>
                    <td><span className="badge-pill badge-navy" style={{ fontWeight: 800 }}>{idx + 1}</span></td>
                    <td>
                      <strong style={{ color: '#071426', display: 'block' }}>{p.title}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{p.id} • {p.total_corridor_area_ha} Ha</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.acquiring_agency}</div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{p.statutory_act}</span>
                    </td>
                    <td><span className="badge-pill badge-blue">{p.state}</span></td>
                    <td>
                      <span className="badge-pill badge-saffron">
                        {p.current_stage.split(' ')[1]} {p.current_stage.split(' ')[2] || ''}
                      </span>
                      <div style={{ width: 90, height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 4 }}>
                        <div style={{ width: `${p.stage_progress_pct}%`, height: '100%', background: '#059669', borderRadius: 2 }} />
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#059669' }}>₹{p.total_compensation_disbursed_cr}</strong> / ₹{p.total_compensation_assessed_cr} Cr
                    </td>
                    <td>
                      <button 
                        className="btn-action btn-outline" 
                        style={{ padding: '6px 10px', fontSize: '0.75rem', background: '#f8fafc' }}
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setActiveTab('workbench');
                        }}
                      >
                        <span>{langHindi ? 'वर्कफ़्लो खोलें' : 'Open Workflow Engine'}</span> <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Delay Risk Radar */}
        <div className="section-panel-card">
          <div className="panel-card-head">
            <h3 className="panel-card-title">
              <Zap size={16} color="#dc2626" />
              <span>{langHindi ? 'विलंब-जोखिम पूर्वानुमान' : 'Delay-Risk Forecast'}</span>
            </h3>
            <button className="btn-action btn-outline" style={{ padding: '3px 7px', fontSize: '0.68rem' }} onClick={() => setActiveTab('airisk')}>
              {langHindi ? 'रडार खोलें' : 'Open Radar'}
            </button>
          </div>

          <div className="panel-card-body" style={{ padding: '14px' }}>
            {projectRisk ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#071426' }}>{selectedProject?.title}</strong>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{langHindi ? 'वर्तमान चरण:' : 'Current:'} {projectRisk.bottleneck_stage}</div>
                  </div>
                  <span className={`badge-pill badge-${projectRisk.risk_level.toLowerCase()}`}>
                    {projectRisk.risk_level} ({projectRisk.risk_score}%)
                  </span>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700 }}>
                    {t.forecastLag} +{projectRisk.predicted_delay_months} {langHindi ? 'महीने' : 'Months'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#7f1d1d', marginTop: 3 }}>
                    {projectRisk.risk_factors[0]}
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#334155' }}>
                  <strong style={{ color: '#071426', display: 'block', marginBottom: 3 }}>{langHindi ? 'एआई सुधारात्मक कार्यवाही:' : 'Prescriptive Action:'}</strong>
                  <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4, border: '1px solid var(--border-main)' }}>
                    💡 {projectRisk.prescriptive_mitigations[0]}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 16, color: '#64748b' }}>{langHindi ? 'कॉरिडोर डेटा का विश्लेषण जारी है...' : 'Analyzing corridor parameters...'}</div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
