import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { mockProducts } from '../../lib/mockData';

export default function StoreManagementScreen() {
  const navigate = useNavigate();
  const [products] = useState(mockProducts);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/host/dashboard')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1 style={styles.title}>獎品管理</h1>
      </div>

      <button style={styles.addBtn}>
        <Plus size={20} />
        添加獎品
      </button>

      <div style={styles.productList}>
        {products.map((product) => (
          <div key={product.id} style={styles.productCard}>
            <div style={styles.productImage}>{product.image}</div>
            <div style={styles.productInfo}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productDesc}>{product.description}</p>
              <div style={styles.productStats}>
                <span style={styles.points}>⭐ {product.pointsRequired} 分</span>
                <span style={styles.quantity}>📦 剩餘 {product.quantity} 件</span>
              </div>
            </div>
            <div style={styles.actions}>
              <button style={styles.editBtn}>編輯</button>
              <button style={styles.deleteBtn}>刪除</button>
            </div>
          </div>
        ))}
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
    fontSize: '24px',
    fontWeight: '800',
    color: '#1a202c'
  },
  addBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
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
    marginBottom: '20px'
  },
  productList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  productCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  productImage: {
    fontSize: '60px',
    flexShrink: 0
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '4px'
  },
  productDesc: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '8px'
  },
  productStats: {
    display: 'flex',
    gap: '16px'
  },
  points: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ecc94b'
  },
  quantity: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  editBtn: {
    padding: '8px 16px',
    background: '#667eea',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '8px 16px',
    background: '#e53e3e',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
