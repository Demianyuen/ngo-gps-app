import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Bell, ShoppingBag, Layers, Map as MapIcon, RefreshCw, MapPin } from 'lucide-react';
import { mockEvents } from '../../lib/mockData';
import LeafletMap from '../../components/LeafletMap';

export default function MapScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = mockEvents.find(e => e.id === eventId);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [scannedCheckpoints, setScannedCheckpoints] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [gpsStatus, setGpsStatus] = useState<'loading' | 'active' | 'error'>('loading');
  const [gpsErrorMessage, setGpsErrorMessage] = useState('');

  // Request GPS location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMessage('您的瀏覽器不支援定位功能');
      // Use default location
      setUserLocation({ lat: 22.2086, lng: 114.0299 });
      return;
    }

    setGpsStatus('loading');
    setGpsErrorMessage('');

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGpsStatus('active');
        console.log('GPS Success:', position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log('GPS Error code:', error.code, error.message);
        setGpsStatus('error');

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsErrorMessage('請允許瀏覽器使用您的位置權限');
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsErrorMessage('無法取得位置，請稍後再試');
            break;
          case error.TIMEOUT:
            setGpsErrorMessage('定位超時，請稍後再試');
            break;
          default:
            setGpsErrorMessage('定位服務暫時無法使用');
        }

        // Use default Cheung Chau location for demo
        setUserLocation({ lat: 22.2086, lng: 114.0299 });
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000
      }
    );
  }, []);

  useEffect(() => {
    // Store current event ID for navigation back from QR scanner
    if (eventId) {
      localStorage.setItem('currentEventId', eventId);
    }

    // Load scanned checkpoints from localStorage
    const stored = localStorage.getItem('scannedCheckpoints');
    const storedScore = localStorage.getItem('userScore');

    if (stored) {
      setScannedCheckpoints(JSON.parse(stored));
    }

    if (storedScore) {
      setTotalScore(parseInt(storedScore));
    }

    // Request location on mount
    requestLocation();

    // Watch for location changes
    let watchId: number | undefined;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsStatus('active');
        },
        () => {
          // Silent fail for watch - we already have initial position
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [eventId, requestLocation]);

  const handleCheckpointClick = (checkpointId: string) => {
    // Check if already scanned
    if (scannedCheckpoints.includes(checkpointId)) {
      return;
    }
    navigate(`/checkpoint/${checkpointId}`);
  };

  if (!event) return <div style={styles.loading}>載入中...</div>;

  const scannedCount = event.checkpoints.filter(cp => scannedCheckpoints.includes(cp.id)).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button style={styles.backBtn} onClick={() => navigate('/events')}>
            ←
          </button>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>{event.name}</h1>
            <p style={styles.subtitle}>
              已完成 {scannedCount}/{event.checkpoints.length} 個簽碼
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div style={styles.viewToggle}>
          <button
            style={{
              ...styles.toggleBtn,
              ...(viewMode === 'list' ? styles.toggleBtnActive : {})
            }}
            onClick={() => setViewMode('list')}
          >
            <MapIcon size={16} />
            列表
          </button>
          <button
            style={{
              ...styles.toggleBtn,
              ...(viewMode === 'map' ? styles.toggleBtnActive : {})
            }}
            onClick={() => setViewMode('map')}
          >
            <Layers size={16} />
            地圖
          </button>
        </div>
      </div>

      {/* GPS Status Banner */}
      {gpsStatus === 'error' && (
        <div style={styles.gpsErrorBanner}>
          <div style={styles.gpsErrorContent}>
            <AlertTriangle size={18} />
            <span>{gpsErrorMessage || 'GPS定位失敗'}</span>
          </div>
          <button style={styles.retryButton} onClick={requestLocation}>
            <RefreshCw size={14} />
            重試
          </button>
        </div>
      )}

      {gpsStatus === 'loading' && (
        <div style={styles.gpsLoadingBanner}>
          <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
          <span>正在取得您的位置...</span>
        </div>
      )}

      {/* Quick Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem} onClick={() => navigate('/scores')}>
          <Trophy size={20} style={styles.statIcon} />
          <div>
            <div style={styles.statValue}>{totalScore}</div>
            <div style={styles.statLabel}>我的積分</div>
          </div>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem} onClick={() => navigate('/notices')}>
          <Bell size={20} style={styles.statIcon} />
          <div>
            <div style={styles.statValue}>2</div>
            <div style={styles.statLabel}>公告</div>
          </div>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem} onClick={() => navigate('/store')}>
          <ShoppingBag size={20} style={styles.statIcon} />
          <div>
            <div style={styles.statValue}>4</div>
            <div style={styles.statLabel}>獎品</div>
          </div>
        </div>
      </div>

      {/* Map View or List View */}
      <div style={styles.contentArea}>
        {viewMode === 'map' ? (
          <div style={styles.mapContainer}>
            <LeafletMap
              checkpoints={event.checkpoints.map(cp => ({
                ...cp,
                scanned: scannedCheckpoints.includes(cp.id)
              }))}
              userLocation={userLocation}
              onCheckpointClick={handleCheckpointClick}
            />
          </div>
        ) : (
          <div style={styles.checkpointsList}>
            {event.checkpoints.map((checkpoint, index) => {
              const scanned = scannedCheckpoints.includes(checkpoint.id);
              const distance = userLocation
                ? calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    checkpoint.location.lat,
                    checkpoint.location.lng
                  )
                : null;

              return (
                <div
                  key={checkpoint.id}
                  style={{
                    ...styles.checkpointCard,
                    ...(scanned ? styles.scannedCheckpoint : {})
                  }}
                  onClick={() => handleCheckpointClick(checkpoint.id)}
                >
                  <div style={styles.checkpointHeader}>
                    <div style={styles.checkpointIcon}>
                      {scanned ? '✅' : '📍'}
                    </div>
                    <div style={styles.checkpointNumber}>簽碼 #{index + 1}</div>
                    <div style={styles.checkpointPoints}>+{checkpoint.points} 分</div>
                  </div>
                  <div style={styles.checkpointInfo}>
                    <h3 style={styles.checkpointTitle}>{checkpoint.name}</h3>
                    <p style={styles.checkpointNameEn}>{checkpoint.nameEn}</p>
                    <p style={styles.checkpointDesc}>{checkpoint.description}</p>
                  </div>
                  {scanned ? (
                    <div style={styles.scannedBadge}>✅ 已完成</div>
                  ) : distance !== null ? (
                    <div style={distance < 30 ? styles.nearbyInfo : styles.distanceInfo}>
                      <MapPin size={12} />
                      {distance < 30 ? '您在簽碼範圍內！' : `距離 ${Math.round(distance)} 米`}
                    </div>
                  ) : null}
                  {!scanned && (
                    <div style={styles.scanHint}>
                      點擊前往掃描
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Progress */}
      <div style={styles.bottomProgress}>
        <div style={styles.progressInfo}>
          <div style={styles.progressPoints}>
            <Trophy size={20} style={{ color: '#20c997' }} />
            <span style={styles.pointsValue}>{totalScore}</span>
            <span style={styles.pointsLabel}>總積分</span>
          </div>
          <div style={styles.progressPercent}>
            {Math.round((scannedCount / event.checkpoints.length) * 100)}%
          </div>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(scannedCount / event.checkpoints.length) * 100}%`
            }}
          />
        </div>
        <p style={styles.progressText}>
          進度：{scannedCount}/{event.checkpoints.length} 完成
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Helper function
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
}

// Icons used
function AlertTriangle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function Loader({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}>
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    paddingBottom: '120px'
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#6c757d'
  },
  gpsErrorBanner: {
    background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
    color: 'white',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontWeight: '600'
  },
  gpsErrorContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  retryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  gpsLoadingBanner: {
    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    color: 'white',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '600'
  },
  header: {
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    color: 'white',
    paddingTop: '12px',
    paddingBottom: '16px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    padding: '0 16px'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleSection: {
    flex: 1
  },
  title: {
    fontSize: '18px',
    fontWeight: '800',
    marginBottom: '4px',
    letterSpacing: '1px'
  },
  subtitle: {
    fontSize: '12px',
    opacity: 0.9,
    fontWeight: '500'
  },
  viewToggle: {
    display: 'flex',
    gap: '8px',
    padding: '0 16px'
  },
  toggleBtn: {
    flex: 1,
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  toggleBtnActive: {
    background: 'white',
    color: '#20c997'
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'space-around',
    background: 'white',
    padding: '16px',
    margin: '16px',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    gap: '8px'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    flex: 1,
    justifyContent: 'center'
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: '#e9ecef'
  },
  statIcon: {
    color: '#20c997'
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1a202c'
  },
  statLabel: {
    fontSize: '11px',
    color: '#6c757d',
    fontWeight: '500'
  },
  contentArea: {
    margin: '0 16px 20px'
  },
  mapContainer: {
    height: '450px',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    background: 'white'
  },
  checkpointsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  checkpointCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '2px solid transparent'
  },
  scannedCheckpoint: {
    opacity: 0.7,
    background: '#f0fff4',
    border: '2px solid #20c997'
  },
  checkpointHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  checkpointIcon: {
    fontSize: '24px'
  },
  checkpointNumber: {
    background: '#20c997',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center' as const,
    margin: '0 8px'
  },
  checkpointPoints: {
    background: '#ffc107',
    color: '#1a202c',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '700'
  },
  checkpointInfo: {
    marginBottom: '12px'
  },
  checkpointTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '4px',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  checkpointNameEn: {
    fontSize: '12px',
    color: '#20c997',
    fontWeight: '600',
    marginBottom: '4px',
    fontStyle: 'italic' as const
  },
  checkpointDesc: {
    fontSize: '13px',
    color: '#6c757d',
    lineHeight: '1.5',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  scannedBadge: {
    color: '#20c997',
    fontSize: '14px',
    fontWeight: '700',
    textAlign: 'center' as const,
    padding: '8px',
    background: 'rgba(32, 201, 151, 0.1)',
    borderRadius: '8px'
  },
  nearbyInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: '#20c997',
    fontSize: '13px',
    fontWeight: '700',
    padding: '8px',
    background: 'rgba(32, 201, 151, 0.15)',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  distanceInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: '#3b82f6',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  scanHint: {
    color: '#20c997',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center' as const,
    padding: '8px',
    background: 'rgba(32, 201, 151, 0.1)',
    borderRadius: '8px'
  },
  bottomProgress: {
    position: 'fixed' as const,
    bottom: '0',
    left: '0',
    right: '0',
    background: 'white',
    padding: '16px 20px',
    borderTop: '1px solid #e9ecef',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  progressPoints: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  pointsValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1a202c'
  },
  pointsLabel: {
    fontSize: '14px',
    color: '#6c757d'
  },
  progressPercent: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#20c997'
  },
  progressBar: {
    height: '8px',
    background: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #20c997 0%, #0ca678 100%)',
    transition: 'width 0.3s'
  },
  progressText: {
    fontSize: '13px',
    color: '#6c757d',
    textAlign: 'center' as const,
    fontWeight: '600',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  }
};
