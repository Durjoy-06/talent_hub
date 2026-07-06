import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
<<<<<<< HEAD
=======
      port: 5173,
      strictPort: true,
      // Proxy /api/* requests from Vite (5173) to the Express server.
      // The server chooses a free port at startup, so this target is resolved dynamically.
      proxy: {
        '/api': {
          target: process.env.VITE_API_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
>>>>>>> pr/chat-and-local-dev-fix
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
