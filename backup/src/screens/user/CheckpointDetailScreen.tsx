import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle, Camera, Upload, Loader2, AlertCircle, SkipForward } from 'lucide-react';
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

  const [status, setStatus] = useState<'scan' | 'photo' | 'success'>('scan');
  const [scanError, setScanError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [scannedCheckpoints, setScannedCheckpoints] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);

  // Initialize scanner
  const initScanner = useCallback(async () => {
    const elementId = 'qr-reader';

    // Clear any existing scanner
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      }
    } catch (e) {
      // Ignore
    }

    try {
      setIsScanning(true);
      setScanError('');

      scannerRef.current = new Html5Qrcode(elementId);

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
    } catch (err: unknown) {
      console.error('Scanner error:', err);
      setIsScanning(false);

      const error = err as { message?: string; toString?: () => string };
      const errorMsg = error?.message || error?.toString?.() || 'Unknown error';

      if (errorMsg.includes('permission')) {
        setScanError('請允許使用相機權限');
      } else if (errorMsg.includes('NotFoundError') || errorMsg.includes('no cameras')) {
        setCameraError('找不到相機，請連接相機或使用其他設備');
        setHasCamera(false);
      } else {
        setScanError('無法啟動相機，請稍後再試');
      }
    }
  }, []);

  useEffect(() => {
    // Load user data
    const storedScore = localStorage.getItem('userScore');
    const stored = localStorage.getItem('scannedCheckpoints');

    if (storedScore) setUserScore(parseInt(storedScore));
    if (stored) setScannedCheckpoints(JSON.parse(stored));

    // Check if already scanned
    if (stored && checkpointId && JSON.parse(stored).includes(checkpointId)) {
      setStatus('success');
    } else {
      // Start QR scanner after a short delay
      setTimeout(() => {
        initScanner();
      }, 500);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [checkpointId, initScanner]);

  const onScanSuccess = async (decodedText: string) => {
    if (status !== 'scan') return;

    console.log('QR Scanned:', decodedText);

    // Stop scanner
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (e) {
        // Ignore
      }
    }

    // Validate QR code - accept if it matches checkpointId or contains it
    if (decodedText === checkpointId ||
        decodedText.includes(checkpointId || '') ||
        decodedText.toLowerCase().includes((checkpointId || '').toLowerCase())) {
      // Success! Move to photo step
      setStatus('photo');
    } else {
      // Wrong QR code
      setScanError(`QR碼不正確！掃描到: ${decodedText}`);
      setTimeout(() => {
        setScanError('');
        initScanner();
      }, 3000);
    }
  };

  const onScanFailure = () => {
    // Silent - this is called frequently when no QR is in view
  };

  // Handle photo selection
  const handlePhotoSelect = () => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        processPhoto(file);
      }
    };

    input.click();
  };

  // Process selected photo
  const processPhoto = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhoto(result);
    };
    reader.onerror = () => {
      alert('讀取圖片失敗，請重試');
    };
    reader.readAsDataURL(file);
  };

  // Upload photo and award points
  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    // Store photo in localStorage (demo mode)
    if (photo && checkpointId) {
      const photos = JSON.parse(localStorage.getItem('checkpointPhotos') || '{}');
      photos[checkpointId] = photo;
      localStorage.setItem('checkpointPhotos', JSON.stringify(photos));
    }

    // Award points
    if (checkpoint && checkpointId) {
      const newScore = userScore + checkpoint.points;
      setUserScore(newScore);
      localStorage.setItem('userScore', newScore.toString());

      // Mark checkpoint as scanned
      const scanned = [...scannedCheckpoints];
      if (!scanned.includes(checkpointId)) {
        scanned.push(checkpointId);
        localStorage.setItem('scannedCheckpoints', JSON.stringify(scanned));
      }
    }

    setIsUploading(false);
    setStatus('success');
  };

  // Skip photo and just award points
  const skipPhoto = () => {
    if (checkpoint && checkpointId) {
      const newScore = userScore + checkpoint.points;
      setUserScore(newScore);
      localStorage.setItem('userScore', newScore.toString());

      const scanned = [...scannedCheckpoints];
      if (!scanned.includes(checkpointId)) {
        scanned.push(checkpointId);
        localStorage.setItem('scannedCheckpoints', JSON.stringify(scanned));
      }
    }
    setStatus('success');
  };

  if (!checkpoint) {
    return (
      <div style={styles.container}>
        <div style={styles.centerContent}>
          <AlertCircle size={64} color="#e53e3e" />
          <h2 style={styles.errorTitle}>找不到簽碼</h2>
          <p style={styles.errorText}>該簽碼可能不存在或已被移除</p>
          <button style={styles.backButton} onClick={() => navigate(-1)}>
            返回
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={styles.container}>
        <div style={styles.centerContent}>
          <div style={styles.successIconBg}>
            <CheckCircle size={80} color="#20c997" />
          </div>
          <h1 style={styles.successTitle}>簽到成功！</h1>
          <p style={styles.checkpointName}>{checkpoint.name}</p>

          <div style={styles.pointsEarned}>
            <span style={styles.pointsValue}>+{checkpoint.points}</span>
            <span style={styles.pointsLabel}>積分</span>
          </div>

          {photo && (
            <div style={styles.photoContainer}>
              <img src={photo} alt="打卡照片" style={styles.photoImage} />
              <p style={styles.photoLabel}>打卡照片</p>
            </div>
          )}

          <div style={styles.totalScore}>
            <span>總積分：</span>
            <span style={styles.totalValue}>{userScore}</span>
          </div>

          <button style={styles.continueButton} onClick={() => navigate(`/map/${event?.id}`)}>
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
          <p style={styles.headerSubtitle}>為 {checkpoint.name} 拍攝照片</p>
        </div>

        <div style={styles.photoSection}>
          {photo ? (
            <div style={styles.photoPreviewContainer}>
              <img src={photo} alt="預覽" style={styles.photoPreviewImage} />
              <button style={styles.changePhotoBtn} onClick={handlePhotoSelect}>
                重新選擇
              </button>
            </div>
          ) : (
            <div style={styles.photoPlaceholder}>
              <Camera size={64} color="#adb5bd" />
              <p style={styles.photoHint}>拍攝或在相冊中選擇照片</p>
              <button style={styles.captureButton} onClick={handlePhotoSelect}>
                <Camera size={20} />
                選擇照片
              </button>
            </div>
          )}
        </div>

        {isUploading && (
          <div style={styles.uploadContainer}>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: `${uploadProgress}%` }} />
            </div>
            <p style={styles.uploadText}>上傳中... {uploadProgress}%</p>
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button style={styles.skipButton} onClick={skipPhoto} disabled={isUploading}>
            <SkipForward size={18} />
            略過拍照
          </button>
          <button
            style={photo ? styles.submitButton : styles.submitButtonDisabled}
            onClick={handleSubmit}
            disabled={!photo || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                上傳中...
              </>
            ) : (
              <>
                <Upload size={18} />
                確認完成
              </>
            )}
          </button>
        </div>

        <button style={styles.cancelButton} onClick={() => navigate(`/map/${event?.id}`)}>
          返回地圖
        </button>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // QR Scan Mode
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>📍 {checkpoint.name}</h1>
        <p style={styles.headerSubtitle}>掃描簽碼位置的 QR 碼</p>
      </div>

      <div style={styles.checkpointInfo}>
        <p style={styles.checkpointDesc}>{checkpoint.description}</p>
        <div style={styles.pointsBadge}>+{checkpoint.points} 分</div>
      </div>

      {/* QR Scanner */}
      <div style={styles.scannerContainer}>
        <div id="qr-reader" style={styles.qrReader} />

        {!hasCamera && (
          <div style={styles.noCameraOverlay}>
            <Camera size={48} color="#adb5bd" />
            <p>找不到相機</p>
            <p style={styles.noCameraHint}>請確保設備有相機權限</p>
          </div>
        )}

        {isScanning && (
          <div style={styles.scanOverlay}>
            <div style={styles.scanFrame}>
              <div style={styles.cornerTL} />
              <div style={styles.cornerTR} />
              <div style={styles.cornerBL} />
              <div style={styles.cornerBR} />
            </div>
            <p style={styles.scanHint}>將 QR 碼放在框內</p>
          </div>
        )}
      </div>

      {scanError && (
        <div style={styles.errorBanner}>
          <AlertCircle size={16} />
          <span>{scanError}</span>
        </div>
      )}

      {cameraError && (
        <div style={styles.errorBanner}>
          <AlertCircle size={16} />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Manual Award Button (for testing) */}
      <div style={styles.testSection}>
        <p style={styles.testText}>無法掃描？</p>
        <button style={styles.manualButton} onClick={skipPhoto}>
          手動完成簽到
        </button>
      </div>

      <button style={styles.cancelButton} onClick={() => navigate(`/map/${event?.id}`)}>
        返回地圖
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    color: 'white'
  },
  centerContent: {
    textAlign: 'center' as const,
    paddingTop: '40px',
    width: '100%'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '20px',
    width: '100%'
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: '800',
    marginBottom: '8px'
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#a0aec0'
  },
  checkpointInfo: {
    textAlign: 'center' as const,
    marginBottom: '16px',
    background: 'rgba(255,255,255,0.1)',
    padding: '16px',
    borderRadius: '16px',
    width: '100%'
  },
  checkpointDesc: {
    fontSize: '14px',
    color: '#e2e8f0',
    marginBottom: '12px',
    lineHeight: 1.5
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
    marginBottom: '16px',
    borderRadius: '20px',
    overflow: 'hidden',
    background: '#2d3748'
  },
  qrReader: {
    width: '100%',
    height: '100%'
  },
  noCameraOverlay: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2d3748',
    color: '#adb5bd'
  },
  noCameraHint: {
    fontSize: '12px',
    marginTop: '8px'
  },
  scanOverlay: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
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
    width: '40px', height: '40px',
    borderTop: '4px solid #20c997',
    borderLeft: '4px solid #20c997',
    borderRadius: '12px 0 0 0'
  },
  cornerTR: {
    position: 'absolute' as const,
    top: 0, right: 0,
    width: '40px', height: '40px',
    borderTop: '4px solid #20c997',
    borderRight: '4px solid #20c997',
    borderRadius: '0 12px 0 0'
  },
  cornerBL: {
    position: 'absolute' as const,
    bottom: 0, left: 0,
    width: '40px', height: '40px',
    borderBottom: '4px solid #20c997',
    borderLeft: '4px solid #20c997',
    borderRadius: '0 0 0 12px'
  },
  cornerBR: {
    position: 'absolute' as const,
    bottom: 0, right: 0,
    width: '40px', height: '40px',
    borderBottom: '4px solid #20c997',
    borderRight: '4px solid #20c997',
    borderRadius: '0 0 12px 0'
  },
  scanHint: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#20c997',
    fontWeight: '600',
    background: 'rgba(0,0,0,0.5)',
    padding: '8px 16px',
    borderRadius: '20px'
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'rgba(245, 101, 101, 0.2)',
    color: '#fc8181',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '600',
    width: '100%',
    textAlign: 'center' as const
  },
  testSection: {
    marginBottom: '16px',
    textAlign: 'center' as const
  },
  testText: {
    fontSize: '13px',
    color: '#a0aec0',
    marginBottom: '8px'
  },
  manualButton: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: '2px solid #4a5568',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cancelButton: {
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
  photoHint: {
    fontSize: '14px',
    color: '#a0aec0'
  },
  captureButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  photoPreviewContainer: {
    textAlign: 'center' as const
  },
  photoPreviewImage: {
    width: '200px',
    height: '200px',
    objectFit: 'cover' as const,
    borderRadius: '16px',
    marginBottom: '12px',
    border: '3px solid #20c997'
  },
  changePhotoBtn: {
    padding: '8px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  uploadContainer: {
    width: '100%',
    marginBottom: '20px'
  },
  progressBarBg: {
    height: '8px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #20c997 0%, #0ca678 100%)',
    transition: 'width 0.3s'
  },
  uploadText: {
    textAlign: 'center' as const,
    fontSize: '13px',
    color: '#a0aec0'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginBottom: '16px'
  },
  skipButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: 'transparent',
    border: '2px solid #4a5568',
    borderRadius: '12px',
    color: '#a0aec0',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  submitButton: {
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
  submitButtonDisabled: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: '#4a5568',
    border: 'none',
    borderRadius: '12px',
    color: '#a0aec0',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'not-allowed'
  },
  successIconBg: {
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
    padding: '16px 32px',
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
  photoContainer: {
    marginBottom: '24px'
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
    fontSize: '18px',
    color: '#a0aec0'
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#20c997'
  },
  continueButton: {
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
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    marginTop: '16px',
    marginBottom: '8px'
  },
  errorText: {
    fontSize: '14px',
    color: '#a0aec0',
    marginBottom: '24px'
  },
  backButton: {
    padding: '12px 24px',
    background: '#20c997',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
