import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Minus } from 'lucide-react';
import { mockUsers } from '../../lib/mockData';

export default function UserScoresScreen() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const adjustScore = (userId: string, amount: number) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, score: Math.max(0, user.score + amount) }
        : user
    ));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/host/dashboard')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1 style={styles.title}>用戶積分管理</h1>
      </div>

      <div style={styles.searchBar}>
        <Search size={20} style={styles.searchIcon} />
        <input
          type="text"
          placeholder="搜尋用戶名稱或電話..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.userList}>
        {filteredUsers.map((user) => (
          <div key={user.id} style={styles.userCard}>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user.name}</div>
              <div style={styles.userPhone}>{user.phone}</div>
            </div>
            <div style={styles.scoreSection}>
              <div style={styles.score}>{user.score} 分</div>
              <div style={styles.adjustBtns}>
                <button
                  style={styles.adjustBtn}
                  onClick={() => adjustScore(user.id, -5)}
                >
                  <Minus size={16} />
                  -5
                </button>
                <button
                  style={styles.adjustBtn}
                  onClick={() => adjustScore(user.id, 5)}
                >
                  <Plus size={16} />
                  +5
                </button>
              </div>
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
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  searchIcon: {
    color: '#a0aec0',
    marginRight: '12px'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px'
  },
  userList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  userCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '4px'
  },
  userPhone: {
    fontSize: '14px',
    color: '#718096'
  },
  scoreSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '8px'
  },
  score: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#667eea'
  },
  adjustBtns: {
    display: 'flex',
    gap: '8px'
  },
  adjustBtn: {
    padding: '6px 12px',
    background: '#e9ecef',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }
};
