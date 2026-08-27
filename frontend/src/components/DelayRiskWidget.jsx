import React from 'react';
import { Zap, BarChart3 } from 'lucide-react';

export default function DelayRiskWidget({
  selectedProject,
  selectedProjectId,
  setSelectedProjectId,
  projects,
  projectRisk,
  allDelayRisks,
  handleTriggerAIMitigation,
  t,
  langHindi
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.navAIRisk}</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {langHindi ? 'बहु-चरणीय एआई विलंब जोखिम पूर्वानुमान (Scikit-Learn Random Forest) व सुधारात्मक सुझाव' : 'Multi-variable predictive intelligence analyzing stage dwell time, disputes, and R&R bottlenecks'}
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

      {projectRisk && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginBottom: 18 }}>
          {/* Risk Score Card */}
          <div className="section-panel-card" style={{ borderTop: `4px solid ${projectRisk.risk_level === 'CRITICAL' ? '#dc2626' : (projectRisk.risk_level === 'HIGH' ? '#ea580c' : '#059669')}` }}>
            <div className="panel-card-head">
              <h3 className="panel-card-title">
                <Zap size={16} color="#dc2626" />
                <span>{langHindi ? 'विलंब-जोखिम मूल्यांकन:' : 'Delay-Risk Assessment:'} {projectRisk.project_title}</span>
              </h3>
              <span className={`badge-pill badge-${projectRisk.risk_level.toLowerCase()}`}>
                {projectRisk.risk_level} {langHindi ? 'जोखिम' : 'RISK'}
              </span>
            </div>

            <div className="panel-card-body">
              <div className="risk-meter-container" style={{ marginBottom: 16 }}>
                <div 
                  className="risk-circle-dial"
                  style={{
                    background: projectRisk.risk_level === 'CRITICAL' ? '#fef2f2' : (projectRisk.risk_level === 'HIGH' ? '#fff7ed' : '#ecfdf5'),
                    color: projectRisk.risk_level === 'CRITICAL' ? '#991b1b' : (projectRisk.risk_level === 'HIGH' ? '#c2410c' : '#047857'),
                    border: `3px solid ${projectRisk.risk_level === 'CRITICAL' ? '#f87171' : (projectRisk.risk_level === 'HIGH' ? '#fb923c' : '#34d399')}`
                  }}
                >
                  <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{projectRisk.risk_score}</span>
                  <span style={{ fontSize: '0.62rem' }}>{langHindi ? 'स्कोर' : 'SCORE'}</span>
                </div>

                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#071426' }}>
                    {t.forecastLag} +{projectRisk.predicted_delay_months} {langHindi ? 'महीने' : 'Months'} ({projectRisk.predicted_delay_days || Math.round(projectRisk.predicted_delay_months * 30)} {langHindi ? 'दिन' : 'Days'})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                    {t.bottleneckStage} <strong>{projectRisk.bottleneck_stage}</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <strong style={{ fontSize: '0.8rem', color: '#071426', display: 'block', marginBottom: 6 }}>
                  {t.keyRiskDrivers}
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {projectRisk.risk_factors.map((f, i) => (
                    <div key={i} style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '8px 12px', borderRadius: 4, fontSize: '0.72rem', color: '#991b1b' }}>
                      ⚠️ {f}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.8rem', color: '#071426', display: 'block', marginBottom: 6 }}>
                  {t.prescriptiveActions}
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {projectRisk.prescriptive_mitigations.map((m, i) => (
                    <div key={i} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '8px 12px', borderRadius: 4, fontSize: '0.72rem', color: '#065f46', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>💡 {m}</div>
                      <button 
                        type="button" 
                        className="btn-action btn-green" 
                        style={{ padding: '3px 8px', fontSize: '0.68rem', flexShrink: 0 }}
                        onClick={() => handleTriggerAIMitigation(m)}
                      >
                        {t.execute}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Project Comparison */}
          <div className="section-panel-card">
            <div className="panel-card-head">
              <h3 className="panel-card-title">
                <BarChart3 size={16} color="#071426" />
                <span>{langHindi ? 'कॉरिडोर जोखिम तुलना' : 'Corridor Risk Comparison'}</span>
              </h3>
              <span className="badge-pill badge-navy">{langHindi ? 'सभी परियोजनाएं' : 'All Projects'}</span>
            </div>

            <div className="panel-card-body" style={{ padding: '12px 16px' }}>
              {allDelayRisks.map(r => (
                <div key={r.project_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #edf2f7' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#071426' }}>{r.project_title}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{langHindi ? 'अनुमानित विलंब:' : 'Predicted Delay:'} +{r.predicted_delay_months} {langHindi ? 'माह' : 'mos'}</div>
                  </div>
                  <span className={`badge-pill badge-${r.risk_level.toLowerCase()}`}>
                    {r.risk_level} ({r.risk_score}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
