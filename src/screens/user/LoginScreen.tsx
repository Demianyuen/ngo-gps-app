import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, MapPin, Loader2 } from 'lucide-react';
import { smsService, formatPhoneNumber } from '../../services/sms';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleSendSMS = async () => {
    if (!phone) {
      setError('請輸入手機號碼');
      return;
    }

    setIsLoading(true);
    setError('');

    const formattedPhone = formatPhoneNumber(phone);
    const result = await smsService.sendVerificationCode(formattedPhone);

    if (result.success) {
      setSmsSent(true);
      setCountdown(60); // 60 second countdown
      setError(result.message || '驗證碼已發送');

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setError('發送失敗，請稍後再試');
    }

    setIsLoading(false);
  };

  const handleLogin = async () => {
    if (method === 'phone') {
      if (!phone || !verificationCode) {
        setError('請輸入手機號碼和驗證碼');
        return;
      }

      setIsLoading(true);
      setError('');

      const formattedPhone = formatPhoneNumber(phone);
      const isValid = await smsService.verifyCode(formattedPhone, verificationCode);

      if (isValid) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('userPhone', formattedPhone);
        navigate('/events');
      } else {
        setError('驗證碼錯誤或已過期');
        setIsLoading(false);
      }
    } else {
      // Event code login
      if (!code) {
        setError('請輸入活動代碼');
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('loginMethod', 'code');
      navigate('/events');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header with Hong Kong island vibes */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <MapPin size={48} style={styles.logoIcon} />
        </div>
        <h1 style={styles.title}>香港定向探索</h1>
        <p style={styles.subtitle}>長洲島探索活動</p>
      </div>

      {/* Main Card */}
      <div style={styles.card}>
        <div style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>歡迎參加！</h2>
          <p style={styles.welcomeText}>探索長洲島的美景，收集簽碼，換取紀念品</p>
        </div>

        {/* Toggle Methods */}
        <div style={styles.toggleContainer}>
          <button
            style={{
              ...styles.toggleBtn,
              ...(method === 'phone' ? styles.toggleBtnActive : {})
            }}
            onClick={() => {
              setMethod('phone');
              setError('');
              setSmsSent(false);
              setCountdown(0);
            }}
          >
            手機號碼
          </button>
          <button
            style={{
              ...styles.toggleBtn,
              ...(method === 'code' ? styles.toggleBtnActive : {})
            }}
            onClick={() => {
              setMethod('code');
              setError('');
            }}
          >
            活動代碼
          </button>
        </div>

        {method === 'phone' ? (
          <div style={styles.inputGroup}>
            <label style={styles.label}>輸入手機號碼</label>
            <div style={styles.inputWrapper}>
              <Phone size={20} style={styles.inputIcon} />
              <input
                type="tel"
                placeholder="+852 xxxx xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
                disabled={smsSent}
              />
            </div>

            {!smsSent ? (
              <button
                style={styles.verifyBtn}
                onClick={handleSendSMS}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} style={styles.spinner} />
                    發送中...
                  </>
                ) : (
                  '發送驗證碼'
                )}
              </button>
            ) : (
              <div style={styles.verificationSection}>
                <label style={styles.label}>輸入6位驗證碼</label>
                <input
                  type="text"
                  placeholder="輸入驗證碼"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  style={styles.input}
                />
                {countdown > 0 ? (
                  <p style={styles.countdownText}>
                    {countdown} 秒後可重新發送
                  </p>
                ) : (
                  <button
                    style={styles.resendBtn}
                    onClick={handleSendSMS}
                    disabled={isLoading}
                  >
                    重新發送
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.inputGroup}>
            <label style={styles.label}>輸入活動代碼</label>
            <input
              type="text"
              placeholder="輸入您的代碼"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={styles.input}
            />
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={styles.primaryBtn}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} style={styles.btnIcon} />
              登入中...
            </>
          ) : (
            <>
              開始探索
              <ArrowRight size={20} style={styles.btnIcon} />
            </>
          )}
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => navigate('/host/login')}
        >
          工作人員登入
        </button>
      </div>

      {/* Footer with event info */}
      <div style={styles.footer}>
        <p style={styles.footerText}>主辦機構：香港長洲康樂體育會</p>
        <p style={styles.footerText}>活動日期：2026年5月25-26日</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px'
  },
  logoContainer: {
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: 'white',
    boxShadow: '0 8px 24px rgba(32, 201, 151, 0.3)'
  },
  logoIcon: {
    color: 'white'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: '8px',
    letterSpacing: '1px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6c757d',
    fontWeight: '500'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef'
  },
  welcomeSection: {
    textAlign: 'center' as const,
    marginBottom: '24px'
  },
  welcomeTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px'
  },
  welcomeText: {
    fontSize: '14px',
    color: '#6c757d',
    lineHeight: '1.6'
  },
  toggleContainer: {
    display: 'flex',
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '24px'
  },
  toggleBtn: {
    flex: 1,
    padding: '12px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    color: '#6c757d',
    transition: 'all 0.2s',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  toggleBtnActive: {
    background: 'white',
    color: '#20c997',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  inputGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '12px 16px',
    border: '2px solid #e9ecef'
  },
  inputIcon: {
    color: '#adb5bd',
    marginRight: '12px'
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '16px',
    outline: 'none',
    color: '#2d3748'
  },
  verifyBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '12px',
    background: '#20c997',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif',
    transition: 'all 0.2s'
  },
  verificationSection: {
    marginTop: '16px'
  },
  countdownText: {
    fontSize: '12px',
    color: '#6c757d',
    textAlign: 'center' as const,
    marginTop: '8px'
  },
  resendBtn: {
    width: '100%',
    padding: '8px',
    marginTop: '8px',
    background: '#e9ecef',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#495057',
    cursor: 'pointer',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  spinner: {
    animation: 'spin 1s linear infinite'
  },
  error: {
    background: '#fff5f5',
    color: '#e53e3e',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    textAlign: 'center' as const,
    fontWeight: '600'
  },
  primaryBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
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
    transition: 'transform 0.2s',
    boxShadow: '0 4px 16px rgba(32, 201, 151, 0.3)',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  btnIcon: {
    marginLeft: '8px'
  },
  secondaryBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '12px',
    background: 'transparent',
    border: '2px solid #e9ecef',
    borderRadius: '12px',
    color: '#6c757d',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center' as const
  },
  footerText: {
    fontSize: '13px',
    color: '#6c757d',
    margin: '4px 0',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  }
};
