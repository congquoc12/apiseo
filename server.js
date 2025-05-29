const express = require('express');
const fetch = require('node-fetch'); // Dùng 'node-fetch' cho Node <=17
const app = express();

// Gist URL gốc
const GIST_URL = 'https://gist.githubusercontent.com/congquoc12/3f5f40771a55213cb5bb0bcc1b8f450b/raw/gistfile1.txt';

// Bỏ cache ở mọi cấp độ
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Proxy tới Gist (bỏ cache với timestamp)
app.get('/', async (req, res) => {
  try {
    const response = await fetch(`${GIST_URL}?t=${Date.now()}`);
    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
    const text = await response.text();
    res.setHeader('Content-Type', 'text/plain');
    res.send(text);
  } catch (error) {
    res.status(500).send('❌ Lỗi proxy: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server đang chạy tại cổng ${PORT}`);
});
