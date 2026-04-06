import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { mockProducts } from '../../lib/mockData';

export default function RedemptionStoreScreen() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);

  const userPoints = 25; // Mock user points

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div style={styles.headerInfo}>
          <h1 style={styles.title}>Reward Store</h1>
          <div style={styles.pointsBadge}>
            <Star size={16} />
            {userPoints} Points
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <p style={styles.subtitle}>
          Browse available rewards and visit the redemption counter to claim them!
        </p>

        <div style={styles.productGrid}>
          {mockProducts.map((product) => (
            <div
              key={product.id}
              style={styles.productCard}
              onClick={() => setSelectedProduct(product)}
            >
              <div style={styles.productImage}>{product.image}</div>
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                <div style={styles.pointsRequired}>
                  <Star size={14} />
                  {product.pointsRequired} pts
                </div>
                <div style={styles.quantity}>{product.quantity} available</div>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div style={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalImage}>{selectedProduct.image}</div>
              <h2 style={styles.modalTitle}>{selectedProduct.name}</h2>
              <p style={styles.modalDescription}>{selectedProduct.description}</p>
              <div style={styles.modalStats}>
                <div style={styles.modalStat}>
                  <div style={styles.statLabel}>Points Required</div>
                  <div style={styles.statValue}>
                    <Star size={16} style={styles.statIcon} />
                    {selectedProduct.pointsRequired}
                  </div>
                </div>
                <div style={styles.modalStat}>
                  <div style={styles.statLabel}>Available</div>
                  <div style={styles.statValue}>{selectedProduct.quantity}</div>
                </div>
              </div>
              <div style={styles.userPoints}>
                Your Points: <strong>{userPoints}</strong>
              </div>
              {userPoints >= selectedProduct.pointsRequired ? (
                <div style={styles.canRedeem}>
                  ✅ You can redeem this reward!
                </div>
              ) : (
                <div style={styles.cannotRedeem}>
                  ❌ Need {selectedProduct.pointsRequired - userPoints} more points
                </div>
              )}
              <p style={styles.redeemNote}>
                Visit the redemption counter to claim your reward.
              </p>
              <button
                style={styles.closeBtn}
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  headerInfo: {
    flex: 1
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    marginBottom: '8px'
  },
  pointsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.2)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  content: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  subtitle: {
    fontSize: '15px',
    color: '#718096',
    marginBottom: '24px',
    textAlign: 'center' as const
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px'
  },
  productCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  productImage: {
    fontSize: '80px',
    textAlign: 'center' as const,
    padding: '24px',
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
  },
  productInfo: {
    padding: '16px'
  },
  productName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px'
  },
  pointsRequired: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  quantity: {
    fontSize: '12px',
    color: '#a0aec0'
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    maxWidth: '400px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto' as const
  },
  modalImage: {
    fontSize: '120px',
    textAlign: 'center' as const,
    marginBottom: '20px'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: '12px'
  },
  modalDescription: {
    fontSize: '15px',
    color: '#718096',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  modalStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px'
  },
  modalStat: {
    background: '#f7fafc',
    borderRadius: '12px',
    padding: '16px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#718096',
    marginBottom: '4px'
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  statIcon: {
    color: '#ecc94b'
  },
  userPoints: {
    fontSize: '14px',
    color: '#4a5568',
    marginBottom: '12px',
    textAlign: 'center' as const
  },
  canRedeem: {
    background: '#f0fff4',
    color: '#38a169',
    padding: '12px',
    borderRadius: '10px',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  cannotRedeem: {
    background: '#fff5f5',
    color: '#e53e3e',
    padding: '12px',
    borderRadius: '10px',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  redeemNote: {
    fontSize: '13px',
    color: '#718096',
    textAlign: 'center' as const,
    marginBottom: '20px',
    fontStyle: 'italic' as const
  },
  closeBtn: {
    width: '100%',
    padding: '14px',
    background: '#e2e8f0',
    border: 'none',
    borderRadius: '12px',
    color: '#4a5568',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
