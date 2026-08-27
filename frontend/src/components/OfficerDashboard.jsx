import React from 'react';
import { Building2, MapPin, IndianRupee, Lock, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export default function OfficerDashboard({
  metrics,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  selectedProject,
  projectRisk,
  setActiveTab,
  t,
  langHindi
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.navDashboard}</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {langHindi ? 'सक्रिय कॉरिडोर परियोजनाओं का कार्यकारी अवलोकन' : 'Executive overview across active infrastructure corridors'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{t.activeProjectLabel}</span>
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

      {/* KPI Cards */}
      <div className="kpi-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-metric-box border-blue">
          <div className="kpi-head">
            <span className="kpi-head-label">{t.activeCorridors}</span>
            <div className="kpi-head-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Building2 size={15} />
            </div>
          </div>
          <div className="kpi-big-num">{metrics?.total_active_projects || 0}</div>
          <div className="kpi-caption">NHAI, DFCCIL, MSRDC, KRDCL</div>
        </div>

        <div className="kpi-metric-box border-saffron">
          <div className="kpi-head">
            <span className="kpi-head-label">{t.notifiedLandArea}</span>
            <div className="kpi-head-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
              <MapPin size={15} />
            </div>
          </div>
          <div className="kpi-big-num">{metrics?.total_notified_area_ha || 0} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ha</span></div>
          <div className="kpi-caption">{metrics?.total_cadastral_parcels_tracked || 0} ULPINs Linked</div>
        </div>

        <div className="kpi-metric-box border-green">
          <div className="kpi-head">
            <span className="kpi-head-label">{t.pfmsDbtDisbursed}</span>
            <div className="kpi-head-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <IndianRupee size={15} />
            </div>
          </div>
          <div className="kpi-big-num">₹ {metrics?.total_compensation_disbursed_cr || 0} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Cr</span></div>
          <div className="kpi-caption">
            <span style={{ color: '#059669', fontWeight: 700 }}>{metrics?.dbt_disbursal_ratio_pct || 0}% </span>
            of ₹{metrics?.total_compensation_assessed_cr || 0} Cr Assessed
          </div>
        </div>

        <div className="kpi-metric-box border-navy">
          <div className="kpi-head">
            <span className="kpi-head-label">{t.avgPossession}</span>
            <div className="kpi-head-icon" style={{ background: '#f1f5f9', color: '#071426' }}>
              <ShieldCheck size={15} />
            </div>
          </div>
          <div className="kpi-big-num">{metrics?.average_physical_possession_pct || 0}%</div>
          <div className="kpi-caption">{metrics?.active_disputes_and_references || 0} {langHindi ? 'सक्रिय अदालती वाद' : 'Active Court Cases'}</div>
        </div>
      </div>

      {/* Grid Drilldown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Project Portfolios */}
        <div className="section-panel-card">
          <div className="panel-card-head">
            <h3 className="panel-card-title">
              <Building2 size={16} color="#071426" />
              <span>{langHindi ? 'सक्रिय अवसंरचना कॉरिडोर' : 'Active Infrastructure Corridors'}</span>
            </h3>
            <span className="badge-pill badge-green">4 Tracked Projects</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="nlams-data-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Sr. No.</th>
                  <th>Corridor Title</th>
                  <th>Agency & Act</th>
                  <th>State</th>
                  <th>Stage</th>
                  <th>Disbursed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, idx) => (
                  <tr key={p.id} style={{ background: selectedProjectId === p.id ? '#f0f7ff' : 'transparent' }}>
                    <td>
                      <span className="badge-pill badge-navy" style={{ fontWeight: 800 }}>{idx + 1}</span>
                    </td>
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
                      <div style={{ width: 100, height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 4 }}>
                        <div style={{ width: `${p.stage_progress_pct}%`, height: '100%', background: '#059669', borderRadius: 2 }} />
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#059669' }}>₹{p.total_compensation_disbursed_cr}</strong> / ₹{p.total_compensation_assessed_cr} Cr
                    </td>
                    <td>
                      <button 
                        className="btn-action btn-outline" 
                        style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setActiveTab('workbench');
                        }}
                      >
                        <span>Workflow</span> <ArrowRight size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Risk Radar */}
        <div className="section-panel-card">
          <div className="panel-card-head">
            <h3 className="panel-card-title">
              <Zap size={16} color="#dc2626" />
              <span>{langHindi ? 'विलंब-जोखिम पूर्वानुमान' : 'Delay-Risk Forecast'}</span>
            </h3>
            <button className="btn-action btn-outline" style={{ padding: '3px 7px', fontSize: '0.68rem' }} onClick={() => setActiveTab('airisk')}>
              Open Radar
            </button>
          </div>

          <div className="panel-card-body" style={{ padding: '14px' }}>
            {projectRisk ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#071426' }}>{selectedProject?.title}</strong>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Current: {projectRisk.bottleneck_stage}</div>
                  </div>
                  <span className={`badge-pill badge-${projectRisk.risk_level.toLowerCase()}`}>
                    {projectRisk.risk_level} ({projectRisk.risk_score}%)
                  </span>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700 }}>
                    {t.forecastLag} +{projectRisk.predicted_delay_months} Months
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#7f1d1d', marginTop: 3 }}>
                    {projectRisk.risk_factors[0]}
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#334155' }}>
                  <strong style={{ color: '#071426', display: 'block', marginBottom: 3 }}>Prescriptive Action:</strong>
                  <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4, border: '1px solid var(--border-main)' }}>
                    💡 {projectRisk.prescriptive_mitigations[0]}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 16, color: '#64748b' }}>Analyzing corridor parameters...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
