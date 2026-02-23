import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-pwa-assets',
      apply: 'build',
      writeBundle() {
        const filesToCopy = ['sw.js', 'manifest.json'];
        const files = fs.readdirSync('.');
        files.forEach(file => {
          if (file.startsWith('icon-') && (file.endsWith('.png') || file.endsWith('.jpg'))) {
            filesToCopy.push(file);
          }
        });

        filesToCopy.forEach(file => {
          const src = path.resolve(file);
          const dest = path.resolve('dist', file);
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`✓ [pwa-copy] ${file} -> dist/${file}`);
          }
        });
        
        fs.writeFileSync(path.resolve('dist', '.nojekyll'), '');
      }
    }
  ],
  base: './', // Критично для корректных путей в sandbox и на хостингах
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});