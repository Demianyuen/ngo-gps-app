# Vercel 部署保護修復指南

## 問題診斷
Vercel 部署保護 (Deployment Protection) 已啟用，導致：
- ✅ 主頁可以訪問 (200 OK)
- ❌ 直接路由返回 404
- ❌ 所有新部署都失敗

## 解決步驟 (3分鐘完成)

### 方法 1: 通過 Vercel Dashboard (推薦)

1. **登入 Vercel**
   - 開啟: https://vercel.com/dashboard
   - 或直接訪問項目設置頁面

2. **找到部署保護設置**
   - 導航到: Settings → Deployment Protection
   - 或直接訪問項目的 deployment-protection 設置頁面

3. **關閉部署保護**
   - 點擊 "Disable" 按鈕
   - 確認禁用

4. **驗證部署**
   - 推送新 commit 到 GitHub
   - 等待自動部署完成
   - 測試路由: https://ngo-gps-app.vercel.app/login

### 方法 2: 使用 Vercel CLI

```bash
# 如果已安裝 Vercel CLI
vercel login
cd "C:\Users\user\Projects\NGO GPS"
vercel link
vercel --prod
```

### 方法 3: 使用替代平台

#### Render.com (已配置好)
1. 註冊: https://render.com
2. 點擊 "New +" → "Web Service"
3. 連接 GitHub 儲存庫
4. 建置命令: `npm run build`
5. 發布目錄: `dist`
6. 點擊 "Deploy"

#### Netlify
1. 註冊: https://app.netlify.com
2. 點擊 "Add new site" → "Import an existing project"
3. 選擇 GitHub
4. 選擇項目儲存庫
5. 建置命令: `npm run build`
6. 發布目錄: `dist`
7. 點擊 "Deploy site"

#### Cloudflare Pages
1. 註冊: https://dash.cloudflare.com
2. Pages → Create a project → Connect to Git
3. 選擇項目儲存庫
4. 設定:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
   - PHP兼容: Yes

## 臨時分享方案 (推薦)

**本地生產伺服器:**
```bash
cd "C:\Users\user\Projects\NGO GPS"
npm run serve
```
- 電腦: http://localhost:5178
- 手機: [本地網絡IP]:5178 (在同一 WiFi 網絡下)

**優點:**
- ✅ 立即可用，無需配置
- ✅ 支援所有路由
- ✅ 適合試用期間使用
- ✅ 可在本地網絡分享

## 快速檢查清單

部署後測試:
- [ ] 主頁載入正常
- [ ] /login 可訪問
- [ ] /events 可訪問
- [ ] GPS 定位工作
- [ ] QR 掃描功能正常
- [ ] 拍照上傳功能正常

## 聯絡支援

如果遇到問題:
- GitHub: 在項目儲存庫的 Issues 頁面提報問題
- 確保 GitHub 儲存庫已設為私有
