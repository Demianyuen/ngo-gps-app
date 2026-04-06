import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function QRScannerScreen() {
  const { checkpointId } = useParams<{ checkpointId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'scanning' | 'success' | 'processing'>('scanning');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [checkpointName, setCheckpointName] = useState('');
  const [scanError, setScanError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    // Get user score from localStorage
    const savedScore = localStorage.getItem('userScore');
    if (savedScore) {
      setUserScore(parseInt(savedScore));
    }

    // Initialize scanner
    const initScanner = async () => {
      try {
        scannerRef.current = new Html5Qrcode('qr-reader');

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };

        await scannerRef.current.start(
          { facingMode: 'environment' },
          config,
          onScanSuccess,
          onScanFailure
        );
      } catch (err) {
        console.error('Scanner init error:', err);
        setScanError('無法啟用相機，請確保已授予相機權限');
      }
    };

    initScanner();

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (status !== 'scanning') return;

    // Stop scanner
    if (scannerRef.current) {
      await scannerRef.current.stop();
    }

    // Validate QR code matches checkpoint
    const checkpointData = decodeQRCode(decodedText);

    if (checkpointData && checkpointData.id === checkpointId) {
      // Success! Award points
      setStatus('processing');
      const points = checkpointData.points;
      const name = checkpointData.name;

      // Update score
      const newScore = userScore + points;
      setUserScore(newScore);
      setPointsEarned(points);
      setCheckpointName(name);

      // Save to localStorage
      localStorage.setItem('userScore', newScore.toString());

      // Mark checkpoint as scanned
      const scannedCheckpoints = JSON.parse(localStorage.getItem('scannedCheckpoints') || '[]');
      if (!scannedCheckpoints.includes(checkpointId)) {
        scannedCheckpoints.push(checkpointId);
        localStorage.setItem('scannedCheckpoints', JSON.stringify(scannedCheckpoints));
      }

      // Show success after short delay
      setTimeout(() => {
        setStatus('success');
      }, 1500);
    } else {
      // Invalid QR code
      setScanError('無效的QR碼，請掃描正確的簽碼QR碼');
      // Restart scanner
      setTimeout(() => {
        setScanError('');
        if (scannerRef.current) {
          scannerRef.current.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            onScanSuccess,
            onScanFailure
          ).catch(console.error);
        }
      }, 2000);
    }
  };

  const onScanFailure = (_error: string) => {
    // Ignore scan failures (no QR code found)
  };

  // Decode QR code data
  const decodeQRCode = (data: string) => {
    try {
      // Expected format: JSON string or simple "id:points:name"
      if (data.startsWith('{')) {
        return JSON.parse(data);
      }
      // Simple format: checkpoint id
      const checkpoints: Record<string, { points: number; name: string }> = {
        'cp1': { points: 10, name: '北帝廟' },
        'cp2': { points: 15, name: '太平清醮場地' },
        'cp3': { points: 20, name: '長洲長城' },
        'cp4': { points: 10, name: '東灣泳灘' },
        'cp5': { points: 5, name: '朗豪坊' },
        'cp6': { points: 10, name: '旺角電腦中心' }
      };
      return checkpoints[data] ? { id: data, ...checkpoints[data] } : null;
    } catch {
      return null;
    }
  };

  if (status === 'success') {
    return (
      <div style={styles.container}>
        <CheckCircle size={80} style={styles.successIcon} />
        <h1 style={styles.successTitle}>掃描成功！</h1>

        <div style={styles.checkpointInfo}>
          <p style={styles.checkpointName}>{checkpointName}</p>
          <div style={styles.pointsBadge}>
            🎉 +{pointsEarned} 分
          </div>
        </div>

        <p style={styles.successText}>
          太棒了！您已成功到達這個簽碼位置。
        </p>

        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>新增積分</div>
            <div style={styles.statValue}>+{pointsEarned}</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>總積分</div>
            <div style={styles.statValue}>{userScore + pointsEarned}</div>
          </div>
        </div>

        <button
          style={styles.continueBtn}
          onClick={() => navigate(`/map/${localStorage.getItem('currentEventId') || '1'}`)}
        >
          返回地圖 →
        </button>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div style={styles.container}>
        <Loader2 size={80} style={styles.processingIcon} />
        <h1 style={styles.processingTitle}>驗證中...</h1>
        <p style={styles.processingText}>正在確認簽碼信息</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>📸 掃描QR碼</h1>
        <p style={styles.headerSubtitle}>將相機對準簽碼位置的QR碼</p>
      </div>

      <div style={styles.scannerContainer}>
        <div id="qr-reader" style={styles.qrReader}></div>

        {/* Scanning overlay */}
        <div style={styles.scanOverlay}>
          <div style={styles.scanFrame}>
            <div style={styles.cornerTL} />
            <div style={styles.cornerTR} />
            <div style={styles.cornerBL} />
            <div style={styles.cornerBR} />
          </div>
        </div>
      </div>

      {scanError && (
        <div style={styles.errorBox}>
          ⚠️ {scanError}
        </div>
      )}

      <div style={styles.tips}>
        <h3 style={styles.tipsTitle}>💡 掃描提示</h3>
        <ul style={styles.tipsList}>
          <li>確保QR碼在相機視野內</li>
          <li>保持手機穩定</li>
          <li>在光線充足的地方掃描</li>
          <li>每個簽碼只能掃描一次</li>
        </ul>
      </div>

      <button
        style={styles.cancelBtn}
        onClick={() => navigate('/events')}
      >
        取消掃描
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    color: 'white'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px'
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '8px'
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#a0aec0'
  },
  scannerContainer: {
    position: 'relative' as const,
    width: '280px',
    height: '280px',
    marginBottom: '24px',
    borderRadius: '24px',
    overflow: 'hidden',
    background: '#2d3748'
  },
  qrReader: {
    width: '100%',
    height: '100%'
  },
  scanOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none' as const
  },
  scanFrame: {
    width: '200px',
    height: '200px',
    position: 'relative' as const
  },
  cornerTL: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '30px',
    height: '30px',
    borderTop: '4px solid #20c997',
    borderLeft: '4px solid #20c997',
    borderRadius: '8px 0 0 0'
  },
  cornerTR: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    width: '30px',
    height: '30px',
    borderTop: '4px solid #20c997',
    borderRight: '4px solid #20c997',
    borderRadius: '0 8px 0 0'
  },
  cornerBL: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    width: '30px',
    height: '30px',
    borderBottom: '4px solid #20c997',
    borderLeft: '4px solid #20c997',
    borderRadius: '0 0 0 8px'
  },
  cornerBR: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: '30px',
    height: '30px',
    borderBottom: '4px solid #20c997',
    borderRight: '4px solid #20c997',
    borderRadius: '0 0 8px 0'
  },
  errorBox: {
    background: 'rgba(245, 101, 101, 0.2)',
    color: '#f56565',
    padding: '12px 24px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center' as const
  },
  tips: {
    background: 'rgba(32, 201, 151, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    maxWidth: '320px',
    width: '100%'
  },
  tipsTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#20c997'
  },
  tipsList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#a0aec0',
    lineHeight: '1.8'
  },
  cancelBtn: {
    padding: '12px 32px',
    background: 'transparent',
    border: '2px solid #4a5568',
    borderRadius: '12px',
    color: '#a0aec0',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  successIcon: {
    color: '#20c997',
    marginBottom: '24px'
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '20px'
  },
  checkpointInfo: {
    textAlign: 'center' as const,
    marginBottom: '24px'
  },
  checkpointName: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#e2e8f0'
  },
  pointsBadge: {
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    padding: '12px 32px',
    borderRadius: '30px',
    fontSize: '24px',
    fontWeight: '800',
    display: 'inline-block'
  },
  successText: {
    fontSize: '16px',
    color: '#a0aec0',
    textAlign: 'center' as const,
    marginBottom: '24px',
    lineHeight: '1.6'
  },
  stats: {
    display: 'flex',
    gap: '32px',
    marginBottom: '24px'
  },
  statItem: {
    textAlign: 'center' as const
  },
  statLabel: {
    fontSize: '13px',
    color: '#a0aec0',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#20c997'
  },
  continueBtn: {
    padding: '16px 48px',
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    border: 'none',
    borderRadius: '16px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(32, 201, 151, 0.4)'
  },
  processingIcon: {
    color: '#20c997',
    marginBottom: '24px',
    animation: 'spin 1s linear infinite'
  },
  processingTitle: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '12px'
  },
  processingText: {
    fontSize: '16px',
    color: '#a0aec0'
  }
};
