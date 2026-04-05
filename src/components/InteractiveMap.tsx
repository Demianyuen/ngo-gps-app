import { useEffect, useState } from 'react';

interface Checkpoint {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  location: { lat: number; lng: number };
  points: number;
  scanned: boolean;
}

interface InteractiveMapProps {
  checkpoints: Checkpoint[];
  userLocation?: { lat: number; lng: number };
  onCheckpointClick?: (checkpointId: string) => void;
}

export default function InteractiveMap({ checkpoints, userLocation, onCheckpointClick }: InteractiveMapProps) {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);

  // Calculate map bounds from checkpoints
  const bounds = checkpoints.reduce(
    (acc, cp) => ({
      minLat: Math.min(acc.minLat, cp.location.lat),
      maxLat: Math.max(acc.maxLat, cp.location.lat),
      minLng: Math.min(acc.minLng, cp.location.lng),
      maxLng: Math.max(acc.maxLng, cp.location.lng),
    }),
    { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 }
  );

  // Add padding to bounds
  const padding = 0.005;
  const mapMinLat = bounds.minLat - padding;
  const mapMaxLat = bounds.maxLat + padding;
  const mapMinLng = bounds.minLng - padding;
  const mapMaxLng = bounds.maxLng + padding;

  // Convert lat/lng to x/y on map
  const toMapX = (lng: number) => {
    return ((lng - mapMinLng) / (mapMaxLng - mapMinLng)) * 100;
  };

  const toMapY = (lat: number) => {
    return ((mapMaxLat - lat) / (mapMaxLat - mapMinLat)) * 100;
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Try to get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('GPS Location:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('GPS Error:', error.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  return (
    <div style={styles.mapContainer}>
      {/* Map Header */}
      <div style={styles.mapHeader}>
        <h3 style={styles.mapTitle}>🗺️ 長洲島探索地圖</h3>
        <p style={styles.mapSubtitle}>GPS 定位版</p>
      </div>

      {/* Map Area with OpenStreetMap */}
      <div style={styles.mapWrapper}>
        {/* OpenStreetMap iframe */}
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapMinLng},${mapMinLat},${mapMaxLng},${mapMaxLat}&layer=mapnik&marker=${userLocation ? `${userLocation.lat},${userLocation.lng}` : ''}`}
          style={styles.mapFrame}
          title="長洲島地圖"
          loading="lazy"
        />

        {/* Checkpoint Overlay */}
        <div style={styles.checkpointOverlay}>
          {checkpoints.map((checkpoint) => {
            const x = toMapX(checkpoint.location.lng);
            const y = toMapY(checkpoint.location.lat);

            return (
              <div
                key={checkpoint.id}
                style={{
                  ...styles.checkpointMarker,
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: checkpoint.scanned ? '#20c997' : '#ffc107',
                }}
                onClick={() => {
                  setSelectedCheckpoint(checkpoint);
                  onCheckpointClick?.(checkpoint.id);
                }}
                title={checkpoint.name}
              >
                {checkpoint.scanned ? '✓' : checkpoint.points}
              </div>
            );
          })}

          {/* User Location Marker */}
          {userLocation && (
            <div
              style={{
                ...styles.userMarker,
                left: `${toMapX(userLocation.lng)}%`,
                top: `${toMapY(userLocation.lat)}%`,
              }}
            >
              <div style={styles.userMarkerInner} />
              <div style={styles.userMarkerPulse} />
            </div>
          )}
        </div>

        {/* GPS Status */}
        <div style={styles.gpsStatus}>
          {userLocation ? (
            <div style={styles.gpsActive}>
              🛰️ GPS: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
            </div>
          ) : (
            <div style={styles.gpsWaiting}>
              📡 等待GPS定位...
            </div>
          )}
        </div>

      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: '#20c997' }} />
          <span>已完成</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: '#ffc107' }} />
          <span>未完成</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: '#3b82f6' }} />
          <span>您的位置</span>
        </div>
      </div>

      {/* Selected Checkpoint Info */}
      {selectedCheckpoint && (
        <div style={styles.checkpointInfo}>
          <div style={styles.infoHeader}>
            <h4 style={styles.infoTitle}>{selectedCheckpoint.name}</h4>
            <span
              style={styles.closeBtn}
              onClick={() => setSelectedCheckpoint(null)}
            >
              ✕
            </span>
          </div>
          <p style={styles.infoEn}>{selectedCheckpoint.nameEn}</p>
          <p style={styles.infoDesc}>{selectedCheckpoint.description}</p>
          <div style={styles.infoFooter}>
            <div style={styles.infoPoints}>
              <span style={styles.pointsValue}>+{selectedCheckpoint.points}</span>
              <span style={styles.pointsLabel}>積分</span>
            </div>
            {selectedCheckpoint.scanned ? (
              <div style={styles.scannedBadge}>✅ 已完成</div>
            ) : (
              <button
                style={styles.scanBtn}
                onClick={() => onCheckpointClick?.(selectedCheckpoint.id)}
              >
                前往掃描
              </button>
            )}
          </div>
          {userLocation && !selectedCheckpoint.scanned && (
            <div style={styles.infoDistance}>
              📍 距離您約 {Math.round(calculateDistance(
                userLocation.lat,
                userLocation.lng,
                selectedCheckpoint.location.lat,
                selectedCheckpoint.location.lng
              ))} 米
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={styles.instructions}>
        <p>💡 點擊標記查看詳情或前往掃描</p>
        <p>📱 在手機上使用可獲得GPS定位</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  mapContainer: {
    width: '100%',
    height: '100%',
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  mapHeader: {
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    color: 'white',
    padding: '12px 16px',
    textAlign: 'center' as const,
  },
  mapTitle: {
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 2px 0',
    letterSpacing: '1px',
  },
  mapSubtitle: {
    fontSize: '12px',
    margin: '0',
    opacity: 0.9,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative' as const,
    minHeight: '300px',
  },
  mapFrame: {
    width: '100%',
    height: '100%',
    border: 'none',
    position: 'absolute' as const,
    top: 0,
    left: 0,
  },
  checkpointOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 1000,
  },
  checkpointMarker: {
    position: 'absolute' as const,
    transform: 'translate(-50%, -50%)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    pointerEvents: 'auto' as const,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    border: '3px solid white',
    transition: 'transform 0.2s',
  },
  userMarker: {
    position: 'absolute' as const,
    transform: 'translate(-50%, -50%)',
    zIndex: 2000,
  },
  userMarkerInner: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#3b82f6',
    border: '3px solid white',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.5)',
  },
  userMarkerPulse: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(59, 130, 246, 0.3)',
    animation: 'pulse 2s infinite',
  },
  gpsStatus: {
    position: 'absolute' as const,
    bottom: '8px',
    left: '8px',
    zIndex: 1500,
  },
  gpsActive: {
    background: 'rgba(32, 201, 151, 0.95)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  gpsWaiting: {
    background: 'rgba(255, 193, 7, 0.95)',
    color: '#1a202c',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  errorMessage: {
    position: 'absolute' as const,
    bottom: '8px',
    right: '8px',
    background: 'rgba(245, 101, 101, 0.95)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '600',
    zIndex: 1500,
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    padding: '8px',
    background: '#f8f9fa',
    borderTop: '1px solid #e9ecef',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#495057',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  checkpointInfo: {
    background: 'white',
    borderTop: '1px solid #e9ecef',
    padding: '16px',
  },
  infoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '700',
    margin: '0',
    color: '#1a202c',
  },
  closeBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '12px',
  },
  infoEn: {
    fontSize: '13px',
    color: '#20c997',
    fontStyle: 'italic',
    margin: '0 0 8px 0',
    fontWeight: '600',
  },
  infoDesc: {
    fontSize: '13px',
    color: '#6c757d',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
  },
  infoFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoPoints: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  pointsValue: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#d69e2e',
  },
  pointsLabel: {
    fontSize: '13px',
    color: '#a0aec0',
  },
  scannedBadge: {
    background: '#20c997',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
  },
  scanBtn: {
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  infoDistance: {
    marginTop: '12px',
    fontSize: '13px',
    color: '#3b82f6',
    fontWeight: '600',
  },
  instructions: {
    padding: '8px 16px',
    background: 'rgba(32, 201, 151, 0.1)',
    textAlign: 'center' as const,
  },
};
