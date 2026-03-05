// ─────────────────────────────────────────────
//  server.js — Backend MercadoPago
//  La Esquina — Menú con pasarela de pago
// ─────────────────────────────────────────────

require('dotenv').config();

const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

// ── CONFIGURACIÓN ──────────────────────────────
// 1. Entrá a https://mercadopago.com.ar/developers
// 2. Creá o seleccioná tu aplicación
// 3. Copiá el Access Token de PRUEBA (empieza con TEST-...)
// 4. Pegalo acá abajo:

console.log('Token cargado:', process.env.ACCESS_TOKEN ? 'SÍ ✓' : 'NO ✗');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;


// URLs que MP usará al terminar el pago
// En producción, reemplazá por tu dominio real
const BASE_URL = 'https://mp-carbon-production.up.railway.app';



const URLS = {
  success: 'https://www.mercadopago.com.ar',
  failure: 'https://www.mercadopago.com.ar',
  pending: 'https://www.mercadopago.com.ar',
};

const PORT = 3000;
// ──────────────────────────────────────────────


// ── MIME TYPES ────────────────────────────────
const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
};


// ── CREAR PREFERENCIA EN MERCADOPAGO ─────────
async function createPreference(items) {
  const body = JSON.stringify({
    items,
    back_urls: URLS,
    statement_descriptor: 'LA ESQUINA',
  });

  // Node nativo con https module
  const https = require('https');

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.mercadopago.com',
      path: '/checkout/preferences',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(body),
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Respuesta MP:', data);
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}


// ── SERVIDOR HTTP ─────────────────────────────
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  // POST /create-preference
  if (req.method === 'POST' && parsed.pathname === '/create-preference') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { items } = JSON.parse(body);

        if (!items || !items.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'No items' }));
        }

        const preference = await createPreference(items);

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          id: preference.id,
          init_point: preference.init_point,           // Producción
          sandbox_init_point: preference.sandbox_init_point, // Pruebas
        }));

      } catch (err) {
        console.error('Error MP:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // GET — Servir archivos estáticos
  let filePath = path.join(__dirname, 'public', parsed.pathname === '/' ? 'index.html' : parsed.pathname);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Si no encuentra el archivo, servir index.html (SPA fallback)
      fs.readFile(path.join(__dirname, 'public', 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(d2);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  🍽  La Esquina — Servidor corriendo');
  console.log('  ─────────────────────────────────');
  console.log('  Local:   http://localhost:' + PORT);
  console.log('');
  if (!ACCESS_TOKEN) {
    console.log('  ⚠  ACCESS_TOKEN no configurado');
    console.log('     Creá un archivo .env con ACCESS_TOKEN=TEST-...');
} else {
    console.log('  ✓  MercadoPago conectado');
}
  console.log('');
});

