// Genera /notas/ (índice + una página por nota) con los banners de oportunidad.
// Uso: node _notas-src/build.mjs   (desde la carpeta del sitio)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { notas } from './contenido.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WA = '525585227440';
const SITE = 'https://kc-venta-de-terrenos.vercel.app';
const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => s.replace(/<[^>]+>/g, '');

const ICONS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-chat" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z"/><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M9 10.5h6M9 13.5h4"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M4 12h16M14 6l6 6-6 6"/></symbol>
  <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M3.5 10h17M8 3v4M16 3v4"/></symbol>
</svg>`;

function head({ title, desc, path, img }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
<link rel="icon" type="image/png" href="/media/logo-kc.png">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:image" content="${SITE}${img}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Jost:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/notas/notas.css">
</head>
<body>
${ICONS}`;
}

function header(msg, current) {
  return `<header class="bar on-dark">
  <div class="wrap bar-in">
    <a class="brand" href="/" aria-label="KC Venta de Terrenos, ir al inicio">
      <img src="/media/logo-kc.png" alt="" width="60" height="60">
      <span class="brand-name" aria-hidden="true"><b>KC</b><small>Venta de terrenos</small></span>
    </a>
    <nav class="bar-nav" aria-label="Principal">
      <a class="tlink" href="/">Inicio</a>
      <a class="tlink" href="/notas/"${current ? ' aria-current="page"' : ''}>Notas</a>
      <a class="tlink" href="/#cita">Agendar visita</a>
      <a class="btn btn-light btn-wa" href="${wa(msg)}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp"><svg aria-hidden="true"><use href="#i-chat"/></svg><span>WhatsApp</span></a>
    </nav>
  </div>
</header>`;
}

// Leaderboard 728×90 (320×100 en celular)
function leaderboard(msg, v = 0) {
  const titles = [
    'Tu terreno con <em>vista al valle</em>',
    'Lotes de 120 m² <em>en venta</em>',
    'Empieza tu patrimonio <em>desde $15,000</em>',
  ];
  return `<div class="lb-slot">
  <div class="wrap">
    <span class="ad-label">Oportunidad KC</span>
    <a class="leader" href="${wa(msg)}" target="_blank" rel="noopener" aria-label="Oportunidad: terrenos de 8 × 15 m con $15,000 de enganche. Contactar por WhatsApp">
      <img class="leader-img" src="/media/galeria-estacas.jpg" alt="" width="96" height="90">
      <span class="leader-copy">
        <span class="leader-kicker">Oportunidad · Terrenos</span>
        <span class="leader-title">${titles[v % titles.length]}</span>
        <span class="leader-sub">8 × 15 m · $15,000 de enganche · mensualidades congeladas de $3,000</span>
      </span>
      <span class="leader-cta">Contactar aquí<svg aria-hidden="true"><use href="#i-arrow"/></svg></span>
    </a>
  </div>
</div>`;
}

// Rectángulo 300×250
function rect(msg) {
  return `<a class="rect" href="${wa(msg)}" target="_blank" rel="noopener" aria-label="Oportunidad: lotes de 8 × 15 m por $350,000. Contactar por WhatsApp">
  <span class="rect-media"><img src="/media/propiedad.jpg" alt="" width="300" height="118" loading="lazy"><span>Oportunidad</span></span>
  <span class="rect-body">
    <span class="rect-title">Lotes de 8 × 15 m con vista al valle</span>
    <span class="rect-price">$350,000 MXN · Enganche <b>$15,000</b> · <b>$3,000</b> al mes, congeladas</span>
    <span class="leader-cta">Contactar aquí<svg aria-hidden="true"><use href="#i-arrow"/></svg></span>
  </span>
</a>`;
}

function promo(n) {
  const p = n.promo;
  return `<aside class="promo" aria-label="Oportunidad de terrenos">
  <img src="${p.img || '/media/galeria-cerros.jpg'}" alt="" loading="lazy">
  <div class="promo-body">
    <span class="eyebrow">Oportunidad KC</span>
    <h3>${p.title}</h3>
    <p>${p.text}</p>
    <ul class="promo-stats"><li>8 × 15 m</li><li>Enganche $15,000</li><li>$3,000 al mes</li></ul>
    <div class="promo-actions">
      <a class="btn btn-gold" href="${wa(n.wa)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-chat"/></svg>Contactar aquí</a>
      <a class="btn btn-ghost-light" href="/#cita"><svg aria-hidden="true"><use href="#i-calendar"/></svg>Agendar visita</a>
    </div>
  </div>
</aside>`;
}

function band(msg) {
  return `<section class="band on-dark" aria-labelledby="bandTitle">
  <div class="band-media"><img src="/media/banda.jpg" alt="" loading="lazy"></div>
  <div class="wrap">
    <div class="band-in">
      <span class="eyebrow">Oportunidad de terrenos</span>
      <h2 id="bandTitle">Tu terreno a 5 minutos del Circuito Exterior Mexiquense</h2>
      <p>Lotes de 8 × 15 m por $350,000, con $15,000 de enganche y mensualidades congeladas de $3,000. Pregunta por la documentación y agenda tu visita.</p>
      <div class="band-actions">
        <a class="btn btn-light" href="${wa(msg)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-chat"/></svg>Contactar aquí</a>
        <a class="btn btn-ghost-light" href="/#cita"><svg aria-hidden="true"><use href="#i-calendar"/></svg>Agendar visita</a>
      </div>
    </div>
  </div>
</section>`;
}

function footer(msg) {
  return `<footer class="foot on-dark">
  <div class="wrap foot-in">
    <a href="/" aria-label="KC Venta de Terrenos, ir al inicio"><img src="/media/logo-kc.png" alt="" width="96" height="96" loading="lazy"></a>
    <ul>
      <li><a href="/">Inicio</a></li>
      <li><a href="/notas/">Notas para comprar seguro</a></li>
      <li><a href="/#cita">Agendar visita</a></li>
    </ul>
    <ul>
      <li><a href="${wa(msg)}" target="_blank" rel="noopener">WhatsApp 55&nbsp;8522&nbsp;7440</a></li>
      <li><a href="https://maps.app.goo.gl/daC6epcwwuKgx7Q3A?g_st=ic" target="_blank" rel="noopener">Ver ubicación en Google Maps</a></li>
    </ul>
  </div>
</footer>
<a class="fab" href="${wa(msg)}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp"><svg aria-hidden="true"><use href="#i-chat"/></svg>WhatsApp</a>
</body>
</html>
`;
}

const DISCLAIMER = `<p class="disclaimer">Nota informativa y general, revisada en noviembre de 2026. No sustituye la asesoría de un notario público o de un abogado: las leyes, tarifas y trámites cambian y cada caso es distinto. Antes de firmar o pagar, consulta a un profesional.</p>`;

function write(rel, html) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('ok', rel);
}

// ---------- páginas de nota ----------
notas.forEach((n, i) => {
  const path = `/notas/${n.slug}/`;
  const others = notas.filter((o) => o !== n);
  const [antes, despues] = n.body.split('<!--PROMO-->');
  const html = `${head({ title: `${strip(n.title)} | KC Venta de Terrenos`, desc: n.dek, path, img: n.img })}
${header(n.wa, true)}
${leaderboard(n.wa, i)}
<main>
  <div class="wrap">
    <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/notas/">Notas</a><span aria-hidden="true">/</span><span>${n.cat}</span></nav>
  </div>
  <div class="wrap art-layout">
    <article class="art">
      <header class="art-head">
        <span class="eyebrow">${n.cat}</span>
        <h1>${n.title}</h1>
        <p class="dek">${n.dek}</p>
        <p class="meta"><span>Nota ${String(i + 1).padStart(2, '0')}</span><span>${n.min} min de lectura</span><span>Noviembre 2026</span></p>
      </header>
      <figure class="art-fig">
        <img src="${n.img}" alt="${esc(n.imgAlt)}" width="1200" height="675">
        <figcaption>${n.imgAlt}. Foto real de los terrenos KC.</figcaption>
      </figure>
      <div class="prose">
${antes}
${promo(n)}
${despues || ''}
      </div>
      ${DISCLAIMER}
      <section class="next" aria-labelledby="nextTitle">
        <span class="eyebrow" id="nextTitle">Sigue leyendo</span>
        <ul class="next-list">
          ${others.slice(0, 3).map((o) => `<li><a href="/notas/${o.slug}/">${o.title}<svg aria-hidden="true"><use href="#i-arrow"/></svg></a></li>`).join('\n          ')}
        </ul>
      </section>
    </article>
    <aside class="rail" aria-label="Oportunidad y más notas">
      <span class="ad-label" style="margin:0 0 -20px;text-align:left">Oportunidad KC</span>
      ${rect(n.wa)}
      <nav class="rail-box" aria-label="Todas las notas">
        <h4>Notas para comprar seguro</h4>
        <ol>
          ${notas.map((o) => `<li><a href="/notas/${o.slug}/"${o === n ? ' aria-current="page"' : ''}>${strip(o.title)}</a></li>`).join('\n          ')}
        </ol>
      </nav>
    </aside>
  </div>
</main>
${band(n.wa)}
${footer(n.wa)}`;
  write(`notas/${n.slug}/index.html`, html);
});

// ---------- índice ----------
const IDX_MSG = 'Hola, leí las notas de su página y me interesa información de los terrenos.';
const cards = notas.map((n, i) => `<a class="card" href="/notas/${n.slug}/">
      <span class="card-media"><img src="${n.img}" alt="" loading="lazy"><span class="card-num">Nota ${String(i + 1).padStart(2, '0')} · ${n.cat}</span></span>
      <span class="card-body"><h2>${n.title}</h2><p>${n.dek}</p><span class="card-more">Leer nota</span></span>
    </a>`);
const adCard = `<a class="card card-ad" href="${wa(IDX_MSG)}" target="_blank" rel="noopener">
      <span class="card-media"><img src="/media/foto-panoramica.jpg" alt="" loading="lazy"><span class="card-num">Oportunidad</span></span>
      <span class="card-body"><h2>Terrenos de 8 × 15 m con vista al valle</h2><p>$350,000 MXN con $15,000 de enganche y mensualidades congeladas de $3,000. A 5 minutos del Circuito Exterior Mexiquense.</p><span class="card-more">Contactar aquí</span></span>
    </a>`;
cards.splice(3, 0, adCard);

write('notas/index.html', `${head({ title: 'Notas para comprar un terreno seguro | KC Venta de Terrenos', desc: 'Guías claras sobre las leyes mexicanas para comprar un terreno: ejidos, escrituras, mensualidades, gastos notariales, uso de suelo y documentos.', path: '/notas/', img: '/media/foto-panoramica.jpg' })}
${header(IDX_MSG, true)}
${leaderboard(IDX_MSG, 0)}
<main>
  <section class="n-hero">
    <div class="wrap n-hero-in">
      <span class="eyebrow">Notas · Leyes y trámites</span>
      <h1>Compra tu terreno <em>con la ley de tu lado</em></h1>
      <p>Explicamos en lenguaje sencillo lo que dicen las leyes mexicanas sobre comprar un terreno en el Estado de México: qué revisar, qué firmar y qué pagar.</p>
    </div>
  </section>
  <div class="wrap cards">
    ${cards.join('\n    ')}
  </div>
</main>
${band(IDX_MSG)}
${footer(IDX_MSG)}`);

// ---------- sitemap ----------
const urls = ['/', '/notas/', ...notas.map((n) => `/notas/${n.slug}/`)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}
</urlset>
`);
