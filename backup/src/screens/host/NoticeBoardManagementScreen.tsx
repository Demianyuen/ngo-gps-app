import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { mockNotices } from '../../lib/mockData';

export default function NoticeBoardManagementScreen() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState(mockNotices);

  const deleteNotice = (noticeId: string) => {
    setNotices(notices.filter(notice => notice.id !== noticeId));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/host/dashboard')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1 style={styles.title}>公告管理</h1>
      </div>

      <button style={styles.addBtn}>
        <Plus size={20} />
        發布新公告
      </button>

      <div style={styles.noticeList}>
        {notices.map((notice) => (
          <div key={notice.id} style={styles.noticeCard}>
            <div style={styles.noticeHeader}>
              <div>
                <h3 style={styles.noticeTitle}>{notice.title}</h3>
                <div style={styles.timestamp}>
                  {notice.timestamp.toLocaleDateString()} {notice.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteNotice(notice.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
            <p style={styles.noticeContent}>{notice.content}</p>
            <button style={styles.editBtn}>編輯公告</button>
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
    background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
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
  noticeList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  noticeCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderLeft: '4px solid #9f7aea'
  },
  noticeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  noticeTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '4px'
  },
  timestamp: {
    fontSize: '13px',
    color: '#a0aec0'
  },
  deleteBtn: {
    padding: '8px',
    background: '#fff5f5',
    border: 'none',
    borderRadius: '8px',
    color: '#e53e3e',
    cursor: 'pointer'
  },
  noticeContent: {
    fontSize: '15px',
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '16px'
  },
  editBtn: {
    padding: '8px 16px',
    background: 'transparent',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    color: '#718096',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
