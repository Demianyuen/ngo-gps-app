import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, MapPin, X, GripVertical, Save, Target, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
// @ts-expect-error - Leaflet types issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Checkpoint {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  history?: string;
  location: { lat: number; lng: number };
  points: number;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to handle marker dragging
function DraggableMarker({
  checkpoint,
  isSelected,
  onDragEnd
}: {
  checkpoint: Checkpoint;
  isSelected: boolean;
  onSelect?: (id: string) => void;
  onDragEnd: (id: string, lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  const icon = L.divIcon({
    className: 'checkpoint-drag-marker',
    html: `
      <div style="
        width: ${isSelected ? '44px' : '36px'};
        height: ${isSelected ? '44px' : '36px'};
        background: ${isSelected ? '#667eea' : '#ff6b6b'};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${isSelected ? '16px' : '14px'};
        cursor: grab;
        transition: all 0.2s ease;
        ${isSelected ? 'transform: scale(1.1); z-index: 1000;' : ''}
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
    `,
    iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
    iconAnchor: [isSelected ? 22 : 18, isSelected ? 22 : 18],
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const latlng = marker.getLatLng();
        onDragEnd(checkpoint.id, latlng.lat, latlng.lng);
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[checkpoint.location.lat, checkpoint.location.lng]}
      icon={icon}
      ref={markerRef}
    >
      <Popup>
        <div style={{
          minWidth: '160px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang TC", "Microsoft JhengHei", sans-serif'
        }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a202c' }}>
            {checkpoint.name}
          </h4>
          {checkpoint.nameEn && (
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#667eea', fontStyle: 'italic' }}>
              {checkpoint.nameEn}
            </p>
          )}
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#718096' }}>
            📍 {checkpoint.location.lat.toFixed(4)}, {checkpoint.location.lng.toFixed(4)}
          </p>
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'inline-block'
          }}>
            +{checkpoint.points} 分
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// New checkpoint preview marker
function NewCheckpointMarker({ lat, lng }: { lat: number; lng: number }) {
  const icon = L.divIcon({
    className: 'new-checkpoint-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: rgba(102, 126, 234, 0.9);
        border-radius: 50%;
        border: 3px dashed white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: bounce 0.5s ease infinite alternate;
      ">
        <span style="color: white; font-size: 18px;">+</span>
      </div>
      <style>
        @keyframes bounce {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return <Marker position={[lat, lng]} icon={icon} />;
}

export default function CheckpointManagementScreen() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  // Load from localStorage or use mock data
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(() => {
    const savedEvents = localStorage.getItem('ngo_events');
    if (savedEvents) {
      const events = JSON.parse(savedEvents);
      const event = events.find((e: any) => e.id === eventId);
      if (event) return event.checkpoints.map((cp: any) => ({
        ...cp,
        location: { lat: cp.latitude || cp.location?.lat || 22.2, lng: cp.longitude || cp.location?.lng || 114.03 }
      }));
    }
    // Default checkpoints for demo
    return [
      {
        id: 'demo-1',
        name: '北帝廟',
        nameEn: 'Pak Tai Temple',
        description: '長洲島上最古老的廟宇',
        history: '北帝廟建於清朝乾隆年間，已有超過200年歷史。',
        location: { lat: 22.2086, lng: 114.0299 },
        points: 10
      },
      {
        id: 'demo-2',
        name: '太平清醮場地',
        nameEn: 'Bun Festival Venue',
        description: '著名搶包山活動舉辦地',
        history: '太平清醮是長洲最盛大的傳統節慶，已有百多年歷史。',
        location: { lat: 22.2055, lng: 114.0315 },
        points: 15
      },
      {
        id: 'demo-3',
        name: '長洲長城',
        nameEn: 'Mini Great Wall',
        description: '長洲特色地標建築',
        location: { lat: 22.2070, lng: 114.0275 },
        points: 20
      }
    ];
  });

  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCheckpoint, setEditingCheckpoint] = useState<Checkpoint | null>(null);
  const [newCheckpointPos, setNewCheckpointPos] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    history: '',
    points: 10
  });

  const eventName = (() => {
    const savedEvents = localStorage.getItem('ngo_events');
    if (savedEvents) {
      const events = JSON.parse(savedEvents);
      const event = events.find((e: any) => e.id === eventId);
      if (event) return event.name;
    }
    return '長洲島歷史文化探索';
  })();

  // Save checkpoints to localStorage
  const saveCheckpoints = (updatedCheckpoints: Checkpoint[]) => {
    setCheckpoints(updatedCheckpoints);
    const savedEvents = localStorage.getItem('ngo_events');
    if (savedEvents) {
      const events = JSON.parse(savedEvents);
      const updatedEvents = events.map((e: any) =>
        e.id === eventId
          ? {
              ...e,
              checkpoints: updatedCheckpoints.map(cp => ({
                ...cp,
                latitude: cp.location.lat,
                longitude: cp.location.lng
              }))
            }
          : e
      );
      localStorage.setItem('ngo_events', JSON.stringify(updatedEvents));
    }
  };

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    setNewCheckpointPos({ lat, lng });
    setEditingCheckpoint(null);
    setFormData({ name: '', nameEn: '', description: '', history: '', points: 10 });
    setShowForm(true);
  };

  // Handle marker drag
  const handleMarkerDrag = (id: string, lat: number, lng: number) => {
    const updated = checkpoints.map(cp =>
      cp.id === id ? { ...cp, location: { lat, lng } } : cp
    );
    saveCheckpoints(updated);
    if (selectedCheckpoint?.id === id) {
      setSelectedCheckpoint({ ...selectedCheckpoint, location: { lat, lng } });
    }
  };

  // Handle form submit
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('請輸入簽碼點名稱');
      return;
    }

    if (editingCheckpoint) {
      // Update existing
      const updated = checkpoints.map(cp =>
        cp.id === editingCheckpoint.id
          ? { ...cp, ...formData }
          : cp
      );
      saveCheckpoints(updated);
      setSelectedCheckpoint({ ...editingCheckpoint, ...formData });
    } else if (newCheckpointPos) {
      // Add new
      const newCheckpoint: Checkpoint = {
        id: `cp-${Date.now()}`,
        name: formData.name,
        nameEn: formData.nameEn,
        description: formData.description,
        history: formData.history,
        location: { ...newCheckpointPos },
        points: formData.points
      };
      const updated = [...checkpoints, newCheckpoint];
      saveCheckpoints(updated);
      setNewCheckpointPos(null);
    }

    setShowForm(false);
    setEditingCheckpoint(null);
  };

  // Edit checkpoint from list
  const handleEditFromList = (checkpoint: Checkpoint) => {
    setSelectedCheckpoint(checkpoint);
    setEditingCheckpoint(checkpoint);
    setFormData({
      name: checkpoint.name,
      nameEn: checkpoint.nameEn || '',
      description: checkpoint.description || '',
      history: checkpoint.history || '',
      points: checkpoint.points
    });
    setShowForm(true);
    setViewMode('map');
  };

  // Delete checkpoint
  const handleDelete = (id: string) => {
    if (confirm('確定要刪除這個簽碼點嗎？')) {
      const updated = checkpoints.filter(cp => cp.id !== id);
      saveCheckpoints(updated);
      if (selectedCheckpoint?.id === id) {
        setSelectedCheckpoint(null);
      }
    }
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (editingCheckpoint) {
            const updated = checkpoints.map(cp =>
              cp.id === editingCheckpoint.id
                ? { ...cp, location: { lat: latitude, lng: longitude } }
                : cp
            );
            saveCheckpoints(updated);
            setEditingCheckpoint({ ...editingCheckpoint, location: { lat: latitude, lng: longitude } });
          } else {
            setNewCheckpointPos({ lat: latitude, lng: longitude });
          }
        },
        (error) => alert('無法獲取位置：' + error.message)
      );
    } else {
      alert('您的瀏覽器不支持地理定位');
    }
  };

  // Center map on checkpoint
  const handleCenterOnCheckpoint = (checkpoint: Checkpoint) => {
    setSelectedCheckpoint(checkpoint);
  };

  // Map center - use selected checkpoint or default to Cheung Chau
  const mapCenter: [number, number] = selectedCheckpoint
    ? [selectedCheckpoint.location.lat, selectedCheckpoint.location.lng]
    : checkpoints.length > 0
      ? [
          checkpoints.reduce((sum, cp) => sum + cp.location.lat, 0) / checkpoints.length,
          checkpoints.reduce((sum, cp) => sum + cp.location.lng, 0) / checkpoints.length
        ]
      : [22.2070, 114.0297];

  return (
    <div style={styles.container}>
      <style>{`
        .checkpoint-drag-marker, .new-checkpoint-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
        .leaflet-popup-content {
          margin: 14px !important;
        }
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", "Microsoft JhengHei", sans-serif;
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/host/events')}>
          <X size={20} />
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>地圖編輯簽碼點</h1>
          <p style={styles.subtitle}>{eventName}</p>
        </div>
        <button
          style={{
            ...styles.viewToggle,
            background: viewMode === 'map' ? '#667eea' : '#f0f0f0',
            color: viewMode === 'map' ? 'white' : '#666'
          }}
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
        >
          <Layers size={16} />
          {viewMode === 'map' ? '列表' : '地圖'}
        </button>
      </div>

      {/* Instructions Banner */}
      <div style={styles.instructionBanner}>
        <Target size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>操作提示：</strong>
          點擊地圖添加新簽碼點 | 拖曳標記調整位置 | 點擊標記查看詳情
        </span>
      </div>

      {viewMode === 'map' ? (
        <div style={styles.mapLayout}>
          {/* Map */}
          <div style={styles.mapContainer}>
            <MapContainer
              center={mapCenter}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapClickHandler onMapClick={handleMapClick} />

              {/* Existing checkpoints */}
              {checkpoints.map((checkpoint) => (
                <DraggableMarker
                  key={checkpoint.id}
                  checkpoint={checkpoint}
                  isSelected={selectedCheckpoint?.id === checkpoint.id}
                  onSelect={(id) => {
                    const cp = checkpoints.find(c => c.id === id);
                    if (cp) setSelectedCheckpoint(cp);
                  }}
                  onDragEnd={handleMarkerDrag}
                />
              ))}

              {/* New checkpoint preview */}
              {newCheckpointPos && (
                <NewCheckpointMarker lat={newCheckpointPos.lat} lng={newCheckpointPos.lng} />
              )}
            </MapContainer>

            {/* Map Legend */}
            <div style={styles.mapLegend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, background: '#ff6b6b' }} />
                <span>簽碼點</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, background: '#667eea' }} />
                <span>已選中</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, background: 'rgba(102,126,234,0.7)', border: '2px dashed white' }} />
                <span>新增位置</span>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div style={styles.sidePanel}>
            {showForm ? (
              /* Form */
              <div style={styles.formSection}>
                <div style={styles.formHeader}>
                  <h3 style={styles.formTitle}>
                    {editingCheckpoint ? '編輯簽碼點' : '新增簽碼點'}
                  </h3>
                  <button style={styles.closeFormBtn} onClick={() => {
                    setShowForm(false);
                    setEditingCheckpoint(null);
                    setNewCheckpointPos(null);
                  }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={styles.formBody}>
                  {newCheckpointPos && (
                    <div style={styles.coordDisplay}>
                      <MapPin size={14} />
                      <span>{newCheckpointPos.lat.toFixed(5)}, {newCheckpointPos.lng.toFixed(5)}</span>
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.label}>簽碼點名稱 *</label>
                    <input
                      type="text"
                      style={styles.input}
                      placeholder="例如：張保仔洞"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>英文名稱</label>
                    <input
                      type="text"
                      style={styles.input}
                      placeholder="Cheung Po Tsai Cave"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>簡短描述</label>
                    <textarea
                      style={styles.textarea}
                      placeholder="這個簽碼點的簡短描述..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>📜 歷史故事</label>
                    <textarea
                      style={styles.textarea}
                      placeholder="張保仔是清朝著名的海盜，據說他在這個洞穴收藏了無數寶藏..."
                      value={formData.history}
                      onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>緯度</label>
                      <input
                        type="number"
                        step="0.0001"
                        style={styles.input}
                        value={editingCheckpoint ? editingCheckpoint.location.lat : (newCheckpointPos?.lat || 0)}
                        onChange={(e) => {
                          const lat = parseFloat(e.target.value);
                          if (editingCheckpoint) {
                            const updated = checkpoints.map(cp =>
                              cp.id === editingCheckpoint.id
                                ? { ...cp, location: { ...cp.location, lat } }
                                : cp
                            );
                            saveCheckpoints(updated);
                            setEditingCheckpoint({ ...editingCheckpoint, location: { ...editingCheckpoint.location, lat } });
                          } else if (newCheckpointPos) {
                            setNewCheckpointPos({ ...newCheckpointPos, lat });
                          }
                        }}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>經度</label>
                      <input
                        type="number"
                        step="0.0001"
                        style={styles.input}
                        value={editingCheckpoint ? editingCheckpoint.location.lng : (newCheckpointPos?.lng || 0)}
                        onChange={(e) => {
                          const lng = parseFloat(e.target.value);
                          if (editingCheckpoint) {
                            const updated = checkpoints.map(cp =>
                              cp.id === editingCheckpoint.id
                                ? { ...cp, location: { ...cp.location, lng } }
                                : cp
                            );
                            saveCheckpoints(updated);
                            setEditingCheckpoint({ ...editingCheckpoint, location: { ...editingCheckpoint.location, lng } });
                          } else if (newCheckpointPos) {
                            setNewCheckpointPos({ ...newCheckpointPos, lng });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <button style={styles.locationBtn} onClick={handleGetCurrentLocation}>
                    <MapPin size={14} />
                    使用GPS定位
                  </button>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>積分值</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
                    />
                  </div>

                  <button style={styles.submitBtn} onClick={handleSubmit}>
                    <Save size={16} />
                    {editingCheckpoint ? '更新簽碼點' : '添加簽碼點'}
                  </button>
                </div>
              </div>
            ) : selectedCheckpoint ? (
              /* Selected Checkpoint Details */
              <div style={styles.detailSection}>
                <div style={styles.detailHeader}>
                  <div style={styles.detailBadge}>+{selectedCheckpoint.points} 分</div>
                  <button
                    style={styles.editBtn}
                    onClick={() => {
                      setEditingCheckpoint(selectedCheckpoint);
                      setFormData({
                        name: selectedCheckpoint.name,
                        nameEn: selectedCheckpoint.nameEn || '',
                        description: selectedCheckpoint.description || '',
                        history: selectedCheckpoint.history || '',
                        points: selectedCheckpoint.points
                      });
                      setShowForm(true);
                    }}
                  >
                    編輯
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(selectedCheckpoint.id)}
                  >
                    刪除
                  </button>
                </div>

                <h3 style={styles.detailName}>{selectedCheckpoint.name}</h3>
                {selectedCheckpoint.nameEn && (
                  <p style={styles.detailNameEn}>{selectedCheckpoint.nameEn}</p>
                )}

                <div style={styles.detailCoords}>
                  <MapPin size={14} />
                  <span>{selectedCheckpoint.location.lat.toFixed(5)}, {selectedCheckpoint.location.lng.toFixed(5)}</span>
                </div>

                {selectedCheckpoint.description && (
                  <p style={styles.detailDesc}>{selectedCheckpoint.description}</p>
                )}

                {selectedCheckpoint.history && (
                  <div style={styles.historyBox}>
                    <h4 style={styles.historyTitle}>📜 歷史故事</h4>
                    <p style={styles.historyText}>{selectedCheckpoint.history}</p>
                  </div>
                )}

                <button
                  style={styles.addNewBtn}
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} />
                  添加新簽碼點
                </button>
              </div>
            ) : (
              /* Empty State */
              <div style={styles.emptyState}>
                <GripVertical size={48} style={{ color: '#ccc', marginBottom: 16 }} />
                <h3 style={styles.emptyTitle}>選擇或新增簽碼點</h3>
                <p style={styles.emptyText}>點擊地圖上的位置添加新簽碼點，或點擊現有標記查看詳情</p>
                <button
                  style={styles.addNewBtn}
                  onClick={() => {
                    // Center on map and wait for click
                  }}
                >
                  <Plus size={16} />
                  添加新簽碼點
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* List View */
        <div style={styles.listView}>
          {checkpoints.map((checkpoint) => (
            <div
              key={checkpoint.id}
              style={{
                ...styles.listCard,
                borderLeft: selectedCheckpoint?.id === checkpoint.id ? '4px solid #667eea' : '4px solid transparent'
              }}
              onClick={() => handleCenterOnCheckpoint(checkpoint)}
            >
              <div style={styles.listCardHeader}>
                <div style={styles.listCardInfo}>
                  <h3 style={styles.listCardName}>{checkpoint.name}</h3>
                  {checkpoint.nameEn && (
                    <p style={styles.listCardNameEn}>{checkpoint.nameEn}</p>
                  )}
                </div>
                <div style={styles.listCardBadge}>+{checkpoint.points} 分</div>
              </div>
              <div style={styles.listCardCoords}>
                <MapPin size={12} />
                <span>{checkpoint.location.lat.toFixed(4)}, {checkpoint.location.lng.toFixed(4)}</span>
              </div>
              {checkpoint.description && (
                <p style={styles.listCardDesc}>{checkpoint.description}</p>
              )}
              <div style={styles.listCardActions}>
                <button
                  style={styles.listEditBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditFromList(checkpoint);
                  }}
                >
                  編輯
                </button>
                <button
                  style={styles.listDeleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(checkpoint.id);
                  }}
                >
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  backBtn: {
    background: '#f5f5f7',
    border: 'none',
    borderRadius: 10,
    padding: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1a202c',
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: '#718096',
    margin: 0,
  },
  viewToggle: {
    border: 'none',
    borderRadius: 8,
    padding: '8px 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
  },
  instructionBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
    color: '#667eea',
    fontSize: 13,
  },
  mapLayout: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mapContainer: {
    height: 400,
    position: 'relative' as const,
  },
  mapLegend: {
    position: 'absolute' as const,
    bottom: 16,
    left: 16,
    zIndex: 1000,
    background: 'rgba(255,255,255,0.95)',
    padding: '10px 14px',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: 16,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#495057',
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  sidePanel: {
    flex: 1,
    background: 'white',
    borderTop: '1px solid #e2e8f0',
    maxHeight: 400,
    overflow: 'auto',
  },
  formSection: {
    padding: 20,
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1a202c',
    margin: 0,
  },
  closeFormBtn: {
    background: '#f5f5f7',
    border: 'none',
    borderRadius: 8,
    padding: 8,
    cursor: 'pointer',
  },
  formBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  coordDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 10,
    color: '#667eea',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  formRow: {
    display: 'flex',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#2d3748',
  },
  input: {
    padding: '12px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
  },
  textarea: {
    padding: '12px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
  },
  locationBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    background: '#48bb78',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: 12,
    color: 'white',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  detailSection: {
    padding: 20,
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  detailBadge: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 15,
    fontWeight: 700,
  },
  editBtn: {
    padding: '8px 16px',
    background: '#f5f5f7',
    border: 'none',
    borderRadius: 8,
    color: '#495057',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '8px 16px',
    background: '#fff5f5',
    border: 'none',
    borderRadius: 8,
    color: '#e53e3e',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  detailName: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a202c',
    margin: '0 0 4px 0',
  },
  detailNameEn: {
    fontSize: 14,
    color: '#667eea',
    fontStyle: 'italic',
    margin: '0 0 12px 0',
  },
  detailCoords: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#718096',
    fontSize: 13,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  detailDesc: {
    fontSize: 14,
    color: '#4a5568',
    margin: '0 0 16px 0',
    lineHeight: 1.5,
  },
  historyBox: {
    background: '#fef5e7',
    borderLeft: '4px solid #f39c12',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#d35400',
    margin: '0 0 8px 0',
  },
  historyText: {
    fontSize: 13,
    color: '#2c3e50',
    margin: 0,
    lineHeight: 1.6,
  },
  addNewBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    background: 'white',
    border: '2px dashed #667eea',
    borderRadius: 12,
    color: '#667eea',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    textAlign: 'center' as const,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1a202c',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
    margin: '0 0 20px 0',
    lineHeight: 1.5,
  },
  listView: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  listCard: {
    background: 'white',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    cursor: 'pointer',
  },
  listCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listCardInfo: {
    flex: 1,
  },
  listCardName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1a202c',
    margin: 0,
  },
  listCardNameEn: {
    fontSize: 13,
    color: '#667eea',
    fontStyle: 'italic',
    margin: '4px 0 0 0',
  },
  listCardBadge: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: 16,
    fontSize: 13,
    fontWeight: 700,
  },
  listCardCoords: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: '#718096',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  listCardDesc: {
    fontSize: 13,
    color: '#4a5568',
    margin: '0 0 12px 0',
  },
  listCardActions: {
    display: 'flex',
    gap: 8,
  },
  listEditBtn: {
    flex: 1,
    padding: '8px 12px',
    background: '#f5f5f7',
    border: 'none',
    borderRadius: 8,
    color: '#495057',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  listDeleteBtn: {
    flex: 1,
    padding: '8px 12px',
    background: '#fff5f5',
    border: 'none',
    borderRadius: 8,
    color: '#e53e3e',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
