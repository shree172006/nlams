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
  langHindi
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
      structure_valuation: 350000,
      tree_valuation: 45000,
      crop_valuation: 25000,
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
          <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.navCalculator}</h2>
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
          Statutory First Schedule Mathematical Formulation
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, fontSize: '0.8rem', fontFamily: 'monospace' }}>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: 4 }}>
            (Base MV × Factor)
          </span>
          <span style={{ color: '#f97316', fontWeight: 800 }}>+</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: 4 }}>
            Attached Assets
          </span>
          <span style={{ color: '#f97316', fontWeight: 800 }}>=</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: 4, color: '#93c5fd' }}>
            Base Compensation
          </span>
          <span style={{ color: '#f97316', fontWeight: 800 }}>+</span>
          <span style={{ background: 'rgba(37,99,235,0.3)', padding: '3px 8px', borderRadius: 4, color: '#bfdbfe' }}>
            100% Solatium
          </span>
          <span style={{ color: '#f97316', fontWeight: 800 }}>+</span>
          <span style={{ background: 'rgba(37,99,235,0.3)', padding: '3px 8px', borderRadius: 4, color: '#bfdbfe' }}>
            12% p.a. Addl
          </span>
          <span style={{ color: '#22c55e', fontWeight: 800 }}>➔</span>
          <span style={{ background: '#059669', padding: '3px 10px', borderRadius: 4, color: '#ffffff', fontWeight: 700 }}>
            Gross Total Award
          </span>
        </div>
      </div>

      <div className="section-panel-card">
        <div className="panel-card-head">
          <div>
            <h3 className="panel-card-title">
              <Sliders size={16} color="#071426" />
              <span>Interactive Parameter Sandbox</span>
            </h3>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
              Adjust inputs and live sliders to observe instant transparent statutory award recalculation.
            </div>
          </div>
          <span className="badge-pill badge-green">IEEE 754 Audited</span>
        </div>

        <div className="panel-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
            {/* Input form */}
            <form onSubmit={handleSubmitCalculate} style={{ background: '#f8fafc', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.85rem', color: '#071426', margin: 0 }}>1. Enter Parcel Parameters</h4>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="btn-action btn-outline"
                  style={{ fontSize: '0.68rem', padding: '3px 8px', gap: 4 }}
                  title="Reset to benchmark values"
                >
                  <RefreshCw size={10} />
                  <span>Reset</span>
                </button>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>Landholder Name</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                  value={calcInputs.owner_name} 
                  onChange={(e) => setCalcInputs({ ...calcInputs, owner_name: e.target.value })} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>Acquired Area (sq.m)</label>
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
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>Location & Multiplier</label>
                  <select 
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.land_type}
                    onChange={(e) => setCalcInputs({ ...calcInputs, land_type: e.target.value })}
                  >
                    <option value="URBAN">Urban (1.0x)</option>
                    <option value="RURAL_CLOSE">Rural 0-10 km (1.25x)</option>
                    <option value="RURAL_MID">Rural 10-20 km (1.50x)</option>
                    <option value="RURAL_REMOTE">Rural Remote &gt;20 km (2.00x)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>Circle Rate (₹/sq.m)</label>
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
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>3-Yr Deeds Rate (₹/sq.m)</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>Structures (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.structure_valuation} 
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCalcInputs({ ...calcInputs, structure_valuation: isNaN(val) ? '' : Math.max(0, val) });
                    }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>Trees (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.tree_valuation} 
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCalcInputs({ ...calcInputs, tree_valuation: isNaN(val) ? '' : Math.max(0, val) });
                    }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>Crops (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.crop_valuation} 
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCalcInputs({ ...calcInputs, crop_valuation: isNaN(val) ? '' : Math.max(0, val) });
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>Sec 11 Notification Date</label>
                  <input 
                    type="date" 
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}
                    value={calcInputs.notification_date} 
                    onChange={(e) => setCalcInputs({ ...calcInputs, notification_date: e.target.value })} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: 3 }}>Award Sanction Date</label>
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
                  <span className="badge-pill badge-green">Statutory Award Breakdown</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Statutory Days: {calcResult.days_elapsed_notif_to_award}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Sec 26 Base Rate:</span>
                    <strong>₹{calcResult.base_market_value_per_sqm.toLocaleString()} / sq.m</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Base Land Value ({calcResult.acquired_area_sqm} sq.m):</span>
                    <strong>₹{calcResult.base_market_value_total.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Multiplication Factor:</span>
                    <strong style={{ color: '#b45309' }}>× {calcResult.multiplication_factor}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Adjusted Land Value:</span>
                    <strong>₹{calcResult.adjusted_market_value.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Attached Assets (Sec 29):</span>
                    <strong>+ ₹{calcResult.assets_valuation_total.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: 4 }}>
                    <span style={{ fontWeight: 700 }}>Base Compensation (C_base):</span>
                    <strong style={{ color: '#071426' }}>₹{calcResult.base_compensation.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Solatium 100% (Sec 30(1)):</span>
                    <strong style={{ color: '#2563eb' }}>+ ₹{calcResult.solatium_amount.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Additional 12% p.a. (Sec 30(3)):</span>
                    <strong style={{ color: '#2563eb' }}>+ ₹{calcResult.additional_amount_12pct.toLocaleString()}</strong>
                  </div>
                </div>

                <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 'var(--radius-sm)', padding: 14, marginTop: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>
                    Gross Total Award Payable (PFMS DBT)
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: 2 }}>
                    ₹ {calcResult.gross_total_award.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#15803d' }}>
                    (₹ {(calcResult.gross_total_award / 10000000).toFixed(4)} Crores)
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
