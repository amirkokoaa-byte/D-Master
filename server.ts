import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });
  
  const PORT = 3000;
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Handle speed test requests (mock ping & latency)
  app.get('/api/speedtest', (req, res) => {
    res.json({
      latency: Math.floor(Math.random() * 50) + 10,
      download_speed: Math.floor(Math.random() * 50) + 20, // Mbps
      protocol: 'HTTP/2',
      tls: 'TLS 1.3',
      resume: 'Supported'
    });
  });

  // Downloads mock logic via Socket.io
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('start_download', (data) => {
      const { id, url, format, speedLimit, simulatedSize = 100 * 1024 * 1024 } = data; // 100MB default
      
      let downloaded = 0;
      let total = simulatedSize;
      let isPaused = false;
      let isCancelled = false;

      // Speed limit logic. If 'unlimited', use high speed. Else use the specified bytes per sec.
      const intervalMs = 1000;
      let charsPerSec = speedLimit === 'unlimited' ? 10 * 1024 * 1024 : parseInt(speedLimit); 
      
      const interval = setInterval(() => {
        if (isCancelled) {
          clearInterval(interval);
          socket.emit('download_failed', { id, error: 'Cancelled' });
          return;
        }
        if (isPaused) return;

        // Apply a little randomness to make it look real
        const currentSpeed = charsPerSec * (0.8 + Math.random() * 0.4);
        downloaded += currentSpeed;

        if (downloaded >= total) {
          downloaded = total;
          clearInterval(interval);
          socket.emit('download_progress', { id, downloaded, total, speed: currentSpeed });
          socket.emit('download_complete', { id, success: true });
        } else {
          socket.emit('download_progress', { id, downloaded, total, speed: currentSpeed });
        }
      }, intervalMs);

      socket.on('cancel_download', (cancelData) => {
        if (cancelData.id === id) isCancelled = true;
      });
      socket.on('pause_download', (pauseData) => {
        if (pauseData.id === id) isPaused = true;
      });
      socket.on('resume_download', (resumeData) => {
        if (resumeData.id === id) isPaused = false;
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
