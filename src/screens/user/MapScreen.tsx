import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, RefreshCw, Info, Compass, Trophy } from 'lucide-react';
import { mockEvents } from '../../lib/mockData';

export default function MapScreen() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [event] = useState(mockEvents.find(e => e.id === eventId) || mockEvents[0]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useState(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsStatus('success');
        },
        () => {
          setGpsStatus('error');
        }
      );
    }
  });

  const handleCheckpointClick = (checkpointId: string) => {
    navigate(`/checkpoint/${checkpointId}`);
  };

  const handleRefreshGPS = () => {
    setGpsStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsStatus('success');
        },
        () => {
          setGpsStatus('error');
        }
      );
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/events')}>
          <ArrowLeft size={20} />
          返回活動
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>{event.name}</h1>
          <p style={styles.subtitle}>{event.description}</p>
        </div>
      </div>

      {/* GPS Status Banner */}
      <div style={styles.bannerContainer}>
        {gpsStatus === 'loading' && (
          <div style={styles.statusBanner}>
            <RefreshCw size={14} style={styles.bannerIcon} />
            <span>正在獲取位置...</span>
          </div>
        )}
        {gpsStatus === 'error' && (
          <div style={{...styles.statusBanner, background: 'rgba(255, 59, 48, 0.08)', borderColor: 'rgba(255, 59, 48, 0.2)'}}>
            <Info size={14} style={{...styles.bannerIcon, color: '#ff3b30'}} />
            <span style={{color: '#ff3b30'}}>定位失敗</span>
            <button style={styles.retryButton} onClick={handleRefreshGPS}>
              重試
            </button>
          </div>
        )}
        {gpsStatus === 'success' && (
          <div style={{...styles.statusBanner, background: 'rgba(52, 199, 89, 0.08)', borderColor: 'rgba(52, 199, 89, 0.2)'}}>
            <MapPin size={14} style={{...styles.bannerIcon, color: '#34c759'}} />
            <span style={{color: '#34c759'}}>GPS 定位成功</span>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div style={styles.mapSection}>
        <div style={styles.mapContainer}>
          <div style={styles.mapPlaceholder}>
            <Compass size={64} style={styles.compassIcon} />
            <h2 style={styles.mapTitle}>互動式地圖</h2>
            <p style={styles.mapDesc}>顯示 {event.checkpoints.length} 個探索點</p>
            <div style={styles.mapStats}>
              <div style={styles.mapStat}>
                <MapPin size={16} style={styles.statIcon} />
                <div>
                  <div style={styles.statValue}>{event.checkpoints.length}</div>
                  <div style={styles.statLabel}>探索點</div>
                </div>
              </div>
              {userLocation && (
                <div style={styles.mapStat}>
                  <Navigation size={16} style={styles.statIcon} />
                  <div>
                    <div style={styles.statValue}>{userLocation.lat.toFixed(4)}</div>
                    <div style={styles.statLabel}>緯度</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoints Section */}
      <div style={styles.checkpointsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>探索點列表</h2>
          <div style={styles.progressBadge}>
            <Trophy size={14} style={styles.trophyIcon} />
            <span>最高 {event.checkpoints.reduce((sum, cp) => sum + cp.points, 0)} 分</span>
          </div>
        </div>

        <div style={styles.checkpointsList}>
          {event.checkpoints.map((checkpoint) => {
            const isNearby = userLocation && Math.abs(userLocation.lat - (checkpoint.location?.lat || 22.2)) < 0.001;
            return (
              <div
                key={checkpoint.id}
                style={{
                  ...styles.checkpointCard,
                  borderColor: isNearby ? '#667eea' : 'transparent',
                  borderWidth: isNearby ? '2px' : '1px',
                  background: isNearby ? 'rgba(102, 126, 234, 0.02)' : '#ffffff'
                }}
                onClick={() => handleCheckpointClick(checkpoint.id)}
              >
                <div style={styles.checkpointHeader}>
                  <div style={styles.checkpointInfo}>
                    <h3 style={styles.checkpointName}>{checkpoint.name}</h3>
                    {checkpoint.nameEn && (
                      <p style={styles.checkpointNameEn}>{checkpoint.nameEn}</p>
                    )}
                    {isNearby && (
                      <div style={styles.nearbyBadge}>
                        <Navigation size={12} />
                        <span>在附近</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.pointsBadge}>
                    +{checkpoint.points}
                  </div>
                </div>

                {checkpoint.description && (
                  <p style={styles.checkpointDesc}>{checkpoint.description}</p>
                )}

                <div style={styles.checkpointMeta}>
                  <MapPin size={13} style={styles.metaIcon} />
                  <span style={styles.metaText}>
                    {(checkpoint.location?.lat || 22.2).toFixed(4)}, {(checkpoint.location?.lng || 114.03).toFixed(4)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  header: {
    background: '#ffffff',
    borderBottom: '0.5px solid #e2e8f0',
    padding: '16px 20px 20px',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100
  },
  backButton: {
    background: '#f5f5f7',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '15px',
    fontWeight: 600,
    marginBottom: '16px',
    width: 'fit-content'
  },
  headerContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: '1.14',
    letterSpacing: '0.196px',
    color: '#1d1d1f',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '15px',
    lineHeight: '1.47',
    letterSpacing: '-0.374px',
    color: '#86868b',
    margin: 0,
    fontWeight: 400
  },
  bannerContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px 16px'
  },
  statusBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(102, 126, 234, 0.08)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 500
  },
  bannerIcon: {
    color: '#667eea'
  },
  retryButton: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '4px 12px',
    borderRadius: '8px'
  },
  mapSection: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px 24px'
  },
  mapContainer: {
    background: '#f5f5f7',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0'
  },
  mapPlaceholder: {
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '320px'
  },
  compassIcon: {
    color: '#86868b',
    marginBottom: '16px'
  },
  mapTitle: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '1.19',
    letterSpacing: '0.231px',
    color: '#1d1d1f',
    margin: '0 0 4px 0'
  },
  mapDesc: {
    fontSize: '15px',
    lineHeight: '1.47',
    letterSpacing: '-0.374px',
    color: '#86868b',
    margin: '0 0 24px 0',
    fontWeight: 400
  },
  mapStats: {
    display: 'flex',
    gap: '32px'
  },
  mapStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  statIcon: {
    color: '#86868b'
  },
  statValue: {
    fontSize: '17px',
    fontWeight: 700,
    lineHeight: '1.19',
    letterSpacing: '0.231px',
    color: '#1d1d1f'
  },
  statLabel: {
    fontSize: '13px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#86868b',
    fontWeight: 400
  },
  checkpointsSection: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px 40px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '1.14',
    letterSpacing: '0.196px',
    color: '#1d1d1f',
    margin: 0
  },
  progressBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid ' + 'rgba(102, 126, 234, 0.2)'
  },
  trophyIcon: {
    color: '#667eea'
  },
  checkpointsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  checkpointCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  checkpointHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  checkpointInfo: {
    flex: 1
  },
  checkpointName: {
    fontSize: '17px',
    fontWeight: 700,
    lineHeight: '1.19',
    letterSpacing: '0.231px',
    color: '#1d1d1f',
    margin: '0 0 4px 0'
  },
  checkpointNameEn: {
    fontSize: '13px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#86868b',
    margin: '0 0 8px 0',
    fontWeight: 400
  },
  nearbyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(52, 199, 89, 0.1)',
    color: '#34c759',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600
  },
  pointsBadge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: '6px 14px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 700,
    flexShrink: 0
  },
  checkpointDesc: {
    fontSize: '15px',
    lineHeight: '1.47',
    letterSpacing: '-0.374px',
    color: '#86868b',
    margin: '0 0 12px 0',
    fontWeight: 400
  },
  checkpointMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#86868b'
  },
  metaIcon: {
    flexShrink: 0
  },
  metaText: {
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 400
  }
};
