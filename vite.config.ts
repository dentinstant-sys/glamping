import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Inyecta las etiquetas que dependen del dominio (canonical + og:url) sobre el
 * marcador `<!--SEO_URL-->` de index.html.
 *
 * Se hace con un plugin y no con `%VITE_SITIO_URL%` a propósito: si la variable
 * falta, la sustitución de Vite dejaría el literal `%VITE_SITIO_URL%` dentro del
 * href y publicaríamos un canonical basura — peor para SEO que no tener ninguno.
 * Aquí, sin variable, simplemente no se emiten las etiquetas.
 */
function seoUrl(sitioUrl: string): Plugin {
  return {
    name: 'royal-seo-url',
    transformIndexHtml(html) {
      if (!sitioUrl) {
        return html.replace('<!--SEO_URL-->', '<!-- Sin VITE_SITIO_URL: no se emite canonical -->');
      }
      const base = sitioUrl.replace(/\/+$/, '');
      // og:image exige URL ABSOLUTA (WhatsApp y demás scrapers ignoran las
      // relativas), por eso se arma aquí y no en el HTML estático. El archivo
      // es public/og.jpg — foto con ruta estable, fuera del hash de Vite.
      // Sin ella, compartir el sitio por WhatsApp salía sin foto — y WhatsApp
      // es el canal principal del negocio.
      return html.replace(
        '<!--SEO_URL-->',
        [
          `<link rel="canonical" href="${base}/" />`,
          `<meta property="og:url" content="${base}/" />`,
          `<meta property="og:image" content="${base}/og.jpg" />`,
          `<meta property="og:image:alt" content="Domos geodésicos de Royal Glamping al atardecer" />`,
          `<meta name="twitter:image" content="${base}/og.jpg" />`,
        ].join('\n    '),
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), tailwindcss(), seoUrl(env.VITE_SITIO_URL ?? '')],
    server: {
      port: 5173,
      // Solo localhost. Para probar en un teléfono real de la red, poner
      // `host: true` aquí y añadir `"host": "0.0.0.0"` a los emuladores en
      // firebase.json — recordando que eso deja el Firestore de prueba abierto
      // a cualquiera en la wifi.
    },
    build: {
      rollupOptions: {
        output: {
          // Separar dependencias pesadas en chunks propios para mejor caché y LCP.
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/firestore', 'firebase/functions'],
          },
        },
      },
    },
  };
});
