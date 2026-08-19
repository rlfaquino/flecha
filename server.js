import express from 'express';
import { createServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { WebSocketServer } from 'ws';
import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 5173);
const HTTPS_KEY = path.join(__dirname, 'certs', 'dev-key.pem');
const HTTPS_CERT = path.join(__dirname, 'certs', 'dev-cert.pem');
const DATA_FILE = path.join(__dirname, 'data', 'shared-session.json');
const defaults = { count: 0, obsHash: 'DEFAULT1', settings: { sensitivity: 50, cooldown: 1000, label: 'Disparos', showLabel: true, showTarget: true, targetCount: 30, textColor: '#fbbf24', backgroundColor: '#000000', transparentBackground: true, fontFamily: 'system-ui', fontSize: 96 } };
let state = defaults;

async function loadState() { try { state = { ...defaults, ...(JSON.parse(await readFile(DATA_FILE, 'utf8')) || {}) }; } catch { await persist(); } }
async function persist() { await writeFile(DATA_FILE, JSON.stringify(state, null, 2)); }
function broadcast() { const message = JSON.stringify({ type: 'state', state }); for (const client of sockets) if (client.readyState === 1) client.send(message); }
const sockets = new Set();

await loadState();
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/api/session', (_req, res) => res.json(state));
app.put('/api/session', async (req, res) => { state = { ...state, ...req.body, settings: { ...state.settings, ...(req.body.settings || {}) } }; await persist(); broadcast(); res.json(state); });
app.post('/api/session/increment', async (_req, res) => { state = { ...state, count: Math.max(0, Number(state.count) || 0) + 1 }; await persist(); broadcast(); res.json(state); });
app.use((_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
let server;
try {
  server = createHttpsServer({ key: readFileSync(HTTPS_KEY), cert: readFileSync(HTTPS_CERT) }, app);
  console.log('HTTPS ativado com certificado local.');
} catch (error) {
  console.error(`Não foi possível ativar HTTPS: ${error.message}`);
  process.exit(1);
}
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (socket) => { sockets.add(socket); socket.send(JSON.stringify({ type: 'state', state })); socket.on('message', async (raw) => { try { const message = JSON.parse(raw); if (message.type === 'update') { state = { ...state, ...message.state, settings: { ...state.settings, ...(message.state.settings || {}) } }; await persist(); broadcast(); } } catch {} }); socket.on('close', () => sockets.delete(socket)); });
server.listen(PORT, '0.0.0.0', () => console.log(`Arrow Counter disponível em https://localhost:${PORT} e https://192.168.1.6:${PORT}`));
