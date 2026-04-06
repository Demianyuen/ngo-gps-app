import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Trash2, Edit2, X } from 'lucide-react';
import { mockEvents } from '../../lib/mockData';

interface Checkpoint {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  points: number;
}

export default function CheckpointManagementScreen() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [event] = useState(mockEvents.find(e => e.id === eventId) || mockEvents[0]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(event.checkpoints);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCheckpoint, setEditingCheckpoint] = useState<Checkpoint | null>(null);
  const [newCheckpoint, setNewCheckpoint] = useState({
    name: '',
    nameEn: '',
    description: '',
    latitude: 22.2000,
    longitude: 114.0300,
    points: 10
  });

  const handleAddCheckpoint = () => {
    if (!newCheckpoint.name.trim()) return;

    const checkpoint: Checkpoint = {
      id: Date.now().toString(),
      ...newCheckpoint
    };

    setCheckpoints([...checkpoints, checkpoint]);
    setNewCheckpoint({
      name: '',
      nameEn: '',
      description: '',
      latitude: 22.2000,
      longitude: 114.0300,
      points: 10
    });
    setShowAddModal(false);
  };

  const handleEditCheckpoint = (checkpoint: Checkpoint) => {
    setEditingCheckpoint(checkpoint);
    setNewCheckpoint({
      name: checkpoint.name,
      nameEn: checkpoint.nameEn || '',
      description: checkpoint.description || '',
      latitude: checkpoint.latitude || 22.2000,
      longitude: checkpoint.longitude || 114.0300,
      points: checkpoint.points
    });
    setShowAddModal(true);
  };

  const handleUpdateCheckpoint = () => {
    if (!editingCheckpoint || !newCheckpoint.name.trim()) return;

    setCheckpoints(checkpoints.map(cp =>
      cp.id === editingCheckpoint.id ? { ...cp, ...newCheckpoint } : cp
    ));

    setEditingCheckpoint(null);
    setNewCheckpoint({
      name: '',
      nameEn: '',
      description: '',
      latitude: 22.2000,
      longitude: 114.0300,
      points: 10
    });
    setShowAddModal(false);
  };

  const handleDeleteCheckpoint = (checkpointId: string) => {
    if (confirm('確定要刪除這個簽碼點嗎？')) {
      setCheckpoints(checkpoints.filter(cp => cp.id !== checkpointId));
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewCheckpoint({
            ...newCheckpoint,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          alert('無法獲取位置：' + error.message);
        }
      );
    } else {
      alert('您的瀏覽器不支持地理定位');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/host/events')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1 style={styles.title}>管理簽碼點</h1>
      </div>

      <div style={styles.eventInfo}>
        <h2 style={styles.eventName}>{event.name}</h2>
        <p style={styles.eventDesc}>{event.description}</p>
      </div>

      <button
        style={styles.addBtn}
        onClick={() => {
          setEditingCheckpoint(null);
          setShowAddModal(true);
        }}
      >
        <Plus size={20} />
        添加簽碼點
      </button>

      <div style={styles.checkpointList}>
        {checkpoints.map((checkpoint) => (
          <div key={checkpoint.id} style={styles.checkpointCard}>
            <div style={styles.cpHeader}>
              <div style={styles.cpInfo}>
                <h3 style={styles.cpName}>{checkpoint.name}</h3>
                {checkpoint.nameEn && (
                  <p style={styles.cpNameEn}>{checkpoint.nameEn}</p>
                )}
                <p style={styles.cpDesc}>{checkpoint.description}</p>
              </div>
              <div style={styles.cpPointsBadge}>
                +{checkpoint.points}
              </div>
            </div>

            <div style={styles.cpLocation}>
              <MapPin size={14} />
              <span style={styles.cpCoords}>
                {(checkpoint.latitude || 22.2000).toFixed(4)}, {(checkpoint.longitude || 114.0300).toFixed(4)}
              </span>
            </div>

            <div style={styles.cpActions}>
              <button
                style={styles.editBtn}
                onClick={() => handleEditCheckpoint(checkpoint)}
              >
                <Edit2 size={16} />
                編輯
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDeleteCheckpoint(checkpoint.id)}
              >
                <Trash2 size={16} />
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingCheckpoint ? '編輯簽碼點' : '添加簽碼點'}
              </h2>
              <button
                style={styles.closeBtn}
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCheckpoint(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>簽碼點名稱 *</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="例如：北帝廟"
                  value={newCheckpoint.name}
                  onChange={(e) => setNewCheckpoint({ ...newCheckpoint, name: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>英文名稱（可選）</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="例如：Pak Tai Temple"
                  value={newCheckpoint.nameEn}
                  onChange={(e) => setNewCheckpoint({ ...newCheckpoint, nameEn: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>描述</label>
                <textarea
                  style={styles.textarea}
                  placeholder="這個簽碼點的簡短描述..."
                  value={newCheckpoint.description}
                  onChange={(e) => setNewCheckpoint({ ...newCheckpoint, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>緯度</label>
                  <input
                    type="number"
                    step="0.0001"
                    style={styles.input}
                    value={newCheckpoint.latitude}
                    onChange={(e) => setNewCheckpoint({ ...newCheckpoint, latitude: parseFloat(e.target.value) })}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>經度</label>
                  <input
                    type="number"
                    step="0.0001"
                    style={styles.input}
                    value={newCheckpoint.longitude}
                    onChange={(e) => setNewCheckpoint({ ...newCheckpoint, longitude: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <button
                style={styles.locationBtn}
                onClick={handleGetLocation}
              >
                <MapPin size={16} />
                使用當前位置
              </button>

              <div style={styles.formGroup}>
                <label style={styles.label}>積分值</label>
                <input
                  type="number"
                  style={styles.input}
                  placeholder="10"
                  value={newCheckpoint.points}
                  onChange={(e) => setNewCheckpoint({ ...newCheckpoint, points: parseInt(e.target.value) })}
                />
              </div>

              <div style={styles.modalFooter}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCheckpoint(null);
                  }}
                >
                  取消
                </button>
                <button
                  style={styles.confirmBtn}
                  onClick={editingCheckpoint ? handleUpdateCheckpoint : handleAddCheckpoint}
                  disabled={!newCheckpoint.name.trim()}
                >
                  {editingCheckpoint ? '更新' : '添加'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
    marginBottom: '20px'
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
  eventInfo: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '20px',
    color: 'white',
    marginBottom: '20px'
  },
  eventName: {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  eventDesc: {
    fontSize: '14px',
    margin: 0,
    opacity: 0.9
  },
  addBtn: {
    width: '100%',
    padding: '16px',
    background: 'white',
    border: '2px dashed #667eea',
    borderRadius: '12px',
    color: '#667eea',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '20px'
  },
  checkpointList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  checkpointCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  cpHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  cpInfo: {
    flex: 1
  },
  cpName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 4px 0'
  },
  cpNameEn: {
    fontSize: '12px',
    color: '#718096',
    margin: '0 0 4px 0'
  },
  cpDesc: {
    fontSize: '13px',
    color: '#718096',
    margin: 0
  },
  cpPointsBadge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '700'
  },
  cpLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
    color: '#718096',
    fontSize: '13px'
  },
  cpCoords: {
    fontFamily: 'monospace'
  },
  cpActions: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    flex: 1,
    padding: '10px',
    background: '#f8f9fa',
    border: 'none',
    borderRadius: '8px',
    color: '#4a5568',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px'
  },
  deleteBtn: {
    flex: 1,
    padding: '10px',
    background: '#fff5f5',
    border: 'none',
    borderRadius: '8px',
    color: '#e53e3e',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px'
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
    marginBottom: '16px'
  },
  formRow: {
    display: 'flex',
    gap: '12px'
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
  locationBtn: {
    width: '100%',
    padding: '12px',
    background: '#48bb78',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '16px'
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
