# 🔧 API 設置指南 - GPS和SMS功能

## 📱 概述

本應用現已整合 **SMS驗證** 和 **GPS定位** 功能，需要配置外部API服務才能正常運作。

---

## 🚀 快速開始

### **選項1：Demo模式（無需API）**
應用已內置Demo模式，可以直接測試：
- ✅ **SMS**: 驗證碼會顯示在控制台
- ✅ **GPS**: 使用瀏覽器定位或默認位置（長洲島）

### **選項2：完整功能模式**
配置真實API服務以實現完整功能。

---

## 📨 **設置Twilio SMS服務**

### **步驟1：註冊Twilio帳戶**
1. 訪問 [Twilio官網](https://www.twilio.com/)
2. 註冊免費帳戶（免費額度：發送測試短信）
3. 獲取以下信息：
   - Account SID
   - Auth Token
   - Twilio Phone Number

### **步驟2：配置環境變量**
創建 `.env` 文件（複製 `.env.example`）：

```bash
cp .env.example .env
```

編輯 `.env` 文件：
```env
VITE_TWILIO_ACCOUNT_SID=your_actual_account_sid
VITE_TWILIO_AUTH_TOKEN=your_actual_auth_token
VITE_TWILIO_PHONE_NUMBER=+85212345678
```

### **步驟3：測試SMS功能**
1. 重啟開發服務器
2. 在登入頁面輸入手機號碼
3. 點擊「發送驗證碼」
4. 查看手機接收到的短信

---

## 🗺️ **設置Mapbox地圖服務**

### **步驟1：註冊Mapbox**
1. 訪問 [Mapbox官網](https://www.mapbox.com/)
2. 註冊免費帳戶（免費額度：50,000次地圖調用/月）
3. 獲取Access Token

### **步驟2：配置Mapbox**
在 `.env` 文件中添加：
```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

### **步驟3：安裝Mapbox SDK**
```bash
npm install mapbox-gl
```

---

## 🗄️ **可選：設置Supabase後端**

### **為什麼需要Supabase？**
- **實時同步** - 多用戶實時更新積分
- **數據持久化** - 保存用戶進度和記錄
- **用戶管理** - 安全的認證系統
- **API端點** - 安全的後端API

### **步驟1：創建Supabase項目**
1. 訪問 [Supabase官網](https://supabase.com/)
2. 創建新項目（免費）
3. 獲取：
   - Project URL
   - Anon Key

### **步驟2：配置Supabase**
在 `.env` 文件中添加：
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **步驟3：創建數據庫表**
在Supabase SQL編輯器中運行：

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Checkpoints table
CREATE TABLE checkpoints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User checkpoints (scanned checkpoints)
CREATE TABLE user_checkpoints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  checkpoint_id UUID REFERENCES checkpoints(id),
  scanned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, checkpoint_id)
);
```

---

## 💰 **費用估算**

### **免費額度（足夠測試和小型活動）**
- **Twilio**: 免費 $15 額度
- **Mapbox**: 50,000次地圖調用/月
- **Supabase**: 500MB數據庫 + 1GB文件存儲

### **付費計劃（大型活動）**
- **Twilio**: ~HK$1-2/條短信
- **Mapbox**: 免費額度足夠
- **Supabase**: 免費額度足夠

---

## 🔧 **開發環境設置**

### **安裝依賴**
```bash
# 已安裝的依賴
npm install react-router-dom lucide-react

# 新增依賴（如果使用完整地圖功能）
npm install mapbox-gl

# 可選：Supabase客戶端
npm install @supabase/supabase-js
```

### **環境變量優先級**
1. `.env` 文件（本地開發）
2. `.env.production` （生產環境）
3. 系統環境變量

---

## ✅ **測試清單**

### **SMS功能測試**
- [ ] 能夠發送驗證碼
- [ ] 能夠驗證碼驗證
- [ ] 倒計時功能正常
- [ ] 重新發送功能正常

### **GPS功能測試**
- [ ] 能夠獲取當前位置
- [ ] 地圖顯示正確
- [ ] 距離計算準確
- [ ] 30米探測功能正常

### **整合測試**
- [ ] 用戶登入流程
- [ ] 簽碼掃描流程
- [ ] 積分計算正確
- [ ] 獎品兌換流程

---

## 🚨 **常見問題**

### **SMS發送失敗**
- 檢查Twilio餘額
- 確認手機號碼格式（+852xxxxxxxx）
- 檢查網絡連接

### **GPS定位不準**
- 確保允許瀏覽器定位權限
- 在室外測試（室內GPS訊號弱）
- 檢查設備是否支持GPS

### **地圖不顯示**
- 檢查Mapbox Token是否正確
- 確認網絡連接正常
- 查看瀏覽器控制台錯誤

---

## 📞 **技術支持**

如有問題，請檢查：
1. 瀏覽器開發者工具控制台
2. 網絡請求（Network標籤）
3. 環境變量是否正確設置

---

## 🎯 **下一步**

1. **測試Demo模式** - 確保基本功能正常
2. **配置真實API** - 按需配置Twilio/Mapbox
3. **生產環境部署** - 配置生產環境變量
4. **性能優化** - 監控API使用量和成本

**Demo模式已足夠演示使用，配置真實API僅在正式活動時需要！** 🚀
