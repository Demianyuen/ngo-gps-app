import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle, Camera, Upload, Loader2, AlertCircle } from 'lucide-react';
import { mockEvents } from '../../lib/mockData';

export default function CheckpointDetailScreen() {
  const { checkpointId } = useParams<{ checkpointId: string }>();
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Find checkpoint from events
  const checkpoint = mockEvents
    .flatMap(e => e.checkpoints)
    .find(cp => cp.id === checkpointId);

  const event = mockEvents.find(e => e.checkpoints.some(cp => cp.id === checkpointId));

  const [status, setStatus] = useState<'scan' | 'photo' | 'success' | 'error'>('scan');
  const [scanError, setScanError] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [scannedCheckpoints, setScannedCheckpoints] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Load user data
    const storedScore = localStorage.getItem('userScore');
    const stored = localStorage.getItem('scannedCheckpoints');

    if (storedScore) setUserScore(parseInt(storedScore));
    if (stored) setScannedCheckpoints(JSON.parse(stored));

    // Check if already scanned
    if (stored && checkpointId && JSON.parse(stored).includes(checkpointId)) {
      setStatus('success');
    }

    // Start QR scanner
    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [checkpointId]);

  const initScanner = async () => {
    try {
      scannerRef.current = new Html5Qrcode('qr-reader');

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      setIsScanning(true);

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        onScanFailure
      );
    } catch (err) {
      console.error('Scanner init error:', err);
      setScanError('無法啟用相機，請確保已授予相機權限');
      setIsScanning(false);
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    if (status !== 'scan') return;

    // Stop scanner
    if (scannerRef.current) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }

    // Validate QR code
    if (decodedText === checkpointId || decodedText.includes(checkpointId || '')) {
      // Success! Move to photo step
      setStatus('photo');
    } else {
      // Wrong QR code
      setScanError('QR碼不正確，請掃描此簽碼位置的QR碼');
      setTimeout(() => {
        setScanError('');
        initScanner();
      }, 2000);
    }
  };

  const onScanFailure = () => {
    // Ignore scan failures
  };

  const handlePhotoCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhoto(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handlePhotoUpload = async () => {
    if (!photo) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload with progress
    const uploadPromise = new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          setUploadProgress(100);
          clearInterval(interval);
          resolve();
        } else {
          setUploadProgress(Math.round(progress));
        }
      }, 300);
    });

    await uploadPromise;

    // Store photo in localStorage (demo mode)
    const photos = JSON.parse(localStorage.getItem('checkpointPhotos') || '{}');
    photos[checkpointId || ''] = photo;
    localStorage.setItem('checkpointPhotos', JSON.stringify(photos));

    // Award points
    if (checkpoint) {
      const newScore = userScore + checkpoint.points;
      setUserScore(newScore);
      localStorage.setItem('userScore', newScore.toString());

      // Mark checkpoint as scanned
      const scanned = [...scannedCheckpoints];
      if (!scanned.includes(checkpointId || '')) {
        scanned.push(checkpointId || '');
        localStorage.setItem('scannedCheckpoints', JSON.stringify(scanned));
        setScannedCheckpoints(scanned);
      }
    }

    setIsUploading(false);
    setStatus('success');
  };

  const skipPhoto = () => {
    // Skip photo and just award points
    if (checkpoint) {
      const newScore = userScore + checkpoint.points;
      setUserScore(newScore);
      localStorage.setItem('userScore', newScore.toString());

      const scanned = [...scannedCheckpoints];
      if (!scanned.includes(checkpointId || '')) {
        scanned.push(checkpointId || '');
        localStorage.setItem('scannedCheckpoints', JSON.stringify(scanned));
      }
    }
    setStatus('success');
  };

  if (!checkpoint) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <AlertCircle size={64} style={{ color: '#e53e3e' }} />
          <h2>找不到簽碼</h2>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            返回
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={styles.container}>
        <div style={styles.successContainer}>
          <div style={styles.successIcon}>
            <CheckCircle size={80} />
          </div>
          <h1 style={styles.successTitle}>簽到成功！</h1>
          <p style={styles.checkpointName}>{checkpoint.name}</p>

          <div style={styles.pointsEarned}>
            <span style={styles.pointsValue}>+{checkpoint.points}</span>
            <span style={styles.pointsLabel}>積分</span>
          </div>

          {photo && (
            <div style={styles.photoPreview}>
              <img src={photo} alt="您的照片" style={styles.photoImage} />
              <p style={styles.photoLabel}>您的打卡照片</p>
            </div>
          )}

          <div style={styles.totalScore}>
            <span style={styles.totalLabel}>總積分：</span>
            <span style={styles.totalValue}>{userScore}</span>
          </div>

          <button style={styles.continueBtn} onClick={() => navigate(`/map/${event?.id}`)}>
            返回地圖
          </button>
        </div>
      </div>
    );
  }

  if (status === 'photo') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>📸 拍攝打卡照片</h1>
          <p style={styles.headerSubtitle}>
            拍攝 {checkpoint.name} 的照片完成打卡
          </p>
        </div>

        <div style={styles.photoSection}>
          {photo ? (
            <div style={styles.photoPreview}>
              <img src={photo} alt="預覽" style={styles.photoPreviewImage} />
              <button
                style={styles.retakeBtn}
                onClick={() => setPhoto(null)}
              >
                重新拍攝
              </button>
            </div>
          ) : (
            <div style={styles.photoPlaceholder}>
              <Camera size={64} style={{ color: '#adb5bd' }} />
              <p>點擊按鈕拍攝照片</p>
              <button style={styles.captureBtn} onClick={handlePhotoCapture}>
                <Camera size={20} />
                拍攝照片
              </button>
            </div>
          )}
        </div>

        {isUploading && (
          <div style={styles.uploadProgress}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
            </div>
            <p>上傳中... {uploadProgress}%</p>
          </div>
        )}

        <div style={styles.actions}>
          <button
            style={styles.skipBtn}
            onClick={skipPhoto}
            disabled={isUploading}
          >
            略過拍照
          </button>
          <button
            style={styles.submitBtn}
            onClick={handlePhotoUpload}
            disabled={!photo || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                上傳中...
              </>
            ) : (
              <>
                <Upload size={20} />
                確認上傳
              </>
            )}
          </button>
        </div>

        <button style={styles.cancelBtn} onClick={() => navigate(`/map/${event?.id}`)}>
          取消
        </button>
      </div>
    );
  }

  // QR Scan mode
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>📍 {checkpoint.name}</h1>
        <p style={styles.headerSubtitle}>
          請掃描簽碼位置的QR碼
        </p>
      </div>

      <div style={styles.checkpointInfo}>
        <p style={styles.checkpointDesc}>{checkpoint.description}</p>
        <div style={styles.pointsBadge}>+{checkpoint.points} 分</div>
      </div>

      <div style={styles.scannerContainer}>
        <div id="qr-reader" style={styles.qrReader}></div>

        {isScanning && (
          <div style={styles.scanningOverlay}>
            <div style={styles.scanFrame}>
              <div style={styles.cornerTL} />
              <div style={styles.cornerTR} />
              <div style={styles.cornerBL} />
              <div style={styles.cornerBR} />
            </div>
            <p style={styles.scanText}>對準QR碼</p>
          </div>
        )}
      </div>

      {scanError && (
        <div style={styles.errorBox}>
          <AlertCircle size={16} />
          {scanError}
        </div>
      )}

      <div style={styles.tips}>
        <h3>💡 提示</h3>
        <ul>
          <li>確保QR碼在相機視野內</li>
          <li>保持手機穩定</li>
          <li>在光線充足的地方掃描</li>
        </ul>
      </div>

      <button style={styles.cancelBtn} onClick={() => navigate(`/map/${event?.id}`)}>
        返回地圖
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    color: 'white'
  },
  errorContainer: {
    textAlign: 'center' as const,
    padding: '40px'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '800',
    marginBottom: '8px'
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#a0aec0'
  },
  checkpointInfo: {
    textAlign: 'center' as const,
    marginBottom: '20px',
    background: 'rgba(255,255,255,0.1)',
    padding: '16px',
    borderRadius: '16px',
    width: '100%'
  },
  checkpointDesc: {
    fontSize: '14px',
    color: '#e2e8f0',
    marginBottom: '12px'
  },
  pointsBadge: {
    background: 'linear-gradient(135deg, #f6e05e 0%, #d69e2e 100%)',
    padding: '8px 24px',
    borderRadius: '20px',
    fontSize: '18px',
    fontWeight: '800',
    color: '#1a202c',
    display: 'inline-block'
  },
  scannerContainer: {
    position: 'relative' as const,
    width: '280px',
    height: '280px',
    marginBottom: '20px',
    borderRadius: '24px',
    overflow: 'hidden',
    background: '#2d3748'
  },
  qrReader: {
    width: '100%',
    height: '100%'
  },
  scanningOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column' as const,
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
    top: 0, left: 0,
    width: '30px', height: '30px',
    borderTop: '4px solid #20c997',
    borderLeft: '4px solid #20c997',
    borderRadius: '8px 0 0 0'
  },
  cornerTR: {
    position: 'absolute' as const,
    top: 0, right: 0,
    width: '30px', height: '30px',
    borderTop: '4px solid #20c997',
    borderRight: '4px solid #20c997',
    borderRadius: '0 8px 0 0'
  },
  cornerBL: {
    position: 'absolute' as const,
    bottom: 0, left: 0,
    width: '30px', height: '30px',
    borderBottom: '4px solid #20c997',
    borderLeft: '4px solid #20c997',
    borderRadius: '0 0 0 8px'
  },
  cornerBR: {
    position: 'absolute' as const,
    bottom: 0, right: 0,
    width: '30px', height: '30px',
    borderBottom: '4px solid #20c997',
    borderRight: '4px solid #20c997',
    borderRadius: '0 0 8px 0'
  },
  scanText: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#20c997',
    fontWeight: '600'
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(245, 101, 101, 0.2)',
    color: '#f56565',
    padding: '12px 24px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  tips: {
    background: 'rgba(32, 201, 151, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '20px',
    width: '100%'
  },
  backBtn: {
    padding: '12px 24px',
    background: '#20c997',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px'
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
  photoSection: {
    width: '100%',
    marginBottom: '20px'
  },
  photoPlaceholder: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px'
  },
  captureBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  photoPreview: {
    textAlign: 'center' as const
  },
  photoPreviewImage: {
    width: '200px',
    height: '200px',
    objectFit: 'cover' as const,
    borderRadius: '16px',
    marginBottom: '12px'
  },
  retakeBtn: {
    padding: '8px 20px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  uploadProgress: {
    width: '100%',
    marginBottom: '20px',
    textAlign: 'center' as const
  },
  progressBar: {
    height: '8px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #20c997 0%, #0ca678 100%)',
    transition: 'width 0.3s'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginBottom: '16px'
  },
  skipBtn: {
    flex: 1,
    padding: '14px',
    background: 'transparent',
    border: '2px solid #4a5568',
    borderRadius: '12px',
    color: '#a0aec0',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  submitBtn: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  successContainer: {
    textAlign: 'center' as const,
    paddingTop: '40px'
  },
  successIcon: {
    color: '#20c997',
    marginBottom: '24px'
  },
  successTitle: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '8px'
  },
  checkpointName: {
    fontSize: '18px',
    color: '#a0aec0',
    marginBottom: '24px'
  },
  pointsEarned: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '8px',
    background: 'rgba(32, 201, 151, 0.2)',
    padding: '12px 32px',
    borderRadius: '24px',
    marginBottom: '24px'
  },
  pointsValue: {
    fontSize: '48px',
    fontWeight: '900',
    color: '#20c997'
  },
  pointsLabel: {
    fontSize: '18px',
    color: '#a0aec0'
  },
  photoImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover' as const,
    borderRadius: '12px',
    marginBottom: '8px'
  },
  photoLabel: {
    fontSize: '13px',
    color: '#a0aec0'
  },
  totalScore: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '32px',
    fontSize: '18px'
  },
  totalLabel: {
    color: '#a0aec0'
  },
  totalValue: {
    fontSize: '24px',
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
  }
};
