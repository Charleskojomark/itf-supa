import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          const url = new URL(req.url, 'http://localhost');
          let handlerModule: any;
          if (url.pathname === '/api/auth/register') {
            handlerModule = await server.ssrLoadModule('./api/auth/register.ts');
          } else if (url.pathname === '/api/auth/login') {
            handlerModule = await server.ssrLoadModule('./api/auth/login.ts');
          } else if (url.pathname === '/api/auth/verify-pin') {
            handlerModule = await server.ssrLoadModule('./api/auth/verify-pin.ts');
          } else if (url.pathname === '/api/students') {
            handlerModule = await server.ssrLoadModule('./api/students/index.ts');
          } else if (url.pathname === '/api/students/sync') {
            handlerModule = await server.ssrLoadModule('./api/students/sync.ts');
          }

          if (handlerModule && handlerModule.default) {
            let body: any = {};
            if (req.method === 'POST') {
              const buffers: any[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const raw = Buffer.concat(buffers).toString();
              try {
                body = JSON.parse(raw);
              } catch (e) {
                body = {};
              }
            }
            (req as any).body = body;
            (res as any).status = (code: number) => {
              res.statusCode = code;
              return res;
            };
            (res as any).json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
            try {
              return await handlerModule.default(req, res);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err.message }));
            }
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    devApiPlugin(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'AI Naija Academy - ITF SUPA LMS',
        short_name: 'AI Naija',
        description: 'Gamified, offline-first AI Specialist LMS for ITF SUPA Level 3 Standard',
        theme_color: '#0A2619',
        background_color: '#0A2619',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})

