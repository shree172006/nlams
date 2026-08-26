import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, ShieldCheck, FileText, IndianRupee, Layers, 
  TrendingUp, AlertTriangle, CheckCircle, Search, Clock, 
  ArrowRight, Lock, RefreshCw, Check, HelpCircle, Printer, Globe,
  Home, ChevronRight, Scale, Users, PlusCircle, Zap, Sparkles, Calendar
} from 'lucide-react';

import Navbar from './components/Navbar';
import OfficerDashboard from './components/OfficerDashboard';
import GISParcelMap from './components/GISParcelMap';
import ValuationCalculator from './components/ValuationCalculator';
import LandownerPortal from './components/LandownerPortal';
import DelayRiskWidget from './components/DelayRiskWidget';

const API_BASE = "http://localhost:8000";

// Bilingual translations dictionary
const T = {
  en: {
    govt: "भारत सरकार | Government of India",
    deptHindi: "भूमि संसाधन विभाग | ग्रामीण विकास मंत्रालय",
    mainName: "National Land Acquisition & Management System (NLAMS)",
    subHeading: "Production MVP • 8 Core Modules • RFCTLARR Act 2013 & NH Act 1956",
    liveSystem: "LIVE SYSTEM",
    govtDept: "Govt of India (DoLR)",
    actBadge: "RFCTLARR Act 2013",
    actSub: "NH Act 1956 (Sec 3G)",
    tickerTitle: "SYSTEM CONTROL CONSOLE",
    gatewayHub: "Gateway Hub",
    navDashboard: "1. Officer Dashboard",
    navGis: "2. GIS Parcel Map",
    navWorkflow: "3. Acquisition Workflow",
    navCalculator: "4. Compensation Calc",
    navLandowner: "5. Landowner Portal",
    navObjections: "6. Objections",
    navRR: "7. R&R Tracking",
    navAIRisk: "8. AI Delay-Risk",
    heroBadge: "Department of Land Resources • Production-Ready Platform",
    heroTitle: "National Land Acquisition & Management System",
    heroDesc: "A unified, statutory enterprise platform digitizing India's public land acquisition lifecycle end-to-end under the RFCTLARR Act, 2013 and sector-specific central legislations (National Highways Act 1956, Railways Act 1989). Eliminates litigation, locks illegal transactions via 14-digit ULPIN (Bhu-Aadhaar), and automates PFMS Direct Benefit Transfer (DBT).",
    statDBT: "PFMS DBT Disbursed Directly",
    statArea: "Notified Corridor Area",
    statParcels: "14-Digit ULPINs Linked",
    statModules: "Production MVP Ready",
    modSectionTitle: "Core Functional Modules",
    modSectionDesc: "Select any of the 8 dedicated functional areas below to explore live features.",
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
    subHeading: "उत्पादन MVP • 8 मुख्य मॉड्यूल • भूमि अर्जन अधिनियम 2013",
    liveSystem: "सक्रिय प्रणाली",
    govtDept: "भारत सरकार (DoLR)",
    actBadge: "भूमि अर्जन अधिनियम 2013",
    actSub: "राजमार्ग अधिनियम 1956 (धारा 3G)",
    tickerTitle: "प्रणाली नियंत्रण पटल",
    gatewayHub: "मुख्य द्वार (Gateway)",
    navDashboard: "1. अधिकारी डैशबोर्ड",
    navGis: "2. जीआईएस पार्सल नक्शा",
    navWorkflow: "3. अधिग्रहण वर्कफ़्लो",
    navCalculator: "4. मुआवजा गणना",
    navLandowner: "5. भू-स्वामी पोर्टल",
    navObjections: "6. आपत्तियां",
    navRR: "7. पुनर्वास (R&R)",
    navAIRisk: "8. एआई विलंब-जोखिम",
    heroBadge: "भूमि संसाधन विभाग • उत्पादन-सक्षम प्लेटफॉर्म",
    heroTitle: "राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन प्रणाली",
    heroDesc: "भूमि अर्जन एवं पुनर्वास अधिनियम 2013 एवं राष्ट्रीय राजमार्ग अधिनियम 1956 के तहत सार्वजनिक बुनियादी ढांचा परियोजनाओं हेतु भूमि अधिग्रहण की संपूर्ण डिजिटल व पारदर्शी प्रक्रिया। 14-अंकीय भू-आधार (ULPIN) द्वारा अभिलेखों का स्वतः लाकिंग एवं PFMS द्वारा सीधे बैंक खातों में मुआवजा भुगतान।",
    statDBT: "PFMS प्रत्यक्ष बैंक भुगतान",
    statArea: "अधिसूचित कॉरिडोर क्षेत्र",
    statParcels: "लिंक किए गए भू-आधार",
    statModules: "कार्यशील मॉड्यूल तैयार",
    modSectionTitle: "8 मुख्य कार्यात्मक मॉड्यूल",
    modSectionDesc: "लाइव सुविधाओं का अनुभव करने हेतु नीचे दिए गए किसी भी मॉड्यूल का चयन करें।",
    openModule: "मॉड्यूल खोलें",
    activeProjectLabel: "सक्रिय परियोजना:",
    activeCorridors: "सक्रिय कॉरिडोर",
    notifiedLandArea: "अधिसूचित भूमि क्षेत्र",
    pfmsDbtDisbursed: "PFMS DBT वितरित मुआवजा",
    activeEncumbranceLocks: "सक्रिय भार-मुक्ति लॉक",
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
    status: 'DISPOSED_UPHELD',
    reason: ''
  });
  const [newObjectionForm, setNewObjectionForm] = useState({
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

  const t = langHindi ? T.hi : T.en;

  // Font size scaler effect
  useEffect(() => {
    document.documentElement.className = `font-scale-${fontSize}`;
  }, [fontSize]);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resMetrics, resProjects, resRisks, resObjs] = await Promise.all([
        fetch(`${API_BASE}/api/national-metrics`).then(r => r.json()),
        fetch(`${API_BASE}/api/projects`).then(r => r.json()),
        fetch(`${API_BASE}/api/delay-risks`).then(r => r.json()),
        fetch(`${API_BASE}/api/objections`).then(r => r.json())
      ]);
      setMetrics(resMetrics);
      setProjects(resProjects);
      setAllDelayRisks(resRisks);
      setAllObjections(resObjs);
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
      console.error(e);
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
      console.error(e);
    }
  };

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

  const handleCitizenSearch = async (e, queryOverride) => {
    if (e) e.preventDefault();
    const query = queryOverride !== undefined ? queryOverride : citizenQuery;
    if (!query) return;
    try {
      const res = await fetch(`${API_BASE}/api/citizen-lookup?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setCitizenResults(data);
      if (data.length === 0) {
        showToast("No records found matching query.", 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleHearing = async () => {
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
        showToast(`Objection ${disposalForm.status.toLowerCase().replace('_', ' ')} with reasoned order.`, 'success');
        setActiveObjectionToDispose(null);
        setDisposalForm({ status: 'DISPOSED_UPHELD', reason: '' });
        fetchData();
      }
    } catch (err) {
      showToast("Failed to record disposal order.", 'error');
    }
  };

  const handleFileNewObjection = async (e) => {
    e.preventDefault();
    if (!selectedProject || !newObjectionForm.claimant_name || !newObjectionForm.ulpin) {
      showToast("Please complete required objection fields.", 'error');
      return;
    }
    try {
      const params = new URLSearchParams(newObjectionForm);
      const res = await fetch(
        `${API_BASE}/api/projects/${selectedProject.id}/objections?${params.toString()}`,
        { method: 'POST' }
      );
      if (res.ok) {
        showToast("Section 15 Objection filed into statutory register.", 'success');
        setActiveModal(null);
        setNewObjectionForm({
          claimant_name: '',
          contact_phone: '',
          ulpin: '',
          grounds_category: 'Inadequate Valuation',
          objection_details: ''
        });
        fetchData();
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

  // 8 Core Prototype Modules Definition
  const CORE_MODULES = [
    {
      id: 'dashboard',
      icon: <TrendingUp size={20} color="#0284c7" />,
      iconBg: '#e0f2fe',
      title: t.navDashboard,
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
      title: t.navGis,
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
      title: t.navWorkflow,
      statutory: 'RFCTLARR Act 2013 • NH Act 1956',
      desc: langHindi
        ? '9-चरणीय वैधानिक वर्कफ़्लो, ई-राजपत्र निर्माण, PFMS DBT बैच एवं राज्य भूमि अभिलेखों में स्वतः दाखिल-खारिज।'
        : 'Deterministic 9-stage statutory workflow enforcing legal gates, e-Gazette generation, DBT payout, and registry auto-mutation.',
      users: langHindi ? 'सक्षम प्राधिकारी (CALA)' : 'CALAs & Land Acquisition Officers',
      tag: 'Core Lifecycle',
      badgeColor: 'badge-saffron'
    },
    {
      id: 'calculator',
      icon: <IndianRupee size={20} color="#0b1e36" />,
      iconBg: '#f1f5f9',
      title: t.navCalculator,
      statutory: 'RFCTLARR Sec 26-30 • NH Act 3G',
      desc: langHindi
        ? 'बाजार दर × ग्रामीण गुणक + परिसंपत्ति + 100% सोलेशियम + 12% प्रति वर्ष अतिरिक्त राशि का पारदर्शी गणित।'
        : 'Automated statutory math: Market Value × Rural Multiplier + Assets + 100% Solatium + 12% Additional Amount.',
      users: langHindi ? 'मूल्यांकन अधिकारी व किसान' : 'Valuation Officers & Landowners',
      tag: 'Audited Formula',
      badgeColor: 'badge-navy'
    },
    {
      id: 'citizen',
      icon: <Search size={20} color="#2563eb" />,
      iconBg: '#eff6ff',
      title: t.navLandowner,
      statutory: 'Citizen Bhu-Aadhaar Self-Service',
      desc: langHindi
        ? '14-अंकीय भू-आधार, खसरा या नाम से सार्वजनिक खोज, डिजिटल मुआवजा पर्ची व ऑनलाइन आपत्ति दर्ज करना।'
        : 'Public lookup by ULPIN / Khasra / Name to view statutory stage, download award estimate slip, and file grievances.',
      users: langHindi ? 'भू-स्वामी एवं प्रभावित परिवार' : 'Farmers & Affected Families',
      tag: 'Citizen Access',
      badgeColor: 'badge-blue'
    },
    {
      id: 'objections',
      icon: <Scale size={20} color="#7c3aed" />,
      iconBg: '#f3e8ff',
      title: t.navObjections,
      statutory: 'RFCTLARR Sec 15 • NH Act Sec 3C',
      desc: langHindi
        ? 'धारा 15 के तहत आपत्तियों का पंजीकरण, अर्ध-न्यायिक सुनवाई का निर्धारण एवं कारणयुक्त निस्तारण आदेश।'
        : 'Section 15 objection tribunal to track grievances, schedule quasi-judicial hearings, and issue reasoned disposal orders.',
      users: langHindi ? 'सक्षम प्राधिकारी व दावेदार' : 'CALA Benches & Claimants',
      tag: 'Dispute Resolution',
      badgeColor: 'badge-purple'
    },
    {
      id: 'rr',
      icon: <Users size={20} color="#059669" />,
      iconBg: '#ecfdf5',
      title: t.navRR,
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
      title: t.navAIRisk,
      statutory: 'Statutory Bottleneck & Lapse Forecaster',
      desc: langHindi
        ? 'चरणबद्ध समय, लंबित विवादों व R&R अंतर के आधार पर महीनों के विलंब की सटीक एआई भविष्यवाणी व समाधान।'
        : 'AI forecasting engine analyzing stage dwell time, dispute ratios, and R&R gaps to predict months of delay with prescriptive fixes.',
      users: langHindi ? 'परियोजना निदेशक व अनुश्रवण कक्ष' : 'Project Directors & Monitoring Cells',
      tag: 'AI Intelligence',
      badgeColor: 'badge-critical'
    }
  ];

  const filteredObjections = allObjections.filter(item => {
    if (objectionFilter === 'ALL') return true;
    return item.objection.status === objectionFilter;
  });

  return (
    <div>
      {/* 1. Global Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fontSize={fontSize}
        setFontSize={setFontSize}
        langHindi={langHindi}
        setLangHindi={setLangHindi}
        t={t}
        selectedProject={selectedProject}
        metrics={metrics}
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
                <Sparkles size={13} />
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
                <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.modSectionTitle}</h2>
                <p style={{ fontSize: '0.76rem', color: '#64748b' }}>{t.modSectionDesc}</p>
              </div>
              <span className="badge-pill badge-navy" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Official Enterprise Gateways</span>
            </div>

            {/* Modules Grid */}
            <div className="home-portals-grid">
              {CORE_MODULES.map((mod) => (
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
                      style={{ padding: '5px 12px', fontSize: '0.72rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(mod.id);
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
                    <span className="badge-pill badge-green">State: {selectedProject.state}</span>
                  </div>
                  <h2 style={{ fontSize: '1.15rem', color: '#071426', margin: '3px 0' }}>{selectedProject.title}</h2>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Agency: <strong>{selectedProject.acquiring_agency}</strong> • Corridor: <strong>{selectedProject.total_corridor_area_ha} Ha ({selectedProject.total_length_km || 0} km)</strong> • Parcels: <strong>{selectedProject.parcels.length}</strong>
                  </div>
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
                          {isCompleted ? <Check size={13} /> : (idx + 1)}
                        </div>
                        <div className="node-name-text">
                          {stageName.split(' ')[1]} {stageName.split(' ')[2] || ''}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stage Action Triggers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  <div style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 16, background: '#f8fafc', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#071426' }}>Form 11A: e-Gazette Schedule</strong>
                      <span className="badge-pill badge-blue">Section 11(1) / 3A</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 12 }}>
                      Generates standardized bilingual schedule in Hindi & English stamped with Class-3 DSC digital certificate.
                    </p>
                    <button className="btn-action btn-outline" style={{ width: '100%', fontSize: '0.72rem' }} onClick={handleGenerateGazette}>
                      <FileText size={13} />
                      <span>Inspect Gazette Notification</span>
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 16, background: '#f8fafc', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#071426' }}>PFMS Direct Benefit Transfer (DBT)</strong>
                      <span className="badge-pill badge-green">Section 23 / 3G</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 12 }}>
                      Generates ISO 20022 XML batch to credit compensation directly to farmers' verified bank accounts.
                    </p>
                    <button className="btn-action btn-green" style={{ width: '100%', fontSize: '0.72rem' }} onClick={handleDisburseDBT}>
                      <IndianRupee size={13} />
                      <span>Execute PFMS DBT Disbursal</span>
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', padding: 16, background: '#f8fafc', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#071426' }}>State Land Registry Mutation</strong>
                      <span className="badge-pill badge-saffron">Section 38 / 3E</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 12 }}>
                      Sends automated webhook mutation payloads to State Portals (UP Bhulekh, 7/12, Bhoomi) upon possession.
                    </p>
                    <button className="btn-action btn-saffron" style={{ width: '100%', fontSize: '0.72rem' }} onClick={handleTriggerMutation}>
                      <RefreshCw size={13} />
                      <span>Trigger Automated Mutation</span>
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
                  <span>Cadastral Parcels Linked to this Corridor</span>
                </h3>
                <span className="badge-pill badge-green">{selectedProject.parcels.length} Parcels</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="nlams-data-table">
                  <thead>
                    <tr>
                      <th>ULPIN (Bhu-Aadhaar)</th>
                      <th>Local Record Ref</th>
                      <th>Landowner & Bank</th>
                      <th>Acquired Area</th>
                      <th>Land Classification</th>
                      <th>Circle / Sale Rate</th>
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
                            <span className="badge-pill badge-red"><Lock size={9} /> Encumbrance Locked</span>
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
          </div>
        )}

        {/* ================= MODULE 4: COMPENSATION CALCULATION ================= */}
        {activeTab === 'calculator' && (
          <ValuationCalculator 
            calcInputs={calcInputs}
            setCalcInputs={setCalcInputs}
            calcResult={calcResult}
            setActiveTab={setActiveTab}
            t={t}
            langHindi={langHindi}
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
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {['ALL', 'PENDING', 'HEARING_SCHEDULED', 'DISPOSED_UPHELD', 'DISPOSED_REJECTED'].map(st => (
                <button 
                  key={st}
                  className={`btn-action ${objectionFilter === st ? 'btn-navy' : 'btn-outline'}`}
                  style={{ fontSize: '0.7rem', padding: '5px 12px' }}
                  onClick={() => setObjectionFilter(st)}
                >
                  {st.replace('_', ' ')}
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
                              <span className={`badge-pill ${obj.status === 'PENDING' ? 'badge-red' : (obj.status === 'HEARING_SCHEDULED' ? 'badge-saffron' : 'badge-green')}`}>
                                {obj.status.replace('_', ' ')}
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

                            {obj.status !== 'DISPOSED_UPHELD' && obj.status !== 'DISPOSED_REJECTED' && (
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

        {/* ================= MODULE 7: R&R TRACKING ================= */}
        {activeTab === 'rr' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.navRR}</h2>
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
                    <span className="kpi-head-label">Affected Families</span>
                    <div className="kpi-head-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                      <Users size={15} />
                    </div>
                  </div>
                  <div className="kpi-big-num">{rrSummary.total_affected_families}</div>
                  <div className="kpi-caption">Baseline Surveyed Families</div>
                </div>

                <div className="kpi-metric-box border-saffron">
                  <div className="kpi-head">
                    <span className="kpi-head-label">Physically Displaced</span>
                    <div className="kpi-head-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
                      <Home size={15} />
                    </div>
                  </div>
                  <div className="kpi-big-num">{rrSummary.displaced_families}</div>
                  <div className="kpi-caption">Entitled to Housing Units</div>
                </div>

                <div className="kpi-metric-box border-green">
                  <div className="kpi-head">
                    <span className="kpi-head-label">Settlement Rate</span>
                    <div className="kpi-head-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                      <CheckCircle size={15} />
                    </div>
                  </div>
                  <div className="kpi-big-num">{rrSummary.settlement_percentage}%</div>
                  <div className="kpi-caption">{rrSummary.fully_settled_families} of {rrSummary.total_affected_families} Settled</div>
                </div>

                <div className="kpi-metric-box border-navy">
                  <div className="kpi-head">
                    <span className="kpi-head-label">Total R&R Outlay</span>
                    <div className="kpi-head-icon" style={{ background: '#f1f5f9', color: '#071426' }}>
                      <IndianRupee size={15} />
                    </div>
                  </div>
                  <div className="kpi-big-num">₹ {rrSummary.total_rr_assistance_budget_lakhs} <span style={{ fontSize: '0.9rem' }}>Lakhs</span></div>
                  <div className="kpi-caption">Second Schedule Grants</div>
                </div>
              </div>
            )}

            {/* Affected Families Entitlement Tracker */}
            <div className="section-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">
                  <Users size={16} color="#059669" />
                  <span>Project Affected Families & Entitlements Ledger ({selectedProject?.title})</span>
                </h3>
                <span className="badge-pill badge-green">Second Schedule Compliance</span>
              </div>

              <div className="panel-card-body">
                {(!rrSummary || rrSummary.families.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No R&R families enrolled for this corridor.
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
                              {fam.is_displaced && <span className="badge-pill badge-saffron">Physically Displaced</span>}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>
                              Assistance Package: <strong>₹ {fam.total_rr_assistance_inr.toLocaleString()}</strong>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: fam.monetary_entitlements_settled >= 11 ? '#059669' : '#ea580c' }}>
                              {fam.monetary_entitlements_settled} / 11 Entitlements Settled
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
                          <strong style={{ color: '#071426', display: 'block', marginBottom: 4 }}>Resettlement Colony Civic Amenities Allocated:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {fam.resettlement_amenities_allocated.length > 0 ? (
                              fam.resettlement_amenities_allocated.map((am, i) => (
                                <span key={i} className="badge-pill badge-green">✓ {am}</span>
                              ))
                            ) : (
                              <span style={{ color: '#94a3b8' }}>Awaiting colony allotment</span>
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

      </main>

      {/* 3. Footer */}
      <footer className="nlams-footer">
        <div className="footer-top-grid">
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: 6 }}>{t.deptHindi}</h4>
            <p style={{ lineHeight: 1.6, color: '#94a3b8' }}>
              Ministry of Rural Development, Government of India.<br />
              NBO Building, Nirman Bhawan, New Delhi - 110011.<br />
              Toll-Free National Helpline: <strong>1800-11-LAND (5263)</strong>
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: 6 }}>8 Working Modules</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8, color: '#94a3b8' }}>
              <li>1. Officer Dashboard</li>
              <li>2. GIS Parcel Map & ULPIN</li>
              <li>3. Project Acquisition Workflow</li>
              <li>4. Compensation Calculation</li>
              <li>5. Landowner Bhu-Aadhaar Portal</li>
              <li>6. Objection / Grievance System</li>
              <li>7. R&R Tracking (2nd Schedule)</li>
              <li>8. AI Delay-Risk Prediction</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: 6 }}>Statutory Data Integrations</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8, color: '#94a3b8' }}>
              <li>• PM GatiShakti NMP (BiSAG-N)</li>
              <li>• Bhu-Naksha & Survey of India ORI</li>
              <li>• PFMS Direct Benefit Transfer</li>
              <li>• State Land Records (Bhulekh / 7/12)</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>
            Designed & Developed for Smart India Hackathon (SIH) • Department of Land Resources
          </div>
          <div>
            NLAMS Production MVP v1.0 • Last Updated: 26-Aug-2026
          </div>
        </div>
      </footer>

      {/* ================= MODAL 1: BILINGUAL E-GAZETTE SCHEDULE ================= */}
      {activeModal === 'gazette' && gazetteData && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>e-Gazette Statutory Notification (Form 11A)</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Published under Section 11(1) of RFCTLARR Act 2013</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4, marginBottom: 12, border: '1px solid var(--border-main)', fontSize: '0.72rem' }}>
              <div><strong>Gazette ID:</strong> {gazetteData.gazette_id}</div>
              <div><strong>Signing Authority:</strong> {gazetteData.signing_authority}</div>
              <div><strong>Class-3 DSC Hash:</strong> <code style={{ color: '#2563eb' }}>{gazetteData.dsc_digital_signature_hash}</code></div>
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
                <span>{langHindi ? 'स्वीकृति दें' : 'Acknowledge Gazette Publication'}</span>
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
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>PFMS Direct Benefit Transfer (DBT) ISO 20022 XML Batch</h3>
                <span style={{ fontSize: '0.7rem', color: '#059669' }}>Transmitted to RBI APBS Settlement Gateway</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 10 }}>
              <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4 }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Batch Sanction Ref</span>
                <strong style={{ fontSize: '0.75rem', color: '#071426', display: 'block' }}>{dbtBatchData.batch_id}</strong>
              </div>
              <div style={{ background: '#ecfdf5', padding: 8, borderRadius: 4 }}>
                <span style={{ fontSize: '0.65rem', color: '#166534' }}>Direct Bank Credit</span>
                <strong style={{ fontSize: '0.9rem', color: '#059669', display: 'block' }}>₹ {dbtBatchData.total_amount_cr} Cr</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4 }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Verified Beneficiaries</span>
                <strong style={{ fontSize: '0.9rem', color: '#2563eb', display: 'block' }}>{dbtBatchData.total_beneficiaries} Landholders</strong>
              </div>
            </div>

            <pre style={{ background: '#071426', color: '#a5f3fc', padding: 12, borderRadius: 4, fontSize: '0.7rem', overflowX: 'auto', maxHeight: '42vh' }}>
              {dbtBatchData.xml_payload}
            </pre>

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-action btn-green" onClick={() => setActiveModal(null)}>
                <CheckCircle size={13} />
                <span>{langHindi ? 'भुगतान की पुष्टि करें' : 'Confirm PFMS Direct Disbursal'}</span>
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
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>State Land Registry Automated Mutation Ledger</h3>
                <span style={{ fontSize: '0.7rem', color: '#059669' }}>Synchronized with State RoR Portal ({mutationData.state})</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
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
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>GOVERNMENT OF INDIA • DEPARTMENT OF LAND RESOURCES</div>
              <h2 style={{ fontSize: '1.15rem', color: '#071426', marginTop: 2 }}>{langHindi ? 'वैधानिक मुआवजा प्राक्कलन पर्ची' : 'STATUTORY COMPENSATION ESTIMATE SLIP'}</h2>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Under First Schedule of RFCTLARR Act, 2013 / Section 3G NH Act 1956</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.75rem', marginBottom: 12 }}>
              <div><strong>Owner:</strong> {awardSlipParcel.parcel?.owner_name}</div>
              <div><strong>14-Digit ULPIN:</strong> <span style={{ fontFamily: 'monospace' }}>{awardSlipParcel.parcel?.ulpin}</span></div>
              <div><strong>Khasra / Record:</strong> {awardSlipParcel.parcel?.local_record_no}</div>
              <div><strong>Acquired Area:</strong> {awardSlipParcel.parcel?.acquired_area_sqm} sq.m</div>
              <div><strong>Project Corridor:</strong> {awardSlipParcel.project_title}</div>
              <div><strong>Classification:</strong> {awardSlipParcel.parcel?.land_type}</div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid var(--border-main)', borderRadius: 6, padding: 10, marginBottom: 12, fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>Base Market Rate (Sec 26):</span>
                <strong>₹ {awardSlipParcel.parcel?.avg_registered_sale_rate_per_sqm || 2400} / sq.m</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>100% Solatium (Sec 30(1)):</span>
                <strong>+ 100% (Mandatory)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>Additional Amount 12% p.a. (Sec 30(3)):</span>
                <strong>+ 12% p.a. from Sec 11</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', marginTop: 4, background: '#ecfdf5', borderRadius: 4 }}>
                <strong style={{ color: '#166534' }}>Estimated Total Award (Gross):</strong>
                <strong style={{ color: '#059669', fontSize: '1.05rem' }}>
                  ₹ {awardSlipParcel.valuation_estimate?.gross_total_award?.toLocaleString() || '1,15,00,000'}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>* Direct bank transfer via PFMS APBS.</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-action btn-outline" style={{ fontSize: '0.72rem' }} onClick={() => window.print()}>
                  <Printer size={12} />
                  <span>Print</span>
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
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>File Section 15 / 3C Objection</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Statutory Right of Objection within 60 Days of Preliminary Gazette</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <form onSubmit={handleFileNewObjection}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Claimant Full Name</label>
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
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Contact Phone / Mobile</label>
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={newObjectionForm.contact_phone}
                    onChange={(e) => setNewObjectionForm({ ...newObjectionForm, contact_phone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>14-Digit ULPIN (Bhu-Aadhaar)</label>
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
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Grounds Category</label>
                <select 
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                  value={newObjectionForm.grounds_category}
                  onChange={(e) => setNewObjectionForm({ ...newObjectionForm, grounds_category: e.target.value })}
                >
                  <option value="Inadequate Valuation">Inadequate Valuation / Rate Re-assessment</option>
                  <option value="Measurement Discrepancy">Measurement / Area Discrepancy</option>
                  <option value="Title Dispute">Title Dispute / Co-parcenary Partition</option>
                  <option value="Public Utility Conflict">Public Utility Conflict / Irrigation Canal</option>
                  <option value="Ecological Concern / Wildlife">Ecological Concern / Sacred Land</option>
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Objection Details & Grounds</label>
                <textarea 
                  rows={3} 
                  required
                  placeholder="Explain why the proposed acquisition measurement, rate, or alignment should be re-examined..."
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                  value={newObjectionForm.objection_details}
                  onChange={(e) => setNewObjectionForm({ ...newObjectionForm, objection_details: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn-action btn-outline" onClick={() => setActiveModal(null)}>{t.cancel}</button>
                <button type="submit" className="btn-action btn-saffron">{t.submit}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: SCHEDULE HEARING ================= */}
      {activeObjectionToSchedule && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>Schedule Quasi-Judicial Hearing</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Objection Ref: {activeObjectionToSchedule.objection.id}</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ marginBottom: 10, fontSize: '0.75rem' }}>
              <div>Claimant: <strong>{activeObjectionToSchedule.objection.claimant_name}</strong></div>
              <div>Grounds: <strong>{activeObjectionToSchedule.objection.grounds_category}</strong></div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Select Hearing Date</label>
              <input 
                type="date" 
                style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                value={hearingScheduleDate}
                onChange={(e) => setHearingScheduleDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-action btn-outline" onClick={() => setActiveObjectionToSchedule(null)}>{t.cancel}</button>
              <button className="btn-action btn-navy" onClick={handleScheduleHearing}>Issue Hearing Notice</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 7: RECORD REASONED DISPOSAL ORDER ================= */}
      {activeObjectionToDispose && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-card" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#071426' }}>Record Quasi-Judicial Reasoned Order</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Section 15(2) Inquiry Disposal • {activeObjectionToDispose.objection.id}</span>
              </div>
              <button className="btn-action btn-outline" style={{ padding: '2px 7px' }} onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Disposal Decision</label>
              <select 
                style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                value={disposalForm.status}
                onChange={(e) => setDisposalForm({ ...disposalForm, status: e.target.value })}
              >
                <option value="DISPOSED_UPHELD">Upheld (Favorable to Claimant - Modify Award/Area)</option>
                <option value="DISPOSED_REJECTED">Rejected (Deemed Unsustainable after Inquiry)</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Quasi-Judicial Reasoned Order Summary</label>
              <textarea 
                rows={3}
                required
                placeholder="Enter reasoned legal order detailing field inspection, valuation re-verification, or inquiry findings..."
                style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                value={disposalForm.reason}
                onChange={(e) => setDisposalForm({ ...disposalForm, reason: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-action btn-outline" onClick={() => setActiveObjectionToDispose(null)}>{t.cancel}</button>
              <button className="btn-action btn-green" onClick={handleDisposeObjection}>Sign & Seal Order</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
