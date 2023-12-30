# 考題知識點分析小幫手
## 檔案簡要說明
- LINE Bot 部屬 `app.js`
含回應 render.com 啟動
- 爬蟲資料蒐集 `data_collect/sele.py` `data_collect/test.ipynb`
  - 爬取出的資料：均一教育平台高中生物科學習資源 `data_collect/均一高中生物.csv`
- OpenAI API (ChatGPT) `openai.js`
- Tesseract.js OCR 圖片轉文字 `ocr.js`

## 部屬方式
> [!NOTE]\
> 部屬時需建立 `.env` 檔
> 請在檔案中放入 `OPENAI_API_KEY`、LINE channel 的 `LINE_ACCESS_TOKEN` 與 `CHANNEL_SECRET`。

### terminal 步驟
請確保已經 `cd final`
```md
npm i
```

```md
node app.js
```

```md
ngrok http 3000
```

最後至 LINE Developers Console 設定 channel 的 Webhook URL。

## 操作畫面
![img](https://wannaflyhigh.github.io/LATIA112-1/final/操作畫面.png)