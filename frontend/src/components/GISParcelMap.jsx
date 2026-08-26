import React from 'react';
import { Layers, ShieldCheck, FileText, Lock } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Polyline, Tooltip, Popup } from 'react-leaflet';

export default function GISParcelMap({
  selectedProject,
  selectedProjectId,
  setSelectedProjectId,
  projects,
  selectedMapParcel,
  setSelectedMapParcel,
  mapLayer,
  setMapLayer,
  setAwardSlipParcel,
  setActiveModal,
  t,
  langHindi
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#071426' }}>{t.navGis}</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {langHindi ? 'भू-नक्शा पार्सल सीमाओं एवं राइट-ऑफ-वे संरेखण का जीआईएस मानचित्र' : 'Vector overlay of corridor alignment against village cadastral survey polygons'}
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

      <div style={{ display: 'grid', gridTemplateColumns: selectedMapParcel ? '2fr 1fr' : '1fr', gap: 18 }}>
        <div className="section-panel-card">
          <div className="panel-card-head">
            <div>
              <h3 className="panel-card-title">
                <Layers size={16} color="#071426" />
                <span>{selectedProject?.title} (Cadastral Spatial Layer)</span>
              </h3>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
                Click on any parcel polygon to inspect ownership, valuation, and encumbrance lock.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button 
                className={`btn-action ${mapLayer === 'osm' ? 'btn-navy' : 'btn-outline'}`} 
                style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                onClick={() => setMapLayer('osm')}
              >
                Cadastral Grid
              </button>
              <button 
                className={`btn-action ${mapLayer === 'topo' ? 'btn-navy' : 'btn-outline'}`} 
                style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                onClick={() => setMapLayer('topo')}
              >
                Topography
              </button>
            </div>
          </div>

          <div className="panel-card-body" style={{ padding: '16px' }}>
            <MapContainer 
              center={selectedProject?.alignment_coordinates[0] || [25.3176, 82.9739]} 
              zoom={13} 
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Survey of India ORI'
                url={mapLayer === 'topo' 
                  ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
              />

              {/* Alignment Polyline */}
              {selectedProject?.alignment_coordinates && (
                <Polyline 
                  positions={selectedProject.alignment_coordinates} 
                  color="#ea580c" 
                  weight={6}
                  dashArray="10, 5"
                >
                  <Popup>
                    <div style={{ padding: 4, fontSize: '0.8rem' }}>
                      <strong>{selectedProject.title}</strong>
                      <div>Length: {selectedProject.total_length_km} km</div>
                      <div>Agency: {selectedProject.acquiring_agency}</div>
                    </div>
                  </Popup>
                </Polyline>
              )}

              {/* Cadastral Polygons with Color Codes */}
              {selectedProject?.parcels.map((parcel) => {
                // Color codes:
                // Yellow: Section 11 Notified (Encumbrance Locked)
                // Red: Disputed (Section 15 Active)
                // Green: Acquired / Possession Completed
                // Blue: Proposed / Under SIA
                let strokeColor = '#2563eb';
                let fillColor = '#3b82f6';
                if (parcel.status === 'DISPUTED') {
                  strokeColor = '#b91c1c';
                  fillColor = '#ef4444';
                } else if (parcel.status === 'ACQUIRED') {
                  strokeColor = '#059669';
                  fillColor = '#10b981';
                } else if (parcel.encumbrance_locked || parcel.status === 'NOTIFIED') {
                  strokeColor = '#d97706';
                  fillColor = '#f59e0b';
                }

                return (
                  parcel.coordinates_polygon && parcel.coordinates_polygon.length > 0 && (
                    <Polygon
                      key={parcel.ulpin}
                      positions={parcel.coordinates_polygon}
                      pathOptions={{
                        color: strokeColor,
                        fillColor: fillColor,
                        fillOpacity: 0.55,
                        weight: 2
                      }}
                      eventHandlers={{
                        click: () => setSelectedMapParcel(parcel)
                      }}
                    >
                      <Tooltip sticky>
                        <div style={{ fontSize: '0.75rem' }}>
                          <strong>ULPIN: {parcel.ulpin}</strong>
                          <div>Record: {parcel.local_record_no}</div>
                          <div>Owner: {parcel.owner_name}</div>
                          <div>Acquired: {parcel.acquired_area_sqm} sq.m</div>
                          <div>Status: {parcel.status} {parcel.encumbrance_locked ? '(🔒 Encumbrance Locked)' : ''}</div>
                        </div>
                      </Tooltip>
                    </Polygon>
                  )
                );
              })}
            </MapContainer>

            <div style={{ display: 'flex', gap: 16, marginTop: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)', fontSize: '0.72rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 4, background: '#ea580c', display: 'inline-block' }}></span>
                <span>Corridor Alignment ROW</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: '#f59e0b', display: 'inline-block', border: '1px solid #d97706' }}></span>
                <span>Sec 11 Notified (Locked)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: '#ef4444', display: 'inline-block', border: '1px solid #b91c1c' }}></span>
                <span>Sec 15 Disputed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: '#10b981', display: 'inline-block', border: '1px solid #059669' }}></span>
                <span>Acquired / Mutated</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: '#3b82f6', display: 'inline-block', border: '1px solid #2563eb' }}></span>
                <span>Proposed / Under SIA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Parcel Inspector Drawer */}
        {selectedMapParcel && (
          <div className="section-panel-card" style={{ borderTop: '4px solid #059669', animation: 'slideUp 0.2s ease' }}>
            <div className="panel-card-head">
              <h3 className="panel-card-title">
                <ShieldCheck size={16} color="#059669" />
                <span>Parcel Inspector</span>
              </h3>
              <button className="btn-action btn-outline" style={{ padding: '2px 6px' }} onClick={() => setSelectedMapParcel(null)}>✕</button>
            </div>

            <div className="panel-card-body" style={{ fontSize: '0.78rem' }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>14-Digit Bhu-Aadhaar (ULPIN)</span>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#071426', fontSize: '0.9rem' }}>{selectedMapParcel.ulpin}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4 }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Record No</span>
                  <div style={{ fontWeight: 700 }}>{selectedMapParcel.local_record_no}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4 }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Acquired Area</span>
                  <div style={{ fontWeight: 700 }}>{selectedMapParcel.acquired_area_sqm} sq.m</div>
                </div>
              </div>

              <div style={{ marginBottom: 10, background: '#f8fafc', padding: 8, borderRadius: 4 }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Landholder</span>
                <div style={{ fontWeight: 700, color: '#071426' }}>{selectedMapParcel.owner_name}</div>
                <div style={{ fontSize: '0.68rem', color: '#059669' }}>✓ Aadhaar: {selectedMapParcel.owner_aadhaar_masked}</div>
              </div>

              {/* Joint Khata Co-Heirs */}
              {selectedMapParcel.joint_khata_heirs && selectedMapParcel.joint_khata_heirs.length > 0 && (
                <div style={{ marginBottom: 10, background: '#eff6ff', border: '1px solid #bfdbfe', padding: 8, borderRadius: 4 }}>
                  <span style={{ fontSize: '0.65rem', color: '#1e40af', fontWeight: 700 }}>Joint Khata Co-Heir Shares:</span>
                  <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {selectedMapParcel.joint_khata_heirs.map((heir, hIdx) => (
                      <div key={hIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#1e3a8a' }}>
                        <span>• {heir.name} ({heir.relation})</span>
                        <strong>{heir.share_pct}% ({heir.share_sqm} sq.m)</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* On-Ground Field Survey Asset Valuations */}
              <div style={{ marginBottom: 10, background: '#f8fafc', border: '1px solid var(--border-main)', padding: 8, borderRadius: 4 }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>On-Ground Field Survey Assets:</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginTop: 4, textAlign: 'center' }}>
                  <div style={{ background: '#ffffff', padding: '4px 2px', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Structures</div>
                    <strong style={{ fontSize: '0.72rem', color: '#071426' }}>₹{(selectedMapParcel.structure_valuation || 0).toLocaleString()}</strong>
                  </div>
                  <div style={{ background: '#ffffff', padding: '4px 2px', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Trees</div>
                    <strong style={{ fontSize: '0.72rem', color: '#071426' }}>₹{(selectedMapParcel.tree_valuation || 0).toLocaleString()}</strong>
                  </div>
                  <div style={{ background: '#ffffff', padding: '4px 2px', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Crops</div>
                    <strong style={{ fontSize: '0.72rem', color: '#071426' }}>₹{(selectedMapParcel.crop_valuation || 0).toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Non-Owner Claimants */}
              {selectedMapParcel.non_owner_claimants && selectedMapParcel.non_owner_claimants.length > 0 && (
                <div style={{ marginBottom: 10, background: '#fdf4ff', border: '1px solid #f0abfc', padding: 8, borderRadius: 4 }}>
                  <span style={{ fontSize: '0.65rem', color: '#86198f', fontWeight: 700 }}>Non-Owner Claimants (R&R Entitled):</span>
                  <div style={{ marginTop: 4 }}>
                    {selectedMapParcel.non_owner_claimants.map((c, cIdx) => (
                      <div key={cIdx} style={{ fontSize: '0.68rem', color: '#701a75' }}>
                        • {c.name} ({c.type})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Survey Photos Gallery */}
              {selectedMapParcel.field_survey_photos && selectedMapParcel.field_survey_photos.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>Geo-Tagged Survey Photos:</span>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, overflowX: 'auto' }}>
                    {selectedMapParcel.field_survey_photos.map((url, imgIdx) => (
                      <img 
                        key={imgIdx} 
                        src={url} 
                        alt="Field Survey" 
                        style={{ width: 65, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1' }} 
                      />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Statutory Status</span>
                <div style={{ marginTop: 3 }}>
                  {selectedMapParcel.encumbrance_locked ? (
                    <span className="badge-pill badge-red"><Lock size={9} /> Encumbrance Locked (Sec 11)</span>
                  ) : (
                    <span className="badge-pill badge-green">Free / Mutated</span>
                  )}
                </div>
              </div>

              <button 
                className="btn-action btn-navy" 
                style={{ width: '100%', fontSize: '0.72rem' }}
                onClick={() => {
                  setAwardSlipParcel({
                    parcel: selectedMapParcel,
                    project_title: selectedProject.title,
                    current_stage: selectedProject.current_stage
                  });
                  setActiveModal('awardSlip');
                }}
              >
                <FileText size={12} />
                <span>{t.viewAwardSlip}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
