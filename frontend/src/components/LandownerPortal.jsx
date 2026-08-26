import React from 'react';
import { Search, FileText, HelpCircle } from 'lucide-react';

export default function LandownerPortal({
  citizenQuery,
  setCitizenQuery,
  citizenResults,
  handleCitizenSearch,
  setAwardSlipParcel,
  setNewObjectionForm,
  setActiveModal,
  setActiveTab,
  t,
  langHindi
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.navLandowner}</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {langHindi ? 'भू-स्वामी नागरिक सेवा पोर्टल' : 'Citizen self-service portal to search parcels, view compensation slips, and file objections'}
          </span>
        </div>
        <button className="btn-action btn-outline" style={{ fontSize: '0.72rem' }} onClick={() => setActiveTab('home')}>
          ← {t.gatewayHub}
        </button>
      </div>

      <div className="section-panel-card">
        <div className="panel-card-head">
          <div>
            <h3 className="panel-card-title">
              <Search size={16} color="#071426" />
              <span>{langHindi ? 'भू-आधार नागरिक खोज पोर्टल' : 'Citizen & Farmer Bhu-Aadhaar Tracking Portal'}</span>
            </h3>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
              Open Public Query Interface under GIGW 3.0 Guidelines
            </div>
          </div>
          <span className="badge-pill badge-blue">Public Access Portal</span>
        </div>

        <div className="panel-card-body">
          <form onSubmit={(e) => handleCitizenSearch(e)} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input 
              type="text" 
              placeholder={langHindi ? "14-अंकीय भू-आधार (ULPIN), खसरा संख्या या भू-स्वामी का नाम दर्ज करें..." : "Enter 14-Digit ULPIN, Khasra/Survey No, or Landowner Name (e.g. Ramcharan, Patil, Gurdeep, Manjunath)..."}
              value={citizenQuery}
              onChange={(e) => setCitizenQuery(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}
            />
            <button type="submit" className="btn-action btn-navy" style={{ padding: '0 20px' }}>
              <Search size={14} />
              <span>{t.searchRecords}</span>
            </button>
          </form>

          {/* Quick Try Sample Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{t.quickSearch}</span>
            {[
              { label: 'Ramcharan (Varanasi)', q: 'Ramcharan' },
              { label: 'Eknath Patil (Nagpur)', q: 'Patil' },
              { label: 'Manjunath (Bengaluru)', q: 'Manjunath' },
              { label: 'Gurdeep Singh (Ludhiana)', q: 'Gurdeep' }
            ].map(chip => (
              <button
                key={chip.q}
                type="button"
                className="access-btn"
                style={{ color: '#071426', borderColor: '#cbd5e1', background: '#f1f5f9' }}
                onClick={() => {
                  setCitizenQuery(chip.q);
                  handleCitizenSearch(null, chip.q);
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {citizenResults.length === 0 ? (
            <div style={{ background: '#f8fafc', padding: 30, borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px dashed var(--border-dark)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: 6 }}>🔍</div>
              <strong style={{ color: '#071426', display: 'block', marginBottom: 4, fontSize: '0.95rem' }}>{t.searchPrompt}</strong>
              <p style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
                {t.searchDesc}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {citizenResults.map((item, idx) => (
                <div key={idx} style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-main)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: '1rem', color: '#071426' }}>{item.parcel.owner_name}</strong>
                        <span className="badge-pill badge-green">ULPIN: {item.parcel.ulpin}</span>
                        <span className="badge-pill badge-saffron">{item.parcel.local_record_no}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>
                        Corridor: <strong>{item.project_title}</strong> • Stage: <strong>{item.current_stage}</strong>
                      </div>
                    </div>

                    <span className={`badge-pill ${item.parcel.encumbrance_locked ? 'badge-red' : 'badge-green'}`}>
                      {item.encumbrance_status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
                    <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4 }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Acquired Area</span>
                      <strong style={{ fontSize: '0.85rem', color: '#071426' }}>{item.parcel.acquired_area_sqm} sq.m</strong>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 10, borderRadius: 4 }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Gazette Publication ID</span>
                      <strong style={{ fontSize: '0.78rem', color: '#2563eb' }}>{item.sec11_gazette_id || "Under Preparation"}</strong>
                    </div>
                    <div style={{ background: '#ecfdf5', padding: 10, borderRadius: 4, border: '1px solid #bbf7d0' }}>
                      <span style={{ fontSize: '0.65rem', color: '#166534', display: 'block' }}>Statutory Compensation Award</span>
                      <strong style={{ fontSize: '1.05rem', color: '#059669' }}>₹ {item.valuation_estimate.gross_total_award.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button 
                      className="btn-action btn-outline" 
                      style={{ fontSize: '0.72rem', padding: '5px 12px' }}
                      onClick={() => {
                        setAwardSlipParcel(item);
                        setActiveModal('awardSlip');
                      }}
                    >
                      <FileText size={12} />
                      <span>{t.viewAwardSlip}</span>
                    </button>

                    <button 
                      className="btn-action btn-saffron" 
                      style={{ fontSize: '0.72rem', padding: '5px 12px' }}
                      onClick={() => {
                        setNewObjectionForm({
                          claimant_name: item.parcel.owner_name,
                          contact_phone: '',
                          ulpin: item.parcel.ulpin,
                          grounds_category: 'Inadequate Valuation',
                          objection_details: ''
                        });
                        setActiveModal('fileObjection');
                      }}
                    >
                      <HelpCircle size={12} />
                      <span>{t.fileObjection}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
