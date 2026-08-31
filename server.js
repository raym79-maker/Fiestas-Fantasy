const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// URL canónica de cada página (la que aparece en el sitemap y en el <link rel="canonical">)
const CANONICAL = {
  '/eventos-corporativos': path.join(__dirname, 'eventos-corporativos', 'index.html'),
  '/fiestas-familiares': path.join(__dirname, 'fiestas-familiares', 'index.html'),
  '/blog/ideas-convivio-empresa-bajio': path.join(__dirname, 'blog', 'blog-convivio-empresa-bajio.html'),
  '/blog/que-es-casino-entretenimiento': path.join(__dirname, 'blog', 'blog-que-es-casino-entretenimiento.html'),
  '/blog/quinceanera-diferente-queretaro': path.join(__dirname, 'blog', 'blog-quinceañera-diferente.html'),
};

// Rutas de archivo internas que no deben indexarse por separado:
// si alguien (o Google) las alcanza, se redirigen a su URL canónica.
const FILE_ALIASES = {
  '/eventos-corporativos/index': '/eventos-corporativos',
  '/fiestas-familiares/index': '/fiestas-familiares',
  '/blog/blog-convivio-empresa-bajio': '/blog/ideas-convivio-empresa-bajio',
  '/blog/blog-que-es-casino-entretenimiento': '/blog/que-es-casino-entretenimiento',
  '/blog/blog-quinceañera-diferente': '/blog/quinceanera-diferente-queretaro',
};

// Archivos estáticos reales que deben servirse tal cual (no normalizar)
const STATIC_EXT = /\.(jpe?g|png|gif|svg|ico|webp|css|js|xml|txt|json|woff2?|ttf|eot|mp4|webm|pdf)$/i;

// ──────────────────────────────────────────────────────────────
// SEO: normalización de URLs con 301.
// Debe ir ANTES de express.static para evitar contenido duplicado.
// Consolida: /pagina.html, /pagina/ y /pagina  →  /pagina
// ──────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const qIndex = req.url.indexOf('?');
  const pathname = qIndex === -1 ? req.url : req.url.slice(0, qIndex);
  const query = qIndex === -1 ? '' : req.url.slice(qIndex);

  if (STATIC_EXT.test(pathname)) return next();

  let clean = pathname;

  // 1. Quitar la extensión .html:  /eventos-corporativos.html → /eventos-corporativos
  if (clean.toLowerCase().endsWith('.html')) {
    clean = clean.slice(0, -5);
  }

  // 2. Quitar el slash final (menos en la raíz):  /blog/post/ → /blog/post
  if (clean.length > 1) {
    clean = clean.replace(/\/+$/, '') || '/';
  }

  // 3. /index → raíz
  if (clean === '/index') {
    clean = '/';
  }

  // 4. Rutas de archivo internas → su URL canónica
  if (FILE_ALIASES[clean]) {
    clean = FILE_ALIASES[clean];
  }

  if (clean !== pathname) {
    return res.redirect(301, clean + query);
  }

  next();
});

// Archivos estáticos.
// index:false y redirect:false evitan que express.static genere
// variantes de URL (/carpeta/ → index.html) que dupliquen contenido.
app.use(express.static(path.join(__dirname, '.'), { index: false, redirect: false }));

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Páginas con URL limpia
Object.entries(CANONICAL).forEach(([route, file]) => {
  app.get(route, (req, res) => res.sendFile(file));
});

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

// Cualquier otra ruta: 404 real.
// Devolver 404 (y no la home con 200, ni un 301 a la home) es lo que
// Google espera para URLs que no existen: evita los "soft 404" y que
// se indexe contenido duplicado bajo direcciones inventadas.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
  console.log(`✓ Fiesta Fantasy server corriendo en puerto ${PORT}`);
});
