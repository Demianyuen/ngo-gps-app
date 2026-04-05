# 🚀 部署指南

## 快速部署（推薦）

### 方法 1：Netlify Drop（最簡單，2分鐘）

1. **訪問：** https://app.netlify.com/drop
2. **拖拽這個資料夾：** `C:\Users\user\Projects\NGO GPS\dist`
3. **獲得鏈結：** 幾秒鐘後自動生成

### 方法 2：Netlify CLI（可自訂域名）

```bash
# 1. 登入
netlify login

# 2. 部署
cd "C:\Users\user\Projects\NGO GPS"
netlify deploy --prod --dir=dist
```

### 方法 3：本地生產伺服器（測試用）

```bash
cd "C:\Users\user\Projects\NGO GPS"
npm run serve
```

訪問：
- 電腦：http://localhost:5178
- 手機：[本地網絡IP]:5178（同一 WiFi 下）

## 其他部署平台

### Cloudflare Pages
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name=ngo-gps-app
```

### Render.com
1. 連接 GitHub 儲存庫
2. 設置：Build command `npm run build`，Publish directory `dist`
3. Deploy

## 當前部署狀態

✅ **生產環境：** https://cozy-gnome-562896.netlify.app

## 故障排除

### 404 錯誤
確保 `dist/_redirects` 文件存在並包含：
```
/* /index.html 200
```

### GPS 不工作
- 確保使用 HTTPS 或 localhost
- 檢查瀏覽器定位權限

### QR 掃描失敗
- 確保使用 HTTPS
- 檢查相機權限
- 嘗試不同瀏覽器
