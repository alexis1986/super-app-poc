const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 9000;
const PLATFORM = 'android';

// Enable CORS para que las apps puedan cargar los bundles
app.use(cors());

// Log de requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Servir archivos estáticos desde build/generated (donde webpack realmente genera los archivos)
app.use(express.static(path.join(__dirname, 'build', 'generated', PLATFORM)));

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', platform: PLATFORM });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
========================================
📦 Shared Components Server
========================================
Platform: ${PLATFORM}
Port: ${PORT}
URL: http://localhost:${PORT}
Remote Entry: http://localhost:${PORT}/remoteEntry.bundle

Serving from: build/generated/${PLATFORM}
========================================
  `);
});