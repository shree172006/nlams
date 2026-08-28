import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, ShieldCheck, FileText, IndianRupee, Layers, 
  TrendingUp, AlertTriangle, CheckCircle, Search, Clock, 
  ArrowRight, Lock, RefreshCw, Check, HelpCircle, Printer, Globe,
  Home, ChevronRight, Scale, Users, PlusCircle, Zap, Sparkles, Calendar,
  Shield, LogIn, LogOut, UserCheck, Smartphone
} from 'lucide-react';

import Navbar from './components/Navbar';
import OfficerDashboard from './components/OfficerDashboard';
import GISParcelMap from './components/GISParcelMap';
import ValuationCalculator from './components/ValuationCalculator';
import LandownerPortal from './components/LandownerPortal';
import DelayRiskWidget from './components/DelayRiskWidget';
import FieldSurveyApp from './components/FieldSurveyApp';
import { 
  FALLBACK_METRICS, 
  FALLBACK_PROJECTS, 
  FALLBACK_OBJECTIONS, 
  FALLBACK_LARRDA, 
  calculateClientStatutoryAward 
} from './fallbackSeedData';

const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://nlams-backend.onrender.com');

// Bilingual translations dictionary
const T = {
  en: {
    govt: "भारत सरकार | Government of India",
    deptHindi: "भूमि संसाधन विभाग | ग्रामीण विकास मंत्रालय",
    mainName: "National Land Acquisition & Management System (NLAMS)",
    subHeading: "Government of India • RFCTLARR Act 2013 & Central Legislations",
    liveSystem: "LIVE SYSTEM",
    govtDept: "Govt of India (DoLR)",
    actBadge: "RFCTLARR Act 2013",
    actSub: "NH Act 1956 (Sec 3G)",
    tickerTitle: "SYSTEM CONTROL CONSOLE",
    gatewayHub: "Home",
    navDashboard: "1. Dashboard",
    navGis: "2. GIS Map",
    navWorkflow: "3. Statutory Workflow",
    navObjections: "4. Sec 15 Objections",
    navLARRDA: "5. LARRDA Tribunal",
    navRR: "6. R&R Tracking",
    navAIRisk: "7. AI Delay-Risk",
    navCalculator: "8. Valuation Sandbox",
    navLandowner: "1. Citizen Landowner Portal",
    heroBadge: "Department of Land Resources",
    heroTitle: "National Land Acquisition & Management System",
    heroDesc: "A unified, statutory enterprise platform digitizing India's public land acquisition lifecycle end-to-end under the RFCTLARR Act, 2013 and sector-specific central legislations (National Highways Act 1956, Railways Act 1989). Eliminates litigation, locks illegal transactions via 14-digit ULPIN (Bhu-Aadhaar), and automates PFMS Direct Benefit Transfer (DBT).",
    statDBT: "PFMS DBT Disbursed Directly",
    statArea: "Notified Corridor Area",
    statParcels: "14-Digit ULPINs Linked",
    statModules: "Integrated Modules",
    modSectionTitle: "Core Functional Modules",
    modSectionDesc: "Select any of the dedicated functional areas below to explore official features.",
    openModule: "Open Module",
    activeProjectLabel: "Active Corridor:",
    activeCorridors: "Active Corridors",
    notifiedLandArea: "Notified Land Area",
    pfmsDbtDisbursed: "PFMS DBT Disbursed",
    activeEncumbranceLocks: "Active Encumbrance Locks",
    avgPossession: "Avg Possession",
    advanceStage: "Advance Stage",
    searchRecords: "Search Records",
    viewAwardSlip: "View & Print Award Slip",
    fileObjection: "File Section 15 Objection",
    scheduleHearing: "Schedule Hearing",
    recordDisposal: "Record Disposal Order",
    execute: "Execute",
    close: "Close",
    cancel: "Cancel",
    submit: "Submit",
    quickSearch: "⚡ Quick Search:",
    searchPrompt: "Search Your Landholding Status",
    searchDesc: "Enter your 14-digit ULPIN (Bhu-Aadhaar), Khasra/Survey number, or owner name to view statutory stage and compensation breakdown.",
    forecastLag: "Forecasted Delivery Delay:",
    bottleneckStage: "Critical Bottleneck Stage:",
    keyRiskDrivers: "Key Delay-Risk Drivers Identified:",
    prescriptiveActions: "Prescriptive AI Interventions & Mitigations:"
  },
  hi: {
    govt: "भारत सरकार | Government of India",
    deptHindi: "भूमि संसाधन विभाग | ग्रामीण विकास मंत्रालय",
    mainName: "राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन प्रणाली (NLAMS)",
    subHeading: "भारत सरकार • भूमि अर्जन अधिनियम 2013",
    liveSystem: "सक्रिय प्रणाली",
    govtDept: "भारत सरकार (DoLR)",
    actBadge: "भूमि अर्जन अधिनियम 2013",
    actSub: "राजमार्ग अधिनियम 1956 (धारा 3G)",
    tickerTitle: "प्रणाली नियंत्रण पटल",
    gatewayHub: "होम (Home)",
    navDashboard: "1. अधिकारी डैशबोर्ड",
    navGis: "2. जीआईएस पार्सल नक्शा",
    navWorkflow: "3. अधिग्रहण वर्कफ़्लो",
    navObjections: "4. धारा 15 आपत्तियां",
    navLARRDA: "5. लार्ड्डा न्यायाधिकरण",
    navRR: "6. पुनर्वास R&R ट्रैकिंग",
    navAIRisk: "7. एआई विलंब-जोखिम",
    navCalculator: "8. मुआवजा सैंडबॉक्स",
    navLandowner: "1. नागरिक भू-स्वामी पोर्टल",
    heroBadge: "भूमि संसाधन विभाग",
    heroTitle: "राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन प्रणाली",
    heroDesc: "भूमि अर्जन एवं पुनर्वास अधिनियम 2013 एवं राष्ट्रीय राजमार्ग अधिनियम 1956 के तहत सार्वजनिक बुनियादी ढांचा परियोजनाओं हेतु भूमि अधिग्रहण की संपूर्ण डिजिटल व पारदर्शी प्रक्रिया। 14-अंकीय भू-आधार (ULPIN) द्वारा अभिलेखों का स्वतः लाकिंग एवं PFMS द्वारा सीधे बैंक खातों में मुआवजा भुगतान।",
    statDBT: "PFMS DBT द्वारा सीधा भुगतान",
    statArea: "अधिसूचित कॉरिडोर क्षेत्र",
    statParcels: "14-अंकीय भू-आधार जुड़े पार्सल",
    statModules: "एकीकृत मुख्य मॉड्यूल",
    modSectionTitle: "मुख्य कार्यात्मक मॉड्यूल",
    modSectionDesc: "लाइव सुविधाओं का अनुभव करने हेतु नीचे दिए गए 8 समर्पित मॉड्यूल में से किसी एक का चयन करें।",
    modSectionDesc: "लाइव सुविधाओं का अनुभव करने हेतु नीचे दिए गए 8 समर्पित मॉड्यूल में से किसी एक का चयन करें।",
    openModule: "मॉड्यूल खोलें",
    activeProjectLabel: "सक्रिय कॉरिडोर:",
    activeCorridors: "सक्रिय कॉरिडोर",
    notifiedLandArea: "अधिसूचित भूमि क्षेत्र",
    pfmsDbtDisbursed: "PFMS DBT वितरित मुआवजा",
    activeEncumbranceLocks: "सक्रिय भू-अभिलेख लॉक",
    avgPossession: "औसत भौतिक कब्जा",
    advanceStage: "चरण आगे बढ़ाएं",
    searchRecords: "अभिलेख खोजें",
    viewAwardSlip: "मुआवजा पर्ची देखें व प्रिंट करें",
    fileObjection: "धारा 15 आपत्ति दर्ज करें",
    scheduleHearing: "सुनवाई निर्धारित करें",
    recordDisposal: "निस्तारण आदेश जारी करें",
    execute: "लागू करें",
    close: "बंद करें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    quickSearch: "⚡ त्वरित खोज:",
    searchPrompt: "अपनी भूमि की स्थिति खोजें",
    searchDesc: "वैधानिक स्थिति और मुआवजा विवरण देखने हेतु अपना 14-अंकीय भू-आधार (ULPIN), खसरा संख्या या भू-स्वामी का नाम दर्ज करें।",
    forecastLag: "अनुमानित परियोजना विलंब:",
    bottleneckStage: "प्रमुख विलंब चरण:",
    keyRiskDrivers: "पहचाने गए मुख्य जोखिम कारक:",
    prescriptiveActions: "एआई द्वारा सुझाई गई निवारक कार्रवाइयां:"
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [metrics, setMetrics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('normal');
  const [langHindi, setLangHindi] = useState(false);

  // Modals & Action states
  const [activeModal, setActiveModal] = useState(null);
  const [gazetteData, setGazetteData] = useState(null);
  const [dbtBatchData, setDbtBatchData] = useState(null);
  const [mutationData, setMutationData] = useState(null);
  const [awardSlipParcel, setAwardSlipParcel] = useState(null);
  const [selectedMapParcel, setSelectedMapParcel] = useState(null);
  const [citizenQuery, setCitizenQuery] = useState('');
  const [citizenResults, setCitizenResults] = useState([]);
  const [notificationToast, setNotificationToast] = useState(null);
  const [mapLayer, setMapLayer] = useState('osm');

  // Objection state
  const [allObjections, setAllObjections] = useState([]);
  const [objectionFilter, setObjectionFilter] = useState('ALL');
  const [activeObjectionToSchedule, setActiveObjectionToSchedule] = useState(null);
  const [activeObjectionToDispose, setActiveObjectionToDispose] = useState(null);
  const [hearingScheduleDate, setHearingScheduleDate] = useState('2026-03-15');
  const [disposalForm, setDisposalForm] = useState({
    status: 'PETITION_UPHELD',
    reason: ''
  });
  const [newObjectionForm, setNewObjectionForm] = useState({
    project_id: '',
    claimant_name: '',
    contact_phone: '',
    ulpin: '',
    grounds_category: 'Inadequate Valuation',
    objection_details: ''
  });

  // AI Delay-Risk state
  const [projectRisk, setProjectRisk] = useState(null);
  const [allDelayRisks, setAllDelayRisks] = useState([]);

  // R&R Tracking state
  const [rrSummary, setRrSummary] = useState(null);

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

  // Officer Authentication & RBAC
  const [currentUser, setCurrentUser] = useState({
    role: 'CITIZEN',
    name: 'Public Citizen / Landowner',
    designation: 'Open Public Access'
  });
  const isOfficer = currentUser && currentUser.role !== 'CITIZEN';
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [officersList, setOfficersList] = useState([]);
  const [loginEmailInput, setLoginEmailInput] = useState('');

  // LARRDA Dispute Reference State (Section 64)
  const [larrdaReferences, setLarrdaReferences] = useState([]);
  const [newLarrdaForm, setNewLarrdaForm] = useState({
    project_id: '',
    ulpin: '',
    claimant_name: '',
    ground_type: 'VALUATION'
  });

  // Joint Khata Splitting State
  const [activeSplitKhataParcel, setActiveSplitKhataParcel] = useState(null);
  const [splitHeirsList, setSplitHeirsList] = useState([]);

  const t = langHindi ? T.hi : T.en;

  // URL Routing, History & Page Title Synchronization
  useEffect(() => {
    const tabTitles = {
      home: "NLAMS | National Land Acquisition & Management System",
      citizen: "Citizen Landowner Portal | NLAMS",
      gis: "Map-to-Money GIS | NLAMS",
      calculator: "Compensation Calculator | NLAMS",
      dashboard: "Officer Dashboard | NLAMS",
      workbench: "Statutory Workflow | NLAMS",
      objections: "Section 15 Objections | NLAMS",
      larrda: "LARRDA Dispute Tribunal | NLAMS",
      rr: "R&R Tracking | NLAMS",
      airisk: "AI Delay-Risk Forecaster | NLAMS",
      survey: "On-Ground Field Survey & Offline Sync | NLAMS"
    };
    document.title = tabTitles[activeTab] || "NLAMS | National Land Acquisition & Management System";

    const path = activeTab === 'home' ? '/home' : `/${activeTab}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ tab: activeTab }, '', path);
    }
  }, [activeTab]);

  useEffect(() => {
    const handlePopState = () => {
      const current = getInitialTabFromUrl();
      setActiveTab(current);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Font size scaler effect
  useEffect(() => {
    document.documentElement.className = `font-scale-${fontSize}`;
  }, [fontSize]);

  // Fetch officers list for quick demo login
  useEffect(() => {
    fetch(`${API_BASE}/api/auth/officers`)
      .then(r => r.json())
      .then(data => setOfficersList(data))
      .catch(() => {});
  }, []);

  const DEMO_OFFICERS = {
    COLLECTOR: {
      id: "usr_coll_01",
      name: "Shri S. Rajalingam, IAS",
      email: "collector.varanasi@up.gov.in",
      role: "COLLECTOR",
      designation: "District Magistrate & Collector, Varanasi",
      district: "Varanasi",
      agency: "Revenue Administration"
    },
    CALA: {
      id: "usr_cala_01",
      name: "Dr. Alok Verma, PCS",
      email: "cala.nh19@up.gov.in",
      role: "CALA",
      designation: "Competent Authority Land Acquisition (CALA) / ADM (LA)",
      district: "Varanasi",
      agency: "CALA Revenue Bench"
    },
    SURVEYOR: {
      id: "usr_surv_01",
      name: "Shri S. K. Sharma",
      email: "sk.sharma.survey@gov.in",
      role: "SURVEYOR",
      designation: "Assistant Director / Field Surveyor",
      district: "Varanasi",
      agency: "Directorate of Land Records & Survey"
    },
    AGENCY: {
      id: "usr_nhai_01",
      name: "Er. Ramesh Chandra",
      email: "ramesh.chandra@nhai.org",
      role: "AGENCY",
      designation: "Project Director & GM (Tech), NHAI PIU Varanasi",
      district: "Varanasi",
      agency: "National Highways Authority of India (NHAI)"
    }
  };

  const handleOfficerLogin = async (roleOrEmail) => {
    try {
      const isEmail = typeof roleOrEmail === 'string' && roleOrEmail.includes('@');
      const payload = isEmail ? { email: roleOrEmail } : { role: roleOrEmail };
      
      let loggedUser = null;
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.user) {
          loggedUser = data.user;
        }
      } catch (err) {
        console.warn("Backend auth call failed, using client fallback:", err);
      }

      if (!loggedUser) {
        loggedUser = DEMO_OFFICERS[roleOrEmail] || DEMO_OFFICERS.COLLECTOR;
      }

      setCurrentUser(loggedUser);
      setShowLoginModal(false);
      if (loggedUser.role === 'SURVEYOR') {
        setActiveTab('survey');
        showToast(`Logged in as Field Surveyor: ${loggedUser.name} • Dedicated On-Ground Survey Workspace Enabled`, 'success');
      } else {
        setActiveTab('dashboard');
        showToast(`Authenticated as ${loggedUser.name} (${loggedUser.role}) • Officer Workspace Enabled`, 'success');
      }
    } catch (e) {
      console.error(e);
      showToast("Officer login error.", 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser({
      role: 'CITIZEN',
      name: 'Public Citizen / Landowner',
      designation: 'Open Public Access'
    });
    setActiveTab('home');
    showToast("Switched to Free Citizen Public Mode", 'info');
  };

  const requireOfficerRole = (requiredRoles = ['COLLECTOR', 'CALA', 'AGENCY', 'SURVEYOR']) => {
    if (!currentUser || currentUser.role === 'CITIZEN') {
      setShowLoginModal(true);
      showToast("Officer Authorization Required: Please login with an officer profile.", 'error');
      return false;
    }
    if (!requiredRoles.includes(currentUser.role)) {
      showToast(`Access Restricted: This action requires role: ${requiredRoles.join(' or ')}.`, 'error');
      return false;
    }
    return true;
  };

  const handleSelectTab = (tabId) => {
    const officerExclusiveTabs = ['dashboard', 'workbench', 'objections', 'larrda', 'airisk'];
    if (officerExclusiveTabs.includes(tabId) && (!currentUser || currentUser.role === 'CITIZEN')) {
      setShowLoginModal(true);
      showToast("Officer Login Required: Please authenticate to access official administrative modules.", 'error');
      return;
    }
    setActiveTab(tabId);
  };

  // Fetch initial data with resilient fallback
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resMetrics, resProjects, resRisks, resObjs, resLarrda] = await Promise.all([
        fetch(`${API_BASE}/api/national-metrics`).then(r => r.ok ? r.json() : FALLBACK_METRICS).catch(() => FALLBACK_METRICS),
        fetch(`${API_BASE}/api/projects`).then(r => r.ok ? r.json() : FALLBACK_PROJECTS).catch(() => FALLBACK_PROJECTS),
        fetch(`${API_BASE}/api/delay-risks`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${API_BASE}/api/objections`).then(r => r.ok ? r.json() : FALLBACK_OBJECTIONS).catch(() => FALLBACK_OBJECTIONS),
        fetch(`${API_BASE}/api/larrda-references`).then(r => r.ok ? r.json() : FALLBACK_LARRDA).catch(() => FALLBACK_LARRDA)
      ]);
      const validMetrics = resMetrics || FALLBACK_METRICS;
      const validProjects = (Array.isArray(resProjects) && resProjects.length > 0) ? resProjects : FALLBACK_PROJECTS;
      const validObjections = (Array.isArray(resObjs) && resObjs.length > 0) ? resObjs : FALLBACK_OBJECTIONS;
      const validLarrda = (Array.isArray(resLarrda) && resLarrda.length > 0) ? resLarrda : FALLBACK_LARRDA;

      setMetrics(validMetrics);
      setProjects(validProjects);
      setAllDelayRisks(resRisks || []);
      setAllObjections(validObjections);
      setLarrdaReferences(validLarrda);

      if (validProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(validProjects[0].id);
        setSelectedProject(validProjects[0]);
      }
    } catch (err) {
      console.warn("Backend connection fallback enabled:", err);
      setMetrics(FALLBACK_METRICS);
      setProjects(FALLBACK_PROJECTS);
      setAllObjections(FALLBACK_OBJECTIONS);
      setLarrdaReferences(FALLBACK_LARRDA);
      setSelectedProjectId(FALLBACK_PROJECTS[0].id);
      setSelectedProject(FALLBACK_PROJECTS[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const p = projects.find(item => item.id === selectedProjectId) || projects[0];
      setSelectedProject(p);
      fetchProjectRisk(p.id);
      fetchProjectRR(p.id);
    }
  }, [selectedProjectId, projects]);

  const fetchProjectRisk = async (prjId) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/${prjId}/delay-risk`);
      if (res.ok) {
        const data = await res.json();
        setProjectRisk(data);
      }
    } catch (e) {
      console.warn("Risk prediction using corridor telemetry");
    }
  };

  const fetchProjectRR = async (prjId) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/${prjId}/rr-tracking`);
      if (res.ok) {
        const data = await res.json();
        setRrSummary(data);
      }
    } catch (e) {
      console.warn("R&R tracking ledger loaded");
    }
  };

  // Recalculate sandbox calculator instantly client-side with backend validation
  const runCalculator = async () => {
    try {
      const clientCalc = calculateClientStatutoryAward(calcInputs);
      setCalcResult(clientCalc);

      const params = new URLSearchParams(calcInputs);
      const res = await fetch(`${API_BASE}/api/calculate-single-valuation?${params.toString()}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setCalcResult(data);
      }
    } catch (err) {
      // Client-side math is already set above
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

  // Actions with RBAC
  const handleAdvanceStage = async () => {
    if (!requireOfficerRole(['COLLECTOR', 'CALA', 'AGENCY'])) return;
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
    if (!requireOfficerRole(['COLLECTOR', 'CALA'])) return;
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
    if (!requireOfficerRole(['COLLECTOR', 'CALA'])) return;
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

  const handleCitizenSearch = async (e, queryOverride) => {
    if (e) e.preventDefault();
    const query = queryOverride !== undefined ? queryOverride : citizenQuery;
    if (!query) return;

    // First, search locally for immediate results
    const lowerQ = query.trim().toLowerCase();
    const localMatches = [];
    const sourceProjects = (projects && projects.length > 0) ? projects : FALLBACK_PROJECTS;
    
    sourceProjects.forEach(p => {
      if (p.parcels) {
        p.parcels.forEach(parcel => {
          if (
            parcel.ulpin?.toLowerCase().includes(lowerQ) ||
            parcel.local_record_no?.toLowerCase().includes(lowerQ) ||
            parcel.owner_name?.toLowerCase().includes(lowerQ) ||
            parcel.village?.toLowerCase().includes(lowerQ)
          ) {
            localMatches.push({
              project_id: p.id,
              project_title: p.title,
              current_stage: p.current_stage,
              sec11_gazette_id: "GAZ-2025-UP-NH19-011A",
              encumbrance_status: parcel.encumbrance_locked ? "🔒 Encumbrance Locked (Sec 11)" : "✓ Free / Mutated",
              parcel: parcel,
              valuation_estimate: calculateClientStatutoryAward(parcel)
            });
          }
        });
      }
    });

    if (localMatches.length > 0) {
      setCitizenResults(localMatches);
    }

    // Also query backend if available to get synced state
    try {
      const res = await fetch(`${API_BASE}/api/citizen-lookup?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCitizenResults(data);
        } else if (localMatches.length === 0) {
          showToast(langHindi ? "खोजे गए विवरण से कोई रिकॉर्ड नहीं मिला।" : "No records found matching query.", 'error');
        }
      } else if (localMatches.length === 0) {
        showToast(langHindi ? "खोजे गए विवरण से कोई रिकॉर्ड नहीं मिला।" : "No records found matching query.", 'error');
      }
    } catch (err) {
      if (localMatches.length === 0) {
        showToast(langHindi ? "खोजे गए विवरण से कोई रिकॉर्ड नहीं मिला।" : "No records found matching query.", 'error');
      }
    }
  };

  const handleScheduleHearing = async () => {
    if (!requireOfficerRole(['CALA', 'COLLECTOR'])) return;
    if (!activeObjectionToSchedule) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/projects/${activeObjectionToSchedule.project_id}/objections/${activeObjectionToSchedule.objection.id}/schedule-hearing?hearing_date=${encodeURIComponent(hearingScheduleDate)}`,
        { method: 'POST' }
      );
      if (res.ok) {
        showToast("Quasi-judicial hearing scheduled successfully!", 'success');
        setActiveObjectionToSchedule(null);
        fetchData();
      }
    } catch (err) {
      showToast("Failed to schedule hearing.", 'error');
    }
  };

  const handleDisposeObjection = async () => {
    if (!requireOfficerRole(['CALA', 'COLLECTOR'])) return;
    if (!activeObjectionToDispose || !disposalForm.reason) {
      showToast("Please provide a reasoned order summary.", 'error');
      return;
    }
    try {
      const params = new URLSearchParams({
        status: disposalForm.status,
        reasoned_order_summary: disposalForm.reason
      });
      const res = await fetch(
        `${API_BASE}/api/projects/${activeObjectionToDispose.project_id}/objections/${activeObjectionToDispose.objection.id}/dispose?${params.toString()}`,
        { method: 'POST' }
      );
      if (res.ok) {
        showToast(`Objection recorded as ${disposalForm.status} with reasoned order.`, 'success');
        setActiveObjectionToDispose(null);
        setDisposalForm({ status: 'UPHELD', reason: '' });
        fetchData();
      }
    } catch (err) {
      showToast("Failed to record disposal order.", 'error');
    }
  };

  const handleFileLarrdaReference = async (e) => {
    e.preventDefault();
    if (!newLarrdaForm.project_id || !newLarrdaForm.ulpin || !newLarrdaForm.claimant_name) {
      showToast("Please fill all required LARRDA reference fields.", 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/larrda-references`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLarrdaForm)
      });
      if (res.ok) {
        showToast("Section 64 Reference submitted to State LARRDA Tribunal.", 'success');
        setActiveModal(null);
        fetchLarrdaData();
      }
    } catch (e) {
      showToast("Failed to file LARRDA reference.", 'error');
    }
  };

  const fetchLarrdaData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/larrda-references`);
      if (res.ok) {
        const data = await res.json();
        setLarrdaReferences(data);
      }
    } catch (e) {}
  };

  const handleSaveJointKhataSplit = async (ulpin, heirs) => {
    try {
      const res = await fetch(`${API_BASE}/api/parcels/${ulpin}/split-khata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heirs })
      });
      if (res.ok) {
        showToast(`Joint Khata partitioned successfully across ${heirs.length} co-heirs!`, 'success');
        setActiveSplitKhataParcel(null);
        fetchData();
      }
    } catch (e) {
      showToast("Failed to split Joint Khata.", 'error');
    }
  };

  const handleFileNewObjection = async (e) => {
    e.preventDefault();
    if (!newObjectionForm.claimant_name || !newObjectionForm.ulpin) {
      showToast("Please enter Claimant Name and 14-Digit ULPIN.", 'error');
      return;
    }
    if (newObjectionForm.grounds_category === 'Other' && !newObjectionForm.objection_details) {
      showToast("Please provide a detailed description for 'Other' grounds.", 'error');
      return;
    }
    const prjId = newObjectionForm.project_id || selectedProject?.id || 'PRJ-NHAI-2026-UP01';
    try {
      const params = new URLSearchParams({
        ...newObjectionForm,
        objection_details: newObjectionForm.objection_details || newObjectionForm.grounds_category
      });
      const res = await fetch(
        `${API_BASE}/api/projects/${prjId}/objections?${params.toString()}`,
        { method: 'POST' }
      );
      if (res.ok) {
        showToast("Section 15 Objection filed into statutory register.", 'success');
        setActiveModal(null);
        setNewObjectionForm({
          project_id: '',
          claimant_name: '',
          contact_phone: '',
          ulpin: '',
          grounds_category: 'Inadequate Valuation',
          objection_details: ''
        });
        fetchData();
      } else {
        showToast("Failed to file objection. Please check fields.", 'error');
      }
    } catch (err) {
      showToast("Failed to file objection.", 'error');
    }
  };

  const handleSettleRRFamily = async (famId) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/projects/${selectedProject.id}/rr-tracking/settle-family?family_id=${famId}&entitlements_settled=11&additional_amenity=Community%20Centre%20Allotment`,
        { method: 'POST' }
      );
      if (res.ok) {
        showToast("R&R 2nd Schedule entitlement package fully settled!", 'success');
        fetchProjectRR(selectedProject.id);
      }
    } catch (err) {
      showToast("Failed to settle R&R package.", 'error');
    }
  };

  const handleTriggerAIMitigation = (actionText) => {
    showToast(`AI Prescriptive Action Initiated: ${actionText}`, 'success');
    if (projectRisk) {
      setProjectRisk({
        ...projectRisk,
        risk_score: Math.max(10, Math.round(projectRisk.risk_score * 0.7)),
        predicted_delay_months: Math.max(0.5, Math.round((projectRisk.predicted_delay_months * 0.65) * 10) / 10)
      });
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

  // 4 Citizen Public Portals Definition
  const CITIZEN_MODULES = [
    {
      id: 'citizen',
      icon: <Search size={20} color="#2563eb" />,
      iconBg: '#eff6ff',
      title: langHindi ? '1. भू-स्वामी नागरिक सेवा' : '1. Citizen Land Portal (Free)',
      statutory: 'Citizen Bhu-Aadhaar Self-Service',
      desc: langHindi
        ? '14-अंकीय भू-आधार, खसरा या नाम से सार्वजनिक खोज, डिजिटल मुआवजा पर्ची व ऑनलाइन आपत्ति दर्ज करना।'
        : 'Public lookup by ULPIN / Khasra / Name to view statutory stage, download award estimate slip, and file grievances.',
      users: langHindi ? 'भू-स्वामी एवं प्रभावित परिवार' : 'Farmers & Affected Families',
      tag: 'Citizen Access',
      badgeColor: 'badge-blue'
    },
    {
      id: 'gis',
      icon: <Layers size={20} color="#059669" />,
      iconBg: '#ecfdf5',
      title: langHindi ? '2. मैप-टू-मनी जीआईएस' : '2. Map-to-Money GIS',
      statutory: 'ULPIN Bhu-Aadhaar • Cadastral Polygons',
      desc: langHindi
        ? 'गांवों के भू-नक्शा पार्सल के ऊपर राइट-ऑफ-वे (RoW) संरेखण का इंटरैक्टिव लेयर व यूएलपीआईएन परीक्षण।'
        : 'Interactive vector map overlaying Right-of-Way alignments against village cadastral parcels with instant ULPIN inspector.',
      users: langHindi ? 'नागरिक एवं किसान' : 'Public & Landowners',
      tag: 'Spatial Fusion',
      badgeColor: 'badge-green'
    },
    {
      id: 'calculator',
      icon: <IndianRupee size={20} color="#0b1e36" />,
      iconBg: '#f1f5f9',
      title: langHindi ? '3. मुआवजा कैलकुलेटर' : '3. Compensation Calculator',
      statutory: 'RFCTLARR Sec 26-30 • NH Act 3G',
      desc: langHindi
        ? 'बाजार दर × ग्रामीण गुणक + परिसंपत्ति + 100% सोलेशियम + 12% प्रति वर्ष अतिरिक्त राशि का पारदर्शी गणित।'
        : 'Automated statutory math: Market Value × Rural Multiplier + Assets + 100% Solatium + 12% Additional Amount.',
      users: langHindi ? 'किसान व भू-स्वामी' : 'Landowners & Beneficiaries',
      tag: 'Audited Formula',
      badgeColor: 'badge-navy'
    },
    {
      id: 'rr',
      icon: <Users size={20} color="#059669" />,
      iconBg: '#ecfdf5',
      title: langHindi ? '4. पुनर्वास एवं R&R गाइड' : '4. R&R Entitlements Guide',
      statutory: 'Second Schedule Mandatory Packages',
      desc: langHindi
        ? 'विस्थापित परिवारों के अधिकार, 11 अनिवार्य वित्तीय पैकेज एवं पुनर्वास कॉलोनी में नागरिक सुविधाओं की जानकारी।'
        : 'Second Schedule entitlements guide explaining housing grants, subsistence allowances, and resettlement benefits.',
      users: langHindi ? 'प्रभावित परिवार व नागरिक' : 'Affected Families & Public',
      tag: 'Social Welfare',
      badgeColor: 'badge-green'
    }
  ];

  // 9 Officer Administrative Modules Definition
  const OFFICER_MODULES = [
    {
      id: 'dashboard',
      icon: <TrendingUp size={20} color="#0284c7" />,
      iconBg: '#e0f2fe',
      title: langHindi ? '1. अधिकारी डैशबोर्ड' : '1. Executive Dashboard',
      statutory: 'Executive Command Console',
      desc: langHindi 
        ? 'अधिसूचित क्षेत्र, भौतिक कब्जा, PFMS DBT भुगतान एवं उच्च जोखिम वाली परियोजनाओं की निगरानी।'
        : 'Pan-India corridor tracker monitoring acreage, possession %, DBT disbursals, and bottleneck flags.',
      users: langHindi ? 'जिला कलेक्टर व मंत्रालय' : 'District Collectors & Line Ministries',
      tag: 'Executive View',
      badgeColor: 'badge-blue'
    },
    {
      id: 'gis',
      icon: <Layers size={20} color="#059669" />,
      iconBg: '#ecfdf5',
      title: langHindi ? '2. जीआईएस नक्शा' : '2. GIS Parcel Map',
      statutory: 'ULPIN Bhu-Aadhaar • Cadastral Polygons',
      desc: langHindi
        ? 'गांवों के भू-नक्शा पार्सल के ऊपर राइट-ऑफ-वे (RoW) संरेखण का इंटरैक्टिव लेयर व यूएलपीआईएन परीक्षण।'
        : 'Interactive vector map overlaying Right-of-Way alignments against village cadastral parcels with instant ULPIN inspector.',
      users: langHindi ? 'जीआईएस एवं योजनाकार' : 'GIS Engineers & Planners',
      tag: 'Spatial Fusion',
      badgeColor: 'badge-green'
    },
    {
      id: 'workbench',
      icon: <Building2 size={20} color="#ea580c" />,
      iconBg: '#ffedd5',
      title: langHindi ? '3. अधिग्रहण चरण' : '3. Statutory Workflow',
      statutory: 'RFCTLARR Act 2013 • NH Act 1956',
      desc: langHindi
        ? '9-चरणीय वैधानिक वर्कफ़्लो, ई-राजपत्र निर्माण, PFMS DBT बैच एवं राज्य भूमि अभिलेखों में स्वतः दाखिल-खारिज।'
        : 'Deterministic 9-stage statutory workflow enforcing legal gates, e-Gazette generation, DBT payout, and registry auto-mutation.',
      users: langHindi ? 'सक्षम प्राधिकारी (CALA)' : 'CALAs & Land Acquisition Officers',
      tag: 'Core Lifecycle',
      badgeColor: 'badge-saffron'
    },
    {
      id: 'objections',
      icon: <Scale size={20} color="#7c3aed" />,
      iconBg: '#f3e8ff',
      title: langHindi ? '4. धारा 15 आपत्तियां' : '4. Sec 15 Objections',
      statutory: 'RFCTLARR Sec 15 • NH Act Sec 3C',
      desc: langHindi
        ? 'धारा 15 के तहत आपत्तियों का पंजीकरण, अर्ध-न्यायिक सुनवाई का निर्धारण एवं कारणयुक्त निस्तारण आदेश।'
        : 'Section 15 objection tribunal to track grievances, schedule quasi-judicial hearings, and issue reasoned disposal orders.',
      users: langHindi ? 'सक्षम प्राधिकारी व दावेदार' : 'CALA Benches & Claimants',
      tag: 'Dispute Resolution',
      badgeColor: 'badge-purple'
    },
    {
      id: 'larrda',
      icon: <Scale size={20} color="#f59e0b" />,
      iconBg: '#fef3c7',
      title: langHindi ? '5. लार्ड्डा न्यायाधिकरण' : '5. LARRDA Tribunal (Sec 64)',
      statutory: 'RFCTLARR Section 64 Tribunal',
      desc: langHindi
        ? 'भूमि अधिग्रहण, पुनर्वास एवं पुनर्व्यवस्था प्राधिकरण में लंबित वादों व 90-दिवसीय कलेक्टर प्रेषण की निगरानी।'
        : 'Quasi-judicial authority established under Section 64 tracking tribunal referrals, awards, and High Court appeals.',
      users: langHindi ? 'न्यायाधिकरण व कलेक्टर' : 'Tribunal Judges & Collectors',
      tag: 'Judicial Authority',
      badgeColor: 'badge-gold'
    },
    {
      id: 'rr',
      icon: <Users size={20} color="#059669" />,
      iconBg: '#ecfdf5',
      title: langHindi ? '6. पुनर्वास R&R' : '6. Non-Owner R&R',
      statutory: 'Second Schedule Mandatory Packages',
      desc: langHindi
        ? 'विस्थापित परिवारों की ट्रैकिंग, 11 अनिवार्य वित्तीय पैकेज एवं पुनर्वास कॉलोनी में नागरिक सुविधाओं का आवंटन।'
        : 'Resettlement & Rehabilitation tracker monitoring displaced families, monetary grants, and civic amenities allocation.',
      users: langHindi ? 'पुनर्वास अधिकारी व पंचायत' : 'District R&R Officers & Panchayats',
      tag: 'Social Welfare',
      badgeColor: 'badge-green'
    },
    {
      id: 'airisk',
      icon: <Zap size={20} color="#dc2626" />,
      iconBg: '#fef2f2',
      title: langHindi ? '7. एआई जोखिम' : '7. AI Delay-Risk',
      statutory: 'Statutory Bottleneck & Lapse Forecaster',
      desc: langHindi
        ? 'चरणबद्ध समय, लंबित विवादों व R&R अंतर के आधार पर महीनों के विलंब की सटीक एआई भविष्यवाणी व समाधान।'
        : 'AI forecasting engine analyzing stage dwell time, dispute ratios, and R&R gaps to predict months of delay with prescriptive fixes.',
      users: langHindi ? 'परियोजना निदेशक व अनुश्रवण कक्ष' : 'Project Directors & Monitoring Cells',
      tag: 'AI Intelligence',
      badgeColor: 'badge-critical'
    },
    {
      id: 'calculator',
      icon: <IndianRupee size={20} color="#0b1e36" />,
      iconBg: '#f1f5f9',
      title: langHindi ? '8. मुआवजा मूल्यांकन' : '8. Valuation Sandbox',
      statutory: 'RFCTLARR Sec 26-30 • NH Act 3G',
      desc: langHindi
        ? 'बाजार दर × ग्रामीण गुणक + परिसंपत्ति + 100% सोलेशियम + 12% प्रति वर्ष अतिरिक्त राशि का पारदर्शी गणित।'
        : 'Automated statutory math: Market Value × Rural Multiplier + Assets + 100% Solatium + 12% Additional Amount.',
      users: langHindi ? 'मूल्यांकन अधिकारी व सक्षम प्राधिकारी' : 'Valuation Officers & CALA',
      tag: 'Audited Formula',
      badgeColor: 'badge-navy'
    },
    {
      id: 'survey',
      icon: <Smartphone size={20} color="#ea580c" />,
      iconBg: '#fff7ed',
      title: langHindi ? '9. फील्ड सर्वे एवं सिंक' : '9. Field Survey & Sync',
      statutory: 'Offline-First On-Ground Survey & Census',
      desc: langHindi
        ? 'दूरदराज के इलाकों में बिना इंटरनेट के भी परिसंपत्ति, पेड़, फसल गणना व भू-टैग फोटो दर्ज करें; इंटरनेट मिलते ही स्वतः सिंक।'
        : 'Offline-first PWA survey tool to record structures, trees, crops, borewells, and PAF claims with automatic database sync upon reconnection.',
      users: langHindi ? 'राजस्व निरीक्षक एवं फील्ड सर्वेक्षक' : 'Revenue Inspectors & Field Surveyors',
      tag: 'Offline Sync PWA',
      badgeColor: 'badge-saffron'
    }
  ];

  const filteredObjections = allObjections.filter(item => {
    if (objectionFilter === 'ALL') return true;
    if (objectionFilter === 'PETITION_UPHELD') {
      return item.objection.status === 'PETITION_UPHELD' || item.objection.status === 'UPHELD' || item.objection.status === 'DISPOSED_UPHELD';
    }
    if (objectionFilter === 'PETITION_REJECTED') {
      return item.objection.status === 'PETITION_REJECTED' || item.objection.status === 'REJECTED' || item.objection.status === 'DISMISSED' || item.objection.status === 'DISPOSED_REJECTED';
    }
    return item.objection.status === objectionFilter;
  });

  return (
    <div>
      {/* 1. Global Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        fontSize={fontSize}
        setFontSize={setFontSize}
        langHindi={langHindi}
        setLangHindi={setLangHindi}
        t={t}
        selectedProject={selectedProject}
        metrics={metrics}
        currentUser={currentUser}
        setShowLoginModal={setShowLoginModal}
        handleLogout={handleLogout}
        setActiveModal={setActiveModal}
        apiBase={API_BASE}
      />

      {/* Toast Notification */}
      {notificationToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: notificationToast.type === 'error' ? '#991b1b' : '#064e3b',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.82rem',
          fontWeight: 700,
          border: '1px solid rgba(255,255,255,0.25)',
          animation: 'slideUp 0.25s ease'
        }}>
          {notificationToast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span>{notificationToast.msg}</span>
        </div>
      )}

      {/* 2. Main App Body */}
      <main className="nlams-app-body">

        {/* ================= VIEW 0: HOME GATEWAY ================= */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Card */}
            <div className="home-hero-card">
              <div className="hero-pill-tag">
                <span>{t.heroBadge}</span>
              </div>
              <h1 className="hero-heading">
                {t.heroTitle}
              </h1>
              <p className="hero-paragraph">
                {t.heroDesc}
              </p>

              <div className="hero-stats-deck">
                <div className="stat-cell">
                  <span className="stat-cell-num">₹ {metrics?.total_compensation_disbursed_cr || '127.9'} Cr</span>
                  <span className="stat-cell-label">{t.statDBT}</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-cell-num">{metrics?.total_notified_area_ha || '393.9'} Ha</span>
                  <span className="stat-cell-label">{t.statArea}</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-cell-num">{metrics?.total_cadastral_parcels_tracked || '34'}</span>
                  <span className="stat-cell-label">{t.statParcels}</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-cell-num">8 Modules</span>
                  <span className="stat-cell-label">{t.statModules}</span>
                </div>
              </div>
            </div>

            {/* Modules Grid Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#071426', margin: 0 }}>
                  {!isOfficer 
                    ? (langHindi ? 'नागरिक एवं भू-स्वामी सार्वजनिक सेवाएं' : 'Citizen Public Services & Landowner Portals')
                    : (langHindi ? 'अधिकारी प्रशासनिक एवं वैधानिक मॉड्यूल' : 'Officer Administrative & Statutory Modules')}
                </h2>
                <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 4 }}>
                  {!isOfficer
                    ? (langHindi ? 'सार्वजनिक भू-अभिलेख, जीआईएस पार्सल नक्शा, मुआवजा कैलकुलेटर व पुनर्वास मार्गदर्शिका।' : 'Public access to digital land records, GIS parcel viewer, compensation calculator, and R&R guides.')
                    : (langHindi ? 'अधिसूचना गेटकीपर, धारा 15 आपत्तियां, लार्ड्डा न्यायाधिकरण व एआई जोखिम विश्लेषण।' : 'Statutory lifecycle workflow, Section 15 inquiries, LARRDA tribunal dockets, and AI delay forecasting.')}
                </p>
              </div>
              <span className={`badge-pill ${!isOfficer ? 'badge-blue' : 'badge-gold'}`} style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {!isOfficer ? 'Public Citizen Access' : `Authenticated: ${currentUser?.role || 'OFFICER'}`}
              </span>
            </div>

            {/* Modules Grid */}
            <div className="home-portals-grid">
              {(isOfficer ? OFFICER_MODULES : CITIZEN_MODULES).map((mod) => (
                <div 
                  key={mod.id} 
                  className="portal-tile-card"
                  onClick={() => handleSelectTab(mod.id)}
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
                      style={{ padding: '5px 12px', fontSize: '0.72rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTab(mod.id);
                      }}
                    >
                      <span>{t.openModule}</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= MODULE 1: OFFICER DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <OfficerDashboard 
            metrics={metrics}
            projects={projects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            selectedProject={selectedProject}
            projectRisk={projectRisk}
            setActiveTab={setActiveTab}
            t={t}
            langHindi={langHindi}
            currentUser={currentUser}
          />
        )}

        {/* ================= MODULE 2: GIS PARCEL MAP ================= */}
        {activeTab === 'gis' && (
          <GISParcelMap 
            selectedProject={selectedProject}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            projects={projects}
            selectedMapParcel={selectedMapParcel}
            setSelectedMapParcel={setSelectedMapParcel}
            mapLayer={mapLayer}
            setMapLayer={setMapLayer}
            setAwardSlipParcel={setAwardSlipParcel}
            setActiveModal={setActiveModal}
            t={t}
            langHindi={langHindi}
          />
        )}

        {/* ================= MODULE 3: ACQUISITION WORKFLOW ================= */}
        {activeTab === 'workbench' && selectedProject && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.navWorkflow}</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {langHindi ? 'वैधानिक चरणबद्ध गेटकीपर प्रक्रिया (RFCTLARR 2013 एवं NH Act 1956)' : 'Enforcing deterministic gatekeeper progression under RFCTLARR Act 2013 & NH Act 1956'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <select 
                  style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)', fontSize: '0.78rem', fontWeight: 600 }}
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>

                <button className="btn-action btn-saffron" onClick={handleAdvanceStage}>
                  <CheckCircle size={13} />
                  <span>{t.advanceStage}</span>
                </button>
              </div>
            </div>

            {/* Project Summary Header */}
            <div className="section-panel-card" style={{ borderTop: '4px solid var(--nlams-navy-900)' }}>
              <div className="panel-card-head" style={{ background: '#f8fafc' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge-pill badge-navy">Ref: {selectedProject.id}</span>
                    <span className="badge-pill badge-saffron">{selectedProject.statutory_act}</span>
                    <span className="badge-pill badge-green">{langHindi ? 'राज्य:' : 'State:'} {selectedProject.state}</span>
                  </div>
                  <h2 style={{ fontSize: '1.15rem', color: '#071426', margin: '3px 0' }}>{selectedProject.title}</h2>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {langHindi ? 'अधिग्रहण एजेंसी:' : 'Agency:'} <strong>{selectedProject.acquiring_agency}</strong> • {langHindi ? 'कॉरिडोर क्षेत्र:' : 'Corridor:'} <strong>{selectedProject.total_corridor_area_ha} Ha ({selectedProject.total_length_km || 0} km)</strong> • {langHindi ? 'पार्सल संख्या:' : 'Parcels:'} <strong>{selectedProject.parcels.length}</strong>
                  </div>
                </div>
              </div>

              {/* 9-Stage Stepper */}
              <div className="panel-card-body">
                <div className="stage-gate-stepper-box">
                  {STAGES_LIST.map((stageName, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isActive = idx === currentStageIndex;
                    const stageDisplayHindi = [
                      '1. प्रस्ताव व SIA',
                      '2. प्रारंभिक धारा 11',
                      '3. सुनवाई धारा 15',
                      '4. घोषणा धारा 19',
                      '5. दावा धारा 21',
                      '6. पंचाट धारा 23',
                      '7. कब्जा धारा 38',
                      '8. R&R द्वितीय अनुसूची',
                      '9. दाखिल खारिज'
                    ];
                    return (
                      <div key={stageName} className={`stepper-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                        <div className="node-circle">
                          {isCompleted ? <Check size={13} /> : (idx + 1)}
                        </div>
                        <div className="node-name-text">
                          {langHindi ? stageDisplayHindi[idx] : `${stageName.split(' ')[1]} ${stageName.split(' ')[2] || ''}`}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stage Action Triggers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  <div style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 16, background: '#f8fafc', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#071426' }}>{langHindi ? 'प्रारूप 11A: ई-राजपत्र अनुसूची' : 'Form 11A: e-Gazette Schedule'}</strong>
                      <span className="badge-pill badge-blue">Section 11(1) / 3A</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 12 }}>
                      {langHindi ? 'Class-3 DSC डिजिटल हस्ताक्षर युक्त द्विभाषी (हिन्दी व अंग्रेजी) राजपत्र अनुसूची स्वतः तैयार करता है।' : 'Generates standardized bilingual schedule in Hindi & English stamped with Class-3 DSC digital certificate.'}
                    </p>
                    <button className="btn-action btn-outline" style={{ width: '100%', fontSize: '0.72rem' }} onClick={handleGenerateGazette}>
                      <FileText size={13} />
                      <span>{langHindi ? 'राजपत्र अधिसूचना देखें' : 'Inspect Gazette Notification'}</span>
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 16, background: '#f8fafc', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#071426' }}>{langHindi ? 'PFMS प्रत्यक्ष लाभ अंतरण (DBT)' : 'PFMS Direct Benefit Transfer (DBT)'}</strong>
                      <span className="badge-pill badge-green">Section 23 / 3G</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 12 }}>
                      {langHindi ? 'किसानों के सत्यापित बैंक खातों में मुआवजा राशि सीधे जमा करने हेतु ISO 20022 XML बैच बनाता है।' : "Generates ISO 20022 XML batch to credit compensation directly to farmers' verified bank accounts."}
                    </p>
                    <button className="btn-action btn-green" style={{ width: '100%', fontSize: '0.72rem' }} onClick={handleDisburseDBT}>
                      <IndianRupee size={13} />
                      <span>{langHindi ? 'PFMS DBT भुगतान निष्पादित करें' : 'Execute PFMS DBT Disbursal'}</span>
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 16, background: '#f8fafc', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#071426' }}>{langHindi ? 'राज्य भू-अभिलेख दाखिल-खारिज' : 'State Land Registry Mutation'}</strong>
                      <span className="badge-pill badge-saffron">Section 38 / 3E</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 12 }}>
                      {langHindi ? 'भौतिक कब्जा मिलने पर राज्य भू-अभिलेख पोर्टल (UP भूलेख, 7/12, भूमि) को स्वतः वेबहुक म्यूटेशन भेजता है।' : 'Sends automated webhook mutation payloads to State Portals (UP Bhulekh, 7/12, Bhoomi) upon possession.'}
                    </p>
                    <button className="btn-action btn-saffron" style={{ width: '100%', fontSize: '0.72rem' }} onClick={handleTriggerMutation}>
                      <RefreshCw size={13} />
                      <span>{langHindi ? 'स्वतः म्यूटेशन (दाखिल-खारिज) करें' : 'Trigger Automated Mutation'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cadastral Inventory Table */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <ShieldCheck size={16} color="#071426" />
                  <span>{langHindi ? 'कॉरिडोर से जुड़े भू-आधार पार्सल अभिलेख' : 'Cadastral Parcels Linked to this Corridor'}</span>
                </h3>
                <span className="badge-pill badge-green">{selectedProject.parcels.length} {langHindi ? 'पार्सल' : 'Parcels'}</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="nlams-data-table">
                  <thead>
                    <tr>
                      <th>{langHindi ? 'भू-आधार (ULPIN)' : 'ULPIN (Bhu-Aadhaar)'}</th>
                      <th>{langHindi ? 'स्थानीय खसरा/रिकॉर्ड' : 'Local Record Ref'}</th>
                      <th>{langHindi ? 'भू-स्वामी व बैंक विवरण' : 'Landowner & Bank'}</th>
                      <th>{langHindi ? 'अधिग्रहित क्षेत्रफल' : 'Acquired Area'}</th>
                      <th>{langHindi ? 'भूमि प्रकार' : 'Land Classification'}</th>
                      <th>{langHindi ? 'सर्किल / बैनामा दर' : 'Circle / Sale Rate'}</th>
                      <th>{langHindi ? 'अभिलेख लॉक स्थिति' : 'Encumbrance State'}</th>
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
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{p.nomenclature_type || 'Khasra'}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.owner_name}</div>
                          <div style={{ fontSize: '0.68rem', color: '#059669' }}>✓ IFSC: {p.bank_ifsc}</div>
                        </td>
                        <td>
                          <strong>{p.acquired_area_sqm} sq.m</strong>
                        </td>
                        <td><span className="badge-pill badge-blue">{p.land_type}</span></td>
                        <td>
                          <div>Circle: ₹{p.circle_rate_per_sqm}</div>
                          <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Sale: ₹{p.avg_registered_sale_rate_per_sqm}</div>
                        </td>
                        <td>
                          {p.encumbrance_locked ? (
                            <span className="badge-pill badge-red"><Lock size={9} /> {langHindi ? 'अभिलेख लॉक' : 'Encumbrance Locked'}</span>
                          ) : (
                            <span className="badge-pill badge-green">{langHindi ? 'मुक्त' : 'Free'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 4: COMPENSATION CALCULATION ================= */}
        {activeTab === 'calculator' && (
          <ValuationCalculator 
            calcInputs={calcInputs}
            setCalcInputs={setCalcInputs}
            calcResult={calcResult}
            runCalculator={runCalculator}
            showToast={showToast}
            setActiveTab={setActiveTab}
            t={t}
            langHindi={langHindi}
            isOfficer={isOfficer}
          />
        )}

        {/* ================= MODULE 5: LANDOWNER PORTAL ================= */}
        {activeTab === 'citizen' && (
          <LandownerPortal 
            citizenQuery={citizenQuery}
            setCitizenQuery={setCitizenQuery}
            citizenResults={citizenResults}
            handleCitizenSearch={handleCitizenSearch}
            setAwardSlipParcel={setAwardSlipParcel}
            setNewObjectionForm={setNewObjectionForm}
            setActiveModal={setActiveModal}
            setActiveTab={setActiveTab}
            t={t}
            langHindi={langHindi}
            isOfficer={isOfficer}
          />
        )}

        {/* ================= MODULE 6: OBJECTION / GRIEVANCE SYSTEM ================= */}
        {activeTab === 'objections' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.navObjections}</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {langHindi ? 'सक्षम प्राधिकारी (CALA) अर्ध-न्यायिक सुनवाई एवं शिकायत निस्तारण' : 'Quasi-judicial inquiry workbench for CALA benches and dispute claimants'}
                </span>
              </div>
              <button 
                className="btn-action btn-saffron" 
                style={{ fontSize: '0.72rem' }}
                onClick={() => {
                  setNewObjectionForm({
                    claimant_name: '',
                    contact_phone: '',
                    ulpin: selectedProject?.parcels[0]?.ulpin || '',
                    grounds_category: 'Inadequate Valuation',
                    objection_details: ''
                  });
                  setActiveModal('fileObjection');
                }}
              >
                <PlusCircle size={13} />
                <span>{langHindi ? 'नई आपत्ति दर्ज करें' : 'File New Objection'}</span>
              </button>
            </div>

            {/* Filter bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                      {[
                { key: 'ALL', label: langHindi ? 'सभी आपत्तियां (All)' : 'All Objections' },
                { key: 'PENDING', label: langHindi ? 'लंबित (Pending)' : 'Pending' },
                { key: 'HEARING_SCHEDULED', label: langHindi ? 'सुनवाई निर्धारित' : 'Hearing Scheduled' },
                { key: 'PETITION_UPHELD', label: langHindi ? 'याचिका स्वीकृत' : 'Petition Upheld' },
                { key: 'PETITION_REJECTED', label: langHindi ? 'याचिका खारिज' : 'Petition Rejected' }
              ].map(st => (
                <button 
                  key={st.key}
                  className={`btn-action ${objectionFilter === st.key ? 'btn-navy' : 'btn-outline'}`}
                  style={{ fontSize: '0.7rem', padding: '5px 12px' }}
                  onClick={() => setObjectionFilter(st.key)}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <Scale size={16} color="#7c3aed" />
                  <span>Objection Registry ({filteredObjections.length} Records)</span>
                </h3>
                <span className="badge-pill badge-purple">CALA Quasi-Judicial Jurisdiction</span>
              </div>

              <div className="panel-card-body">
                {filteredObjections.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 24, color: '#64748b', fontSize: '0.78rem' }}>
                    No objections found matching the current filter.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filteredObjections.map(item => {
                      const obj = item.objection;
                      return (
                        <div key={obj.id} style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 16, background: '#f8fafc', boxShadow: 'var(--shadow-xs)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <strong style={{ color: '#071426', fontSize: '0.88rem' }}>{obj.id}</strong>
                              <span className="badge-pill badge-blue">{obj.grounds_category}</span>
                              <span className={`badge-pill ${
                                obj.status === 'PENDING' ? 'badge-red' : 
                                (obj.status === 'HEARING_SCHEDULED' ? 'badge-saffron' : 
                                ((obj.status === 'PETITION_UPHELD' || obj.status === 'UPHELD' || obj.status === 'DISPOSED_UPHELD') ? 'badge-green' : 'badge-red'))
                              }`}>
                                {(obj.status === 'PETITION_UPHELD' || obj.status === 'UPHELD' || obj.status === 'DISPOSED_UPHELD') ? (langHindi ? 'याचिका स्वीकृत (Petition Upheld)' : 'Petition Upheld') : 
                                 (obj.status === 'PETITION_REJECTED' || obj.status === 'REJECTED' || obj.status === 'DISMISSED' || obj.status === 'DISPOSED_REJECTED') ? (langHindi ? 'याचिका खारिज (Petition Rejected)' : 'Petition Rejected') : 
                                 obj.status.replace('_', ' ')}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Filing Date: {obj.filing_date}</span>
                          </div>

                          <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: 8 }}>
                            Claimant: <strong>{obj.claimant_name}</strong> ({obj.contact_phone}) • ULPIN: <strong>{obj.ulpin}</strong> • Corridor: <strong>{item.project_title}</strong>
                          </div>

                          <div style={{ background: '#ffffff', border: '1px solid var(--border-main)', borderRadius: 4, padding: 10, fontSize: '0.75rem', marginBottom: 8 }}>
                            <strong>Objection Grounds:</strong> {obj.objection_details}
                          </div>

                          {obj.hearing_date && (
                            <div style={{ fontSize: '0.72rem', color: '#ea580c', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5, background: '#fff7ed', padding: '6px 10px', borderRadius: 4, border: '1px solid #fed7aa' }}>
                              <Calendar size={12} />
                              <span>Hearing Scheduled on: <strong>{obj.hearing_date}</strong> before {obj.cala_jurisdiction}</span>
                            </div>
                          )}

                          {obj.reasoned_order_summary && (
                            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 4, padding: 10, fontSize: '0.75rem', color: '#065f46', marginBottom: 8 }}>
                              <strong>Quasi-Judicial Reasoned Order:</strong> {obj.reasoned_order_summary}
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                            {obj.status === 'PENDING' && (
                              <button 
                                className="btn-action btn-outline" 
                                style={{ fontSize: '0.7rem', padding: '4px 10px' }}
                                onClick={() => setActiveObjectionToSchedule(item)}
                              >
                                <Calendar size={11} />
                                <span>{t.scheduleHearing}</span>
                              </button>
                            )}

                            {obj.status !== 'PETITION_UPHELD' && obj.status !== 'PETITION_REJECTED' && obj.status !== 'UPHELD' && obj.status !== 'DISMISSED' && obj.status !== 'DISPOSED_UPHELD' && obj.status !== 'DISPOSED_REJECTED' && (
                              <button 
                                className="btn-action btn-navy" 
                                style={{ fontSize: '0.7rem', padding: '4px 10px' }}
                                onClick={() => setActiveObjectionToDispose(item)}
                              >
                                <CheckCircle size={11} />
                                <span>{t.recordDisposal}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE: R&R TRACKING ================= */}
        {activeTab === 'rr' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>
                  {isOfficer 
                    ? (langHindi ? '6. पुनर्वास एवं पुनर्व्यवस्थापन (R&R) ट्रैकिंग' : '6. Non-Owner R&R Tracking') 
                    : (langHindi ? '4. पुनर्वास एवं पुनर्व्यवस्थापन मार्गदर्शिका (R&R)' : '4. R&R Entitlements Guide')}
                </h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {langHindi ? 'पुनर्वास एवं पुनर्व्यवस्था (द्वितीय अनुसूची) निगरानी' : 'Second Schedule mandatory entitlements under RFCTLARR Act, 2013'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <select 
                  style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)', fontSize: '0.78rem', fontWeight: 600 }}
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* R&R KPIs */}
            {rrSummary && (
              <div className="kpi-row-grid" style={{ marginBottom: 18 }}>
                <div className="kpi-metric-box border-blue">
                  <div className="kpi-head">
                    <span className="kpi-head-label">{langHindi ? 'प्रभावित परिवार' : 'Affected Families'}</span>
                    <div className="kpi-head-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                      <Users size={15} />
                    </div>
                  </div>
                  <div className="kpi-big-num">{rrSummary.total_affected_families}</div>
                  <div className="kpi-caption">{langHindi ? 'प्रारंभिक सर्वेक्षण परिवार' : 'Baseline Surveyed Families'}</div>
                </div>

                <div className="kpi-metric-box border-saffron">
                  <div className="kpi-head">
                    <span className="kpi-head-label">{langHindi ? 'विस्थापित परिवार' : 'Physically Displaced'}</span>
                    <div className="kpi-head-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
                      <Home size={15} />
                    </div>
                  </div>
                  <div className="kpi-big-num">{rrSummary.displaced_families}</div>
                  <div className="kpi-caption">{langHindi ? 'आवास आवंटन हेतु पात्र' : 'Entitled to Housing Units'}</div>
                </div>

                <div className="kpi-metric-box border-green">
                  <div className="kpi-head">
                    <span className="kpi-head-label">{langHindi ? 'निस्तारण दर' : 'Settlement Rate'}</span>
                    <div className="kpi-head-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                      <CheckCircle size={15} />
                    </div>
                  </div>
                  <div className="kpi-big-num">{rrSummary.settlement_percentage}%</div>
                  <div className="kpi-caption">{langHindi ? `${rrSummary.total_affected_families} में से ${rrSummary.fully_settled_families} निस्तारित` : `${rrSummary.fully_settled_families} of ${rrSummary.total_affected_families} Settled`}</div>
                </div>

                <div className="kpi-metric-box border-navy">
                  <div className="kpi-head">
                    <span className="kpi-head-label">{langHindi ? 'कुल R&R परिव्यय' : 'Total R&R Outlay'}</span>
                    <div className="kpi-head-icon" style={{ background: '#f1f5f9', color: '#071426' }}>
                      <IndianRupee size={15} />
                    </div>
                  </div>
                  <div className="kpi-big-num">₹ {rrSummary.total_rr_assistance_budget_lakhs} <span style={{ fontSize: '0.9rem' }}>{langHindi ? 'लाख' : 'Lakhs'}</span></div>
                  <div className="kpi-caption">{langHindi ? 'द्वितीय अनुसूची सहायता' : 'Second Schedule Grants'}</div>
                </div>
              </div>
            )}

            {/* Affected Families Entitlement Tracker */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <Users size={16} color="#059669" />
                  <span>{langHindi ? 'परियोजना प्रभावित परिवार एवं पुनर्वास हकदारी पंजिका' : 'Project Affected Families & Entitlements Ledger'} ({selectedProject?.title})</span>
                </h3>
                <span className="badge-pill badge-green">{langHindi ? 'द्वितीय अनुसूची अनुपालन' : 'Second Schedule Compliance'}</span>
              </div>

              <div className="panel-card-body">
                {(!rrSummary || rrSummary.families.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    {langHindi ? 'इस कॉरिडोर के लिए कोई R&R परिवार पंजीकृत नहीं है।' : 'No R&R families enrolled for this corridor.'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {rrSummary.families.map(fam => (
                      <div key={fam.family_id} style={{ background: '#ffffff', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 16, boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <strong style={{ fontSize: '0.95rem', color: '#071426' }}>{fam.head_of_family}</strong>
                              <span className="badge-pill badge-navy">{fam.family_id}</span>
                              <span className="badge-pill badge-blue">{fam.category}</span>
                              {fam.is_displaced && <span className="badge-pill badge-saffron">{langHindi ? 'भौतिक विस्थापित' : 'Physically Displaced'}</span>}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>
                              {langHindi ? 'सहायता पैकेज:' : 'Assistance Package:'} <strong>₹ {fam.total_rr_assistance_inr.toLocaleString()}</strong>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: fam.monetary_entitlements_settled >= 11 ? '#059669' : '#ea580c' }}>
                              {fam.monetary_entitlements_settled} / 11 {langHindi ? 'हकदारियां स्वीकृत' : 'Entitlements Settled'}
                            </span>
                            <div className="progress-track" style={{ width: 140 }}>
                              <div 
                                className="progress-bar-fill" 
                                style={{ 
                                  width: `${(fam.monetary_entitlements_settled / 11) * 100}%`,
                                  background: fam.monetary_entitlements_settled >= 11 ? '#059669' : '#ea580c'
                                }} 
                              />
                            </div>
                          </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4, marginBottom: 10, fontSize: '0.72rem' }}>
                          <strong style={{ color: '#071426', display: 'block', marginBottom: 4 }}>{langHindi ? 'पुनर्वास कॉलोनी में आवंटित नागरिक सुविधाएं:' : 'Resettlement Colony Civic Amenities Allocated:'}</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {fam.resettlement_amenities_allocated.length > 0 ? (
                              fam.resettlement_amenities_allocated.map((am, i) => (
                                <span key={i} className="badge-pill badge-green">✓ {am}</span>
                              ))
                            ) : (
                              <span style={{ color: '#94a3b8' }}>{langHindi ? 'कॉलोनी भूखंड आवंटन प्रतीक्षित' : 'Awaiting colony allotment'}</span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          {fam.monetary_entitlements_settled < 11 && (
                            <button 
                              className="btn-action btn-green" 
                              style={{ fontSize: '0.7rem', padding: '5px 12px' }}
                              onClick={() => handleSettleRRFamily(fam.family_id)}
                            >
                              <CheckCircle size={11} />
                              <span>Settle All 11 Entitlements</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 8: AI DELAY-RISK PREDICTOR ================= */}
        {activeTab === 'airisk' && (
          <DelayRiskWidget 
            selectedProject={selectedProject}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            projects={projects}
            projectRisk={projectRisk}
            allDelayRisks={allDelayRisks}
            handleTriggerAIMitigation={handleTriggerAIMitigation}
            t={t}
            langHindi={langHindi}
          />
        )}

        {/* ================= MODULE 5: LARRDA DISPUTE TRIBUNAL (SECTION 64) ================= */}
        {activeTab === 'larrda' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.navLARRDA}</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {langHindi ? 'धारा 64 न्यायाधिकरण संदर्भ, 90-दिवसीय कलेक्टर प्रेषण व 60-दिवसीय उच्च न्यायालय अपील निगरानी' : 'Quasi-judicial authority established under Section 64 of RFCTLARR Act, 2013 presided over by District Judge'}
                </span>
              </div>
              <button 
                className="btn-action btn-saffron" 
                style={{ fontSize: '0.72rem' }}
                onClick={() => {
                  setNewLarrdaForm({
                    project_id: selectedProject?.id || '',
                    ulpin: selectedProject?.parcels[0]?.ulpin || '',
                    claimant_name: '',
                    ground_type: 'VALUATION'
                  });
                  setActiveModal('fileLarrda');
                }}
              >
                <PlusCircle size={13} />
                <span>File Section 64 Reference</span>
              </button>
            </div>

            {/* Statutory Deadlines Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderLeft: '4px solid #f59e0b', padding: 14, borderRadius: 'var(--radius-md)' }}>
                <strong style={{ fontSize: '0.85rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} />
                  <span>Collector Referral Mandate (Section 64)</span>
                </strong>
                <p style={{ fontSize: '0.75rem', color: '#78350f', marginTop: 4, margin: '4px 0 0 0' }}>
                  District Collector must refer dispute to LARRDA within <strong>90 days</strong> of written objection. Bombay High Court affirms LARRDA has full judicial power over limitation questions.
                </p>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderLeft: '4px solid #3b82f6', padding: 14, borderRadius: 'var(--radius-md)' }}>
                <strong style={{ fontSize: '0.85rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Scale size={14} />
                  <span>Direct High Court Appeal (Section 74)</span>
                </strong>
                <p style={{ fontSize: '0.75rem', color: '#1e3a8a', marginTop: 4, margin: '4px 0 0 0' }}>
                  Any party aggrieved by a LARRDA award can bypass lower civil courts and appeal directly to the <strong>State High Court within 60 days</strong>.
                </p>
              </div>
            </div>

            {/* References Table */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <Scale size={16} color="#071426" />
                  <span>Active LARRDA References & Tribunal Dockets ({larrdaReferences.length} Records)</span>
                </h3>
                <span className="badge-pill badge-gold">Tribunal Jurisdiction</span>
              </div>
              <div className="panel-card-body">
                {larrdaReferences.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 24, color: '#64748b', fontSize: '0.78rem' }}>
                    No statutory references currently pending before LARRDA Bench.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {larrdaReferences.map(ref => (
                      <div key={ref.id} style={{ background: '#f8fafc', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <strong style={{ color: '#071426', fontSize: '0.9rem' }}>{ref.case_no}</strong>
                            <span className="badge-pill badge-blue">Ground: {ref.ground_type}</span>
                            <span className="badge-pill badge-saffron">{ref.status.replace('_', ' ')}</span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Filing: {ref.filing_date} • Referred: {ref.collector_referral_date}</span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#334155', marginBottom: 6 }}>
                          Claimant: <strong>{ref.claimant_name}</strong> • 14-Digit ULPIN: <strong>{ref.ulpin}</strong>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#475569', background: '#ffffff', border: '1px solid #e2e8f0', padding: 8, borderRadius: 4 }}>
                          Tribunal Bench: <strong>{ref.tribunal_bench}</strong> • High Court Appeal: <span style={{ color: '#059669', fontWeight: 700 }}>{ref.high_court_appeal_status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW: ON-GROUND FIELD SURVEY & OFFLINE-FIRST PWA ================= */}
        {activeTab === 'survey' && (
          <FieldSurveyApp
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={(p) => {
              setSelectedProjectId(p.id);
            }}
            apiBase={API_BASE}
            langHindi={langHindi}
            showToast={showToast}
            currentUser={currentUser}
          />
        )}

      </main>

      {/* 3. Footer */}
      <footer className="nlams-footer">
        <div className="footer-top-grid">
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: 6 }}>{t.deptHindi}</h4>
            <p style={{ lineHeight: 1.6, color: '#94a3b8' }}>
              {langHindi ? 'ग्रामीण विकास मंत्रालय, भारत सरकार।' : 'Ministry of Rural Development, Government of India.'}<br />
              {langHindi ? 'एनबीओ भवन, निर्माण भवन, नई दिल्ली - 110011।' : 'NBO Building, Nirman Bhawan, New Delhi - 110011.'}<br />
              {langHindi ? 'टोल-फ्री राष्ट्रीय हेल्पलाइन:' : 'Toll-Free National Helpline:'} <strong>1800-11-LAND (5263)</strong>
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: 6 }}>{langHindi ? '8 सक्रिय कार्यशील मॉड्यूल' : '8 Working Modules'}</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8, color: '#94a3b8' }}>
              <li>1. {langHindi ? 'अधिकारी डैशबोर्ड' : 'Officer Dashboard'}</li>
              <li>2. {langHindi ? 'जीआईएस पार्सल नक्शा व भू-आधार' : 'GIS Parcel Map & ULPIN'}</li>
              <li>3. {langHindi ? 'वैधानिक अधिग्रहण वर्कफ़्लो' : 'Project Acquisition Workflow'}</li>
              <li>4. {langHindi ? 'मुआवजा मूल्यांकन कैलकुलेटर' : 'Compensation Calculation'}</li>
              <li>5. {langHindi ? 'भू-स्वामी नागरिक पोर्टल' : 'Landowner Bhu-Aadhaar Portal'}</li>
              <li>6. {langHindi ? 'धारा 15 आपत्ति निवारण प्रणाली' : 'Objection / Grievance System'}</li>
              <li>7. {langHindi ? 'R&R पुनर्वास ट्रैकिंग (द्वितीय अनुसूची)' : 'R&R Tracking (2nd Schedule)'}</li>
              <li>8. {langHindi ? 'एआई विलंब-जोखिम पूर्वानुमान' : 'AI Delay-Risk Prediction'}</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: 6 }}>{langHindi ? 'वैधानिक डेटा एकीकरण' : 'Statutory Data Integrations'}</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8, color: '#94a3b8' }}>
              <li>• PM GatiShakti NMP (BiSAG-N)</li>
              <li>• Bhu-Naksha & Survey of India ORI</li>
              <li>• PFMS Direct Benefit Transfer (DBT)</li>
              <li>• State Land Records (Bhulekh / 7/12 / Bhoomi)</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>
            {langHindi ? 'स्मार्ट इंडिया हैकथॉन (SIH) हेतु अभिकल्पित एवं विकसित • भूमि संसाधन विभाग' : 'Designed & Developed for Smart India Hackathon (SIH) • Department of Land Resources'}
          </div>
          <div>
            NLAMS Production MVP v1.0 • {langHindi ? 'अद्यतन: 26-अगस्त-2026' : 'Last Updated: 26-Aug-2026'}
          </div>
        </div>
      </footer>

      {/* ================= MODAL 1: BILINGUAL E-GAZETTE SCHEDULE ================= */}
      {activeModal === 'gazette' && gazetteData && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>{langHindi ? 'ई-राजपत्र वैधानिक अधिसूचना (प्रारूप 11A)' : 'e-Gazette Statutory Notification (Form 11A)'}</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{langHindi ? 'भूमि अर्जन अधिनियम 2013 की धारा 11(1) के तहत प्रकाशित' : 'Published under Section 11(1) of RFCTLARR Act 2013'}</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4, marginBottom: 12, border: '1px solid var(--border-main)', fontSize: '0.72rem' }}>
              <div><strong>{langHindi ? 'राजपत्र अधिसूचना संख्या:' : 'Gazette ID:'}</strong> {gazetteData.gazette_id}</div>
              <div><strong>{langHindi ? 'हस्ताक्षरकर्ता प्राधिकारी:' : 'Signing Authority:'}</strong> {gazetteData.signing_authority}</div>
              <div><strong>{langHindi ? 'Class-3 DSC डिजिटल हस्ताक्षर हैश:' : 'Class-3 DSC Hash:'}</strong> <code style={{ color: '#2563eb' }}>{gazetteData.dsc_digital_signature_hash}</code></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxHeight: '48vh', overflowY: 'auto' }}>
              <div style={{ background: '#ffffff', padding: 12, borderRadius: 4, border: '1px solid var(--border-main)' }}>
                <strong style={{ fontSize: '0.75rem', color: '#071426', display: 'block', marginBottom: 4 }}>English Notification Schedule</strong>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.7rem', fontFamily: 'inherit', color: '#334155' }}>
                  {gazetteData.english_text}
                </pre>
              </div>

              <div style={{ background: '#ffffff', padding: 12, borderRadius: 4, border: '1px solid var(--border-main)' }}>
                <strong style={{ fontSize: '0.75rem', color: '#071426', display: 'block', marginBottom: 4 }}>मानकीकृत हिन्दी राजपत्र अधिसूचना</strong>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.7rem', fontFamily: 'inherit', color: '#334155' }}>
                  {gazetteData.hindi_text}
                </pre>
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-action btn-navy" onClick={() => setActiveModal(null)}>
                <Check size={13} />
                <span>{langHindi ? 'राजपत्र प्रकाशन अभिस्वीकृत करें' : 'Acknowledge Gazette Publication'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PFMS DBT BATCH ================= */}
      {activeModal === 'dbt' && dbtBatchData && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>{langHindi ? 'PFMS प्रत्यक्ष लाभ अंतरण (DBT) ISO 20022 XML बैच' : 'PFMS Direct Benefit Transfer (DBT) ISO 20022 XML Batch'}</h3>
                <span style={{ fontSize: '0.7rem', color: '#059669' }}>{langHindi ? 'RBI APBS सेटलमेंट गेटवे को प्रेषित' : 'Transmitted to RBI APBS Settlement Gateway'}</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 10 }}>
              <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4 }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{langHindi ? 'स्वीकृति संदर्भ संख्या' : 'Batch Sanction Ref'}</span>
                <strong style={{ fontSize: '0.75rem', color: '#071426', display: 'block' }}>{dbtBatchData.batch_id}</strong>
              </div>
              <div style={{ background: '#ecfdf5', padding: 8, borderRadius: 4 }}>
                <span style={{ fontSize: '0.65rem', color: '#166534' }}>{langHindi ? 'प्रत्यक्ष बैंक भुगतान' : 'Direct Bank Credit'}</span>
                <strong style={{ fontSize: '0.9rem', color: '#059669', display: 'block' }}>₹ {dbtBatchData.total_amount_cr} {langHindi ? 'करोड़' : 'Cr'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4 }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{langHindi ? 'सत्यापित लाभार्थी' : 'Verified Beneficiaries'}</span>
                <strong style={{ fontSize: '0.9rem', color: '#2563eb', display: 'block' }}>{dbtBatchData.total_beneficiaries} {langHindi ? 'भू-स्वामी' : 'Landholders'}</strong>
              </div>
            </div>

            <pre style={{ background: '#071426', color: '#a5f3fc', padding: 12, borderRadius: 4, fontSize: '0.7rem', overflowX: 'auto', maxHeight: '42vh' }}>
              {dbtBatchData.xml_payload}
            </pre>

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-action btn-green" onClick={() => setActiveModal(null)}>
                <CheckCircle size={13} />
                <span>{langHindi ? 'PFMS प्रत्यक्ष भुगतान की पुष्टि करें' : 'Confirm PFMS Direct Disbursal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: STATE REGISTRY MUTATION ================= */}
      {activeModal === 'mutation' && mutationData && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>{langHindi ? 'राज्य भू-अभिलेख स्वतः दाखिल-खारिज (Mutation) पंजिका' : 'State Land Registry Automated Mutation Ledger'}</h3>
                <span style={{ fontSize: '0.7rem', color: '#059669' }}>{langHindi ? `राज्य अधिकार अभिलेख (RoR) पोर्टल से सिंक (${mutationData.state})` : `Synchronized with State RoR Portal (${mutationData.state})`}</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
              <table className="nlams-data-table">
                <thead>
                  <tr>
                    <th>{langHindi ? 'भू-आधार (ULPIN)' : 'ULPIN'}</th>
                    <th>{langHindi ? 'पूर्व भू-स्वामी' : 'Previous Landowner'}</th>
                    <th>{langHindi ? 'अधिग्रहण एजेंसी नाम' : 'Vesting Agency Title'}</th>
                    <th>{langHindi ? 'नामांतरण आदेश संख्या' : 'Mutation Order Ref'}</th>
                    <th>{langHindi ? 'राज्य API स्थिति' : 'State API Status'}</th>
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

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-action btn-navy" onClick={() => setActiveModal(null)}>{t.close}</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: STATUTORY AWARD SLIP ================= */}
      {activeModal === 'awardSlip' && awardSlipParcel && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card award-slip-paper" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #071426', paddingBottom: 10, marginBottom: 12 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>{langHindi ? 'भारत सरकार • ग्रामीण विकास मंत्रालय • भूमि संसाधन विभाग' : 'GOVERNMENT OF INDIA • DEPARTMENT OF LAND RESOURCES'}</div>
              <h2 style={{ fontSize: '1.15rem', color: '#071426', marginTop: 2 }}>{langHindi ? 'वैधानिक मुआवजा प्राक्कलन पर्ची (FORM 11B)' : 'STATUTORY COMPENSATION ESTIMATE SLIP'}</h2>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>{langHindi ? 'भूमि अर्जन अधिनियम 2013 प्रथम अनुसूची / धारा 3G राष्ट्रीय राजमार्ग अधिनियम 1956' : 'Under First Schedule of RFCTLARR Act, 2013 / Section 3G NH Act 1956'}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.75rem', marginBottom: 12 }}>
              <div><strong>{langHindi ? 'भू-स्वामी:' : 'Owner:'}</strong> {awardSlipParcel.parcel?.owner_name}</div>
              <div><strong>{langHindi ? '14-अंकीय भू-आधार (ULPIN):' : '14-Digit ULPIN:'}</strong> <span style={{ fontFamily: 'monospace' }}>{awardSlipParcel.parcel?.ulpin}</span></div>
              <div><strong>{langHindi ? 'खसरा / अभिलेख संख्या:' : 'Khasra / Record:'}</strong> {awardSlipParcel.parcel?.local_record_no}</div>
              <div><strong>{langHindi ? 'अधिग्रहित क्षेत्रफल:' : 'Acquired Area:'}</strong> {awardSlipParcel.parcel?.acquired_area_sqm} sq.m</div>
              <div><strong>{langHindi ? 'परियोजना कॉरिडोर:' : 'Project Corridor:'}</strong> {awardSlipParcel.project_title}</div>
              <div><strong>{langHindi ? 'भूमि वर्गीकरण:' : 'Classification:'}</strong> {awardSlipParcel.parcel?.land_type}</div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid var(--border-main)', borderRadius: 6, padding: 10, marginBottom: 12, fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>{langHindi ? 'धारा 26 मूल बाजार दर:' : 'Base Market Rate (Sec 26):'}</span>
                <strong>₹ {awardSlipParcel.parcel?.avg_registered_sale_rate_per_sqm || 2400} / sq.m</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>{langHindi ? '100% सोलेशियम (धारा 30(1)):' : '100% Solatium (Sec 30(1)):'}</span>
                <strong>+ 100% ({langHindi ? 'अनिवार्य' : 'Mandatory'})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>{langHindi ? '12% अतिरिक्त वार्षिक ब्याज (धारा 30(3)):' : 'Additional Amount 12% p.a. (Sec 30(3)):'}</span>
                <strong>+ 12% p.a. ({langHindi ? 'धारा 11 अधिसूचना तिथि से' : 'from Sec 11'})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', marginTop: 4, background: '#ecfdf5', borderRadius: 4 }}>
                <strong style={{ color: '#166534' }}>{langHindi ? 'कुल अनुमानित देय पंचाट मुआवजा:' : 'Estimated Total Award (Gross):'}</strong>
                <strong style={{ color: '#059669', fontSize: '1.05rem' }}>
                  ₹ {awardSlipParcel.valuation_estimate?.gross_total_award?.toLocaleString() || '1,15,00,000'}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>* {langHindi ? 'PFMS APBS के माध्यम से बैंक खाते में सीधा अंतरण।' : 'Direct bank transfer via PFMS APBS.'}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-action btn-outline" style={{ fontSize: '0.72rem' }} onClick={() => window.print()}>
                  <Printer size={12} />
                  <span>{langHindi ? 'प्रिंट करें' : 'Print'}</span>
                </button>
                <button className="btn-action btn-navy" style={{ fontSize: '0.72rem' }} onClick={() => setActiveModal(null)}>
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: FILE SECTION 15 OBJECTION ================= */}
      {activeModal === 'fileObjection' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>{langHindi ? 'धारा 15 / 3C के तहत आपत्ति दर्ज करें' : 'File Section 15 / 3C Objection'}</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{langHindi ? 'प्रारंभिक राजपत्र के 60 दिनों के भीतर वैधानिक आपत्ति अधिकार' : 'Statutory Right of Objection within 60 Days of Preliminary Gazette'}</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <form onSubmit={handleFileNewObjection}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'दावेदार / भू-स्वामी का पूरा नाम' : 'Claimant Full Name'}</label>
                <input 
                  type="text" 
                  required
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                  value={newObjectionForm.claimant_name}
                  onChange={(e) => setNewObjectionForm({ ...newObjectionForm, claimant_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'संपर्क फोन / मोबाइल नंबर' : 'Contact Phone / Mobile'}</label>
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={newObjectionForm.contact_phone}
                    onChange={(e) => setNewObjectionForm({ ...newObjectionForm, contact_phone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? '14-अंकीय भू-आधार (ULPIN)' : '14-Digit ULPIN (Bhu-Aadhaar)'}</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={newObjectionForm.ulpin}
                    onChange={(e) => setNewObjectionForm({ ...newObjectionForm, ulpin: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'आपत्ति का आधार / श्रेणी' : 'Grounds Category'}</label>
                <select 
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                  value={newObjectionForm.grounds_category}
                  onChange={(e) => setNewObjectionForm({ ...newObjectionForm, grounds_category: e.target.value })}
                >
                  <option value="Inadequate Valuation">{langHindi ? 'अपर्याप्त मूल्यांकन / दर पुनर्निर्धारण' : 'Inadequate Valuation / Rate Re-assessment'}</option>
                  <option value="Measurement Discrepancy">{langHindi ? 'माप / सीमा विसंगति (Area Discrepancy)' : 'Measurement / Area Discrepancy'}</option>
                  <option value="Title Dispute">{langHindi ? 'स्वामित्व / वारिसान विवाद (Title Dispute)' : 'Title Dispute / Co-parcenary Partition'}</option>
                  <option value="Public Utility Conflict">{langHindi ? 'सार्वजनिक उपयोगिता / नहर व मार्ग टकराव' : 'Public Utility Conflict / Irrigation Canal'}</option>
                  <option value="Ecological Concern / Wildlife">{langHindi ? 'पर्यावरणीय व धार्मिक स्थल चिंता' : 'Ecological Concern / Sacred Land'}</option>
                  <option value="Other">{langHindi ? 'अन्य (विवरण नीचे लिखें)' : 'Other (Provide description below)'}</option>
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>
                  {langHindi ? 'आपत्ति का विस्तृत विवरण' : 'Detailed Description of Grounds'} {newObjectionForm.grounds_category === 'Other' && <span style={{ color: '#dc2626' }}>* ({langHindi ? 'अनिवार्य' : 'Required'})</span>}
                </label>
                <textarea 
                  rows={3}
                  required={newObjectionForm.grounds_category === 'Other'}
                  placeholder={langHindi ? 'खसरा संख्या, माप संबंधी त्रुटि, बैनामा साक्ष्य या आपत्ति के ठोस कारण दर्ज करें...' : "Describe specific survey numbers, measurement mismatches, market rate evidence, or reasons for objection..."}
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                  value={newObjectionForm.objection_details}
                  onChange={(e) => setNewObjectionForm({ ...newObjectionForm, objection_details: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                <button type="button" className="btn-action btn-outline" onClick={() => setActiveModal(null)}>{t.cancel}</button>
                <button type="submit" className="btn-action btn-saffron">{t.submit}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFICER AUTHENTICATION & DEMO ROLES ================= */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-dialog-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#071426', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={16} color="#2563eb" />
                  <span>{langHindi ? 'अधिकारी पोर्टल लॉगिन (RBAC)' : 'Officer Portal Login (RBAC)'}</span>
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{langHindi ? 'प्रशासनिक भूमिका चुनें' : 'Select an administrative role or enter officer credentials'}</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setShowLoginModal(false)}>✕</button>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 14 }}>
              {langHindi 
                ? 'मूल्यांकन एवं कार्य निष्पादन हेतु नीचे दिए गए पूर्व-कॉन्फ़िगर आधिकारिक पदों में से किसी एक पर क्लिक करें:'
                : 'Select a pre-configured official role below for instant 1-click evaluation access, or enter your official credentials.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { role: 'COLLECTOR', label: langHindi ? 'जिला कलेक्टर / DM' : 'District Collector', name: 'Shri S. Rajalingam, IAS', color: '#1e3a8a', bg: '#eff6ff' },
                { role: 'CALA', label: langHindi ? 'सक्षम प्राधिकारी (CALA / ADM)' : 'CALA / ADM Bench', name: 'Dr. Alok Verma, PCS', color: '#78350f', bg: '#fffbeb' },
                { role: 'SURVEYOR', label: langHindi ? 'राजस्व / फील्ड सर्वेक्षक' : 'Field Surveyor', name: 'Shri S. K. Sharma', color: '#065f46', bg: '#ecfdf5' },
                { role: 'AGENCY', label: langHindi ? 'NHAI प्रोजेक्ट जीएम' : 'NHAI Project GM', name: 'Er. Ramesh Chandra', color: '#831843', bg: '#fdf2f8' }
              ].map(prof => (
                <button
                  key={prof.role}
                  className="btn-action"
                  style={{ 
                    background: prof.bg, 
                    border: `1px solid ${prof.color}40`, 
                    color: prof.color, 
                    padding: '10px 12px', 
                    textAlign: 'left',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 2
                  }}
                  onClick={() => handleOfficerLogin(prof.role)}
                >
                  <strong style={{ fontSize: '0.8rem' }}>{prof.label}</strong>
                  <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>{prof.name}</span>
                </button>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-main)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn-action btn-outline" 
                style={{ fontSize: '0.72rem' }}
                onClick={() => {
                  handleLogout();
                  setShowLoginModal(false);
                }}
              >
                🇮🇳 {langHindi ? 'नागरिक मोड में वापस जाएं' : 'Continue in Free Citizen Mode'}
              </button>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{langHindi ? 'DPDP अधिनियम 2023 अनुपालन' : 'DPDP Act 2023 Compliant'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: FILE LARRDA REFERENCE ================= */}
      {activeModal === 'fileLarrda' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <h3 style={{ fontSize: '1rem', color: '#071426' }}>{langHindi ? 'धारा 64 न्यायाधिकरण संदर्भ प्रस्तुत करें' : 'Submit Section 64 Tribunal Reference'}</h3>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <form onSubmit={handleFileLarrdaReference}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'दावेदार का पूरा नाम' : 'Claimant Full Name'}</label>
                <input 
                  type="text" 
                  required
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                  value={newLarrdaForm.claimant_name}
                  onChange={(e) => setNewLarrdaForm({ ...newLarrdaForm, claimant_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'कॉरिडोर आईडी' : 'Corridor ID'}</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={newLarrdaForm.project_id}
                    onChange={(e) => setNewLarrdaForm({ ...newLarrdaForm, project_id: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? '14-अंकीय भू-आधार (ULPIN)' : '14-Digit ULPIN'}</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={newLarrdaForm.ulpin}
                    onChange={(e) => setNewLarrdaForm({ ...newLarrdaForm, ulpin: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'विवाद का वैधानिक आधार' : 'Dispute Ground'}</label>
                <select 
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                  value={newLarrdaForm.ground_type}
                  onChange={(e) => setNewLarrdaForm({ ...newLarrdaForm, ground_type: e.target.value })}
                >
                  <option value="VALUATION">{langHindi ? 'अपर्याप्त मूल्यांकन व गुणक कारक (धारा 26-30)' : 'Inadequate Valuation & Factor Multiplier (Section 26-30)'}</option>
                  <option value="MEASUREMENT">{langHindi ? 'माप / सीमांकन त्रुटि (धारा 64)' : 'Measurement / Boundary Error (Section 64)'}</option>
                  <option value="TITLE_DISPUTE">{langHindi ? 'स्वामित्व व वारिसान विवाद (धारा 64)' : 'Title / Co-parcenary Conflict (Section 64)'}</option>
                  <option value="RR_PACKAGE">{langHindi ? 'R&R द्वितीय अनुसूची पैकेज में कमी' : 'R&R Second Schedule Package Deficit'}</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                <button type="button" className="btn-action btn-outline" onClick={() => setActiveModal(null)}>{t.cancel}</button>
                <button type="submit" className="btn-action btn-saffron">{langHindi ? 'LARRDA को प्रस्तुत करें' : 'Submit to LARRDA'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SCHEDULE HEARING ================= */}
      {activeObjectionToSchedule && (
        <div className="modal-overlay" onClick={() => setActiveObjectionToSchedule(null)}>
          <div className="modal-dialog-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>{langHindi ? 'अर्ध-न्यायिक सुनवाई निर्धारित करें' : 'Schedule Quasi-Judicial Hearing'}</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{langHindi ? 'आपत्ति संदर्भ:' : 'Objection Ref:'} {activeObjectionToSchedule.objection.id}</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveObjectionToSchedule(null)}>✕</button>
            </div>

            <div style={{ marginBottom: 10, fontSize: '0.75rem' }}>
              <div>{langHindi ? 'दावेदार:' : 'Claimant:'} <strong>{activeObjectionToSchedule.objection.claimant_name}</strong></div>
              <div>{langHindi ? 'आधार:' : 'Grounds:'} <strong>{activeObjectionToSchedule.objection.grounds_category}</strong></div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'सुनवाई तिथि चुनें' : 'Select Hearing Date'}</label>
              <input 
                type="date" 
                style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                value={hearingScheduleDate}
                onChange={(e) => setHearingScheduleDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-action btn-outline" onClick={() => setActiveObjectionToSchedule(null)}>{t.cancel}</button>
              <button className="btn-action btn-navy" onClick={handleScheduleHearing}>{langHindi ? 'सुनवाई नोटिस जारी करें' : 'Issue Hearing Notice'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RECORD REASONED DISPOSAL ORDER ================= */}
      {activeObjectionToDispose && (
        <div className="modal-overlay" onClick={() => setActiveObjectionToDispose(null)}>
          <div className="modal-dialog-card" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>{langHindi ? 'सकारण न्यायिक निस्तारण आदेश दर्ज करें' : 'Record Quasi-Judicial Reasoned Order'}</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{langHindi ? 'धारा 15(2) जांच निस्तारण' : 'Section 15(2) Inquiry Disposal'} • {activeObjectionToDispose.objection.id}</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveObjectionToDispose(null)}>✕</button>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'निस्तारण निर्णय' : 'Disposal Decision'}</label>
              <select 
                style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                value={disposalForm.status}
                onChange={(e) => setDisposalForm({ ...disposalForm, status: e.target.value })}
              >
                <option value="PETITION_UPHELD">{langHindi ? 'याचिका स्वीकृत (Petition Upheld - दावेदार के पक्ष में / मुआवजा संशोधन)' : 'Petition Upheld (याचिका स्वीकृत - Favorable to Claimant / Modify Award)'}</option>
                <option value="PETITION_REJECTED">{langHindi ? 'याचिका खारिज (Petition Rejected - जांचोपरांत आधारहीन)' : 'Petition Rejected (याचिका खारिज - Deemed Unsustainable after Inquiry)'}</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'सकारण न्यायिक आदेश सारांश' : 'Quasi-Judicial Reasoned Order Summary'}</label>
              <textarea 
                rows={3}
                required
                placeholder={langHindi ? 'मौका मुआयना, मूल्यांकन पुनः सत्यापन अथवा सुनवाई निष्कर्षों का विस्तृत कानूनी विवरण दर्ज करें...' : "Enter reasoned legal order detailing field inspection, valuation re-verification, or inquiry findings..."}
                style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                value={disposalForm.reason}
                onChange={(e) => setDisposalForm({ ...disposalForm, reason: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-action btn-outline" onClick={() => setActiveObjectionToDispose(null)}>{t.cancel}</button>
              <button className="btn-action btn-green" onClick={handleDisposeObjection}>{langHindi ? 'हस्ताक्षर व मुहर लगाकर आदेश जारी करें' : 'Sign & Seal Order'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
