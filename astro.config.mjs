// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// En Vercel se usa el dominio de producción real; en local, un valor de respaldo.
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://diagnostico-bolivar.vercel.app';

export default defineConfig({
  site,
  integrations: [sitemap({ lastmod: new Date() })],
  trailingSlash: 'never',
  // El CSS (≈14 kB) se incrusta en cada página: elimina una petición que bloquea el renderizado.
  build: { format: 'file', inlineStylesheets: 'always' },
  compressHTML: true,
  // CSP estricta como <meta>, con el hash del CSS incrustado (sin 'unsafe-inline'). frame-ancestors va en el encabezado de vercel.json.
  security: {
    csp: {
      directives: ["default-src 'none'", "img-src 'self'", "manifest-src 'self'", "base-uri 'none'", "form-action 'none'", "connect-src 'self'"],
    },
  },
});
