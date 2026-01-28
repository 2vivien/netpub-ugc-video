import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import net from 'net';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple check to see if backend is up to avoid noisy proxy logs
let isBackendUp = false;
const checkBackend = () => {
  const socket = new net.Socket();
  socket.setTimeout(500);
  socket.on('connect', () => {
    isBackendUp = true;
    socket.destroy();
  }).on('error', () => {
    isBackendUp = false;
    socket.destroy();
  }).on('timeout', () => {
    isBackendUp = false;
    socket.destroy();
  }).connect(4000, '127.0.0.1');
};

// Check every 2 seconds only in development
let interval: NodeJS.Timeout;

export default defineConfig(({ command, mode }: { command: string, mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  if (command === 'serve') {
    if (!interval) {
      interval = setInterval(checkBackend, 2000);
      checkBackend();
    }
  }

  // Debug log during build (will show up in your terminal)
  console.log('Vite build mode:', mode);
  console.log('VITE_API_KEY present:', !!env.VITE_API_KEY);

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/graphql': {
          target: 'http://127.0.0.1:4000',
          changeOrigin: true,
          ws: true,
          bypass: (req, res) => {
            if (!isBackendUp) {
              res.statusCode = 503;
              res.end('Backend starting up...');
              return req.url; // Return something to indicate we handled it
            }
          },
        },
        '/csrf-token': {
          target: 'http://127.0.0.1:4000',
          changeOrigin: true,
          bypass: (req, res) => {
            if (!isBackendUp) {
              res.statusCode = 503;
              res.end('Backend starting up...');
              return req.url;
            }
          },
        },
      },
    },
    plugins: [react()],
    define: {
      'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_API_KEY),
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom', 'gsap', 'lucide-react', 'react-icons'],
          },
        },
      },
    },

  };
});
