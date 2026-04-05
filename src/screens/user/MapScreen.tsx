import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Bell, ShoppingBag, Layers, Map as MapIcon } from 'lucide-react';
import { mockEvents } from '../../lib/mockData';
import InteractiveMap from '../../components/InteractiveMap';

export default function MapScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = mockEvents.find(e => e.id === eventId);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [scannedCheckpoints, setScannedCheckpoints] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    // Store current event ID for navigation back from QR scanner
    if (eventId) {
      localStorage.setItem('currentEventId', eventId);
    }

    // Load scanned checkpoints from localStorage
    const stored = localStorage.getItem('scannedCheckpoints');
    const storedScore = localStorage.getItem('userScore');

    if (stored) {
      const scanned = JSON.parse(stored);
      setScannedCheckpoints(scanned);
    }

    if (storedScore) {
      setTotalScore(parseInt(storedScore));
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        () => {
          console.log('Geolocation not available');
        }
      );
    }
  }, [eventId]);

  const handleCheckpointClick = (checkpointId: string) => {
    // Check if already scanned
    if (scannedCheckpoints.includes(checkpointId)) {
      // Already scanned - show message
      return;
    }
    navigate(`/scan/${checkpointId}`);
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
            <p style={styles.subtitle}>已完成 {scannedCount}/{event.checkpoints.length} 個簽碼</p>
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
            <InteractiveMap
              checkpoints={event.checkpoints.map(cp => ({
                ...cp,
                scanned: scannedCheckpoints.includes(cp.id)
              }))}
              userLocation={userLocation}
              onCheckpointClick={handleCheckpointClick}
            />
            <div style={styles.mapTips}>
              <p style={styles.mapTipText}>💡 點擊地圖上的標記前往掃描</p>
              <p style={styles.mapTipText}>✅ 綠色 = 已完成 | ⚪ 白色 = 未完成</p>
            </div>
          </div>
        ) : (
          <div style={styles.checkpointsList}>
            {event.checkpoints.map((checkpoint, index) => {
              const scanned = scannedCheckpoints.includes(checkpoint.id);
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
                  {scanned && (
                    <div style={styles.scannedBadge}>✅ 已完成</div>
                  )}
                  {!scanned && userLocation && (
                    <div style={styles.distanceInfo}>
                      📍 距離你約 {Math.round(
                        calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          checkpoint.location.lat,
                          checkpoint.location.lng
                        )
                      )} 米
                    </div>
                  )}
                  {!scanned && (
                    <div style={styles.scanHint}>
                      點擊前往掃描 QR 碼
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
    </div>
  );
}

// Helper function to calculate distance between two coordinates (in meters)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
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

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    paddingBottom: '100px'
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#6c757d'
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
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    background: 'white'
  },
  mapTips: {
    background: 'rgba(32, 201, 151, 0.1)',
    padding: '12px 16px',
    borderTop: '1px solid #e9ecef'
  },
  mapTipText: {
    fontSize: '12px',
    color: '#0ca678',
    fontWeight: '600',
    margin: '4px 0',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
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
  distanceInfo: {
    color: '#3b82f6',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center' as const,
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
