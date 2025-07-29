import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // This tells Vite that your `public` folder contains static assets.
  // When you use a path like `/css/style.css` in your HTML,
  // Vite will now correctly look inside the `public` folder for it.
  publicDir: 'public',

  build: {
    // This tells Vite where to put the final, optimized files after you run `npm run build`.
    // A `dist` folder will be created with your production-ready site.
    outDir: 'dist',
  },
})