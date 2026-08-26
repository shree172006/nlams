import React from 'react';
import { 
  Home, TrendingUp, Layers, Building2, IndianRupee, 
  Search, Scale, Users, Zap, Globe 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  fontSize, 
  setFontSize, 
  langHindi, 
  setLangHindi, 
  t, 
  selectedProject, 
  metrics 
}) {
  return (
    <>
      {/* 1. GIGW 3.0 Standard Accessibility Top Bar */}
      <div className="gov-top-accessibility">
        <div className="top-left-identity">
          <div className="national-flag-tag">
            <span>🇮🇳</span>
            <span>{t.govt}</span>
          </div>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ color: '#93c5fd' }}>{t.deptHindi}</span>
        </div>

        <div className="top-right-tools">
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginRight: 4 }}>Font:</span>
          <button 
            className={`access-btn ${fontSize === 'sm' ? 'active' : ''}`} 
            onClick={() => setFontSize('sm')}
            title="Decrease font size"
          >
            A-
          </button>
          <button 
            className={`access-btn ${fontSize === 'normal' ? 'active' : ''}`} 
            onClick={() => setFontSize('normal')}
            title="Default font size"
          >
            A
          </button>
          <button 
            className={`access-btn ${fontSize === 'lg' ? 'active' : ''}`} 
            onClick={() => setFontSize('lg')}
            title="Increase font size"
          >
            A+
          </button>
          <span style={{ opacity: 0.3, margin: '0 4px' }}>|</span>
          <button 
            className="access-btn" 
            style={{ background: langHindi ? 'var(--nlams-saffron)' : 'rgba(255,255,255,0.12)', color: '#ffffff', fontWeight: 700 }}
            onClick={() => setLangHindi(!langHindi)}
          >
            <Globe size={11} />
            <span>{langHindi ? 'English' : 'हिन्दी'}</span>
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
              <span className="hindi-sub">{t.deptHindi}</span>
              <span className="main-name">{t.mainName}</span>
              <span className="dept-name">{t.subHeading}</span>
            </div>
          </div>

          <div className="header-trust-badges">
            <div className="trust-chip" style={{ borderLeft: '3px solid #059669', padding: '6px 14px' }}>
              <span className="tc-title" style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
                {t.liveSystem}
              </span>
              <span className="tc-sub">{t.govtDept}</span>
            </div>
            <div className="trust-chip" style={{ borderLeft: '3px solid #f97316', padding: '6px 14px' }}>
              <span className="tc-title">{t.actBadge}</span>
              <span className="tc-sub">{t.actSub}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Statutory Ticker Feed */}
      <div className="statutory-ticker">
        <div className="ticker-badge">
          <span>{t.tickerTitle}</span>
        </div>
        <div className="ticker-content">
          ★ <strong>{langHindi ? 'चयनित कॉरिडोर' : 'Selected Corridor'}</strong>: {selectedProject?.title || 'Varanasi Ring Road'} • <strong>{langHindi ? 'वर्तमान चरण' : 'Current Stage'}</strong>: {selectedProject?.current_stage} • <strong>PFMS DBT</strong>: ₹{metrics?.total_compensation_disbursed_cr} Cr {langHindi ? 'वितरित' : 'Disbursed'} • <strong>{langHindi ? 'भार-मुक्ति लॉक' : 'Encumbrance Locks'}</strong>: {metrics?.ulpin_encumbrance_locks_active} {langHindi ? 'पार्सल' : 'Parcels'}.
        </div>
      </div>

      {/* 5. Navigation Bar */}
      <nav className="main-nav-strip">
        <div className="nav-inner-box">
          <button 
            className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={14} />
            <span>{t.gatewayHub}</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={14} />
            <span>{t.navDashboard}</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'gis' ? 'active' : ''}`}
            onClick={() => setActiveTab('gis')}
          >
            <Layers size={14} />
            <span>{t.navGis}</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'workbench' ? 'active' : ''}`}
            onClick={() => setActiveTab('workbench')}
          >
            <Building2 size={14} />
            <span>{t.navWorkflow}</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            <IndianRupee size={14} />
            <span>{t.navCalculator}</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'citizen' ? 'active' : ''}`}
            onClick={() => setActiveTab('citizen')}
          >
            <Search size={14} />
            <span>{t.navLandowner}</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'objections' ? 'active' : ''}`}
            onClick={() => setActiveTab('objections')}
          >
            <Scale size={14} />
            <span>{t.navObjections}</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'rr' ? 'active' : ''}`}
            onClick={() => setActiveTab('rr')}
          >
            <Users size={14} />
            <span>{t.navRR}</span>
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'airisk' ? 'active' : ''}`}
            onClick={() => setActiveTab('airisk')}
          >
            <Zap size={14} />
            <span>{t.navAIRisk}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
