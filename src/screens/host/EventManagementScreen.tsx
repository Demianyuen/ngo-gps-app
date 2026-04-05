import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ToggleRight, ToggleLeft } from 'lucide-react';
import { mockEvents } from '../../lib/mockData';

export default function EventManagementScreen() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);

  const toggleEventStatus = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, isActive: !event.isActive }
        : event
    ));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/host/dashboard')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1 style={styles.title}>活動管理</h1>
      </div>

      <button style={styles.addBtn}>
        <Plus size={20} />
        創建新活動
      </button>

      <div style={styles.eventList}>
        {events.map((event) => (
          <div key={event.id} style={styles.eventCard}>
            <div style={styles.eventHeader}>
              <div>
                <h2 style={styles.eventName}>{event.name}</h2>
                <p style={styles.eventDesc}>{event.description}</p>
              </div>
              <button
                style={{
                  ...styles.toggleBtn,
                  background: event.isActive ? '#48bb78' : '#cbd5e0'
                }}
                onClick={() => toggleEventStatus(event.id)}
              >
                {event.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>

            <div style={styles.checkpointsSection}>
              <h3 style={styles.sectionTitle}>簽碼點 ({event.checkpoints.length})</h3>
              {event.checkpoints.map((checkpoint) => (
                <div key={checkpoint.id} style={styles.checkpointItem}>
                  <span style={styles.cpName}>{checkpoint.name}</span>
                  <span style={styles.cpPoints}>+{checkpoint.points} 分</span>
                </div>
              ))}
              <button style={styles.addCpBtn}>+ 添加簽碼點</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    padding: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  backBtn: {
    background: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1a202c'
  },
  addBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '20px'
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px'
  },
  eventCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  eventName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '4px'
  },
  eventDesc: {
    fontSize: '14px',
    color: '#718096'
  },
  toggleBtn: {
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    color: 'white',
    transition: 'all 0.2s'
  },
  checkpointsSection: {
    borderTop: '2px solid #e2e8f0',
    paddingTop: '16px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '12px'
  },
  checkpointItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  cpName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748'
  },
  cpPoints: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#667eea'
  },
  addCpBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '2px dashed #cbd5e0',
    borderRadius: '10px',
    color: '#718096',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  }
};
