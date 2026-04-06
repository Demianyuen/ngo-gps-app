import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Gift } from 'lucide-react';
import { mockUsers, mockProducts } from '../../lib/mockData';

export default function ManualRedemptionScreen() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [redemptionHistory, setRedemptionHistory] = useState<Array<{
    user: string;
    product: string;
    timestamp: Date;
  }>>([]);

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const handleRedemption = () => {
    if (selectedUser && selectedProduct) {
      setRedemptionHistory([
        {
          user: selectedUser.name,
          product: selectedProduct.name,
          timestamp: new Date()
        },
        ...redemptionHistory
      ]);
      setSelectedUser(null);
      setSelectedProduct(null);
      setSearchTerm('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/host/dashboard')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1 style={styles.title}>積分調整與獎勵兌換</h1>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>步驟1：選擇用戶</h2>
          <div style={styles.searchBar}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="搜尋用戶名稱或電話..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.userList}>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  ...styles.userCard,
                  ...(selectedUser?.id === user.id ? styles.selectedCard : {})
                }}
                onClick={() => setSelectedUser(user)}
              >
                <div style={styles.userInfo}>
                  <div style={styles.userName}>{user.name}</div>
                  <div style={styles.userPhone}>{user.phone}</div>
                </div>
                <div style={styles.userScore}>{user.score} 分</div>
              </div>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>步驟2：選擇獎勵</h2>
            <div style={styles.productGrid}>
              {mockProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    ...styles.productCard,
                    ...(selectedProduct?.id === product.id ? styles.selectedCard : {})
                  }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div style={styles.productIcon}>{product.image}</div>
                  <div style={styles.productName}>{product.name}</div>
                  <div style={styles.productPoints}>
                    <Gift size={14} />
                    {product.pointsRequired} 分
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedUser && selectedProduct && (
          <div style={styles.summarySection}>
            <h3 style={styles.summaryTitle}>確認兌換</h3>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>用戶：</span>
              <span style={styles.summaryValue}>{selectedUser.name}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>獎勵：</span>
              <span style={styles.summaryValue}>{selectedProduct.name}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>所需積分：</span>
              <span style={styles.summaryValue}>{selectedProduct.pointsRequired} 分</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>用戶當前積分：</span>
              <span style={styles.summaryValue}>{selectedUser.score} 分</span>
            </div>

            {selectedUser.score >= selectedProduct.pointsRequired ? (
              <>
                <div style={styles.canRedeem}>
                  <CheckCircle size={20} />
                  積分足夠，可以兌換！
                </div>
                <button style={styles.redeemBtn} onClick={handleRedemption}>
                  確認兌換
                </button>
              </>
            ) : (
              <div style={styles.cannotRedeem}>
                積分不足（需要再多 {selectedProduct.pointsRequired - selectedUser.score} 分）
              </div>
            )}
          </div>
        )}

        {redemptionHistory.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>最近兌換記錄</h2>
            <div style={styles.historyList}>
              {redemptionHistory.map((record, index) => (
                <div key={index} style={styles.historyItem}>
                  <div>
                    <div style={styles.historyUser}>{record.user}</div>
                    <div style={styles.historyProduct}>{record.product}</div>
                  </div>
                  <div style={styles.historyTime}>
                    {record.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
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
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    padding: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  backBtn: {
    background: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1a202c'
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '16px'
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '16px'
  },
  searchIcon: {
    color: '#a0aec0',
    marginRight: '12px'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '15px'
  },
  userList: {
    maxHeight: '200px',
    overflowY: 'auto' as const
  },
  userCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '10px',
    marginBottom: '8px',
    cursor: 'pointer',
    border: '2px solid transparent'
  },
  selectedCard: {
    borderColor: '#38b2ac',
    background: '#e6fffa'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '2px'
  },
  userPhone: {
    fontSize: '13px',
    color: '#718096'
  },
  userScore: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#667eea'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  productCard: {
    padding: '16px',
    background: '#f8f9fa',
    borderRadius: '12px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    border: '2px solid transparent'
  },
  productIcon: {
    fontSize: '40px',
    marginBottom: '8px'
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '4px'
  },
  productPoints: {
    fontSize: '13px',
    color: '#38b2ac',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px'
  },
  summarySection: {
    background: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    marginBottom: '20px'
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '16px'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '15px'
  },
  summaryLabel: {
    opacity: 0.9
  },
  summaryValue: {
    fontWeight: '600'
  },
  canRedeem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    padding: '12px',
    marginTop: '16px',
    marginBottom: '12px',
    fontSize: '15px',
    fontWeight: '600'
  },
  cannotRedeem: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    padding: '12px',
    marginTop: '16px',
    textAlign: 'center' as const,
    fontSize: '15px',
    fontWeight: '600'
  },
  redeemBtn: {
    width: '100%',
    padding: '16px',
    background: 'white',
    border: 'none',
    borderRadius: '12px',
    color: '#38b2ac',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '10px'
  },
  historyUser: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '2px'
  },
  historyProduct: {
    fontSize: '13px',
    color: '#718096'
  },
  historyTime: {
    fontSize: '12px',
    color: '#a0aec0'
  }
};
