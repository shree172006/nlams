import React, { useState, useEffect } from 'react';
import { Layers, ShieldCheck, FileText, Lock, Maximize2, Minimize2 } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Polyline, Tooltip, Popup, useMap } from 'react-leaflet';

// Internal controller to smoothly fly to selected project coordinates and handle resize
function MapController({ selectedProject, isFullscreen }) {
  const map = useMap();

  useEffect(() => {
    if (selectedProject?.alignment_coordinates && selectedProject.alignment_coordinates.length > 0) {
      const coords = selectedProject.alignment_coordinates;
      if (coords.length > 1) {
        map.flyToBounds(coords, { padding: [60, 60], duration: 1.2, maxZoom: 14 });
      } else {
        map.flyTo(coords[0], 13, { duration: 1.2 });
      }
    }
  }, [selectedProject?.id, map]);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [isFullscreen, map]);

  return null;
}

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
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div style={isFullscreen ? {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 99999,
      background: '#071426',
      padding: '16px',
      boxSizing: 'border-box',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    } : {}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: isFullscreen ? '#ffffff' : '#071426', margin: 0 }}>
            {t.navGis} {isFullscreen && <span className="badge-pill badge-gold" style={{ marginLeft: 8, fontSize: '0.65rem' }}>FULL VIEW</span>}
          </h2>
          <span style={{ fontSize: '0.75rem', color: isFullscreen ? '#94a3b8' : '#64748b' }}>
            {langHindi ? 'भू-नक्शा पार्सल सीमाओं एवं राइट-ऑफ-वे संरेखण का जीआईएस मानचित्र' : 'Vector overlay of corridor alignment against village cadastral survey polygons'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isFullscreen ? '#cbd5e1' : '#475569' }}>{t.activeProjectLabel}</span>
          <select 
            style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)', fontSize: '0.78rem', fontWeight: 700, background: '#ffffff', color: '#071426' }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {/* Full Screen Toggle in Header */}
          <button 
            type="button"
            className="btn-action btn-outline"
            style={{ 
              padding: '5px 10px', 
              fontSize: '0.74rem', 
              color: isFullscreen ? '#fef08a' : '#071426',
              borderColor: isFullscreen ? '#fef08a' : 'var(--border-dark)',
              background: isFullscreen ? 'rgba(254, 240, 138, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Full Screen" : "Open Full Screen Map"}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFullscreen ? (langHindi ? 'सामान्य दृश्य' : 'Exit Full View') : (langHindi ? 'पूर्ण स्क्रीन' : 'Full Screen')}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedMapParcel ? '2fr 1fr' : '1fr', gap: 18, flex: isFullscreen ? 1 : 'none' }}>
        <div className="section-panel-card" style={{ display: 'flex', flexDirection: 'column', height: isFullscreen ? '100%' : 'auto' }}>
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

          <div className="panel-card-body" style={{ padding: '12px', position: 'relative', flex: isFullscreen ? 1 : 'none', minHeight: isFullscreen ? 480 : 'auto' }}>
            <div style={{ position: 'relative', width: '100%', height: isFullscreen ? 'calc(100vh - 240px)' : '520px' }}>
              <MapContainer 
                center={selectedProject?.alignment_coordinates[0] || [25.3176, 82.9739]} 
                zoom={13} 
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-sm)' }}
              >
                {/* Reactive Project Controller */}
                <MapController selectedProject={selectedProject} isFullscreen={isFullscreen} />

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

              {/* Floating Bottom-Right Full Screen Button */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                style={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  zIndex: 400,
                  background: '#071426',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: 6,
                  padding: '7px 12px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 700
                }}
                title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen View"}
              >
                {isFullscreen ? <Minimize2 size={14} color="#fef08a" /> : <Maximize2 size={14} color="#60a5fa" />}
                <span>{isFullscreen ? (langHindi ? 'सामान्य दृश्य' : 'Normal View') : (langHindi ? 'पूर्ण स्क्रीन' : 'Full Screen')}</span>
              </button>
            </div>

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
