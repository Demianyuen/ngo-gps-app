import { useNavigate } from 'react-router-dom';
import { Users, MapPin, ShoppingBag, Bell, BarChart3, LogOut, TrendingUp, Activity, Award } from 'lucide-react';

export default function HostDashboardScreen() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: MapPin,
      label: '活動管理',
      route: '/host/events',
      color: '#667eea',
      description: '創建和管理探索活動'
    },
    {
      icon: ShoppingBag,
      label: '獎品管理',
      route: '/host/store',
      color: '#34c759',
      description: '設置獎品和庫存'
    },
    {
      icon: Users,
      label: '用戶積分',
      route: '/host/users',
      color: '#ff9500',
      description: '查看和調整積分'
    },
    {
      icon: Bell,
      label: '公告管理',
      route: '/host/notices',
      color: '#5856d6',
      description: '發送活動通知'
    },
    {
      icon: BarChart3,
      label: '兌換記錄',
      route: '/host/redemption',
      color: '#30d158',
      description: '管理獎品兌換'
    }
  ];

  const stats = [
    { value: '156', label: '總參與人數', icon: Users, color: '#667eea' },
    { value: '48', label: '當前在線', icon: Activity, color: '#34c759' },
    { value: '2,340', label: '已發放積分', icon: Award, color: '#ff9500' }
  ];

  const handleLogout = () => {
    if (confirm('確定要登出嗎？')) {
      localStorage.removeItem('ngo_host');
      navigate('/login');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>管理後台</h1>
          <p style={styles.subtitle}>定向活動管理系統</p>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} />
          登出
        </button>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={{...styles.statIcon, background: stat.color}}>
              <stat.icon size={24} color="#ffffff" />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>快速操作</h2>
        <div style={styles.actionGrid}>
          <div style={styles.actionCard} onClick={() => navigate('/host/events')}>
            <MapPin size={32} style={styles.actionIcon} />
            <div style={styles.actionContent}>
              <h3 style={styles.actionTitle}>創建活動</h3>
              <p style={styles.actionDesc}>添加新的探索活動</p>
            </div>
          </div>

          <div style={styles.actionCard} onClick={() => navigate('/host/store')}>
            <ShoppingBag size={32} style={styles.actionIcon} />
            <div style={styles.actionContent}>
              <h3 style={styles.actionTitle}>管理獎品</h3>
              <p style={styles.actionDesc}>添加獎品和庫存</p>
            </div>
          </div>

          <div style={styles.actionCard} onClick={() => navigate('/host/users')}>
            <TrendingUp size={32} style={styles.actionIcon} />
            <div style={styles.actionContent}>
              <h3 style={styles.actionTitle}>查看積分</h3>
              <p style={styles.actionDesc}>用戶積分排行榜</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={styles.menuSection}>
        <h2 style={styles.sectionTitle}>功能選單</h2>
        <div style={styles.menuGrid}>
          {menuItems.map((item) => (
            <div
              key={item.route}
              style={styles.menuCard}
              onClick={() => navigate(item.route)}
            >
              <div style={{...styles.menuIcon, background: item.color}}>
                <item.icon size={28} color="#ffffff" />
              </div>
              <div style={styles.menuContent}>
                <h3 style={styles.menuLabel}>{item.label}</h3>
                <p style={styles.menuDesc}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          使用 DESIGN.md 中的 Apple 設計系統構建
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang TC", "Microsoft JhengHei", sans-serif',
    paddingBottom: '40px'
  },
  header: {
    background: '#ffffff',
    borderBottom: '0.5px solid #e2e8f0',
    padding: '24px 20px',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100
  },
  headerContent: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  title: {
    fontSize: '40px',
    fontWeight: 600,
    lineHeight: '1.10',
    letterSpacing: 'normal',
    color: '#1d1d1f',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '17px',
    lineHeight: '1.47',
    letterSpacing: '-0.374px',
    color: '#86868b',
    margin: '0',
    fontWeight: 400
  },
  logoutButton: {
    position: 'absolute' as const,
    right: '20px',
    top: '26px',
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
  statsSection: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #f5f5f7',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statInfo: {
    flex: 1
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: '1.07',
    letterSpacing: '-0.28px',
    color: '#1d1d1f',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#86868b',
    fontWeight: 400
  },
  quickActions: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px 40px'
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: '1.14',
    letterSpacing: '0.196px',
    color: '#1d1d1f',
    marginBottom: '20px',
    marginLeft: '20px'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    padding: '0 20px'
  },
  actionCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
  },
  actionIcon: {
    color: '#667eea',
    flexShrink: 0
  },
  actionContent: {
    flex: 1
  },
  actionTitle: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: '1.19',
    letterSpacing: '0.231px',
    color: '#1d1d1f',
    margin: '0 0 4px 0'
  },
  actionDesc: {
    fontSize: '14px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#86868b',
    margin: 0,
    fontWeight: 400
  },
  menuSection: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 0 40px'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '16px',
    padding: '0 20px'
  },
  menuCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
  },
  menuIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  menuContent: {
    flex: 1
  },
  menuLabel: {
    fontSize: '19px',
    fontWeight: 600,
    lineHeight: '1.19',
    letterSpacing: '0.231px',
    color: '#1d1d1f',
    margin: '0 0 4px 0'
  },
  menuDesc: {
    fontSize: '14px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#86868b',
    margin: 0,
    fontWeight: 400
  },
  footer: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px 0',
    borderTop: '1px solid #e2e8f0',
    textAlign: 'center' as const
  },
  footerText: {
    fontSize: '13px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#86868b',
    margin: 0,
    fontWeight: 400
  }
};
