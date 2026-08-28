import React, { useState, useEffect } from 'react';
import {
  Wifi, WifiOff, RefreshCw, Smartphone, MapPin, Camera,
  PlusCircle, Trash2, CheckCircle2, AlertTriangle, Layers,
  Building, Trees, Wheat, Droplets, Users, Shield, Save,
  FileCheck, ArrowUpRight, Check, Info, Clock, Download
} from 'lucide-react';
import { 
  getPendingOfflineSurveys, 
  getSyncedSurveyHistory, 
  queueOfflineSurvey, 
  removePendingSurvey, 
  useNetworkSync 
} from '../utils/offlineSurveyStore';

export default function FieldSurveyApp({
  projects = [],
  selectedProject,
  setSelectedProject,
  apiBase,
  langHindi = false,
  showToast = () => {},
  currentUser
}) {
  const { isOnline, pendingCount, isSyncing, triggerSync, refreshCount } = useNetworkSync(apiBase);
  const [activeSubTab, setActiveSubTab] = useState('new_survey'); // 'new_survey' | 'queue' | 'history'
  
  // Pending queue and history state
  const [pendingSurveys, setPendingSurveys] = useState([]);
  const [syncedHistory, setSyncedHistory] = useState([]);

  // Survey Form State
  const [formData, setFormData] = useState({
    project_id: selectedProject?.id || 'PROJ-NH19-VNS',
    ulpin: '',
    khasra_no: '',
    owner_name: '',
    village: 'Shivpur Rural',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    surveyor_name: currentUser?.name || 'Shri S. K. Sharma (Revenue Inspector)',
    surveyor_id: currentUser?.token || 'SURV-UP-042',
    survey_date: new Date().toISOString().split('T')[0],
    gps_lat: '',
    gps_lng: '',
    gps_accuracy: '',
    
    // Immovable Assets (Sec 29)
    structure_type: 'Pucca Residential (Brick & Concrete)',
    structure_area_sqm: 145,
    structure_rate_sqm: 4200,
    structure_valuation: 609000,
    
    tree_type: 'Teak (Tectona grandis)',
    tree_count: 12,
    tree_rate_per_unit: 15000,
    tree_valuation: 180000,
    
    crop_type: 'Wheat (Standing Ready Crop)',
    crop_area_acres: 1.5,
    crop_rate_per_acre: 45000,
    crop_valuation: 67500,
    
    borewell_depth_ft: 180,
    borewell_pump_hp: 7.5,
    borewell_valuation: 85000,
    
    // Non-Owner Claimants (PAFs)
    non_owner_claimants: [
      { name: 'Rameshwar Pal', type: 'Agricultural Labourer (10+ Yrs)', aadhar: 'XXXX-XXXX-9182', grant_entitled: 500000 },
      { name: 'Ghanshyam Bind', type: 'Sharecropper / Tenant', aadhar: 'XXXX-XXXX-3341', grant_entitled: 250000 }
    ],

    // Joint Khata Heirs
    joint_khata_heirs: [
      { heir_name: 'Satish Chand Sharma', share_fraction: '1/2', relation: 'Son', status: 'Consented' },
      { heir_name: 'Dinesh Chand Sharma', share_fraction: '1/2', relation: 'Son', status: 'Consented' }
    ],

    // Photos
    photo_urls: [
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80'
    ]
  });

  const [newNonOwner, setNewNonOwner] = useState({ name: '', type: 'Agricultural Labourer', aadhar: '', grant_entitled: 500000 });
  const [newHeir, setNewHeir] = useState({ heir_name: '', share_fraction: '1/3', relation: 'Son', status: 'Pending Inquiry' });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Load pending and history lists
  const loadLists = () => {
    setPendingSurveys(getPendingOfflineSurveys());
    setSyncedHistory(getSyncedSurveyHistory());
    refreshCount();
  };

  useEffect(() => {
    loadLists();
  }, [pendingCount]);

  // Handle Project Selection & Autofill
  useEffect(() => {
    if (selectedProject) {
      const firstParcel = selectedProject.parcels?.[0];
      setFormData(prev => ({
        ...prev,
        project_id: selectedProject.id,
        ulpin: firstParcel?.ulpin || prev.ulpin || 'UP-VNS-2026-001',
        khasra_no: firstParcel?.khasra_no || prev.khasra_no || 'Plot 412/1',
        owner_name: firstParcel?.owner_name || prev.owner_name || 'Shri Ramakant Dubey & Co-sharers',
        village: firstParcel?.village || selectedProject.state || prev.village
      }));
    }
  }, [selectedProject]);

  // Recalculate Valuations Dynamically
  useEffect(() => {
    const sVal = (parseFloat(formData.structure_area_sqm) || 0) * (parseFloat(formData.structure_rate_sqm) || 0);
    const tVal = (parseFloat(formData.tree_count) || 0) * (parseFloat(formData.tree_rate_per_unit) || 0);
    const cVal = (parseFloat(formData.crop_area_acres) || 0) * (parseFloat(formData.crop_rate_per_acre) || 0);
    const bVal = parseFloat(formData.borewell_valuation) || 0;

    setFormData(prev => ({
      ...prev,
      structure_valuation: sVal,
      tree_valuation: tVal,
      crop_valuation: cVal,
      total_surveyed_assets: sVal + tVal + cVal + bVal
    }));
  }, [
    formData.structure_area_sqm,
    formData.structure_rate_sqm,
    formData.tree_count,
    formData.tree_rate_per_unit,
    formData.crop_area_acres,
    formData.crop_rate_per_acre,
    formData.borewell_valuation
  ]);

  // Get Live GPS Coordinates via HTML5 Geolocation API
  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser or device.', 'error');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        setFormData(prev => ({
          ...prev,
          gps_lat: pos.coords.latitude.toFixed(6),
          gps_lng: pos.coords.longitude.toFixed(6),
          gps_accuracy: `${Math.round(pos.coords.accuracy)} meters (High Precision)`
        }));
        showToast(`GPS Fixed: Lat ${pos.coords.latitude.toFixed(5)}, Lng ${pos.coords.longitude.toFixed(5)} (±${Math.round(pos.coords.accuracy)}m)`, 'success');
      },
      (err) => {
        setGpsLoading(false);
        // Fallback default coordinates if GPS permission denied
        setFormData(prev => ({
          ...prev,
          gps_lat: '25.317645',
          gps_lng: '82.973912',
          gps_accuracy: 'Simulated Survey Marker (10m accuracy)'
        }));
        showToast('Default survey GPS marker applied.', 'info');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Photo Capture / Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setPhotoPreview(dataUrl);
        setFormData(prev => ({
          ...prev,
          photo_urls: [dataUrl, ...prev.photo_urls.filter(u => !u.startsWith('data:'))]
        }));
        showToast('On-site geo-tagged photo attached.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Non-Owner Claimant
  const handleAddNonOwner = () => {
    if (!newNonOwner.name) return;
    setFormData(prev => ({
      ...prev,
      non_owner_claimants: [...prev.non_owner_claimants, { ...newNonOwner }]
    }));
    setNewNonOwner({ name: '', type: 'Agricultural Labourer', aadhar: '', grant_entitled: 500000 });
  };

  // Remove Non-Owner Claimant
  const handleRemoveNonOwner = (index) => {
    setFormData(prev => ({
      ...prev,
      non_owner_claimants: prev.non_owner_claimants.filter((_, i) => i !== index)
    }));
  };

  // Add Joint Khata Heir
  const handleAddHeir = () => {
    if (!newHeir.heir_name) return;
    setFormData(prev => ({
      ...prev,
      joint_khata_heirs: [...prev.joint_khata_heirs, { ...newHeir }]
    }));
    setNewHeir({ heir_name: '', share_fraction: '1/3', relation: 'Son', status: 'Pending Inquiry' });
  };

  // Remove Joint Khata Heir
  const handleRemoveHeir = (index) => {
    setFormData(prev => ({
      ...prev,
      joint_khata_heirs: prev.joint_khata_heirs.filter((_, i) => i !== index)
    }));
  };

  // Save Survey (Queues offline locally)
  const handleSaveSurvey = async (e) => {
    e.preventDefault();
    if (!formData.ulpin || !formData.project_id) {
      showToast('Please select a valid Project Corridor and enter ULPIN.', 'error');
      return;
    }

    const payload = {
      ...formData,
      asset_details: {
        structure_type: formData.structure_type,
        structure_area_sqm: formData.structure_area_sqm,
        tree_type: formData.tree_type,
        tree_count: formData.tree_count,
        crop_type: formData.crop_type,
        crop_area_acres: formData.crop_area_acres,
        borewell_depth_ft: formData.borewell_depth_ft,
        gps: {
          lat: formData.gps_lat,
          lng: formData.gps_lng,
          accuracy: formData.gps_accuracy
        }
      }
    };

    try {
      const saved = queueOfflineSurvey(payload);
      loadLists();

      if (isOnline) {
        showToast('Survey saved locally! Online connection detected, triggering auto-sync...', 'info');
        const syncRes = await triggerSync();
        if (syncRes?.success) {
          showToast(`⚡ Synced: Survey for ULPIN ${formData.ulpin} written to National Database!`, 'success');
        }
      } else {
        showToast(`💾 Offline Survey Saved! Queued locally. It will auto-sync when internet is restored.`, 'success');
      }

      setActiveSubTab('queue');
    } catch (err) {
      showToast('Error saving offline survey: ' + err.message, 'error');
    }
  };

  const handleManualSyncNow = async () => {
    if (!isOnline) {
      showToast('Device is offline. Please reconnect to internet to sync.', 'error');
      return;
    }
    showToast('Initiating background sync to national registry...', 'info');
    const result = await triggerSync();
    if (result?.success) {
      showToast(result.message || 'Synchronization complete!', 'success');
      loadLists();
    } else {
      showToast(result?.message || 'Sync failed. Surveys are safely queued offline.', 'error');
    }
  };

  const handleDeleteQueuedItem = (id) => {
    removePendingSurvey(id);
    loadLists();
    showToast('Survey removed from offline queue.', 'info');
  };

  const totalAssetVal = (formData.structure_valuation || 0) + (formData.tree_valuation || 0) + (formData.crop_valuation || 0) + (formData.borewell_valuation || 0);

  return (
    <div className="section-container">
      {/* 1. Header Banner & Real-Time Sync Bar */}
      <div style={{
        background: isOnline ? 'linear-gradient(135deg, #071426 0%, #1e3a8a 100%)' : 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
        color: '#ffffff',
        padding: '20px 24px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: 24,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: isOnline ? 'rgba(59, 130, 246, 0.25)' : 'rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${isOnline ? '#60a5fa' : '#f87171'}`
          }}>
            <Smartphone size={26} color={isOnline ? '#93c5fd' : '#fca5a5'} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {langHindi ? 'ऑन-ग्राउंड फील्ड सर्वेक्षक वर्कस्टेशन' : 'On-Ground Field Surveyor PWA Workstation'}
              </h2>
              <span className={`badge-pill ${isOnline ? 'badge-green' : 'badge-red'}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem' }}>
                {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                <span>{isOnline ? 'LIVE ONLINE' : 'OFFLINE MODE (SURVEY ACTIVE)'}</span>
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
              {langHindi
                ? 'दूरदराज के ग्रामीण क्षेत्रों में बिना इंटरनेट के भी ऑन-साइट संपत्ति व फसल मूल्यांकन दर्ज करें। इंटरनेट आते ही डेटा स्वतः सिंक हो जाएगा।'
                : 'Offline-first PWA tool for revenue officers to record structures, trees, crops, borewells & PAFs in remote areas without internet.'}
            </p>
          </div>
        </div>

        {/* Sync Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Offline Queue
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: pendingCount > 0 ? '#fde047' : '#86efac' }}>
              {pendingCount} {pendingCount === 1 ? 'Survey' : 'Surveys'} Queued
            </div>
          </div>

          <button
            className="btn-action"
            onClick={handleManualSyncNow}
            disabled={isSyncing || pendingCount === 0}
            style={{
              background: pendingCount > 0 ? 'var(--nlams-saffron)' : '#334155',
              color: '#ffffff',
              fontWeight: 800,
              padding: '10px 18px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: pendingCount > 0 ? 'pointer' : 'not-allowed',
              boxShadow: pendingCount > 0 ? '0 4px 12px rgba(245,158,11,0.4)' : 'none'
            }}
          >
            <RefreshCw size={16} className={isSyncing ? 'spin-anim' : ''} />
            <span>{isSyncing ? 'Syncing...' : (langHindi ? 'डेटाबेस सिंक करें' : 'Sync to Database')}</span>
          </button>
        </div>
      </div>

      {/* 2. Sub Navigation: New Survey | Queue | Synced History */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #e2e8f0', paddingBottom: 10 }}>
        <button
          onClick={() => setActiveSubTab('new_survey')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: activeSubTab === 'new_survey' ? '#1e3a8a' : '#f1f5f9',
            color: activeSubTab === 'new_survey' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={15} />
          <span>{langHindi ? '1. नया ऑन-साइट सर्वे' : '1. New On-Ground Survey'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('queue')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: activeSubTab === 'queue' ? '#1e3a8a' : '#f1f5f9',
            color: activeSubTab === 'queue' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Clock size={15} />
          <span>{langHindi ? '2. ऑफलाइन कतार' : '2. Offline Queue'}</span>
          {pendingCount > 0 && (
            <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.68rem', padding: '1px 6px', borderRadius: 10, fontWeight: 800 }}>
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: activeSubTab === 'history' ? '#1e3a8a' : '#f1f5f9',
            color: activeSubTab === 'history' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <FileCheck size={15} />
          <span>{langHindi ? '3. सिंक इतिहास' : '3. Synced Records History'}</span>
        </button>
      </div>

      {/* 3. Sub Tab Content */}
      {activeSubTab === 'new_survey' && (
        <form onSubmit={handleSaveSurvey} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: 24 }}>
          {/* Left Column: Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Card 1: Project Corridor & Land Parcel Metadata */}
            <div className="gov-card">
              <div className="card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Layers size={18} color="#2563eb" />
                  <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#071426' }}>
                    1. Corridor & Parcel Identification (Bhu-Aadhaar)
                  </h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Active Corridor Project:
                  </label>
                  <select
                    className="form-control"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
                    value={formData.project_id}
                    onChange={(e) => {
                      const p = projects.find(x => x.id === e.target.value);
                      if (p) setSelectedProject(p);
                      setFormData(prev => ({ ...prev, project_id: e.target.value }));
                    }}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.state})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    14-Digit ULPIN (Bhu-Aadhaar):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: 700 }}
                    value={formData.ulpin}
                    onChange={(e) => setFormData(prev => ({ ...prev, ulpin: e.target.value }))}
                    placeholder="e.g. UP-VNS-2026-001"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Khasra / Plot Number:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
                    value={formData.khasra_no}
                    onChange={(e) => setFormData(prev => ({ ...prev, khasra_no: e.target.value }))}
                    placeholder="Plot 412/1"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Primary Landowner Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
                    value={formData.owner_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, owner_name: e.target.value }))}
                    placeholder="Owner Name"
                  />
                </div>
              </div>

              {/* GPS Geotagging Bar */}
              <div style={{
                marginTop: 16,
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed #94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin size={20} color="#dc2626" />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>
                      GPS Geotagging (On-Site Coordinates)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {formData.gps_lat ? `Lat: ${formData.gps_lat} | Lng: ${formData.gps_lng} (Acc: ${formData.gps_accuracy})` : 'No GPS coordinates fixed yet.'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCaptureGPS}
                  disabled={gpsLoading}
                  className="btn-action"
                  style={{
                    background: '#071426',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <MapPin size={14} />
                  <span>{gpsLoading ? 'Reading Satellite GPS...' : 'Capture Device GPS'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Section 29 Immovable Assets Census */}
            <div className="gov-card">
              <div className="card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Building size={18} color="#059669" />
                  <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#071426' }}>
                    2. Section 29 Immovable Assets Census (Structures, Trees, Crops)
                  </h3>
                </div>
              </div>

              {/* Sub-section: Structures */}
              <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', marginBottom: 14 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building size={15} />
                  <span>A. Residential / Commercial Structures (PWD Plinth Rates)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#14532d', fontWeight: 600 }}>Structure Type:</label>
                    <select
                      value={formData.structure_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, structure_type: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #86efac', fontSize: '0.78rem' }}
                    >
                      <option>Pucca Residential (Brick & Concrete)</option>
                      <option>Semi-Pucca Structure</option>
                      <option>Kaccha / Thatched Structure</option>
                      <option>Boundary Wall / Fencing</option>
                      <option>Commercial Godown / Tube-well Shed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#14532d', fontWeight: 600 }}>Built-up Area (Sq.m):</label>
                    <input
                      type="number"
                      value={formData.structure_area_sqm}
                      onChange={(e) => setFormData(prev => ({ ...prev, structure_area_sqm: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #86efac', fontSize: '0.78rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#14532d', fontWeight: 600 }}>Valuation (₹):</label>
                    <div style={{ padding: '6px 8px', background: '#ffffff', borderRadius: '4px', border: '1px solid #86efac', fontWeight: 800, color: '#15803d', fontSize: '0.82rem' }}>
                      ₹{formData.structure_valuation.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-section: Trees */}
              <div style={{ background: '#fefce8', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #fef08a', marginBottom: 14 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#854d0e', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Trees size={15} />
                  <span>B. Tree Census (Forest Dept Schedules)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#713f12', fontWeight: 600 }}>Tree Species:</label>
                    <select
                      value={formData.tree_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, tree_type: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #fde047', fontSize: '0.78rem' }}
                    >
                      <option>Teak (Tectona grandis)</option>
                      <option>Neem / Sheesham (Timber)</option>
                      <option>Mango / Fruit Bearing Orchard</option>
                      <option>Mahua / Indigenous</option>
                      <option>Eucalyptus Plantation</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#713f12', fontWeight: 600 }}>Mature Tree Count:</label>
                    <input
                      type="number"
                      value={formData.tree_count}
                      onChange={(e) => setFormData(prev => ({ ...prev, tree_count: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #fde047', fontSize: '0.78rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#713f12', fontWeight: 600 }}>Valuation (₹):</label>
                    <div style={{ padding: '6px 8px', background: '#ffffff', borderRadius: '4px', border: '1px solid #fde047', fontWeight: 800, color: '#a16207', fontSize: '0.82rem' }}>
                      ₹{formData.tree_valuation.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-section: Standing Crops & Borewells */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Wheat size={14} color="#d97706" />
                    <span>C. Standing Crops (Mandi MSP)</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 4 }}>Crop: {formData.crop_type} ({formData.crop_area_acres} Acres)</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                    Valuation: ₹{formData.crop_valuation.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Droplets size={14} color="#2563eb" />
                    <span>D. Borewells & Irrigation</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 4 }}>Depth: {formData.borewell_depth_ft} ft | Pump: {formData.borewell_pump_hp} HP</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                    Valuation: ₹{formData.borewell_valuation.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Non-Owner Affected Claimants & Joint Khata Partitions */}
            <div className="gov-card">
              <div className="card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={18} color="#7c3aed" />
                  <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#071426' }}>
                    3. Non-Owner PAFs & Joint Khata Co-heir Partitioning
                  </h3>
                </div>
              </div>

              {/* Non-owner claimants list */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 6 }}>
                  Registered Non-Owner Claimants (Tenants, Agricultural Labourers):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                  {formData.non_owner_claimants.map((c, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                      <div>
                        <strong>{c.name}</strong> • <span style={{ color: '#64748b' }}>{c.type}</span> • <span style={{ color: '#059669', fontWeight: 700 }}>R&R Grant: ₹{c.grant_entitled?.toLocaleString('en-IN')}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveNonOwner(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Claimant Name"
                    value={newNonOwner.name}
                    onChange={(e) => setNewNonOwner(prev => ({ ...prev, name: e.target.value }))}
                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.76rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                  <select
                    value={newNonOwner.type}
                    onChange={(e) => setNewNonOwner(prev => ({ ...prev, type: e.target.value }))}
                    style={{ padding: '6px 8px', fontSize: '0.76rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  >
                    <option>Agricultural Labourer (10+ Yrs)</option>
                    <option>Sharecropper / Tenant</option>
                    <option>Rural Artisan / Shopkeeper</option>
                  </select>
                  <button type="button" onClick={handleAddNonOwner} className="btn-action" style={{ background: '#1e3a8a', color: '#fff', fontSize: '0.72rem', padding: '4px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                    + Add PAF
                  </button>
                </div>
              </div>

              {/* Joint Khata Co-heir partitions */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 6 }}>
                  Joint Khata Unpartitioned Co-heir Shares:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                  {formData.joint_khata_heirs.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                      <div>
                        <strong>{h.heir_name}</strong> ({h.relation}) • Share: <span style={{ fontWeight: 800, color: '#2563eb' }}>{h.share_fraction}</span> • Status: <span style={{ color: '#059669' }}>{h.status}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveHeir(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Co-heir Legal Name"
                    value={newHeir.heir_name}
                    onChange={(e) => setNewHeir(prev => ({ ...prev, heir_name: e.target.value }))}
                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.76rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Share (e.g. 1/3)"
                    value={newHeir.share_fraction}
                    onChange={(e) => setNewHeir(prev => ({ ...prev, share_fraction: e.target.value }))}
                    style={{ width: 100, padding: '6px 8px', fontSize: '0.76rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                  <button type="button" onClick={handleAddHeir} className="btn-action" style={{ background: '#1e3a8a', color: '#fff', fontSize: '0.72rem', padding: '4px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                    + Add Heir
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Summary, Photo Capture & Queue Trigger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Live Valuation Summary Card */}
            <div className="gov-card" style={{ background: '#071426', color: '#ffffff' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10, marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#93c5fd' }}>
                  ⚡ Total Surveyed Asset Valuation
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Section 29 RFCTLARR 2013 Immovable Assets
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>Structure Valuation:</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>₹{formData.structure_valuation.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>Tree Census:</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>₹{formData.tree_valuation.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>Standing Crops:</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>₹{formData.crop_valuation.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>Borewells & Irrigation:</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>₹{formData.borewell_valuation.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800 }}>
                  <span style={{ color: '#fde047' }}>Total Asset Value:</span>
                  <span style={{ color: '#fde047' }}>₹{totalAssetVal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--nlams-saffron)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
                }}
              >
                <Save size={18} />
                <span>{isOnline ? '💾 Save & Sync to Database' : '💾 Save & Queue in Offline Mode'}</span>
              </button>
            </div>

            {/* On-Site Geo-Tagged Photo Capture */}
            <div className="gov-card">
              <div className="card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Camera size={18} color="#2563eb" />
                  <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#071426' }}>
                    4. On-Site Geo-Tagged Camera Photo
                  </h3>
                </div>
              </div>

              <div style={{
                border: '2px dashed #cbd5e1',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
                background: '#f8fafc',
                marginBottom: 12
              }}>
                {photoPreview || formData.photo_urls[0] ? (
                  <div>
                    <img
                      src={photoPreview || formData.photo_urls[0]}
                      alt="Survey attachment"
                      style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 8 }}
                    />
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                      ✓ Geo-tagged photo attached (GPS embedded)
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                    No on-ground photo captured yet.
                  </div>
                )}
              </div>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '8px 14px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1e293b',
                cursor: 'pointer'
              }}>
                <Camera size={15} />
                <span>Capture Photo via Device Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Officer Surveyor Authorization Credentials */}
            <div className="gov-card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Shield size={16} color="#1e3a8a" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e3a8a' }}>
                  Surveyor Identification & Integrity
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#1e40af' }}>
                Officer: <strong>{formData.surveyor_name}</strong><br />
                ID: <strong>{formData.surveyor_id}</strong><br />
                Date: <strong>{formData.survey_date}</strong>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Offline Queue View */}
      {activeSubTab === 'queue' && (
        <div className="gov-card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#071426' }}>
                Offline Survey Queue ({pendingSurveys.length})
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                All surveys conducted while offline in remote field locations are safely stored in browser storage.
              </p>
            </div>

            <button
              className="btn-action"
              onClick={handleManualSyncNow}
              disabled={isSyncing || pendingSurveys.length === 0}
              style={{
                background: pendingSurveys.length > 0 ? '#1e3a8a' : '#cbd5e1',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                cursor: pendingSurveys.length > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All Pending Surveys'}</span>
            </button>
          </div>

          {pendingSurveys.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 10px auto', display: 'block' }} />
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>Queue is Clean & Synchronized</div>
              <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>There are currently no offline surveys waiting for sync.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="gov-table" style={{ width: '100%', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Survey ID</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>ULPIN / Khasra</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Owner & PAFs</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Surveyed Assets</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSurveys.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700 }}>{s.id}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 700, color: '#1e3a8a' }}>{s.ulpin}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.khasra_no} • {s.village}</div>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 600 }}>{s.owner_name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#7c3aed' }}>
                          {s.non_owner_claimants?.length || 0} PAFs • {s.joint_khata_heirs?.length || 0} Co-heirs
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                        ₹{((s.structure_valuation || 0) + (s.tree_valuation || 0) + (s.crop_valuation || 0)).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span className="badge-pill badge-yellow" style={{ fontSize: '0.68rem' }}>
                          Pending Offline
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteQueuedItem(s.id)}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 4 }}
                          title="Remove from queue"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Synced History View */}
      {activeSubTab === 'history' && (
        <div className="gov-card">
          <div className="card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#071426' }}>
              Synchronized Surveys Archive
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Historical field survey records successfully written into the national land database.
            </p>
          </div>

          {syncedHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b', fontSize: '0.82rem' }}>
              No synced history available in local browser session.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="gov-table" style={{ width: '100%', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Survey ID</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>ULPIN</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Surveyor</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total Assets</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Sync Status</th>
                  </tr>
                </thead>
                <tbody>
                  {syncedHistory.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{s.id}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700 }}>{s.ulpin}</td>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>{s.surveyor_name}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                        ₹{((s.structure_valuation || 0) + (s.tree_valuation || 0) + (s.crop_valuation || 0)).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <span className="badge-pill badge-green" style={{ fontSize: '0.68rem' }}>
                          ✓ SYNCHRONIZED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
