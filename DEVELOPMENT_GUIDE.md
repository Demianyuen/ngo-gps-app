# 📚 開發與部署指南

## 🚀 快速開始

### 安裝與運行
```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 構建生產版本
npm run build

# 本地預覽生產版本
npm run serve
```

## 🌐 部署選項

### 推薦：Netlify（免費）
```bash
# 方法1：拖拽部署（最快）
# 訪問 https://app.netlify.com/drop
# 拖拽 dist 文件夾

# 方法2：CLI 部署（可自訂域名）
netlify login
netlify deploy --prod --dir=dist
```

### 其他平台
- **Vercel**: 免費部署，自動 HTTPS
- **Cloudflare Pages**: 全球 CDN
- **Render.com**: 簡單易用

## 📱 手機使用

### PWA 安裝
**iOS (Safari):**
1. 用 Safari 打開網址
2. 點擊「分享」→「添加到主畫面」

**Android (Chrome):**
1. 用 Chrome 打開網址
2. 點擊菜單 →「安裝應用」

### 測試清單
- [ ] GPS 定位正常
- [ ] QR 掃描功能
- [ ] 照片上傳
- [ ] 地圖顯示
- [ ] 分數系統

## 🔧 API 配置（可選）

### Demo 模式（默認）
應用內置 Demo 模式，無需配置即可測試：
- SMS：驗證碼顯示在控制台
- GPS：使用瀏覽器定位

### 完整功能模式
如需真實 API，配置 `.env` 文件：

```env
# Twilio SMS
VITE_TWILIO_ACCOUNT_SID=your_sid
VITE_TWILIO_AUTH_TOKEN=your_token
VITE_TWILIO_PHONE_NUMBER=+85212345678

# Mapbox 地圖
VITE_MAPBOX_ACCESS_TOKEN=your_token

# Supabase 後端（可選）
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## 📊 項目結構

```
src/
├── components/       # 可重用組件
├── screens/         # 頁面組件
│   ├── user/       # 用戶端
│   └── host/       # 主辦方
├── lib/            # 工具函數
└── App.tsx         # 主應用
```

## 🎯 當前狀態

✅ **生產環境：** https://cozy-gnome-562896.netlify.app

## 📞 技術支持

檢查：
1. 瀏覽器控制台錯誤
2. 網絡請求狀態
3. 環境變量配置

---

**詳細文檔：**
- `PROTOTYPE.md` - 原型說明
- `README.md` - 項目概述
- `USER_GUIDE.md` - 用戶使用指南
