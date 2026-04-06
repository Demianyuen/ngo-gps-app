import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Save, X, Eye, Trash2 } from 'lucide-react';

interface Checkpoint {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  history?: string;
  latitude?: number;
  longitude?: number;
  points: number;
}

interface Event {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  checkpoints: Checkpoint[];
}

export default function EventManagementScreen() {
  const navigate = useNavigate();

  // Load from localStorage or use mock data
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('ngo_events');
    if (saved) {
      return JSON.parse(saved);
    }
    return [{
      id: '1',
      name: '長洲島歷史文化探索',
      description: '探索長洲島的歷史古蹟與自然美景，發現隱藏的寶藏！',
      isActive: true,
      checkpoints: [
        {
          id: '1-1',
          name: '北帝廟',
          nameEn: 'Pak Tai Temple',
          description: '長洲最重要的廟宇',
          history: '北帝廟建於清朝乾隆年間，已有超過200年歷史。廟內供奉北帝，是長洲島上最古老的宗教建築之一。北帝又稱玄武真君，是道教中鎮守北方的大神。',
          latitude: 22.2025,
          longitude: 114.0300,
          points: 10
        },
        {
          id: '1-2',
          name: '太平清醮場地',
          nameEn: 'Tai Ping Qing Jiao Grounds',
          description: '著名的搶包山活動舉辦地',
          history: '太平清醮是長洲最盛大的傳統節慶，已有百多年歷史。最精彩的活動是「搶包山」，參賽者要攀爬由平安包堆成的的高塔，既刺激又熱鬧！',
          latitude: 22.2050,
          longitude: 114.0320,
          points: 15
        },
        {
          id: '1-3',
          name: '長洲長城',
          nameEn: 'Cheung Chau Miniature Wall',
          description: '縮小版長城地標',
          history: '這是長洲獨特的地標建築，雖然不是真正的長城，但展現了長洲居民對中華文化的熱愛。登上長城頂，可以俯瞰長洲島的美景。',
          latitude: 22.2080,
          longitude: 114.0340,
          points: 20
        },
        {
          id: '1-4',
          name: '東灣泳灘',
          nameEn: 'Tung Wan Beach',
          description: '美麗的海灘',
          history: '東灣泳灘是長洲島上最熱門的海灘之一，水清沙幼，是游泳和玩水的好地方。這裡曾經是香港電影《秋天的童話》的拍攝場景。',
          latitude: 22.2000,
          longitude: 114.0280,
          points: 10
        }
      ]
    }];
  });

  const [showEventModal, setShowEventModal] = useState(false);
  const [showCheckpointModal, setShowCheckpointModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'checkpoints'>('list');

  const [newEvent, setNewEvent] = useState({
    name: '',
    description: ''
  });

  const [newCheckpoint, setNewCheckpoint] = useState({
    name: '',
    nameEn: '',
    description: '',
    history: '',
    latitude: 22.2000,
    longitude: 114.0300,
    points: 10
  });

  // Save to localStorage whenever events change
  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('ngo_events', JSON.stringify(updatedEvents));
  };

  const handleCreateEvent = () => {
    if (!newEvent.name.trim()) {
      alert('請輸入活動名稱');
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      name: newEvent.name,
      description: newEvent.description,
      isActive: true,
      checkpoints: []
    };

    const updatedEvents = [...events, event];
    saveEvents(updatedEvents);

    setNewEvent({ name: '', description: '' });
    setShowEventModal(false);

    alert('活動創建成功！');
  };

  const handleToggleEventStatus = (eventId: string) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, isActive: !event.isActive }
        : event
    );
    saveEvents(updatedEvents);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('確定要刪除這個活動嗎？這將同時刪除所有相關的簽碼點。')) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      saveEvents(updatedEvents);
    }
  };

  const openCheckpointManagement = (eventId: string) => {
    setSelectedEventId(eventId);
    setViewMode('checkpoints');
  };

  const backToEventList = () => {
    setViewMode('list');
    setSelectedEventId('');
  };

  const handleAddCheckpoint = () => {
    if (!newCheckpoint.name.trim()) {
      alert('請輸入簽碼點名稱');
      return;
    }

    const checkpoint: Checkpoint = {
      id: `${selectedEventId}-${Date.now()}`,
      ...newCheckpoint
    };

    const updatedEvents = events.map(event => {
      if (event.id === selectedEventId) {
        return {
          ...event,
          checkpoints: [...event.checkpoints, checkpoint]
        };
      }
      return event;
    });

    saveEvents(updatedEvents);

    setNewCheckpoint({
      name: '',
      nameEn: '',
      description: '',
      history: '',
      latitude: 22.2000,
      longitude: 114.0300,
      points: 10
    });

    alert('簽碼點添加成功！');
  };

  const handleDeleteCheckpoint = (checkpointId: string) => {
    if (confirm('確定要刪除這個簽碼點嗎？')) {
      const updatedEvents = events.map(event => {
        if (event.id === selectedEventId) {
          return {
            ...event,
            checkpoints: event.checkpoints.filter(cp => cp.id !== checkpointId)
          };
        }
        return event;
      });
      saveEvents(updatedEvents);
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
          alert('位置獲取成功！');
        },
        (error) => {
          alert('無法獲取位置：' + error.message);
        }
      );
    } else {
      alert('您的瀏覽器不支持地理定位');
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  if (viewMode === 'checkpoints' && selectedEvent) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={backToEventList}>
            <ArrowLeft size={20} />
            返回活動列表
          </button>
          <div style={styles.headerTitle}>
            <h1 style={styles.title}>管理簽碼點</h1>
            <p style={styles.subtitle}>{selectedEvent.name}</p>
          </div>
        </div>

        <button
          style={styles.addBtn}
          onClick={() => setShowCheckpointModal(true)}
        >
          <Plus size={20} />
          添加簽碼點
        </button>

        <div style={styles.checkpointList}>
          {selectedEvent.checkpoints.map((checkpoint) => (
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
                  +{checkpoint.points}分
                </div>
              </div>

              {checkpoint.history && (
                <div style={styles.historySection}>
                  <h4 style={styles.historyTitle}>📜 歷史故事</h4>
                  <p style={styles.historyText}>{checkpoint.history}</p>
                </div>
              )}

              <div style={styles.cpLocation}>
                <MapPin size={14} />
                <span style={styles.cpCoords}>
                  {(checkpoint.latitude || 22.2000).toFixed(4)}, {(checkpoint.longitude || 114.0300).toFixed(4)}
                </span>
              </div>

              <div style={styles.cpActions}>
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

        {showCheckpointModal && (
          <div style={styles.modalOverlay} onClick={() => setShowCheckpointModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>添加簽碼點</h2>
                <button style={styles.closeBtn} onClick={() => setShowCheckpointModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>簽碼點名稱 *</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="例如：張保仔洞"
                    value={newCheckpoint.name}
                    onChange={(e) => setNewCheckpoint({ ...newCheckpoint, name: e.target.value })}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>英文名稱</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="Cheung Po Tsai Cave"
                    value={newCheckpoint.nameEn}
                    onChange={(e) => setNewCheckpoint({ ...newCheckpoint, nameEn: e.target.value })}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>簡短描述</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="這個簽碼點的簡短描述..."
                    value={newCheckpoint.description}
                    onChange={(e) => setNewCheckpoint({ ...newCheckpoint, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>📜 歷史故事與特別事蹟</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="張保仔是清朝著名的海盜，據說他在這個洞穴收藏了無數寶藏，就像海賊王羅傑一樣尋找大秘寶！這些寶藏包括了金銀珠寶、古董文物，甚至還有傳說中的神秘藏寶圖..."
                    value={newCheckpoint.history}
                    onChange={(e) => setNewCheckpoint({ ...newCheckpoint, history: e.target.value })}
                    rows={5}
                  />
                  <p style={styles.hint}>💡 提示：可以添加有趣的歷史故事、傳說、特別的事蹟，讓探索更有趣！</p>
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

                <button style={styles.locationBtn} onClick={handleGetLocation}>
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
                    onChange={(e) => setNewCheckpoint({ ...newCheckpoint, points: parseInt(e.target.value) || 10 })}
                  />
                </div>

                <div style={styles.modalFooter}>
                  <button style={styles.cancelBtn} onClick={() => setShowCheckpointModal(false)}>
                    取消
                  </button>
                  <button style={styles.confirmBtn} onClick={handleAddCheckpoint}>
                    <Save size={16} />
                    添加簽碼點
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/host/dashboard')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1 style={styles.title}>活動管理</h1>
      </div>

      <button
        style={styles.addBtn}
        onClick={() => setShowEventModal(true)}
      >
        <Plus size={20} />
        創建新活動
      </button>

      <div style={styles.eventList}>
        {events.map((event) => (
          <div key={event.id} style={styles.eventCard}>
            <div style={styles.eventHeader}>
              <div style={styles.eventInfo}>
                <h2 style={styles.eventName}>{event.name}</h2>
                <p style={styles.eventDesc}>{event.description}</p>
              </div>
              <div style={styles.eventActions}>
                <button
                  style={{
                    ...styles.toggleBtn,
                    background: event.isActive ? '#48bb78' : '#cbd5e0'
                  }}
                  onClick={() => handleToggleEventStatus(event.id)}
                  title={event.isActive ? '停用' : '啟用'}
                >
                  {event.isActive ? '● 啟用' : '○ 停用'}
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDeleteEvent(event.id)}
                  title="刪除活動"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div style={styles.checkpointsSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>簽碼點 ({event.checkpoints.length})</h3>
                <button
                  style={styles.manageBtn}
                  onClick={() => openCheckpointManagement(event.id)}
                >
                  <Eye size={16} />
                  管理
                </button>
              </div>

              {event.checkpoints.slice(0, 3).map((checkpoint) => (
                <div key={checkpoint.id} style={styles.checkpointItem}>
                  <span style={{...styles.cpName, fontSize: '14px'}}>{checkpoint.name}</span>
                  <span style={{fontSize: '13px', fontWeight: '700', color: '#667eea'}}>+{checkpoint.points}分</span>
                </div>
              ))}

              {event.checkpoints.length > 3 && (
                <p style={styles.moreText}>
                  還有 {event.checkpoints.length - 3} 個簽碼點...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showEventModal && (
        <div style={styles.modalOverlay} onClick={() => setShowEventModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>創建新活動</h2>
              <button style={styles.closeBtn} onClick={() => setShowEventModal(false)}>
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
                <button style={styles.cancelBtn} onClick={() => setShowEventModal(false)}>
                  取消
                </button>
                <button style={styles.confirmBtn} onClick={handleCreateEvent}>
                  <Save size={16} />
                  創建活動
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
    background: 'f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    padding: '20px',
    paddingBottom: '100px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  headerTitle: {
    flex: 1
  },
  backBtn: {
    background: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '600'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1a202c',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    margin: 0
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
  eventInfo: {
    flex: 1
  },
  eventName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px',
    margin: 0
  },
  eventDesc: {
    fontSize: '14px',
    color: '#718096',
    margin: 0,
    lineHeight: '1.5'
  },
  eventActions: {
    display: 'flex',
    gap: '8px'
  },
  toggleBtn: {
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap' as const
  },
  deleteBtn: {
    background: '#fff5f5',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    color: '#e53e3e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkpointsSection: {
    borderTop: '2px solid #e2e8f0',
    paddingTop: '16px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  manageBtn: {
    background: '#667eea',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  checkpointItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '14px'
  },
  moreText: {
    fontSize: '13px',
    color: '#718096',
    margin: '8px 0 0 0',
    fontStyle: 'italic'
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
    marginBottom: '4px',
    margin: 0
  },
  cpNameEn: {
    fontSize: '13px',
    color: '#718096',
    margin: '0 0 8px 0'
  },
  cpDesc: {
    fontSize: '14px',
    color: '#4a5568',
    margin: 0,
    lineHeight: '1.5'
  },
  cpPointsBadge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '700'
  },
  historySection: {
    background: '#fef5e7',
    borderLeft: '4px solid #f39c12',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px'
  },
  historyTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#d35400',
    margin: '0 0 8px 0'
  },
  historyText: {
    fontSize: '14px',
    color: '#2c3e50',
    margin: 0,
    lineHeight: '1.6'
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
  hint: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '6px',
    margin: 0,
    fontStyle: 'italic'
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
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  }
};
