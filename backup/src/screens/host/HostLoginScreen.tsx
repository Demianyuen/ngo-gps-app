import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

export default function HostLoginScreen() {
  const navigate = useNavigate();
  const [securityCode, setSecurityCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (securityCode === '1234') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'host');
      navigate('/host/dashboard');
    } else {
      setError('安全碼錯誤，請重新輸入');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <Shield size={48} style={styles.icon} />
        </div>
        <h1 style={styles.title}>工作人員登入</h1>
        <p style={styles.subtitle}>輸入安全碼以進入管理後台</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>安全碼</label>
          <input
            type="password"
            placeholder="輸入4位數安全碼"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
            maxLength={4}
            style={styles.input}
          />
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.hint}>測試安全碼：1234</div>
        </div>

        <button
          style={styles.primaryBtn}
          onClick={handleLogin}
        >
          進入後台
          <ArrowRight size={20} style={styles.btnIcon} />
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => navigate('/login')}
        >
          參加者登入
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
  },
  iconContainer: {
    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    color: 'white'
  },
  icon: {
    color: 'white'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: '8px',
    textAlign: 'center' as const
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '32px',
    textAlign: 'center' as const
  },
  inputGroup: {
    marginBottom: '24px'
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
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '18px',
    textAlign: 'center' as const,
    letterSpacing: '8px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  error: {
    color: '#e53e3e',
    fontSize: '13px',
    marginTop: '8px',
    textAlign: 'center' as const
  },
  hint: {
    color: '#a0aec0',
    fontSize: '12px',
    marginTop: '8px',
    textAlign: 'center' as const
  },
  primaryBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
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
    marginBottom: '12px',
    boxShadow: '0 4px 12px rgba(237, 137, 54, 0.4)'
  },
  btnIcon: {
    marginLeft: '8px'
  },
  secondaryBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    color: '#718096',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
