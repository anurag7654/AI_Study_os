import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Serve static assets from Vite dist build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint for Render zero-downtime health probes
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// SPA fallback: any other request serves index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Study OS production server running on port ${PORT}`);
});
