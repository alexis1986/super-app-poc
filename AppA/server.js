const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8081;
const PLATFORM = 'android';

app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, 'build', 'generated', PLATFORM)));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'AppA', platform: PLATFORM });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
========================================
📱 App A Development Server
========================================
Platform: ${PLATFORM}
Port: ${PORT}
Bundle: http://localhost:${PORT}/index.bundle
========================================
  `);
});