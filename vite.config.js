import { defineConfig } from 'vite';

export default defineConfig({
  // This tells Vite that your 'static' folder contains public assets
  // that should be copied directly to the build output.
  publicDir: 'static',
});