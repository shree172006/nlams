import React, { useState } from 'react';
import { Sliders, Calculator, RefreshCw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ValuationCalculator({
  calcInputs,
  setCalcInputs,
  calcResult,
  runCalculator,
  showToast,
  setActiveTab,
  t,
  langHindi,
  isOfficer
}) {
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSubmitCalculate = async (e) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    if (runCalculator) {
      await runCalculator();
    }
    setTimeout(() => {
      setIsCalculating(false);
      if (showToast) {
        showToast(
          langHindi
            ? 'भूमि अर्जन अधिनियम 2013 के तहत वैधानिक मुआवजा सफलतापूर्वक परिकलित!'
            : 'Statutory Compensation Calculated successfully under RFCTLARR Act 2013!',
          'success'
        );
      }
    }, 250);
  };

  const handleResetDefaults = () => {
    setCalcInputs({
      owner_name: 'Shri Ramcharan Yadav',
      acquired_area_sqm: 3500,
      land_type: 'RURAL_REMOTE',
      circle_rate_per_sqm: 1850,
      avg_registered_sale_rate_per_sqm: 2400,
      ppp_consented_rate_per_sqm: 0,
      structure_valuation: 0,
      tree_valuation: 0,
      crop_valuation: 0,
      notification_date: '2025-05-15',
      award_date: '2026-03-01'
    });
    if (showToast) {
      showToast('Reset to standard statutory evaluation benchmark.', 'info');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>
            {isOfficer ? (langHindi ? '8. वैधानिक मुआवजा सैंडबॉक्स' : '8. Statutory Valuation Sandbox') : (langHindi ? '3. मुआवजा कैलकुलेटर' : '3. Compensation Calculator')}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {langHindi ? 'भूमि अर्जन अधिनियम 2013 प्रथम अनुसूची (धारा 26 से 30) एवं NH Act 1956' : 'RFCTLARR Act 2013 First Schedule (Sections 26 to 30) & NH Act 1956 (Sec 3G)'}
          </span>
        </div>
        <button className="btn-action btn-outline" style={{ fontSize: '0.72rem' }} onClick={() => setActiveTab('home')}>
          ← {t.gatewayHub}
        </button>
      </div>

      {/* Visual Formula Pipeline Banner */}
      <div style={{ background: 'linear-gradient(90deg, #0b1e36 0%, #17375e 100%)', borderRadius: 'var(--radius-md)', padding: '16px 20px', color: '#ffffff', marginBottom: 18, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fba94b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
          {langHindi ? 'भूमि अर्जन अधिनियम 2013 प्रथम अनुसूची गणितीय सूत्र' : 'Statutory First Schedule Mathematical Formulation'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, fontSize: '0.8rem', fontFamily: 'monospace' }}>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: 4 }}>
            {langHindi ? '(बाजार दर × गुणक)' : '(Base MV × Factor)'}
          </span>
          <span style={{ color: '#f97316', fontWeight: 800 }}>+</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: 4 }}>
            {langHindi ? 'परिसंपत्तियां' : 'Attached Assets'}
          </span>
          <span style={{ color: '#f97316', fontWeight: 800 }}>=</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: 4, color: '#93c5fd' }}>
            {langHindi ? 'मूल प्रतिकर' : 'Base Compensation'}
          </span>
          <span style={{ color: '#f97316', fontWeight: 800 }}>+</span>
          <span style={{ background: 'rgba(37,99,235,0.3)', padding: '3px 8px', borderRadius: 4, color: '#bfdbfe' }}>
            {langHindi ? '100% सोलेशियम' : '100% Solatium'}
          </span>
          <span style={{ color: '#f97316', fontWeight: 800 }}>+</span>
          <span style={{ background: 'rgba(37,99,235,0.3)', padding: '3px 8px', borderRadius: 4, color: '#bfdbfe' }}>
            {langHindi ? '12% वार्षिक ब्याज' : '12% p.a. Addl'}
          </span>
          <span style={{ color: '#22c55e', fontWeight: 800 }}>➔</span>
          <span style={{ background: '#059669', padding: '3px 10px', borderRadius: 4, color: '#ffffff', fontWeight: 700 }}>
            {langHindi ? 'कुल देय पंचाट' : 'Gross Total Award'}
          </span>
        </div>
      </div>

      <div className="section-panel-card">
        <div className="panel-card-head">
          <div>
            <h3 className="panel-card-title">
              <Sliders size={16} color="#071426" />
              <span>{langHindi ? 'पारस्परिक मूल्यांकन सैंडबॉक्स' : 'Interactive Parameter Sandbox'}</span>
            </h3>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
              {langHindi ? 'मानक मानों को बदलकर तत्काल पारदर्शी वैधानिक मुआवजा गणना देखें।' : 'Adjust inputs and live sliders to observe instant transparent statutory award recalculation.'}
            </div>
          </div>
          <span className="badge-pill badge-green">{langHindi ? 'IEEE 754 ऑडिटेड' : 'IEEE 754 Audited'}</span>
        </div>

        <div className="panel-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
            {/* Input form */}
            <form onSubmit={handleSubmitCalculate} style={{ background: '#f8fafc', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.85rem', color: '#071426', margin: 0 }}>{langHindi ? '1. पार्सल मानक दर्ज करें' : '1. Enter Parcel Parameters'}</h4>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="btn-action btn-outline"
                  style={{ fontSize: '0.7rem', padding: '4px 10px', gap: 5, color: '#071426', borderColor: '#cbd5e1' }}
                  title="Reset to statutory baseline defaults"
                >
                  <RefreshCw size={11} />
                  <span>{langHindi ? 'मानक मान रीसेट करें' : 'Reset to Statutory Baseline'}</span>
                </button>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'भू-स्वामी का नाम' : 'Landholder Name'}</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                  value={calcInputs.owner_name} 
                  onChange={(e) => setCalcInputs({ ...calcInputs, owner_name: e.target.value })} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'अधिग्रहित क्षेत्रफल (वर्ग मीटर)' : 'Acquired Area (sq.m)'}</label>
                  <input 
                    type="number" 
                    min="1"
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.acquired_area_sqm}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCalcInputs({ ...calcInputs, acquired_area_sqm: isNaN(val) ? '' : Math.max(1, val) });
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'स्थान व ग्रामीण गुणक' : 'Location & Multiplier'}</label>
                  <select 
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.land_type}
                    onChange={(e) => setCalcInputs({ ...calcInputs, land_type: e.target.value })}
                  >
                    <option value="URBAN">{langHindi ? 'शहरी क्षेत्र (1.0x)' : 'Urban (1.0x)'}</option>
                    <option value="RURAL_CLOSE">{langHindi ? 'ग्रामीण 0-10 किमी (1.25x)' : 'Rural 0-10 km (1.25x)'}</option>
                    <option value="RURAL_MID">{langHindi ? 'ग्रामीण 10-20 किमी (1.50x)' : 'Rural 10-20 km (1.50x)'}</option>
                    <option value="RURAL_REMOTE">{langHindi ? 'दूरस्थ ग्रामीण >20 किमी (2.00x)' : 'Rural Remote >20 km (2.00x)'}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'सर्किल दर (₹/वर्ग मी.)' : 'Circle Rate (₹/sq.m)'}</label>
                  <input 
                    type="number" 
                    min="1"
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.circle_rate_per_sqm} 
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCalcInputs({ ...calcInputs, circle_rate_per_sqm: isNaN(val) ? '' : Math.max(1, val) });
                    }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? '3-वर्षीय बैनामा दर (₹/वर्ग मी.)' : '3-Yr Deeds Rate (₹/sq.m)'}</label>
                  <input 
                    type="number" 
                    min="1"
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.avg_registered_sale_rate_per_sqm} 
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCalcInputs({ ...calcInputs, avg_registered_sale_rate_per_sqm: isNaN(val) ? '' : Math.max(1, val) });
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'धारा 11 अधिसूचना तिथि' : 'Sec 11 Notification Date'}</label>
                  <input 
                    type="date" 
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.notification_date} 
                    onChange={(e) => setCalcInputs({ ...calcInputs, notification_date: e.target.value })} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>{langHindi ? 'पंचाट/मुआवजा आदेश तिथि' : 'Award Sanction Date'}</label>
                  <input 
                    type="date" 
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.award_date} 
                    onChange={(e) => setCalcInputs({ ...calcInputs, award_date: e.target.value })} 
                  />
                </div>
              </div>

              {/* Submit / Calculate Button */}
              <button
                type="submit"
                disabled={isCalculating}
                className="btn-action btn-navy"
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #071426 0%, #1e3a8a 100%)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 3px 8px rgba(7, 20, 38, 0.25)',
                  cursor: 'pointer',
                  border: '1px solid #3b82f6'
                }}
              >
                {isCalculating ? (
                  <>
                    <RefreshCw size={15} className="spin" />
                    <span>{langHindi ? 'मुआवजा परिकलित हो रहा है...' : 'Calculating Statutory Award...'}</span>
                  </>
                ) : (
                  <>
                    <Calculator size={16} color="#60a5fa" />
                    <span>{langHindi ? 'मुआवजा गणना करें (Submit & Calculate)' : 'Submit & Calculate Statutory Compensation'}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Valuation Breakdown Display */}
            {calcResult && (
              <div style={{ background: '#ffffff', border: '2px solid #059669', borderRadius: 'var(--radius-md)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-main)', paddingBottom: 8, marginBottom: 10 }}>
                  <span className="badge-pill badge-green">{langHindi ? 'वैधानिक मुआवजा विखंडन' : 'Statutory Award Breakdown'}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{langHindi ? 'कुल दिन:' : 'Statutory Days:'} {calcResult.days_elapsed_notif_to_award}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>{langHindi ? 'धारा 26 मूल दर:' : 'Sec 26 Base Rate:'}</span>
                    <strong>₹{calcResult.base_market_value_per_sqm.toLocaleString()} / sq.m</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>{langHindi ? `मूल भूमि मूल्य (${calcResult.acquired_area_sqm} वर्ग मी.):` : `Base Land Value (${calcResult.acquired_area_sqm} sq.m):`}</span>
                    <strong>₹{calcResult.base_market_value_total.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>{langHindi ? 'स्थान गुणक:' : 'Multiplication Factor:'}</span>
                    <strong style={{ color: '#b45309' }}>× {calcResult.multiplication_factor}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>{langHindi ? 'समायोजित भूमि मूल्य:' : 'Adjusted Land Value:'}</span>
                    <strong>₹{calcResult.adjusted_market_value.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>{langHindi ? 'संलग्न परिसंपत्तियां (धारा 29):' : 'Attached Assets (Sec 29):'}</span>
                    <strong>+ ₹{calcResult.assets_valuation_total.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: 4 }}>
                    <span style={{ fontWeight: 700 }}>{langHindi ? 'आधारभूत मुआवजा (C_base):' : 'Base Compensation (C_base):'}</span>
                    <strong style={{ color: '#071426' }}>₹{calcResult.base_compensation.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>{langHindi ? '100% सोलेशियम (धारा 30(1)):' : 'Solatium 100% (Sec 30(1)):'}</span>
                    <strong style={{ color: '#2563eb' }}>+ ₹{calcResult.solatium_amount.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>{langHindi ? '12% वार्षिक ब्याज (धारा 30(3)):' : 'Additional 12% p.a. (Sec 30(3)):'}</span>
                    <strong style={{ color: '#2563eb' }}>+ ₹{calcResult.additional_amount_12pct.toLocaleString()}</strong>
                  </div>
                </div>

                <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 'var(--radius-sm)', padding: 14, marginTop: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>
                    {langHindi ? 'कुल देय पंचाट मुआवजा (PFMS DBT बैंक अंतरण)' : 'Gross Total Award Payable (PFMS DBT)'}
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: 2 }}>
                    ₹ {calcResult.gross_total_award.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#15803d' }}>
                    (₹ {(calcResult.gross_total_award / 10000000).toFixed(4)} {langHindi ? 'करोड़' : 'Crores'})
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
