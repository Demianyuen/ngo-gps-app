import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Star } from 'lucide-react';
import { mockEvents, mockProducts } from '../../lib/mockData';

export default function ScoreScreen() {
  const navigate = useNavigate();
  const [scannedCheckpoints, setScannedCheckpoints] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('scannedCheckpoints');
    const storedScore = localStorage.getItem('userScore');

    if (stored) {
      setScannedCheckpoints(JSON.parse(stored));
    }

    if (storedScore) {
      setTotalScore(parseInt(storedScore));
    } else {
      // Calculate from scanned checkpoints
      const scanned: string[] = stored ? JSON.parse(stored) : [];
      let score = 0;
      mockEvents.forEach(event => {
        event.checkpoints.forEach(cp => {
          if (scanned.includes(cp.id)) {
            score += cp.points;
          }
        });
      });
      setTotalScore(score);
      localStorage.setItem('userScore', score.toString());
    }
  }, []);

  // Get all scanned checkpoints with details
  const scannedDetails = mockEvents.flatMap(event =>
    event.checkpoints
      .filter(cp => scannedCheckpoints.includes(cp.id))
      .map(cp => ({ ...cp, eventName: event.name }))
  );

  const checkpointsCompleted = scannedDetails.length;
  const totalCheckpoints = mockEvents.reduce((sum, e) => sum + e.checkpoints.length, 0);

  // Calculate redemption progress
  const products = mockProducts.sort((a, b) => a.pointsRequired - b.pointsRequired);
  const closestReward = products.find(p => p.pointsRequired <= totalScore) || products[0];
  const nextReward = products.find(p => p.pointsRequired > totalScore);

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        返回
      </button>

      <div style={styles.content}>
        {/* Trophy Section */}
        <div style={styles.trophySection}>
          <div style={styles.trophyIcon}>
            <Trophy size={64} />
          </div>
          <h1 style={styles.title}>我的積分</h1>
        </div>

        {/* Main Score Card */}
        <div style={styles.mainScoreCard}>
          <div style={styles.scoreDisplay}>
            <div style={styles.scoreValue}>{totalScore}</div>
            <div style={styles.scoreLabel}>總積分</div>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{checkpointsCompleted}</div>
              <div style={styles.statLabel}>已完成簽碼</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statValue}>{totalCheckpoints}</div>
              <div style={styles.statLabel}>簽碼總數</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div style={styles.progressCard}>
          <h2 style={styles.sectionTitle}>探索進度</h2>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${Math.round((checkpointsCompleted / totalCheckpoints) * 100)}%`
              }}
            />
          </div>
          <div style={styles.progressText}>
            已完成 {checkpointsCompleted}/{totalCheckpoints} 個簽碼 ({Math.round((checkpointsCompleted / totalCheckpoints) * 100)}%)
          </div>
        </div>

        {/* Reward Preview */}
        {totalScore >= 10 && (
          <div style={styles.rewardCard}>
            <h2 style={styles.sectionTitle}>可用獎勵</h2>
            {closestReward && totalScore >= closestReward.pointsRequired && (
              <div style={styles.redeemableReward}>
                <div style={styles.rewardImage}>{closestReward.image}</div>
                <div style={styles.rewardInfo}>
                  <div style={styles.rewardName}>{closestReward.name}</div>
                  <div style={styles.rewardPoints}>
                    <Star size={14} style={{ color: '#fbbf24' }} />
                    {closestReward.pointsRequired} 分
                  </div>
                </div>
                <div style={styles.redeemBadge}>可兌換</div>
              </div>
            )}
            {nextReward && (
              <div style={styles.nextReward}>
                <span style={styles.nextLabel}>下一個獎勵：</span>
                <span style={styles.nextName}>{nextReward.name}</span>
                <span style={styles.nextPoints}>（需 {nextReward.pointsRequired} 分）</span>
              </div>
            )}
            {!nextReward && totalScore >= products[products.length - 1].pointsRequired && (
              <div style={styles.allDone}>
                🎉 已解鎖所有獎勵！前往換領處換取您的禮物！
              </div>
            )}
          </div>
        )}

        {/* Scanned Checkpoints History */}
        {scannedDetails.length > 0 && (
          <div style={styles.historyCard}>
            <h2 style={styles.sectionTitle}>簽碼記錄</h2>
            <div style={styles.historyList}>
              {scannedDetails.map((checkpoint, index) => (
                <div key={index} style={styles.historyItem}>
                  <div style={styles.historyIcon}>✅</div>
                  <div style={styles.historyInfo}>
                    <div style={styles.historyName}>{checkpoint.name}</div>
                    <div style={styles.historyEvent}>{checkpoint.eventName}</div>
                  </div>
                  <div style={styles.historyPoints}>+{checkpoint.points}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={styles.actions}>
          <button
            style={styles.redeemBtn}
            onClick={() => navigate('/store')}
          >
            查看獎勵商店
          </button>
          <button
            style={styles.exploreBtn}
            onClick={() => navigate('/events')}
          >
            繼續探索
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a365d 0%, #2d3748 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    padding: '20px',
    paddingTop: '40px'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
    width: 'fit-content',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  content: {
    maxWidth: '480px',
    margin: '0 auto'
  },
  trophySection: {
    textAlign: 'center' as const,
    marginBottom: '24px'
  },
  trophyIcon: {
    background: 'linear-gradient(135deg, #f6e05e 0%, #d69e2e 100%)',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 8px 32px rgba(246, 224, 94, 0.4)'
  },
  title: {
    fontSize: '32px',
    fontWeight: '900',
    color: 'white',
    letterSpacing: '2px'
  },
  mainScoreCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    textAlign: 'center' as const,
    marginBottom: '16px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
  },
  scoreDisplay: {
    marginBottom: '24px'
  },
  scoreValue: {
    fontSize: '72px',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #20c997 0%, #0ca678 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1'
  },
  scoreLabel: {
    fontSize: '18px',
    color: '#718096',
    fontWeight: '600',
    marginTop: '8px'
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px'
  },
  statItem: {
    textAlign: 'center' as const
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#2d3748'
  },
  statLabel: {
    fontSize: '13px',
    color: '#a0aec0',
    fontWeight: '500',
    marginTop: '4px'
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: '#e2e8f0'
  },
  progressCard: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '12px'
  },
  progressBar: {
    height: '10px',
    background: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #20c997 0%, #0ca678 100%)',
    transition: 'width 0.5s'
  },
  progressText: {
    fontSize: '13px',
    color: '#718096',
    fontWeight: '600'
  },
  rewardCard: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '16px'
  },
  redeemableReward: {
    display: 'flex',
    alignItems: 'center',
    background: '#f0fff4',
    border: '2px solid #20c997',
    borderRadius: '16px',
    padding: '16px',
    gap: '12px'
  },
  rewardImage: {
    fontSize: '48px'
  },
  rewardInfo: {
    flex: 1
  },
  rewardName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '4px'
  },
  rewardPoints: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#d69e2e'
  },
  redeemBadge: {
    background: '#20c997',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700'
  },
  nextReward: {
    marginTop: '12px',
    padding: '12px',
    background: '#f7fafc',
    borderRadius: '12px',
    fontSize: '13px'
  },
  nextLabel: {
    color: '#718096'
  },
  nextName: {
    fontWeight: '700',
    color: '#2d3748'
  },
  nextPoints: {
    color: '#a0aec0'
  },
  allDone: {
    marginTop: '12px',
    padding: '16px',
    background: '#fefcbf',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#744210',
    textAlign: 'center' as const
  },
  historyCard: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '16px'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f7fafc',
    borderRadius: '12px'
  },
  historyIcon: {
    fontSize: '24px'
  },
  historyInfo: {
    flex: 1
  },
  historyName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#2d3748'
  },
  historyEvent: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '2px'
  },
  historyPoints: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#20c997'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  redeemBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #f6e05e 0%, #d69e2e 100%)',
    border: 'none',
    borderRadius: '16px',
    color: '#744210',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(246, 224, 94, 0.4)',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  },
  exploreBtn: {
    width: '100%',
    padding: '16px',
    background: 'white',
    border: 'none',
    borderRadius: '16px',
    color: '#20c997',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif'
  }
};
