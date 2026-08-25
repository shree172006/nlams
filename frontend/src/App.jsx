import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, ShieldCheck, FileText, IndianRupee, Layers, 
  TrendingUp, Award, AlertTriangle, CheckCircle, Search, Clock, 
  ArrowRight, Landmark, FileSpreadsheet, Lock, RefreshCw, Send, Check,
  UserCheck, ExternalLink, HelpCircle, Download, Printer, Globe, Eye,
  Home, Compass, Cpu, Database, ChevronRight, X, User, BarChart3
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Polyline, Tooltip, Popup } from 'react-leaflet';

const API_BASE = "http://localhost:8000";

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [metrics, setMetrics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [vikasRankings, setVikasRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('normal');
  const [langHindi, setLangHindi] = useState(false);

  // Modals & Action states
  const [activeModal, setActiveModal] = useState(null);
  const [gazetteData, setGazetteData] = useState(null);
  const [dbtBatchData, setDbtBatchData] = useState(null);
  const [mutationData, setMutationData] = useState(null);
  const [citizenQuery, setCitizenQuery] = useState('');
  const [citizenResults, setCitizenResults] = useState([]);
  const [notificationToast, setNotificationToast] = useState(null);

  // Interactive Calculator State
  const [calcInputs, setCalcInputs] = useState({
    owner_name: 'Shri Ramcharan Yadav',
    acquired_area_sqm: 3500,
    land_type: 'RURAL_REMOTE',
    circle_rate_per_sqm: 1850,
    avg_registered_sale_rate_per_sqm: 2400,
    ppp_consented_rate_per_sqm: 0,
    structure_valuation: 350000,
    tree_valuation: 45000,
    crop_valuation: 25000,
    notification_date: '2025-05-15',
    award_date: '2026-03-01'
  });
  const [calcResult, setCalcResult] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resMetrics, resProjects, resVikas] = await Promise.all([
        fetch(`${API_BASE}/api/national-metrics`).then(r => r.json()),
        fetch(`${API_BASE}/api/projects`).then(r => r.json()),
        fetch(`${API_BASE}/api/vikas-rankings`).then(r => r.json())
      ]);
      setMetrics(resMetrics);
      setProjects(resProjects);
      setVikasRankings(resVikas);
      if (resProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(resProjects[0].id);
        setSelectedProject(resProjects[0]);
      }
    } catch (err) {
      console.error("Failed to connect to backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const p = projects.find(item => item.id === selectedProjectId);
      setSelectedProject(p || projects[0]);
    }
  }, [selectedProjectId, projects]);

  // Recalculate sandbox calculator
  const runCalculator = async () => {
    try {
      const params = new URLSearchParams(calcInputs);
      const res = await fetch(`${API_BASE}/api/calculate-single-valuation?${params.toString()}`, {
        method: 'POST'
      });
      const data = await res.json();
      setCalcResult(data);
    } catch (err) {
      console.error("Calculator error:", err);
    }
  };

  useEffect(() => {
    runCalculator();
  }, [calcInputs]);

  // Toast trigger
  const showToast = (msg, type = 'success') => {
    setNotificationToast({ msg, type });
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Actions
  const handleAdvanceStage = async () => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${selectedProject.id}/advance-stage`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Statutory Gate Passed: Advanced to ${data.project.current_stage}`, 'success');
        fetchData();
      } else {
        showToast(data.detail || "Cannot advance stage.", 'error');
      }
    } catch (err) {
      showToast("Error communicating with state machine.", 'error');
    }
  };

  const handleGenerateGazette = async () => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${selectedProject.id}/generate-egazette`, {
        method: 'POST'
      });
      const data = await res.json();
      setGazetteData(data);
      setActiveModal('gazette');
      showToast("Bilingual Gazette schedule generated with Class-3 DSC signature!", 'success');
    } catch (err) {
      showToast("Failed to generate e-Gazette.", 'error');
    }
  };

  const handleDisburseDBT = async () => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${selectedProject.id}/disburse-pfms-dbt`, {
        method: 'POST'
      });
      const data = await res.json();
      setDbtBatchData(data);
      setActiveModal('dbt');
      showToast(`PFMS DBT Disbursed: ₹${data.total_amount_cr} Cr credited to ${data.total_beneficiaries} farmers!`, 'success');
      fetchData();
    } catch (err) {
      showToast("Failed to process PFMS DBT.", 'error');
    }
  };

  const handleTriggerMutation = async () => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${selectedProject.id}/trigger-mutation`, {
        method: 'POST'
      });
      const data = await res.json();
      setMutationData(data);
      setActiveModal('mutation');
      showToast(`Automated mutation completed for ${data.total_mutated_parcels} parcels in State Registry!`, 'success');
      fetchData();
    } catch (err) {
      showToast("Failed to trigger state mutation.", 'error');
    }
  };

  const handleCitizenSearch = async (e) => {
    e.preventDefault();
    if (!citizenQuery) return;
    try {
      const res = await fetch(`${API_BASE}/api/citizen-lookup?query=${encodeURIComponent(citizenQuery)}`);
      const data = await res.json();
      setCitizenResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const STAGES_LIST = [
    "1. Proposal Ingestion & Alignment Scrutiny",
    "2. Social Impact Assessment (SIA)",
    "3. Preliminary Notification & Freezing (Sec 11/3A)",
    "4. Objection Management & Inquiry (Sec 15/3C)",
    "5. Declaration of Acquisition (Sec 19/3D)",
    "6. Valuation, Award & Compensation (Sec 23/26-30/3G)",
    "7. Rehabilitation & Resettlement (R&R)",
    "8. Physical Possession & Land Mutation (Sec 38/3E)",
    "9. Dispute & Reference Monitoring (Sec 51-74)"
  ];

  const currentStageIndex = selectedProject ? STAGES_LIST.indexOf(selectedProject.current_stage) : 0;

  // Home Page Modules Data
  const HOME_MODULES = [
    {
      id: 'dashboard',
      icon: <TrendingUp size={22} color="#0284c7" />,
      iconBg: '#e0f2fe',
      title: 'National Executive Dashboard',
      statutory: 'IndEA 2.0 • PM GatiShakti • PRAGATI Console',
      desc: 'Central intelligence console for DoLR leadership and Central Ministries tracking pan-India corridor progress, acreage notified vs possessed, and fiscal outlays across 28 States.',
      users: 'Central Line Ministries & DoLR Leadership',
      tag: 'Executive View',
      badgeColor: 'badge-blue'
    },
    {
      id: 'workbench',
      icon: <Building2 size={22} color="#ea580c" />,
      iconBg: '#ffedd5',
      title: 'Statutory 9-Stage Workbench',
      statutory: 'RFCTLARR Act 2013 (Sec 4-38) • NH Act 1956',
      desc: 'Deterministic statutory state machine that enforces legal milestones, manages hearing calendars, publishes bilingual gazettes, and issues digital possession memos.',
      users: 'CALAs & District Collectors',
      tag: 'Core Engine',
      badgeColor: 'badge-saffron'
    },
    {
      id: 'gis',
      icon: <Layers size={22} color="#059669" />,
      iconBg: '#ecfdf5',
      title: 'Cadastral GIS Corridor Engine',
      statutory: 'ULPIN Bhu-Aadhaar • Survey of India ORI Layers',
      desc: 'Ingests Right-of-Way alignments (KML/GeoJSON) and computes geometric intersections against cadastral parcel boundaries, tagging 14-digit ULPIN identifiers.',
      users: 'GIS Engineers & Infrastructure Planners',
      tag: 'Spatial Fusion',
      badgeColor: 'badge-green'
    },
    {
      id: 'calculator',
      icon: <IndianRupee size={22} color="#0b1e36" />,
      iconBg: '#f1f5f9',
      title: 'First Schedule Award Calculator',
      statutory: 'RFCTLARR 2013 (Sec 26-30) & NH Act 3G',
      desc: 'Automated statutory valuation engine executing Base Market Rate × Rural Factor (1.0x-2.0x) + Assets + 100% Solatium + 12% Additional Amount with audited accuracy.',
      users: 'Valuation Officers & Landowners',
      tag: 'Audited Formula',
      badgeColor: 'badge-navy'
    },
    {
      id: 'citizen',
      icon: <Search size={22} color="#2563eb" />,
      iconBg: '#eff6ff',
      title: 'Citizen Bhu-Aadhaar Public Portal',
      statutory: 'GIGW 3.0 • Digital Public Infrastructure • Self-Service',
      desc: 'Open public tracking interface for farmers and citizens to search by 14-digit ULPIN or Khasra, inspect itemized compensation awards, and file Section 15 objections.',
      users: 'Landowners & Affected Families',
      tag: 'Citizen Access',
      badgeColor: 'badge-blue'
    },
    {
      id: 'vikas',
      icon: <Award size={22} color="#d97706" />,
      iconBg: '#fef3c7',
      title: '140-Point Vikas State Rankings',
      statutory: 'DoLR MIS Directives • Bhoomi Samman Framework',
      desc: 'Real-time performance leaderboard scoring States on Process Velocity (40 pts), Financial DBT (40 pts), Social R&R (40 pts), and Spatial Mutation (20 pts).',
      users: 'State Chief Secretaries & Evaluators',
      tag: 'National Matrix',
      badgeColor: 'badge-saffron'
    }
  ];

  return (
    <div style={{ fontSize: fontSize === 'large' ? '1.04rem' : (fontSize === 'small' ? '0.92rem' : '1rem') }}>
      
      {/* 1. GIGW 3.0 Standard Accessibility Top Bar */}
      <div className="gov-top-accessibility">
        <div className="top-left-identity">
          <div className="national-flag-tag">
            <span>🇮🇳</span>
            <span>भारत सरकार | Government of India</span>
          </div>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ color: '#93c5fd' }}>ग्रामीण विकास मंत्रालय | Ministry of Rural Development</span>
        </div>

        <div className="top-right-tools">
          <button className="access-btn" onClick={() => setFontSize('small')}>A-</button>
          <button className="access-btn" onClick={() => setFontSize('normal')}>A</button>
          <button className="access-btn" onClick={() => setFontSize('large')}>A+</button>
          <span style={{ opacity: 0.3 }}>|</span>
          <button className="access-btn" onClick={() => setLangHindi(!langHindi)}>
            <Globe size={11} style={{ display: 'inline', marginRight: 4 }} />
            {langHindi ? 'English' : 'हिन्दी'}
          </button>
        </div>
      </div>

      {/* 2. Tricolor Line */}
      <div className="national-tricolor-line">
        <div className="c-saffron" />
        <div className="c-white" />
        <div className="c-green" />
      </div>

      {/* 3. Official Department Header */}
      <header className="main-gov-header">
        <div className="header-container">
          <div className="emblem-title-lockup" onClick={() => setActiveTab('home')}>
            {/* SVG Lion Capital */}
            <svg className="emblem-graphic" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="120" rx="4" fill="#f8fafc"/>
              <path d="M50 15 C42 15 35 22 35 32 C35 40 40 45 45 48 L45 70 L30 70 L30 78 L70 78 L70 70 L55 70 L55 48 C60 45 65 40 65 32 C65 22 58 15 50 15 Z" fill="#92400e"/>
              <circle cx="50" cy="32" r="6" fill="#071426"/>
              <rect x="25" y="82" width="50" height="8" rx="2" fill="#0b1e36"/>
              <circle cx="50" cy="86" r="3" fill="#ffffff"/>
              <rect x="20" y="94" width="60" height="6" rx="1" fill="#78350f"/>
              <text x="50" y="112" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#071426" fontFamily="serif">सत्यमेव जयते</text>
            </svg>

            <div className="brand-hierarchy">
              <span className="hindi-sub">भूमि संसाधन विभाग | ग्रामीण विकास मंत्रालय</span>
              <span className="main-name">National Land Acquisition & Management System (NLAMS)</span>
              <span className="dept-name">Department of Land Resources • Government of India • Unified National Portal</span>
            </div>
          </div>

          <div className="header-trust-badges">
            <div className="trust-chip">
              <span className="tc-title">PM GatiShakti</span>
              <span className="tc-sub">National Master Plan</span>
            </div>
            <div className="trust-chip" style={{ borderTop: '2px solid #f97316' }}>
              <span className="tc-title">Bhu-Aadhaar</span>
              <span className="tc-sub">14-Digit ULPIN</span>
            </div>
            <div className="trust-chip" style={{ borderTop: '2px solid #059669' }}>
              <span className="tc-title">PFMS DBT</span>
              <span className="tc-sub">Direct Bank Credit</span>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Statutory Ticker Feed */}
      <div className="statutory-ticker">
        <div className="ticker-badge">
          <ShieldCheck size={12} />
          <span>STATUTORY GAZETTE FEED</span>
        </div>
        <div className="ticker-content">
          ★ <strong>Notification No. DL-(N)-04/2026</strong>: Preliminary Section 11 schedule published for Delhi-Amritsar Highway Corridor • <strong>ULPIN Encumbrance Lock Active</strong>: 34 cadastral parcels frozen in State Registries • <strong>PFMS DBT Direct Credit</strong>: ₹127.9 Cr disbursed directly to project-affected persons without intermediate holding floats.
        </div>
      </div>

      {/* 5. Navigation Bar */}
      <nav className="main-nav-strip">
        <div className="nav-inner-box">
          <button 
            className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={15} />
            <span>National Gateway</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={15} />
            <span>Executive Dashboard</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'workbench' ? 'active' : ''}`}
            onClick={() => setActiveTab('workbench')}
          >
            <Building2 size={15} />
            <span>Stage-Gate Workbench</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'gis' ? 'active' : ''}`}
            onClick={() => setActiveTab('gis')}
          >
            <Layers size={15} />
            <span>Cadastral GIS Viewer</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            <IndianRupee size={15} />
            <span>Award Calculator</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'citizen' ? 'active' : ''}`}
            onClick={() => setActiveTab('citizen')}
          >
            <Search size={15} />
            <span>Citizen Bhu-Aadhaar</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'vikas' ? 'active' : ''}`}
            onClick={() => setActiveTab('vikas')}
          >
            <Award size={15} />
            <span>140-Point Vikas Rankings</span>
          </button>
        </div>
      </nav>

      {/* Toast Notification */}
      {notificationToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: notificationToast.type === 'error' ? '#991b1b' : '#064e3b',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: 'var(--shadow-xl)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.85rem',
          fontWeight: 700,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {notificationToast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span>{notificationToast.msg}</span>
        </div>
      )}

      {/* 6. Main App Body */}
      <main className="nlams-app-body">

        {/* ================= VIEW 0: HOME GATEWAY ================= */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Card */}
            <div className="home-hero-card">
              <div className="hero-pill-tag">
                <Landmark size={13} />
                <span>Department of Land Resources • Smart India Hackathon</span>
              </div>
              <h1 className="hero-heading">
                National Land Acquisition & Management System (NLAMS)
              </h1>
              <p className="hero-paragraph">
                A unified, statutory enterprise platform digitizing India's public land acquisition lifecycle end-to-end under the <strong>RFCTLARR Act, 2013</strong> and sector-specific central legislations (National Highways Act 1956, Railways Act 1989). Eliminates litigation, locks illegal transactions via <strong>14-digit ULPIN (Bhu-Aadhaar)</strong>, and automates <strong>PFMS Direct Benefit Transfer (DBT)</strong>.
              </p>

              <div className="hero-stats-deck">
                <div className="stat-cell">
                  <span className="stat-cell-num">₹ {metrics?.total_compensation_disbursed_cr || '127.9'} Cr</span>
                  <span className="stat-cell-label">PFMS DBT Disbursed Directly</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-cell-num">{metrics?.total_notified_area_ha || '393.9'} Ha</span>
                  <span className="stat-cell-label">Notified Corridor Area</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-cell-num">{metrics?.total_cadastral_parcels_tracked || '34'}</span>
                  <span className="stat-cell-label">Cadastral Parcels Linked</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-cell-num">100% Audited</span>
                  <span className="stat-cell-label">First Schedule Statutory Math</span>
                </div>
              </div>
            </div>

            {/* Modules Grid Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#071426' }}>Core Functional Portals & Statutory Modules</h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Select any dedicated module below to access statutory workbench functions, analytics, and citizen services.</p>
              </div>
              <span className="badge-pill badge-navy" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Official Enterprise Gateways</span>
            </div>

            {/* Modules Grid */}
            <div className="home-portals-grid">
              {HOME_MODULES.map((mod) => (
                <div 
                  key={mod.id} 
                  className="portal-tile-card"
                  onClick={() => setActiveTab(mod.id)}
                >
                  <div>
                    <div className="portal-header-row">
                      <div className="portal-icon-wrapper" style={{ background: mod.iconBg }}>
                        {mod.icon}
                      </div>
                      <span className={`badge-pill ${mod.badgeColor}`}>{mod.tag}</span>
                    </div>

                    <h3 className="portal-title-text">{mod.title}</h3>
                    <span className="portal-statutory-label">{mod.statutory}</span>
                    <p className="portal-description">{mod.desc}</p>
                  </div>

                  <div className="portal-card-footer">
                    <span className="portal-user-tag">{mod.users}</span>
                    <button 
                      className="btn-action btn-outline" 
                      style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(mod.id);
                      }}
                    >
                      <span>Access Portal</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Statutory Pillar Highlights */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 22, boxShadow: 'var(--shadow-xs)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              <div style={{ borderLeft: '3px solid #f97316', paddingLeft: 14 }}>
                <strong style={{ fontSize: '0.85rem', color: '#071426', display: 'block', marginBottom: 4 }}>
                  1. Statutory Encumbrance Freezing (Sec 11/3A)
                </strong>
                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
                  The moment a Preliminary Gazette is published with Class-3 DSC, NLAMS places an automated API lock on the 14-digit ULPIN in State Land Registries, preventing illegal sales or distress deeds.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #059669', paddingLeft: 14 }}>
                <strong style={{ fontSize: '0.85rem', color: '#071426', display: 'block', marginBottom: 4 }}>
                  2. Direct Account Settlement via PFMS DBT
                </strong>
                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
                  Approved compensation is routed directly from Central Ministry accounts to Aadhaar-seeded farmer bank accounts, eliminating intermediate parking in CALA commercial holding accounts.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #2563eb', paddingLeft: 14 }}>
                <strong style={{ fontSize: '0.85rem', color: '#071426', display: 'block', marginBottom: 4 }}>
                  3. 140-Point Vikas State Accountability
                </strong>
                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
                  States and Districts are ranked continuously based on Process Velocity, DBT efficiency, and R&R civic amenities delivery, with automated penalty deductions for delayed declarations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 1: NATIONAL DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#071426' }}>National Executive Command Console</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Real-time aggregated indicators across active linear & spatial infrastructure corridors</span>
              </div>
              <button className="btn-action btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setActiveTab('home')}>
                ← Back to National Gateway
              </button>
            </div>

            {/* KPI Cards */}
            <div className="kpi-row-grid">
              <div className="kpi-metric-box border-blue">
                <div className="kpi-head">
                  <span className="kpi-head-label">Active Projects</span>
                  <div className="kpi-head-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                    <Building2 size={16} />
                  </div>
                </div>
                <div className="kpi-big-num">{metrics?.total_active_projects || 0}</div>
                <div className="kpi-caption">Central Line Ministries (NHAI, MoR, MoP)</div>
              </div>

              <div className="kpi-metric-box border-saffron">
                <div className="kpi-head">
                  <span className="kpi-head-label">Notified Land Area</span>
                  <div className="kpi-head-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
                    <MapPin size={16} />
                  </div>
                </div>
                <div className="kpi-big-num">{metrics?.total_notified_area_ha || 0} <span style={{ fontSize: '1rem', fontWeight: 600 }}>Ha</span></div>
                <div className="kpi-caption">{metrics?.total_cadastral_parcels_tracked || 0} Cadastral Parcels Linked</div>
              </div>

              <div className="kpi-metric-box border-green">
                <div className="kpi-head">
                  <span className="kpi-head-label">PFMS DBT Disbursed</span>
                  <div className="kpi-head-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                    <IndianRupee size={16} />
                  </div>
                </div>
                <div className="kpi-big-num">₹ {metrics?.total_compensation_disbursed_cr || 0} <span style={{ fontSize: '1rem', fontWeight: 600 }}>Cr</span></div>
                <div className="kpi-caption">
                  <span style={{ color: '#059669', fontWeight: 700 }}>{metrics?.dbt_disbursal_ratio_pct || 0}% </span>
                  of ₹{metrics?.total_compensation_assessed_cr || 0} Cr Assessed
                </div>
              </div>

              <div className="kpi-metric-box border-gold">
                <div className="kpi-head">
                  <span className="kpi-head-label">ULPIN Encumbrance Locks</span>
                  <div className="kpi-head-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                    <Lock size={16} />
                  </div>
                </div>
                <div className="kpi-big-num">{metrics?.ulpin_encumbrance_locks_active || 0}</div>
                <div className="kpi-caption">State Registries Locked (NGDRS/Bhulekh)</div>
              </div>

              <div className="kpi-metric-box border-navy">
                <div className="kpi-head">
                  <span className="kpi-head-label">Avg Physical Possession</span>
                  <div className="kpi-head-icon" style={{ background: '#f1f5f9', color: '#071426' }}>
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <div className="kpi-big-num">{metrics?.average_physical_possession_pct || 0}%</div>
                <div className="kpi-caption">{metrics?.active_disputes_and_references || 0} Court References in e-Courts</div>
              </div>
            </div>

            {/* Split Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              {/* Project Portfolios */}
              <div className="section-panel-card">
                <div className="panel-card-head">
                  <h3 className="panel-card-title">
                    <Building2 size={18} color="#071426" />
                    <span>Statutory Infrastructure Corridors (Pan-India Stream)</span>
                  </h3>
                  <span className="badge-pill badge-green">IndEA 2.0 Compliant</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="nlams-data-table">
                    <thead>
                      <tr>
                        <th>Corridor Project Title</th>
                        <th>Acquiring Body & Act</th>
                        <th>State</th>
                        <th>Statutory Stage</th>
                        <th>PFMS DBT Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id} style={{ background: selectedProjectId === p.id ? '#f0f7ff' : 'transparent' }}>
                          <td>
                            <strong style={{ color: '#071426', display: 'block' }}>{p.title}</strong>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Project Ref: {p.id} • {p.total_corridor_area_ha} Ha</span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{p.acquiring_agency}</div>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{p.statutory_act}</span>
                          </td>
                          <td><span className="badge-pill badge-blue">{p.state}</span></td>
                          <td>
                            <span className="badge-pill badge-saffron">
                              {p.current_stage.split(' ')[1]} {p.current_stage.split(' ')[2] || ''}
                            </span>
                            <div style={{ width: 110, height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 4 }}>
                              <div style={{ width: `${p.stage_progress_pct}%`, height: '100%', background: '#059669', borderRadius: 2 }} />
                            </div>
                          </td>
                          <td>
                            <strong style={{ color: '#059669' }}>₹{p.total_compensation_disbursed_cr}</strong> / ₹{p.total_compensation_assessed_cr} Cr
                          </td>
                          <td>
                            <button 
                              className="btn-action btn-outline" 
                              style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                              onClick={() => {
                                setSelectedProjectId(p.id);
                                setActiveTab('workbench');
                              }}
                            >
                              Open Workbench <ArrowRight size={11} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 140-Point Vikas Preview */}
              <div className="section-panel-card">
                <div className="panel-card-head">
                  <h3 className="panel-card-title">
                    <Award size={18} color="#d97706" />
                    <span>140-Point Vikas Matrix</span>
                  </h3>
                  <button className="btn-action btn-outline" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={() => setActiveTab('vikas')}>
                    View Rankings
                  </button>
                </div>

                <div className="panel-card-body" style={{ padding: '14px 18px' }}>
                  {vikasRankings.slice(0, 5).map((vr, idx) => (
                    <div key={vr.state} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #edf2f7' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ 
                          width: 24, height: 24, borderRadius: 4, 
                          background: idx === 0 ? '#fef3c7' : '#f1f5f9',
                          color: idx === 0 ? '#b45309' : '#334155',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem',
                          border: '1px solid #cbd5e1'
                        }}>
                          #{idx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#071426' }}>{vr.state}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Velocity: {vr.process_velocity_score}/40 • DBT: {vr.financial_dbt_score}/40</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#071426' }}>{vr.total_score}</span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}> / 140</span>
                      </div>
                    </div>
                  ))}

                  <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, marginTop: 14, border: '1px solid var(--border-main)', fontSize: '0.72rem', color: '#475569' }}>
                    <strong style={{ color: '#071426', display: 'block', marginBottom: 2 }}>Statutory Delay Penalties:</strong>
                    Automatic -2.5 pt deductions applied for lapsed Sec 19 notifications or stayed judicial hearings.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: STATUTORY STAGE-GATE WORKBENCH ================= */}
        {activeTab === 'workbench' && selectedProject && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#071426' }}>Statutory Stage-Gate Lifecycle Workbench</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Enforcing deterministic gatekeeper progression under RFCTLARR Act 2013 & NH Act 1956</span>
              </div>
              <button className="btn-action btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setActiveTab('home')}>
                ← Back to National Gateway
              </button>
            </div>

            {/* Project Summary Header */}
            <div className="section-panel-card" style={{ borderTop: '5px solid var(--nlams-navy-800)' }}>
              <div className="panel-card-head" style={{ background: '#f8fafc' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge-pill badge-navy">File Ref: {selectedProject.id}</span>
                    <span className="badge-pill badge-saffron">{selectedProject.statutory_act}</span>
                    <span className="badge-pill badge-green">State: {selectedProject.state}</span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', color: '#071426', margin: '4px 0' }}>{selectedProject.title}</h2>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Requiring Body: <strong>{selectedProject.acquiring_agency}</strong> • Total Corridor: <strong>{selectedProject.total_corridor_area_ha} Ha ({selectedProject.total_length_km || 0} km)</strong> • Cadastral Parcels: <strong>{selectedProject.parcels.length}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <select 
                    style={{ padding: '7px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)', fontSize: '0.8rem', fontWeight: 600 }}
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>

                  <button className="btn-action btn-saffron" onClick={handleAdvanceStage}>
                    <CheckCircle size={14} />
                    <span>Advance Stage</span>
                  </button>
                </div>
              </div>

              {/* 9-Stage Stepper */}
              <div className="panel-card-body">
                <div className="stage-gate-stepper-box">
                  {STAGES_LIST.map((stageName, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isActive = idx === currentStageIndex;
                    return (
                      <div key={stageName} className={`stepper-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                        <div className="node-circle">
                          {isCompleted ? <Check size={14} /> : (idx + 1)}
                        </div>
                        <div className="node-name-text">
                          {stageName.split(' ')[1]} {stageName.split(' ')[2] || ''}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stage Action Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                  {/* Action 1: e-Gazette */}
                  <div style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-sm)', padding: 16, background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <strong style={{ fontSize: '0.85rem', color: '#071426' }}>Form 11A: e-Gazette Schedule</strong>
                      <span className="badge-pill badge-blue">Section 11(1) / 3A</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12 }}>
                      Generates standardized bilingual schedule in Hindi & English stamped with Class-3 DSC digital certificate.
                    </p>
                    <button className="btn-action btn-outline" style={{ width: '100%', fontSize: '0.75rem' }} onClick={handleGenerateGazette}>
                      <FileText size={14} />
                      <span>Inspect & Sign Gazette Notification</span>
                    </button>
                  </div>

                  {/* Action 2: PFMS DBT */}
                  <div style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-sm)', padding: 16, background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <strong style={{ fontSize: '0.85rem', color: '#071426' }}>PFMS Direct Benefit Transfer (DBT)</strong>
                      <span className="badge-pill badge-green">Section 23 / 3G</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12 }}>
                      Generates ISO 20022 XML batch to credit ₹ Cr compensation directly to farmers' verified bank accounts.
                    </p>
                    <button className="btn-action btn-green" style={{ width: '100%', fontSize: '0.75rem' }} onClick={handleDisburseDBT}>
                      <IndianRupee size={14} />
                      <span>Execute PFMS DBT Disbursal</span>
                    </button>
                  </div>

                  {/* Action 3: State Registry Mutation */}
                  <div style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-sm)', padding: 16, background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <strong style={{ fontSize: '0.85rem', color: '#071426' }}>State Land Registry Mutation</strong>
                      <span className="badge-pill badge-saffron">Section 38 / 3E</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12 }}>
                      Sends automated webhook mutation payloads to State Portals (UP Bhulekh, 7/12, Bhoomi) upon possession.
                    </p>
                    <button className="btn-action btn-saffron" style={{ width: '100%', fontSize: '0.75rem' }} onClick={handleTriggerMutation}>
                      <RefreshCw size={14} />
                      <span>Trigger Automated Mutation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cadastral Parcel Records */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <ShieldCheck size={18} color="#071426" />
                  <span>Cadastral Inventory & 14-Digit ULPIN (Bhu-Aadhaar) Records</span>
                </h3>
                <span className="badge-pill badge-green">{selectedProject.parcels.length} Intersected Parcels</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="nlams-data-table">
                  <thead>
                    <tr>
                      <th>14-Digit ULPIN (Bhu-Aadhaar)</th>
                      <th>State Local Record Ref</th>
                      <th>Landowner & Bank Verification</th>
                      <th>Acquired / Total Area</th>
                      <th>Land Classification</th>
                      <th>Circle / Sale Rate (₹/sq.m)</th>
                      <th>Encumbrance State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.parcels.map(p => (
                      <tr key={p.ulpin}>
                        <td>
                          <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#071426' }}>{p.ulpin}</div>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{p.village}, {p.district}</span>
                        </td>
                        <td>
                          <strong style={{ color: '#071426' }}>{p.local_record_no}</strong>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{p.nomenclature_type}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.owner_name}</div>
                          <div style={{ fontSize: '0.68rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Check size={11} /> Aadhaar: {p.owner_aadhaar_masked} ({p.bank_ifsc})
                          </div>
                        </td>
                        <td>
                          <strong>{p.acquired_area_sqm} sq.m</strong>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>of {p.total_parcel_area_sqm} sq.m</span>
                        </td>
                        <td>
                          <span className="badge-pill badge-blue">{p.land_type}</span>
                        </td>
                        <td>
                          <div>Circle: ₹{p.circle_rate_per_sqm}</div>
                          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Sale: ₹{p.avg_registered_sale_rate_per_sqm}</div>
                        </td>
                        <td>
                          {p.encumbrance_locked ? (
                            <span className="badge-pill badge-red">
                              <Lock size={10} /> Encumbrance Locked
                            </span>
                          ) : (
                            <span className="badge-pill badge-green">Free</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 15 Objections Register */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <FileSpreadsheet size={18} color="#071426" />
                  <span>Section 15 / 3C Objection Register & Quasi-Judicial Orders</span>
                </h3>
                <span className="badge-pill badge-saffron">{selectedProject.objections.length} Filed Objections</span>
              </div>

              <div className="panel-card-body">
                {selectedProject.objections.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 20, color: '#64748b', fontSize: '0.8rem' }}>
                    No statutory objections pending for this corridor. All Section 11 notices are clean.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {selectedProject.objections.map(obj => (
                      <div key={obj.id} style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-sm)', padding: 14, background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <strong style={{ color: '#071426', fontSize: '0.85rem' }}>{obj.id}</strong>
                            <span className="badge-pill badge-blue">{obj.grounds_category}</span>
                            <span className="badge-pill badge-green">{obj.status}</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Filing Date: {obj.filing_date}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 8 }}>
                          Claimant: <strong>{obj.claimant_name}</strong> • Contact: {obj.contact_phone} • ULPIN: <strong>{obj.ulpin}</strong>
                        </div>
                        <div style={{ background: '#ffffff', border: '1px solid var(--border-main)', borderRadius: 4, padding: 10, fontSize: '0.78rem', marginBottom: 8 }}>
                          <strong>Grounds of Objection:</strong> {obj.objection_details}
                        </div>
                        {obj.reasoned_order_summary && (
                          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 4, padding: 10, fontSize: '0.78rem', color: '#065f46' }}>
                            <strong>Quasi-Judicial Reasoned Order (CALA):</strong> {obj.reasoned_order_summary}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3: CADASTRAL GIS CORRIDOR VIEWER ================= */}
        {activeTab === 'gis' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#071426' }}>Cadastral GIS Intersection Engine</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Vector overlay of infrastructure Right-of-Way alignments against Survey of India cadastral maps</span>
              </div>
              <button className="btn-action btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setActiveTab('home')}>
                ← Back to National Gateway
              </button>
            </div>

            <div className="section-panel-card">
              <div className="panel-card-head">
                <div>
                  <h3 className="panel-card-title">
                    <Layers size={18} color="#071426" />
                    <span>Cadastral GIS Intersection Engine (BiSAG-N PM GatiShakti Compliant)</span>
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                    High-Resolution Vector Overlay: Right-of-Way (RoW) Alignment vs Survey of India Cadastral Polygons
                  </div>
                </div>
                <span className="badge-pill badge-green">EPSG:4326 OGC Layer</span>
              </div>

              <div className="panel-card-body">
                <MapContainer 
                  center={selectedProject?.alignment_coordinates[0] || [28.6139, 77.2090]} 
                  zoom={12} 
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Survey of India ORI'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Alignment Polyline */}
                  {selectedProject?.alignment_coordinates && (
                    <Polyline 
                      positions={selectedProject.alignment_coordinates} 
                      color="#ea580c" 
                      weight={6}
                      dashArray="10, 5"
                    >
                      <Popup>
                        <div style={{ padding: 4, fontSize: '0.8rem' }}>
                          <strong>{selectedProject.title}</strong>
                          <div>Length: {selectedProject.total_length_km} km</div>
                          <div>Agency: {selectedProject.acquiring_agency}</div>
                        </div>
                      </Popup>
                    </Polyline>
                  )}

                  {/* Cadastral Polygons */}
                  {selectedProject?.parcels.map((parcel) => (
                    parcel.coordinates_polygon && parcel.coordinates_polygon.length > 0 && (
                      <Polygon
                        key={parcel.ulpin}
                        positions={parcel.coordinates_polygon}
                        pathOptions={{
                          color: parcel.encumbrance_locked ? '#b91c1c' : '#059669',
                          fillColor: parcel.encumbrance_locked ? '#ef4444' : '#10b981',
                          fillOpacity: 0.45,
                          weight: 2
                        }}
                      >
                        <Tooltip sticky>
                          <div style={{ fontSize: '0.75rem' }}>
                            <strong>ULPIN: {parcel.ulpin}</strong>
                            <div>Record: {parcel.local_record_no}</div>
                            <div>Owner: {parcel.owner_name}</div>
                            <div>Acquired: {parcel.acquired_area_sqm} sq.m</div>
                            <div>Status: {parcel.encumbrance_locked ? '🔒 ENCUMBRANCE LOCKED' : 'FREE'}</div>
                          </div>
                        </Tooltip>
                      </Polygon>
                    )
                  ))}
                </MapContainer>

                <div style={{ display: 'flex', gap: 24, marginTop: 14, padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 14, height: 4, background: '#ea580c', display: 'inline-block' }}></span>
                    <span>Proposed Infrastructure Corridor (Right-of-Way)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 12, height: 12, background: '#ef4444', opacity: 0.7, display: 'inline-block', border: '1px solid #b91c1c' }}></span>
                    <span>Section 11 Encumbrance Locked Cadastral Parcel</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 12, height: 12, background: '#10b981', opacity: 0.7, display: 'inline-block', border: '1px solid #059669' }}></span>
                    <span>Free / Unnotified Cadastral Polygon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: FIRST SCHEDULE COMPENSATION CALCULATOR ================= */}
        {activeTab === 'calculator' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#071426' }}>First Schedule Compensation Valuation Engine</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Mathematical formulation under Sections 26 to 30 of the RFCTLARR Act, 2013</span>
              </div>
              <button className="btn-action btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setActiveTab('home')}>
                ← Back to National Gateway
              </button>
            </div>

            <div className="section-panel-card">
              <div className="panel-card-head">
                <div>
                  <h3 className="panel-card-title">
                    <IndianRupee size={18} color="#071426" />
                    <span>Statutory First Schedule Compensation Computation Engine</span>
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                    Mandatory Formulation under RFCTLARR Act 2013 (Sec 26-30) & NH Act 1956 (Sec 3G)
                  </div>
                </div>
                <span className="badge-pill badge-green">IEEE 754 Audited</span>
              </div>

              <div className="panel-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
                  {/* Input form */}
                  <div style={{ background: '#f8fafc', padding: 18, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
                    <h4 style={{ fontSize: '0.88rem', marginBottom: 14, color: '#071426' }}>1. Statutory Parameter Inputs</h4>

                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Landholder Full Name</label>
                      <input 
                        type="text" 
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                        value={calcInputs.owner_name} 
                        onChange={(e) => setCalcInputs({ ...calcInputs, owner_name: e.target.value })} 
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Acquired Area (sq.m)</label>
                        <input 
                          type="number" 
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          value={calcInputs.acquired_area_sqm} 
                          onChange={(e) => setCalcInputs({ ...calcInputs, acquired_area_sqm: parseFloat(e.target.value) || 0 })} 
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Jurisdiction & Factor</label>
                        <select 
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          value={calcInputs.land_type}
                          onChange={(e) => setCalcInputs({ ...calcInputs, land_type: e.target.value })}
                        >
                          <option value="URBAN">Urban (Factor: 1.0x)</option>
                          <option value="RURAL_CLOSE">Rural 0-10 km (Factor: 1.25x)</option>
                          <option value="RURAL_MID">Rural 10-20 km (Factor: 1.50x)</option>
                          <option value="RURAL_REMOTE">Rural Remote &gt;20 km (Factor: 2.00x)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Stamp Act Circle Rate (₹/sq.m)</label>
                        <input 
                          type="number" 
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          value={calcInputs.circle_rate_per_sqm} 
                          onChange={(e) => setCalcInputs({ ...calcInputs, circle_rate_per_sqm: parseFloat(e.target.value) || 0 })} 
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Avg 3-Yr Deeds Rate (₹/sq.m)</label>
                        <input 
                          type="number" 
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          value={calcInputs.avg_registered_sale_rate_per_sqm} 
                          onChange={(e) => setCalcInputs({ ...calcInputs, avg_registered_sale_rate_per_sqm: parseFloat(e.target.value) || 0 })} 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Structures (₹)</label>
                        <input 
                          type="number" 
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          value={calcInputs.structure_valuation} 
                          onChange={(e) => setCalcInputs({ ...calcInputs, structure_valuation: parseFloat(e.target.value) || 0 })} 
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Trees (₹)</label>
                        <input 
                          type="number" 
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          value={calcInputs.tree_valuation} 
                          onChange={(e) => setCalcInputs({ ...calcInputs, tree_valuation: parseFloat(e.target.value) || 0 })} 
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Crops (₹)</label>
                        <input 
                          type="number" 
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          value={calcInputs.crop_valuation} 
                          onChange={(e) => setCalcInputs({ ...calcInputs, crop_valuation: parseFloat(e.target.value) || 0 })} 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Sec 11 Notification Date</label>
                        <input 
                          type="date" 
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          value={calcInputs.notification_date} 
                          onChange={(e) => setCalcInputs({ ...calcInputs, notification_date: e.target.value })} 
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Award Sanction Date</label>
                        <input 
                          type="date" 
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          value={calcInputs.award_date} 
                          onChange={(e) => setCalcInputs({ ...calcInputs, award_date: e.target.value })} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Valuation Breakdown Display */}
                  {calcResult && (
                    <div style={{ background: '#ffffff', border: '2px solid #059669', borderRadius: 'var(--radius-sm)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
                        <span className="badge-pill badge-green">Statutory Award Breakdown</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Statutory Days: {calcResult.days_elapsed_notif_to_award}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#64748b' }}>Sec 26 Base Rate:</span>
                          <strong>₹{calcResult.base_market_value_per_sqm.toLocaleString()} / sq.m</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#64748b' }}>Base Land Value ({calcResult.acquired_area_sqm} sq.m):</span>
                          <strong>₹{calcResult.base_market_value_total.toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#64748b' }}>Multiplication Factor:</span>
                          <strong style={{ color: '#b45309' }}>× {calcResult.multiplication_factor}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#64748b' }}>Adjusted Market Value (MVadj):</span>
                          <strong>₹{calcResult.adjusted_market_value.toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#64748b' }}>Attached Assets (Sec 29):</span>
                          <strong>+ ₹{calcResult.assets_valuation_total.toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                          <span style={{ fontWeight: 700 }}>Base Compensation (C_base):</span>
                          <strong style={{ color: '#071426' }}>₹{calcResult.base_compensation.toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#64748b' }}>Solatium 100% (Sec 30(1)):</span>
                          <strong style={{ color: '#2563eb' }}>+ ₹{calcResult.solatium_amount.toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#64748b' }}>Additional Amount 12% p.a. (Sec 30(3)):</span>
                          <strong style={{ color: '#2563eb' }}>+ ₹{calcResult.additional_amount_12pct.toLocaleString()}</strong>
                        </div>
                      </div>

                      <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 'var(--radius-sm)', padding: 14, marginTop: 14, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>
                          Gross Total Award Payable (PFMS DBT)
                        </div>
                        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', marginTop: 2 }}>
                          ₹ {calcResult.gross_total_award.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#15803d' }}>
                          (₹ {(calcResult.gross_total_award / 10000000).toFixed(4)} Crores)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 5: CITIZEN / LANDOWNER BHU-AADHAAR PORTAL ================= */}
        {activeTab === 'citizen' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#071426' }}>Citizen Bhu-Aadhaar Public Tracking Portal</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Public search for acquisition notifications, itemized compensation awards, and objection status</span>
              </div>
              <button className="btn-action btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setActiveTab('home')}>
                ← Back to National Gateway
              </button>
            </div>

            <div className="section-panel-card">
              <div className="panel-card-head">
                <div>
                  <h3 className="panel-card-title">
                    <Search size={18} color="#071426" />
                    <span>Citizen & Landholder Bhu-Aadhaar Public Tracking Portal</span>
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                    Open Public Query Interface under GIGW 3.0 Guidelines for Transparency
                  </div>
                </div>
                <span className="badge-pill badge-blue">Public Access Portal</span>
              </div>

              <div className="panel-card-body">
                <form onSubmit={handleCitizenSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <input 
                    type="text" 
                    placeholder="Enter 14-Digit ULPIN (Bhu-Aadhaar), Khasra / Survey No, or Landowner Name (e.g. Ramcharan)..."
                    value={citizenQuery}
                    onChange={(e) => setCitizenQuery(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn-action btn-navy" style={{ padding: '0 20px' }}>
                    <Search size={15} />
                    <span>Search Records</span>
                  </button>
                </form>

                {citizenResults.length === 0 ? (
                  <div style={{ background: '#f8fafc', padding: 28, borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px dashed var(--border-dark)' }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: 6 }}>🔍</div>
                    <strong style={{ color: '#071426', display: 'block', marginBottom: 4 }}>Search Your Landholding Status</strong>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: 460, margin: '0 auto' }}>
                      Enter your 14-digit ULPIN (Bhu-Aadhaar), Khasra/Survey number, or owner name (e.g. "Ramcharan", "Savita", "Singh") to track statutory stage and compensation.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {citizenResults.map((item, idx) => (
                      <div key={idx} style={{ background: '#ffffff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)', padding: 18, boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginBottom: 12 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <strong style={{ fontSize: '1rem', color: '#071426' }}>{item.parcel.owner_name}</strong>
                              <span className="badge-pill badge-green">ULPIN: {item.parcel.ulpin}</span>
                              <span className="badge-pill badge-saffron">{item.parcel.local_record_no}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                              Corridor: <strong>{item.project_title}</strong> • Stage: <strong>{item.current_stage}</strong>
                            </div>
                          </div>

                          <span className={`badge-pill ${item.parcel.encumbrance_locked ? 'badge-red' : 'badge-green'}`}>
                            {item.encumbrance_status}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 14 }}>
                          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4 }}>
                            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Acquired Area</span>
                            <strong style={{ fontSize: '0.85rem', color: '#071426' }}>{item.parcel.acquired_area_sqm} sq.m</strong>
                          </div>
                          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4 }}>
                            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Gazette Publication ID</span>
                            <strong style={{ fontSize: '0.8rem', color: '#2563eb' }}>{item.sec11_gazette_id || "Under Preparation"}</strong>
                          </div>
                          <div style={{ background: '#ecfdf5', padding: 10, borderRadius: 4, border: '1px solid #bbf7d0' }}>
                            <span style={{ fontSize: '0.68rem', color: '#166534', display: 'block' }}>Statutory Compensation Award</span>
                            <strong style={{ fontSize: '1.05rem', color: '#059669' }}>₹ {item.valuation_estimate.gross_total_award.toLocaleString()}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          <button 
                            className="btn-action btn-outline" 
                            style={{ fontSize: '0.72rem', padding: '5px 12px' }}
                            onClick={() => {
                              showToast("Objection Window Open: Section 15 digital form launched.", 'success');
                            }}
                          >
                            <HelpCircle size={13} />
                            <span>File Section 15 Objection</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 6: 140-POINT VIKAS RANKINGS ================= */}
        {activeTab === 'vikas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#071426' }}>140-Point Vikas State Rankings Leaderboard</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Department of Land Resources (DoLR) national performance matrix</span>
              </div>
              <button className="btn-action btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setActiveTab('home')}>
                ← Back to National Gateway
              </button>
            </div>

            <div className="section-panel-card">
              <div className="panel-card-head">
                <div>
                  <h3 className="panel-card-title">
                    <Award size={18} color="#d97706" />
                    <span>DoLR 140-Point Vikas Performance Matrix (State & UT Leaderboard)</span>
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                    Official National Evaluation Framework under Bhoomi Samman Program
                  </div>
                </div>
                <span className="badge-pill badge-saffron">Annual Evaluation 2026</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="nlams-data-table">
                  <thead>
                    <tr>
                      <th>National Rank</th>
                      <th>State / Union Territory</th>
                      <th>Process Velocity (Max 40)</th>
                      <th>Financial & DBT (Max 40)</th>
                      <th>Social & R&R (Max 40)</th>
                      <th>Spatial & Mutation (Max 20)</th>
                      <th>Penalty Deductions</th>
                      <th>Total Vikas Score (Max 140)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vikasRankings.map((v, idx) => (
                      <tr key={v.state}>
                        <td>
                          <span style={{ 
                            width: 24, height: 24, borderRadius: 4, 
                            background: idx === 0 ? '#fef3c7' : '#f1f5f9',
                            color: idx === 0 ? '#b45309' : '#0f172a',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                            border: '1px solid #cbd5e1', fontSize: '0.75rem'
                          }}>
                            #{idx + 1}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.85rem', color: '#071426' }}>{v.state}</strong>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                            {v.breakdown_details.total_active_projects || 1} Active Corridors Tracked
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: '#2563eb' }}>{v.process_velocity_score}</strong> / 40
                        </td>
                        <td>
                          <strong style={{ color: '#059669' }}>{v.financial_dbt_score}</strong> / 40
                        </td>
                        <td>
                          <strong style={{ color: '#d97706' }}>{v.social_rr_score}</strong> / 40
                        </td>
                        <td>
                          <strong style={{ color: '#071426' }}>{v.spatial_mutation_score}</strong> / 20
                        </td>
                        <td>
                          {v.penalties_deducted > 0 ? (
                            <span style={{ color: '#dc2626', fontWeight: 700 }}>-{v.penalties_deducted} pts</span>
                          ) : (
                            <span style={{ color: '#059669' }}>0</span>
                          )}
                        </td>
                        <td>
                          <strong style={{ fontSize: '1.15rem', color: '#071426' }}>
                            {v.total_score} <span style={{ fontSize: '0.68rem', color: '#64748b' }}>/ 140</span>
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 7. Footer */}
      <footer className="nlams-footer">
        <div className="footer-top-grid">
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9rem', marginBottom: 8 }}>Department of Land Resources (DoLR)</h4>
            <p style={{ lineHeight: 1.6, color: '#94a3b8' }}>
              Ministry of Rural Development, Government of India.<br />
              NBO Building, Nirman Bhawan, New Delhi - 110011.<br />
              Toll-Free National Helpline: <strong>1800-11-LAND (5263)</strong>
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9rem', marginBottom: 8 }}>Statutory Standards</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8, color: '#94a3b8' }}>
              <li>• RFCTLARR Act, 2013</li>
              <li>• National Highways Act, 1956</li>
              <li>• Railways Act, 1989</li>
              <li>• GIGW 3.0 & WCAG 2.1 AA</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9rem', marginBottom: 8 }}>Sovereign Integrations</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8, color: '#94a3b8' }}>
              <li>• PM GatiShakti NMP (BiSAG-N)</li>
              <li>• PFMS Direct Benefit Transfer</li>
              <li>• Directorate of Printing e-Gazette</li>
              <li>• State Land Records (Bhulekh / 7/12)</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>
            Designed & Developed for Smart India Hackathon (SIH) • Department of Land Resources
          </div>
          <div>
            Portal Version 1.0.0 (IndEA 2.0) • Last Updated: 25-Aug-2026
          </div>
        </div>
      </footer>

      {/* ================= MODAL 1: BILINGUAL E-GAZETTE SCHEDULE ================= */}
      {activeModal === 'gazette' && gazetteData && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 12, marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#071426' }}>e-Gazette Statutory Notification (Form 11A)</h3>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Published under Section 11(1) of RFCTLARR Act 2013</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 8px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4, marginBottom: 12, border: '1px solid var(--border-main)', fontSize: '0.75rem' }}>
              <div><strong>Gazette ID:</strong> {gazetteData.gazette_id}</div>
              <div><strong>Signing Authority:</strong> {gazetteData.signing_authority}</div>
              <div><strong>Class-3 DSC Hash:</strong> <code style={{ color: '#2563eb' }}>{gazetteData.dsc_digital_signature_hash}</code></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxHeight: '48vh', overflowY: 'auto' }}>
              <div style={{ background: '#ffffff', padding: 12, borderRadius: 4, border: '1px solid var(--border-main)' }}>
                <strong style={{ fontSize: '0.78rem', color: '#071426', display: 'block', marginBottom: 6 }}>English Notification Schedule</strong>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.72rem', fontFamily: 'inherit', color: '#334155' }}>
                  {gazetteData.english_text}
                </pre>
              </div>

              <div style={{ background: '#ffffff', padding: 12, borderRadius: 4, border: '1px solid var(--border-main)' }}>
                <strong style={{ fontSize: '0.78rem', color: '#071426', display: 'block', marginBottom: 6 }}>मानकीकृत हिन्दी राजपत्र अधिसूचना</strong>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.72rem', fontFamily: 'inherit', color: '#334155' }}>
                  {gazetteData.hindi_text}
                </pre>
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn-action btn-navy" onClick={() => setActiveModal(null)}>
                <Check size={14} />
                <span>Acknowledge Gazette Publication</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PFMS DBT BATCH ================= */}
      {activeModal === 'dbt' && dbtBatchData && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 12, marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#071426' }}>PFMS Direct Benefit Transfer (DBT) ISO 20022 XML Batch</h3>
                <span style={{ fontSize: '0.72rem', color: '#059669' }}>Transmitted to RBI APBS Settlement Gateway</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 8px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4 }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Batch Sanction Ref</span>
                <strong style={{ fontSize: '0.78rem', color: '#071426', display: 'block' }}>{dbtBatchData.batch_id}</strong>
              </div>
              <div style={{ background: '#ecfdf5', padding: 10, borderRadius: 4 }}>
                <span style={{ fontSize: '0.68rem', color: '#166534' }}>Direct Bank Credit</span>
                <strong style={{ fontSize: '0.95rem', color: '#059669', display: 'block' }}>₹ {dbtBatchData.total_amount_cr} Cr</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4 }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Verified Beneficiaries</span>
                <strong style={{ fontSize: '0.95rem', color: '#2563eb', display: 'block' }}>{dbtBatchData.total_beneficiaries} Landholders</strong>
              </div>
            </div>

            <pre style={{ background: '#071426', color: '#a5f3fc', padding: 14, borderRadius: 4, fontSize: '0.72rem', overflowX: 'auto', maxHeight: '42vh' }}>
              {dbtBatchData.xml_payload}
            </pre>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn-action btn-green" onClick={() => setActiveModal(null)}>
                <CheckCircle size={14} />
                <span>Confirm PFMS Direct Disbursal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: STATE REGISTRY MUTATION ================= */}
      {activeModal === 'mutation' && mutationData && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 12, marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#071426' }}>State Land Registry Automated Mutation Ledger</h3>
                <span style={{ fontSize: '0.72rem', color: '#059669' }}>Synchronized with State RoR Portal ({mutationData.state})</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 8px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
              <table className="nlams-data-table">
                <thead>
                  <tr>
                    <th>ULPIN</th>
                    <th>Previous Landowner</th>
                    <th>Vesting Agency Title</th>
                    <th>Mutation Order Ref</th>
                    <th>State API Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mutationData.records.map((rec, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{rec.ulpin}</td>
                      <td>{rec.old_owner}</td>
                      <td><strong style={{ color: '#059669' }}>{rec.new_owner}</strong></td>
                      <td>{rec.mutation_order_no}</td>
                      <td><span className="badge-pill badge-green">{rec.state_portal_sync}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-action btn-navy" onClick={() => setActiveModal(null)}>Close Mutation Ledger</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
