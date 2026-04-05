import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, ArrowRight, LogOut, Trophy } from 'lucide-react';
import { mockEvents } from '../../lib/mockData';

export default function EventSelectionScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('確定要登出嗎？')) {
      localStorage.removeItem('ngo_user');
      localStorage.removeItem('ngo_current_event');
      navigate('/login');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} />
          登出
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>選擇探索活動</h1>
          <p style={styles.subtitle}>發現精彩旅程，探索文化寶藏</p>
        </div>
      </div>

      {/* Events List */}
      <div style={styles.eventsList}>
        {mockEvents.map((event) => (
          <div
            key={event.id}
            style={styles.eventCard}
            onClick={() => navigate(`/map/${event.id}`)}
          >
            {/* Status Badge */}
            {event.isActive && (
              <div style={styles.activeBadge}>
                進行中
              </div>
            )}

            {/* Event Info */}
            <div style={styles.eventInfo}>
              <h2 style={styles.eventName}>{event.name}</h2>
              <p style={styles.eventDesc}>{event.description}</p>

              {/* Stats */}
              <div style={styles.stats}>
                <div style={styles.stat}>
                  <MapPin size={16} style={styles.statIcon} />
                  <span style={styles.statText}>{event.checkpoints.length} 個簽碼點</span>
                </div>
                <div style={styles.stat}>
                  <Users size={16} style={styles.statIcon} />
                  <span style={styles.statText}>156 人參加</span>
                </div>
                <div style={styles.stat}>
                  <Clock size={16} style={styles.statIcon} />
                  <span style={styles.statText}>全天開放</span>
                </div>
              </div>

              {/* Reward Preview */}
              <div style={styles.rewardPreview}>
                <Trophy size={14} style={styles.trophyIcon} />
                <span style={styles.rewardText}>最高可獲得 120 積分</span>
              </div>
            </div>

            {/* Action */}
            <div style={styles.actionSection}>
              <button style={styles.joinButton}>
                立即參加
                <ArrowRight size={18} style={styles.arrowIcon} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div style={styles.bottomInfo}>
        <p style={styles.infoText}>完成探索後，可用積分兌換精美紀念品</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang TC", "Microsoft JhengHei", sans-serif',
    paddingBottom: '80px'
  },
  header: {
    position: 'sticky' as const,
    top: 0,
    background: 'rgba(255, 255, 255, 0.94)',
    backdropFilter: 'saturate(180%) blur(20px)',
    borderBottom: '0.5px solid #e2e8f0',
    padding: '24px 20px',
    zIndex: 100
  },
  logoutButton: {
    position: 'absolute' as const,
    right: '20px',
    top: '24px',
    background: '#f5f5f7',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    color: '#86868b',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
  },
  headerContent: {
    maxWidth: '800px',
    margin: '0 auto',
    paddingTop: '40px'
  },
  title: {
    fontSize: '40px',
    fontWeight: 600,
    lineHeight: '1.10',
    letterSpacing: 'normal',
    color: '#1d1d1f',
    margin: '0 0 8px 0',
    textAlign: 'center' as const
  },
  subtitle: {
    fontSize: '17px',
    lineHeight: '1.47',
    letterSpacing: '-0.374px',
    color: '#86868b',
    margin: 0,
    textAlign: 'center' as const,
    fontWeight: 400
  },
  eventsList: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px'
  },
  eventCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f5f5f7',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px'
  },
  activeBadge: {
    position: 'absolute' as const,
    top: '24px',
    left: '24px',
    background: 'rgba(52, 199, 89, 0.1)',
    color: '#34c759',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '-0.12px'
  },
  eventInfo: {
    flex: 1,
    paddingLeft: '100px'
  },
  eventName: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '1.19',
    letterSpacing: '0.231px',
    color: '#1d1d1f',
    margin: '0 0 8px 0'
  },
  eventDesc: {
    fontSize: '15px',
    lineHeight: '1.47',
    letterSpacing: '-0.374px',
    color: '#86868b',
    margin: '0 0 16px 0',
    fontWeight: 400
  },
  stats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '16px'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  statIcon: {
    color: '#86868b'
  },
  statText: {
    fontSize: '14px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#86868b',
    fontWeight: 500
  },
  rewardPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    padding: '10px 16px',
    borderRadius: '12px',
    width: 'fit-content'
  },
  trophyIcon: {
    color: '#667eea'
  },
  rewardText: {
    fontSize: '13px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#667eea',
    fontWeight: 600
  },
  actionSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px'
  },
  joinButton: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '14px',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    letterSpacing: '-0.224px',
    whiteSpace: 'nowrap' as const
  },
  arrowIcon: {
    transition: 'transform 0.2s ease'
  },
  bottomInfo: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 20px'
  },
  infoText: {
    fontSize: '14px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#86868b',
    margin: 0,
    textAlign: 'center' as const,
    fontWeight: 400
  }
};
