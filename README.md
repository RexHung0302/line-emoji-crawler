# LINE Emoji Crawler

古人有云：『能自動化之事，勿自爲手動』

> 能讓程式替我們執行的事情就不要手動了

這是一款關於透過爬蟲自動抓取 [LINE Emoji](https://developers.line.biz/en/docs/messaging-api/emoji-list/#line-emoji-definitions) 的程式碼，起因動機為筆者正在練習串接 LINE Messaging API，在 [Text Message](https://developers.line.biz/en/reference/messaging-api/#text-message) 的格式裡可以放入 Emoji，故筆者想抓取圖片後，製作界面讓使用者可以透過 UI 選擇問顏文字，如下圖。

![Emoji UI 選擇假想圖]('/emoji-demo.png')

當然這段程式碼可以將抓取的目標替換為任何你想抓取的目標，這段程式碼基本做下面幾件事情：

1. 先清空下載的資料夾(./download) 
2. 打開預抓取 Emoji 的目標網站
3. 抓取每一組 Product ID 當作資料夾名稱
4. 每抓到一組 Product ID 就順勢點開 Emoji 底下的 Show all 按鈕，展示完整的 Emoji
5. 抓取每一張圖片，存進剛剛建立的資料夾
  ![Emoji 抓取後圖片展示]('/emoji-download-demo.png')
6. 全部抓取完畢後，透過剛剛抓取時取得到的 Project ID 及 Emoji Number，建立一份 JSON 檔案保存
  ![JSON 內容展示]('/emoji-json-demo.png')
## 運作環境

- Chrome v49+ or Firefox v45+ or Safari v9+
- 一台筆電 或 桌電 或 近代的手機(至少要能跑 Angry Birds )
- 一顆炙熱的寫 Code ❤️
- 至少有充足的睡眠(8/hr+)
- 至少保證自己吃過早點 或 晚餐(3 餐+)
- 沒有喝酒的情況下

## 建議環境

- nvm v0.35.0
- node v16.15.1

---

## 環境 domain 說明

- 無

---

## 使用套件

puppeteer - v20.8.2

axios - v1.4.0

---

## 環境安裝說明

1. npm install / yarn install

2. npm run start / yarn start

---

## 其他備註

### 充足的睡眠

1. 確保有睡滿 8 小時

2. 不要熬夜

### 保證有吃過早餐

1. 記得少吃油類早餐

2. 高蛋白質的早餐，可使人思考敏銳、反應靈活，並且提高學習和工作效率
