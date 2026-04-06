import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'user' | 'host'>('user');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = () => {
    if (!phone.trim()) {
      alert('請輸入手機號碼');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('驗證碼:', verificationCode);
      alert(`驗證碼: ${verificationCode}`);
      setIsLoading(false);
    }, 500);
  };

  const handleUserLogin = () => {
    if (!phone.trim() || !code.trim()) {
      alert('請填寫完整資訊');
      return;
    }

    localStorage.setItem('ngo_user', JSON.stringify({
      phone,
      loginTime: new Date().toISOString()
    }));

    navigate('/events');
  };

  const handleHostLogin = () => {
    if (!password.trim()) {
      alert('請輸入密碼');
      return;
    }

    if (password === 'admin123') {
      localStorage.setItem('ngo_host', JSON.stringify({
        loginTime: new Date().toISOString()
      }));
      navigate('/host/dashboard');
    } else {
      alert('密碼錯誤');
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Elements */}
      <div style={styles.background}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.logo}>NGO GPS</h1>
          <p style={styles.tagline}>探索·發現·學習</p>
        </div>

        {/* Type Toggle */}
        <div style={styles.toggleContainer}>
          <button
            style={{
              ...styles.toggleButton,
              background: userType === 'user' ? '#1d1d1f' : 'transparent',
              color: userType === 'user' ? '#ffffff' : '#86868b'
            }}
            onClick={() => setUserType('user')}
          >
            參與者
          </button>
          <button
            style={{
              ...styles.toggleButton,
              background: userType === 'host' ? '#1d1d1f' : 'transparent',
              color: userType === 'host' ? '#ffffff' : '#86868b'
            }}
            onClick={() => setUserType('host')}
          >
            主辦方
          </button>
        </div>

        {/* Forms */}
        {userType === 'user' ? (
          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>手機號碼</label>
              <input
                type="tel"
                style={styles.input}
                placeholder="+852 XXXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>驗證碼</label>
              <div style={styles.codeRow}>
                <input
                  type="text"
                  style={styles.codeInput}
                  placeholder="6 位數字"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                />
                <button
                  style={styles.sendButton}
                  onClick={handleSendCode}
                  disabled={isLoading}
                >
                  {isLoading ? '發送中' : '發送驗證碼'}
                </button>
              </div>
            </div>

            <button
              style={styles.primaryButton}
              onClick={handleUserLogin}
            >
              開始探索
              <ArrowRight size={20} style={styles.arrowIcon} />
            </button>
          </div>
        ) : (
          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>管理員密碼</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={styles.input}
                  placeholder="輸入密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  style={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              style={styles.primaryButton}
              onClick={handleHostLogin}
            >
              管理後台
              <ArrowRight size={20} style={styles.arrowIcon} />
            </button>
          </div>
        )}

        {/* Footer */}
        <p style={styles.footer}>
          {userType === 'user' ? '探索精彩活動，收集積分兌換獎品' : '管理活動和用戶資料'}
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
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    position: 'relative' as const
  },
  background: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden' as const
  },
  circle1: {
    position: 'absolute' as const,
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
    top: '-200px',
    right: '-200px',
    filter: 'blur(80px)'
  },
  circle2: {
    position: 'absolute' as const,
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.06) 100%)',
    bottom: '-100px',
    left: '-100px',
    filter: 'blur(60px)'
  },
  circle3: {
    position: 'absolute' as const,
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(118, 75, 162, 0.04) 100%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    filter: 'blur(40px)'
  },
  content: {
    position: 'relative' as const,
    zIndex: 1,
    width: '100%',
    maxWidth: '420px'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '48px'
  },
  logo: {
    fontSize: '56px',
    fontWeight: 600,
    lineHeight: '1.07',
    letterSpacing: '-0.28px',
    color: '#1d1d1f',
    margin: '0 0 8px 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  tagline: {
    fontSize: '17px',
    lineHeight: '1.47',
    letterSpacing: '-0.374px',
    color: '#86868b',
    margin: 0,
    fontWeight: 400
  },
  toggleContainer: {
    display: 'flex',
    background: '#f5f5f7',
    padding: '4px',
    borderRadius: '12px',
    marginBottom: '32px',
    gap: '4px'
  },
  toggleButton: {
    flex: 1,
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '-0.224px'
  },
  form: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#1d1d1f',
    marginBottom: '8px',
    marginLeft: '4px'
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    fontSize: '17px',
    fontFamily: 'inherit',
    background: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    color: '#1d1d1f',
    transition: 'all 0.2s ease',
    outline: 'none',
    letterSpacing: '-0.374px'
  },
  codeRow: {
    display: 'flex',
    gap: '12px'
  },
  codeInput: {
    flex: 1,
    padding: '16px 20px',
    fontSize: '20px',
    fontFamily: 'inherit',
    background: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    color: '#1d1d1f',
    transition: 'all 0.2s ease',
    outline: 'none',
    letterSpacing: '4px',
    textAlign: 'center' as const,
    fontWeight: 600
  },
  sendButton: {
    padding: '16px 20px',
    background: '#f5f5f7',
    border: 'none',
    borderRadius: '12px',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s ease',
    letterSpacing: '-0.224px'
  },
  passwordWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center'
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#86868b',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButton: {
    width: '100%',
    padding: '18px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '14px',
    color: '#ffffff',
    fontSize: '17px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    letterSpacing: '-0.374px'
  },
  arrowIcon: {
    transition: 'transform 0.2s ease'
  },
  footer: {
    fontSize: '14px',
    lineHeight: '1.29',
    letterSpacing: '-0.224px',
    color: '#86868b',
    margin: '32px 0 0 0',
    textAlign: 'center' as const,
    fontWeight: 400
  }
};
