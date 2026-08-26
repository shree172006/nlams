import React from 'react';
import { 
  Home, TrendingUp, Layers, Building2, IndianRupee, 
  Search, Scale, Users, Zap, Globe, Shield, UserCheck, LogIn, LogOut, Smartphone
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
  metrics,
  currentUser,
  setShowLoginModal,
  handleLogout
}) {
  const isOfficer = currentUser && currentUser.role !== 'CITIZEN';

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
            {isOfficer ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '6px 14px', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1e3a8a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    <Shield size={16} color="#93c5fd" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>{currentUser.name}</span>
                      <span className="badge-pill badge-blue" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>{currentUser.role}</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{currentUser.designation}</div>
                  </div>
                </div>
                <div style={{ height: 24, width: 1, background: '#cbd5e1', margin: '0 4px' }} />
                <button 
                  onClick={handleLogout}
                  className="btn-action btn-outline"
                  style={{ fontSize: '0.7rem', padding: '4px 8px', color: '#dc2626', borderColor: '#fca5a5' }}
                  title="Switch back to Free Citizen Mode"
                >
                  <LogOut size={12} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button 
                className="btn-action btn-navy"
                style={{
                  padding: '9px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 'var(--radius-md)',
                  background: '#071426',
                  color: '#ffffff',
                  border: '1px solid #1e3a8a',
                  boxShadow: '0 2px 6px rgba(7,20,38,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setShowLoginModal(true)}
              >
                <Shield size={16} color="#60a5fa" />
                <span>{langHindi ? 'अधिकारी लॉगिन' : 'Officer Login'}</span>
                <span className="badge-pill badge-gold" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>Portal</span>
              </button>
            )}
          </div>
        </div>
      </header>

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

          {!isOfficer ? (
            /* ================= CITIZEN PUBLIC TABS (NOT LOGGED IN AS OFFICER) ================= */
            <>
              <button 
                className={`nav-link-btn ${activeTab === 'citizen' ? 'active' : ''}`}
                onClick={() => setActiveTab('citizen')}
              >
                <Search size={14} />
                <span>{langHindi ? '1. भू-स्वामी नागरिक सेवा' : '1. Citizen Land Portal (Free)'}</span>
              </button>
              <button 
                className={`nav-link-btn ${activeTab === 'gis' ? 'active' : ''}`}
                onClick={() => setActiveTab('gis')}
              >
                <Layers size={14} />
                <span>{langHindi ? '2. मैप-टू-मनी जीआईएस' : '2. Map-to-Money GIS'}</span>
              </button>
              <button 
                className={`nav-link-btn ${activeTab === 'calculator' ? 'active' : ''}`}
                onClick={() => setActiveTab('calculator')}
              >
                <IndianRupee size={14} />
                <span>{langHindi ? '3. मुआवजा कैलकुलेटर' : '3. Compensation Calculator'}</span>
              </button>
              <button 
                className={`nav-link-btn ${activeTab === 'rr' ? 'active' : ''}`}
                onClick={() => setActiveTab('rr')}
              >
                <Users size={14} />
                <span>{langHindi ? '4. पुनर्वास एवं R&R' : '4. R&R Entitlements Guide'}</span>
              </button>
            </>
          ) : (
            /* ================= OFFICER TABS (WHEN AUTHENTICATED) ================= */
            <>
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
                <span>{langHindi ? '2. मैप-टू-मनी जीआईएस' : '2. Map-to-Money GIS'}</span>
              </button>
              <button 
                className={`nav-link-btn ${activeTab === 'workbench' ? 'active' : ''}`}
                onClick={() => setActiveTab('workbench')}
              >
                <Building2 size={14} />
                <span>{langHindi ? '3. वैधानिक चरण गेटकीपर' : '3. Statutory Workflow'}</span>
              </button>
              <button 
                className={`nav-link-btn ${activeTab === 'objections' ? 'active' : ''}`}
                onClick={() => setActiveTab('objections')}
              >
                <Scale size={14} />
                <span>{langHindi ? '4. धारा 15 आपत्तियां' : '4. Sec 15 Inquiry Bench'}</span>
              </button>
              <button 
                className={`nav-link-btn ${activeTab === 'larrda' ? 'active' : ''}`}
                onClick={() => setActiveTab('larrda')}
              >
                <Scale size={14} color="#f59e0b" />
                <span>{langHindi ? '5. लार्ड्डा न्यायाधिकरण (Sec 64)' : '5. LARRDA Dispute Tribunal'}</span>
              </button>
              <button 
                className={`nav-link-btn ${activeTab === 'rr' ? 'active' : ''}`}
                onClick={() => setActiveTab('rr')}
              >
                <Users size={14} />
                <span>{langHindi ? '6. गैर-मालिक व R&R' : '6. Non-Owner R&R'}</span>
              </button>
              <button 
                className={`nav-link-btn ${activeTab === 'airisk' ? 'active' : ''}`}
                onClick={() => setActiveTab('airisk')}
              >
                <Zap size={14} />
                <span>{t.navAIRisk}</span>
              </button>
              <button 
                className={`nav-link-btn ${activeTab === 'calculator' ? 'active' : ''}`}
                onClick={() => setActiveTab('calculator')}
              >
                <IndianRupee size={14} />
                <span>{langHindi ? '8. मुआवजा मूल्यांकन' : '8. Valuation Sandbox'}</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
