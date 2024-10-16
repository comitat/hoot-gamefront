import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import mockServer from 'vite-plugin-mock-server';

export default defineConfig(({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return {
    plugins: [
      react(),
      mkcert(),
      process.env.VITE_USE_MOCK_SERVER === 'true' ? mockServer({
        mockRootDir: './apiMock'
      }) : null,
    ],
    server: {
      host: process.env.VITE_APP_URL,
      https: process.env.VITE_USE_HTTPS === 'true'
        ? { key: '', cert: '' }
        : undefined,
      // proxy: process.env.VITE_USE_MOCK_SERVER !== 'true' ? {
      //   '/api': {
      //     target: process.env.BACKEND_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // } : undefined,
    },
    resolve: {
      alias: [
        { find: '@api', replacement: '/src/api' },
        { find: '@assets', replacement: '/src/assets' },
        { find: '@components', replacement: '/src/components' },
        { find: '@store', replacement: '/src/store' },
        { find: '@pages', replacement: '/src/pages' },
        { find: '@tools', replacement: '/src/tools' },
        { find: '@models', replacement: '/src/models' },
      ],
    },
  };
});
