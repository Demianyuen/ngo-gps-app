import { useNavigate } from 'react-router-dom';
import { Users, MapPin, ShoppingBag, Bell, LogOut, BarChart3 } from 'lucide-react';

export default function HostDashboardScreen() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: MapPin, label: '活動管理', route: '/host/events', color: '#667eea' },
    { icon: ShoppingBag, label: '獎品管理', route: '/host/store', color: '#48bb78' },
    { icon: Users, label: '用戶積分', route: '/host/users', color: '#ed8936' },
    { icon: Bell, label: '公告管理', route: '/host/notices', color: '#9f7aea' },
    { icon: BarChart3, label: '積分調整', route: '/host/redemption', color: '#38b2ac' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 工作人員後台</h1>
        <p style={styles.subtitle}>管理您的定向探索活動</p>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>156</div>
          <div style={styles.statLabel}>總參與人數</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>48</div>
          <div style={styles.statLabel}>當前在線</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>2,340</div>
          <div style={styles.statLabel}>已發放積分</div>
        </div>
      </div>

      <div style={styles.menu}>
        {menuItems.map((item) => (
          <div
            key={item.route}
            style={styles.menuItem}
            onClick={() => navigate(item.route)}
          >
            <div style={{ ...styles.menuIcon, background: item.color }}>
              <item.icon size={24} color="white" />
            </div>
            <span style={styles.menuLabel}>{item.label}</span>
          </div>
        ))}
      </div>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        <LogOut size={20} />
        登出
      </button>
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
    marginBottom: '32px',
    textAlign: 'center' as const
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px'
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#667eea',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#718096',
    fontWeight: '600'
  },
  menu: {
    display: 'grid',
    gap: '12px',
    marginBottom: '24px'
  },
  menuItem: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.2s'
  },
  menuIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuLabel: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c'
  },
  logoutBtn: {
    width: '100%',
    padding: '16px',
    background: '#e53e3e',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  }
};
