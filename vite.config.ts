import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'Nagpur ZP & PS Ward Structure',
          short_name: 'ZP PS Wards',
          description: 'Maharashtra ZP & Panchayat Samiti final ward structures for all 13 talukas of Nagpur District.',
          theme_color: '#064e3b',
          background_color: '#064e3b',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/extract-pdf' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const { GoogleGenAI, Type } = await import('@google/genai');
                  const { pdfBase64 } = JSON.parse(body);
                  if (!pdfBase64) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({ error: 'Missing pdfBase64' }));
                  }

                  const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
                  const ai = new GoogleGenAI({
                    apiKey: process.env.GEMINI_API_KEY,
                    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
                  });

                  const response = await ai.models.generateContent({
                    model: 'gemini-3.8-flash',
                    contents: [
                      {
                        parts: [
                          { inlineData: { mimeType: 'application/pdf', data: cleanBase64 } },
                          { text: 'Extract Maharashtra Panchayat Samiti 6-tier ward hierarchy JSON.' },
                        ],
                      },
                    ],
                    config: {
                      responseMimeType: 'application/json',
                    },
                  });

                  const parsed = JSON.parse(response.text || '{}');
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: true, data: parsed }));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: err?.message || 'Extraction failed' }));
                }
              });
              return;
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
