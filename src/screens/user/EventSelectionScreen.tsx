import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { mockEvents } from '../../lib/mockData';

export default function EventSelectionScreen() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.backBtn} onClick={() => navigate(-1)}>← 返回</div>
        <h1 style={styles.title}>選擇探索活動</h1>
        <p style={styles.subtitle}>選擇您想參加的定向活動</p>
      </div>

      {/* Events List */}
      <div style={styles.eventsList}>
        {mockEvents.map((event) => (
          <div
            key={event.id}
            style={styles.eventCard}
            onClick={() => navigate(`/map/${event.id}`)}
          >
            {/* Event Image Placeholder */}
            <div style={styles.eventImage}>
              <MapPin size={48} style={styles.eventIcon} />
              {event.isActive && (
                <span style={styles.activeBadge}>進行中</span>
              )}
            </div>

            {/* Event Info */}
            <div style={styles.eventInfo}>
              <h2 style={styles.eventTitle}>{event.name}</h2>
              <p style={styles.eventDesc}>{event.description}</p>

              {/* Event Stats */}
              <div style={styles.eventStats}>
                <div style={styles.stat}>
                  <MapPin size={16} style={styles.statIcon} />
                  <span style={styles.statText}>{event.checkpoints.length} 個簽碼</span>
                </div>
                <div style={styles.stat}>
                  <Users size={16} style={styles.statIcon} />
                  <span style={styles.statText}>156 人參加</span>
                </div>
                <div style={styles.stat}>
                  <Clock size={16} style={styles.statIcon} />
                  <span style={styles.statText}>進行中</span>
                </div>
              </div>

              {/* Join Button */}
              <button style={styles.joinBtn}>
                立即參加
                <ArrowRight size={18} style={styles.btnIcon} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div style={styles.bottomInfo}>
        <p style={styles.infoText}>完成探索後，可用積分換取紀念品</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    color: 'white',
    padding: '24px 20px',
    textAlign: 'center' as const
  },
  backBtn: {
    position: 'absolute' as const,
    left: '20px',
    top: '24px',
    background: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '1px'
  },
  subtitle: {
    fontSize: '14px',
    opacity: 0.9,
    fontWeight: '500'
  },
  eventsList: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  eventCard: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    marginBottom: '20px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '1px solid #e9ecef'
  },
  eventImage: {
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    color: 'white'
  },
  eventIcon: {
    opacity: 0.8
  },
  activeBadge: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    background: 'rgba(255,255,255,0.95)',
    color: '#0ca678',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700'
  },
  eventInfo: {
    padding: '20px'
  },
  eventTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  eventDesc: {
    fontSize: '14px',
    color: '#6c757d',
    marginBottom: '16px',
    lineHeight: '1.6',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  eventStats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  statIcon: {
    color: '#20c997'
  },
  statText: {
    fontSize: '13px',
    color: '#495057',
    fontWeight: '500'
  },
  joinBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif',
    boxShadow: '0 4px 12px rgba(32, 201, 151, 0.3)'
  },
  btnIcon: {
    marginLeft: '8px'
  },
  bottomInfo: {
    textAlign: 'center' as const,
    padding: '20px',
    background: 'white',
    borderTop: '1px solid #e9ecef'
  },
  infoText: {
    fontSize: '14px',
    color: '#6c757d',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  }
};
