import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ToggleRight, ToggleLeft, X } from 'lucide-react';
import { mockEvents } from '../../lib/mockData';

export default function EventManagementScreen() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: ''
  });

  const toggleEventStatus = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, isActive: !event.isActive }
        : event
    ));
  };

  const handleCreateEvent = () => {
    if (!newEvent.name.trim()) return;

    const event = {
      id: Date.now().toString(),
      name: newEvent.name,
      description: newEvent.description,
      isActive: true,
      checkpoints: []
    };

    setEvents([...events, event]);
    setNewEvent({ name: '', description: '' });
    setShowCreateModal(false);
  };

  const handleAddCheckpoint = (eventId: string) => {
    // Navigate to checkpoint creation screen
    navigate(`/host/event/${eventId}/checkpoints`);
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

      <button style={styles.addBtn} onClick={() => setShowCreateModal(true)}>
        <Plus size={20} />
        創建新活動
      </button>

      {showCreateModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>創建新活動</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowCreateModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>活動名稱 *</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="例如：長洲島歷史文化探索"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>活動描述</label>
                <textarea
                  style={styles.textarea}
                  placeholder="探索長洲島的歷史古蹟與自然美景，發現隱藏的寶藏！"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div style={styles.modalFooter}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => setShowCreateModal(false)}
                >
                  取消
                </button>
                <button
                  style={styles.confirmBtn}
                  onClick={handleCreateEvent}
                  disabled={!newEvent.name.trim()}
                >
                  創建活動
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <button
                style={styles.addCpBtn}
                onClick={() => handleAddCheckpoint(event.id)}
              >
                + 添加簽碼點
              </button>
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
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#718096',
    padding: '4px'
  },
  modalBody: {
    padding: '24px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    transition: 'border-color 0.2s',
    outline: 'none'
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  },
  cancelBtn: {
    padding: '12px 24px',
    background: '#f8f9fa',
    border: 'none',
    borderRadius: '10px',
    color: '#4a5568',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  confirmBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    opacity: 1
  }
};
