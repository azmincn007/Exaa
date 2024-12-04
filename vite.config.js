import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePrerender } from 'vite-plugin-prerender'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      // Specify routes to pre-render
      routes: [
        '/',
        '/category/1/category-name',
        '/packages',
        '/profile',
        '/showroom'
      ],
      
      // Optional: Customize rendering
      renderAfterDocumentEvent: 'render-complete',
      
      // Optional: Server-side rendering configuration
      postProcess: (context) => {
        // Add your meta tags or modify the rendered HTML
        context.html = context.html
          .replace(
            '<div id="root"></div>', 
            `<div id="root">${context.renderedContent}</div>`
          )
        return context
      }
    })
  ],
  
  // Resolve aliases if you use them
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})