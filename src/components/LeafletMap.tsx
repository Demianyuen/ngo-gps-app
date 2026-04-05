import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
  nameEn: string;
  description: string;
  location: { lat: number; lng: number };
  points: number;
  scanned: boolean;
}

interface LeafletMapProps {
  checkpoints: Checkpoint[];
  userLocation?: { lat: number; lng: number };
  onCheckpointClick?: (checkpointId: string) => void;
}

export default function LeafletMap({ checkpoints, userLocation, onCheckpointClick }: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate center from checkpoints
  const center = useMemo<[number, number]>(() => {
    if (checkpoints.length === 0) {
      return [22.2086, 114.0299]; // Default: Cheung Chau
    }
    const avgLat = checkpoints.reduce((sum, cp) => sum + cp.location.lat, 0) / checkpoints.length;
    const avgLng = checkpoints.reduce((sum, cp) => sum + cp.location.lng, 0) / checkpoints.length;
    return [avgLat, avgLng];
  }, [checkpoints]);

  // Create custom icon for checkpoints
  const createCheckpointIcon = (scanned: boolean, points: number) => {
    const color = scanned ? '#20c997' : '#ffc107';
    const symbol = scanned ? '✓' : points.toString();

    return L.divIcon({
      className: 'custom-checkpoint-marker',
      html: `
        <div style="
          background: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        ">${symbol}</div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  };

  // User location icon
  const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: pulse 2s infinite;
      "></div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  // Calculate distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (!isMounted) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>地圖載入中...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        .custom-checkpoint-marker, .custom-user-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 12px !important;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>📍 您的位置</Popup>
          </Marker>
        )}

        {/* Checkpoint Markers */}
        {checkpoints.map((checkpoint) => {
          const distance = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                checkpoint.location.lat,
                checkpoint.location.lng
              )
            : null;

          return (
            <Marker
              key={checkpoint.id}
              position={[checkpoint.location.lat, checkpoint.location.lng]}
              icon={createCheckpointIcon(checkpoint.scanned, checkpoint.points)}
              eventHandlers={{
                click: () => onCheckpointClick?.(checkpoint.id)
              }}
            >
              <Popup>
                <div style={popupStyles.content}>
                  <h4 style={popupStyles.title}>{checkpoint.name}</h4>
                  <p style={popupStyles.en}>{checkpoint.nameEn}</p>
                  <p style={popupStyles.desc}>{checkpoint.description}</p>
                  <div style={popupStyles.footer}>
                    <span style={popupStyles.points}>+{checkpoint.points} 分</span>
                    {checkpoint.scanned ? (
                      <span style={popupStyles.scanned}>✅ 已完成</span>
                    ) : (
                      <span style={popupStyles.pending}>⏳ 待完成</span>
                    )}
                  </div>
                  {distance !== null && !checkpoint.scanned && (
                    <div style={popupStyles.distance}>
                      📍 距離: 約{Math.round(distance)}米
                    </div>
                  )}
                  {!checkpoint.scanned && (
                    <button
                      style={popupStyles.button}
                      onClick={() => onCheckpointClick?.(checkpoint.id)}
                    >
                      前往掃描
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* GPS Status */}
      <div style={styles.gpsStatus}>
        {userLocation ? (
          <div style={styles.gpsActive}>
            🛰️ GPS: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
          </div>
        ) : (
          <div style={styles.gpsWaiting}>
            📡 等待GPS定位...
          </div>
        )}
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
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#6c757d',
    fontSize: '16px',
  },
  gpsStatus: {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    zIndex: 1000,
  },
  gpsActive: {
    background: 'rgba(32, 201, 151, 0.95)',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  gpsWaiting: {
    background: 'rgba(255, 193, 7, 0.95)',
    color: '#1a202c',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  legend: {
    position: 'absolute' as const,
    bottom: '10px',
    left: '10px',
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '10px 14px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    display: 'flex',
    gap: '12px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#495057',
  },
  legendDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
};

const popupStyles: Record<string, React.CSSProperties> = {
  content: {
    minWidth: '180px',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#1a202c',
  },
  en: {
    fontSize: '13px',
    color: '#20c997',
    fontStyle: 'italic',
    margin: '0 0 8px 0',
    fontWeight: '600',
  },
  desc: {
    fontSize: '13px',
    color: '#6c757d',
    margin: '0 0 10px 0',
    lineHeight: '1.4',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  points: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#d69e2e',
  },
  scanned: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#20c997',
  },
  pending: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffc107',
  },
  distance: {
    fontSize: '12px',
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    padding: '10px',
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};
