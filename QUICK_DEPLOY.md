# 快速部署指南 - Netlify Drop

## 步驟 1：準備部署

應用已經編譯完成，位於：
```
C:\Users\user\Projects\NGO GPS\dist
```

## 步驟 2：使用 Netlify Drop 部署

1. **打開瀏覽器**，訪問：https://app.netlify.com/drop

2. **將 dist 資料夾拖到網頁上的 "Drag and drop your site output folder here" 區域**

3. **等待幾秒鐘**，Netlify 會自動：
   - 上傳文件
   - 創建網站
   - 生成鏈結

4. **獲得獨立鏈結**，例如：
   - `https://amazing-abc123.netlify.app`
   - `https://ngo-gps-cheung-chau.netlify.app`

## 步驟 3：測試部署

部署後，使用手機訪問生成的鏈結，測試以下功能：

### 基本功能
- [ ] 頁面正常載入
- [ ] 可以選擇用戶/主辦方登入

### 用戶功能
- [ ] 手機號碼註冊（或使用主辦方生成的代碼）
- [ ] GPS定位正常
- [ ] 地圖顯示簽碼點
- [ ] QR碼掃描功能
- [ ] 照片上傳功能
- [ ] 查看分數
- [ ] 查看公告板
- [ ] 查看獎品商店

### 主辦方功能
- [ ] 登入後台
- [ ] 管理活動
- [ ] 添加簽碼點
- [ ] 管理獎品
- [ ] 查看用戶分數
- [ ] 手動兌換

## 步驟 4：自訂域名（可選）

Netlify Drop 提供的鏈結是免費的，格式為：
`https://random-name.netlify.app`

如果想要自訂域名：
1. 在 Netlify Dashboard 中打開你的網站
2. 前往 "Domain settings"
3. 點擊 "Add custom domain"
4. 輸入你的域名（例如 `cheungchau-gps.ngo.hk`）
5. 按照指示配置 DNS

## 故障排除

### 404 錯誤
如果出現 404 錯誤，檢查：
1. `dist/_redirects` 文件是否存在
2. 文件內容應該是：`/* /index.html 200`

### GPS 不工作
- 確保使用 HTTPS 或 localhost
- 檢查瀏覽器的定位權限

### QR碼掃描失敗
- 確保使用 HTTPS
- 檢查相機權限
- 嘗試使用不同的瀏覽器

## 下一步

部署完成後，你可以：
1. 分享鏈結給客戶測試
2. 根據反饋調整功能
3. 添加更多活動和簽碼點
4. 準備正式發布

祝部署順利！🚀
