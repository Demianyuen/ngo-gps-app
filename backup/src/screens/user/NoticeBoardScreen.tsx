import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Clock } from 'lucide-react';
import { mockNotices } from '../../lib/mockData';

export default function NoticeBoardScreen() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 style={styles.title}>
          <Bell size={24} style={styles.titleIcon} />
          Notice Board
        </h1>
      </div>

      <div style={styles.content}>
        {mockNotices.map((notice) => (
          <div key={notice.id} style={styles.noticeCard}>
            <div style={styles.noticeHeader}>
              <h2 style={styles.noticeTitle}>{notice.title}</h2>
              <div style={styles.timestamp}>
                <Clock size={14} style={styles.clockIcon} />
                {notice.timestamp.toLocaleDateString()}
              </div>
            </div>
            <p style={styles.noticeContent}>{notice.content}</p>
          </div>
        ))}

        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>💡 Tips</h3>
          <ul style={styles.tipsList}>
            <li>Scan QR codes at each checkpoint to earn points</li>
            <li>Visit the redemption counter to claim your prizes</li>
            <li>Check this board for updates and announcements</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1
  },
  titleIcon: {
    flexShrink: 0
  },
  content: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  noticeCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderLeft: '4px solid #667eea'
  },
  noticeHeader: {
    marginBottom: '12px'
  },
  noticeTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '6px'
  },
  timestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#a0aec0'
  },
  clockIcon: {
    flexShrink: 0
  },
  noticeContent: {
    fontSize: '15px',
    color: '#4a5568',
    lineHeight: '1.6'
  },
  infoCard: {
    background: 'linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%)',
    borderRadius: '16px',
    padding: '20px',
    border: '2px dashed #cbd5e0'
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '12px'
  },
  tipsList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#4a5568',
    lineHeight: '1.8'
  }
};
