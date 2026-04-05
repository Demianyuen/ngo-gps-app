# 📱 手機使用指南

## 🚀 四種部署方式

### **方式一：本地開發模式（測試用）**

**適合：** 開發測試、演示

```bash
# 電腦運行
npm run dev -- --host

# 手機瀏覽器打開
http://192.168.8.125:5176/
```

**限制：** 電腦需要一直開機，手機和電腦要在同一WiFi

---

### **方式二：部署到 Vercel（推薦 - 免費）**

**適合：** 正式使用、長期運營

**步驟：**

1. **安裝Vercel CLI**
```bash
npm i -g vercel
```

2. **部署**
```bash
vercel
```

3. **完成後獲得URL，例如：**
```
https://ngo-gps.vercel.app
```

4. **手機直接訪問該URL即可！**

**優點：**
- ✅ 完全免費
- ✅ 電腦關機也能訪問
- ✅ 自動生成 HTTPS
- ✅ 支持自訂域名（可綁定 yourdomain.com）

---

### **方式三：部署到 Netlify（推薦 - 免費）**

**步驟：**

1. **訪問** [netlify.com](https://netlify.com)
2. **直接拖拽 dist 資料夾上傳
3. **獲得URL，例如：**
```
https://random-name.netlify.app
```

**或使用CLI：**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

### **方式四：本地生成APK（進階）**

**適合：** 完全離線、不需要網絡

**工具：**
- [Capacitor](https://capacitorjs.com/) - 將Web轉為原生APP
- [PWABuilder](https://www.pwabuilder.com/) - 一鍵生成APK

**步驟：**
```bash
# 1. 安裝 Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. 初始化
npx cap init "定向探索" "com.ngo.orientation"

# 3. 添加Android平台
npx cap add android

# 4. 構建
npm run build

# 5. 同步到Android項目
npx cap sync android

# 6. 用Android Studio打開 /android 資料夾
# 7. 生成APK
```

---

## 📲 **安裝為手機APP（PWA）**

### **iOS (Safari)**

1. 用Safari打開網址
2. 點擊底部「分享」按鈕 ⬆️
3. 向下滾動，點擊「添加到主畫面」
4. 點擊「新增」
5. APP圖標就會出現在桌面！

### **Android (Chrome)**

1. 用Chrome打開網址
2. 點擊右上角「⋮」菜单
3. 點擊「安裝應用」或「添加到主畫面」
4. 確認安裝
5. APP會出現在應用列表和桌面！

---

## 🌐 **推薦：部署到 Vercel**

### **完整步驟**

```bash
# 1. 在項目資料夾運行
cd C:/Users/user/Projects/NGO GPS

# 2. 登入Vercel
vercel login

# 3. 部署
vercel

# 4. 回答問題：
# - Set up and deploy? → Y
# - Which scope? → 選擇你的帳戶
# - Link to existing project? → N
# - Project name? → ngo-gps
# - Directory? → ./
# - Override settings? → N

# 5. 獲得URL，例如：
# https://ngo-gps.vercel.app

# 6. 生產環境部署
vercel --prod
```

### **之後每次更新**

```bash
vercel --prod
```

---

## 📱 **手機功能測試清單**

### **基本功能**
- [ ] 頁面能正常打開
- [ ] 繁體中文顯示正常
- [ ] 按鈕可以點擊
- [ ] 輸入框可以輸入

### **SMS驗證**
- [ ] 輸入手機號碼
- [ ] 點擊發送驗證碼
- [ ] 查看瀏覽器控制台（驗證碼）
- [ ] 輸入驗證碼登入

### **GPS定位**
- [ ] 允許位置權限
- [ ] 地圖顯示你的位置
- [ ] 能看到簽碼位置
- [ ] 距離計算準確

### **PWA安裝**
- [ ] 能安裝到桌面
- [ ] 圖標顯示正確
- [ ] 全屏模式正常
- [ ] 離線頁面（已緩存）

---

## 🔧 **故障排除**

### **手機打不開**

1. 確認URL正確
2. 確認手機和電腦在同一WiFi（本地模式）
3. 確認電腦的防火牆允許5176端口
4. 嘗試刷新頁面

### **GPS不工作**

1. 確認已允許位置權限
2. 在室外測試（室內GPS訊號弱）
3. 確認手機GPS已開啟
4. 檢查瀏覽器設置

### **SMS不工作（Demo模式）**

1. 打開瀏覽器開發者工具（F12）
2. 切換到Console標籤
3. 找到驗證碼（藍色日誌）
4. 複製驗證碼到輸入框

---

## 💰 **成本估算**

| 方案 | 費用 | 適用場景 |
|------|------|----------|
| 本地模式 | 免費 | 測試、演示 |
| Vercel | 免費（100GB流量/月）| 正式使用 |
| Netlify | 免費（100GB流量/月）| 正式使用 |
| 自架服務器 | 需購買服務器 | 大型活動 |

---

## 🎯 **推薦流程**

### **測試階段（現在）**
1. 使用本地模式測試功能
2. 收集反饋
3. 調整UI/UX

### **正式活動前1週**
1. 部署到Vercel
2. 測試完整流程
3. 準備工作人員培訓

### **活動當天**
1. 確認URL可訪問
2. 準備備用方案（紙質表格）
3. 安排技術支持

---

## 📞 **技術支持**

如有問題，請提供：
1. 使用的手機型號
2. 使用的瀏覽器
3. 具體的錯誤信息
4. 截圖（如有）

---

**立即行動：**
1. 嘗試用瀏覽器打開 `http://192.168.8.125:5176/`
2. 按提示添加到桌面
3. 測試基本功能

**有任何問題隨時告訴我！** 🚀
