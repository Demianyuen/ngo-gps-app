# Netlify 部署步驟

## 步驟 1：登入 Netlify

Netlify CLI 已安裝完成！現在需要登入。

### 選項 A：自動登入（推薦）

在終端運行：
```bash
netlify login
```

這會：
1. 打開瀏覽器
2. 讓你授權 Netlify CLI
3. 自動完成認證

### 選項 B：手動 Token

如果自動登入失敗：
1. 訪問：https://app.netlify.com/user/applications
2. 創建 "New access token"
3. 複製 token
4. 運行：`netlify login --token=YOUR_TOKEN`

## 步驟 2：部署應用

登入後，運行：

```bash
cd "C:\Users\user\Projects\NGO GPS"
netlify deploy --prod --dir=dist --site=ngo-gps-cheung-chau
```

這會創建一個類似這樣的鏈結：
**https://ngo-gps-cheung-chau.netlify.app**

## 步驟 3：測試部署

部署完成後：
1. 用手機訪問生成的鏈結
2. 測試所有功能
3. 分享給客戶

## 如果想要使用 Netlify Drop（更簡單）

1. 訪問：https://app.netlify.com/drop
2. 將這個資料夾拖到網頁上：
   ```
   C:\Users\user\Projects\NGO GPS\dist
   ```
3. 等待幾秒鐘，獲得鏈結

## 快速決策

**哪個更快？**
- Netlify Drop：2分鐘（拖拽即可，不需要登入 CLI）
- Netlify CLI：5分鐘（需要登入，但可自訂域名）

**建議：**
如果你想要 ** ngo-gps-cheung-chau.netlify.app** 這個域名，使用 CLI
如果你不介意隨機域名，使用 Netlify Drop

選擇一個，然後告訴我！
