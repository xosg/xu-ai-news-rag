import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
// MongoDB removed: using only Chroma for knowledge base
import { addEmbedding, queryEmbedding, createCollection } from './chroma-client.js';

const JWT_SECRET = 'dev_secret';

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encHeader = base64url(JSON.stringify(header));
  const encPayload = base64url(JSON.stringify(payload));
  const data = `${encHeader}.${encPayload}`;
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${data}.${signature}`;
}

function verifyJWT(token, secret) {
  const [encHeader, encPayload, signature] = token.split('.');
  if (!encHeader || !encPayload || !signature) return null;
  const data = `${encHeader}.${encPayload}`;
  const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  if (signature !== expectedSig) return null;
  try {
    return JSON.parse(Buffer.from(encPayload, 'base64').toString());
  } catch {
    return null;
  }
}


const DEMO_USER = { username: 'admin', password: 'admin' };

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/[a-zA-Z]:/, m => m[1] + ':'));
const frontendDir = path.resolve(__dirname, '../frontend');

function sendJson(res, obj, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function serveStatic(req, res) {
  let reqPath;
  try {
    reqPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  } catch {
    reqPath = '/';
  }
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(frontendDir, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const mime = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon',
      }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  } catch {
    pathname = '/';
  }
  if (req.method === 'POST' && pathname === '/api/login') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        if (username === DEMO_USER.username && password === DEMO_USER.password) {
          // expiresIn: 1h
          const exp = Math.floor(Date.now() / 1000) + 3600;
          const token = signJWT({ username, exp }, JWT_SECRET);
          sendJson(res, { token });
        } else {
          sendJson(res, { error: 'Invalid credentials' }, 401);
        }
      } catch (e) {
        sendJson(res, { error: 'Bad request' }, 400);
      }
    });
  } else if (req.method === 'GET' && pathname === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
  } else if (req.method === 'POST' && pathname === '/api/chroma/add') {
    // Add embedding to Chroma
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { collection, id, embedding, metadata } = JSON.parse(body);
        const result = await addEmbedding(collection, id, embedding, metadata);
        sendJson(res, result);
      } catch (e) {
        sendJson(res, { error: 'Bad request' }, 400);
      }
    });
  } else if (req.method === 'POST' && pathname === '/api/chroma/query') {
    // Query embedding from Chroma
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { collection, embedding, topK } = JSON.parse(body);
        const result = await queryEmbedding(collection, embedding, topK);
        sendJson(res, result);
      } catch (e) {
        sendJson(res, { error: 'Bad request' }, 400);
      }
    });
  } else if (req.method === 'POST' && pathname === '/api/chroma/create-collection') {
    // Create a new Chroma collection
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { name } = JSON.parse(body);
        const result = await createCollection(name);
        sendJson(res, result);
      } catch (e) {
        sendJson(res, { error: 'Bad request' }, 400);
      }
    });
  } else if (req.method === 'GET' && (pathname === '/' || pathname.startsWith('/frontend/'))) {
    // Serve static frontend files
    serveStatic(req, res);
  } else if (req.method === 'GET') {
    // Try to serve static file from frontend for any GET
    serveStatic(req, res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3001, () => console.log('Native server running on http://localhost:3001'));
