// Genera src/data/mapas.json (rutas SVG) a partir de geometrías abiertas guardadas en data/raw/geo/.
// Departamentos: DANE, Marco Geoestadístico Nacional 2018. Municipios: TopoJSON abierto basado en el MGN del DANE.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const { feature } = require('topojson-client');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(readFileSync(join(root, 'data', 'raw', 'geo', f), 'utf8'));

const depts = read('dane-mgn-2018-departamentos.geojson').features;
const topo = read('colombia-municipios.topojson');
const mpios = feature(topo, topo.objects.mpios).features;

const rings = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).flat();

// Douglas-Peucker sobre coordenadas ya proyectadas (en píxeles).
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > max) { max = d; idx = i; }
    }
    if (max > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

// Los anillos son cerrados (primer punto = último): se parten en dos mitades para que Douglas-Peucker funcione.
function simplifyRing(pts, tol) {
  const mid = Math.floor(pts.length / 2);
  return [...simplify(pts.slice(0, mid + 1), tol), ...simplify(pts.slice(mid), tol).slice(1)];
}

function makeProjector(features, width) {
  let minX = 180, maxX = -180, minY = 90, maxY = -90;
  features.forEach((f) => rings(f.geometry).forEach((r) => r.forEach(([x, y]) => {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  })));
  const k = Math.cos(((minY + maxY) / 2) * Math.PI / 180);
  const scale = width / ((maxX - minX) * k);
  const height = Math.ceil((maxY - minY) * scale);
  return { width, height, project: ([x, y]) => [(x - minX) * k * scale, (maxY - y) * scale] };
}

function pathOf(geometry, project, tol) {
  return rings(geometry)
    .map((r) => simplifyRing(r.map(project), tol))
    .filter((r) => r.length >= 4)
    .map((r) => 'M' + r.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z')
    .join('');
}

// Colombia continental (se omite el archipiélago de San Andrés para no distorsionar la escala).
const cont = depts.filter((f) => !/SAN ANDR/i.test(f.properties.DPTO_CNMBR));
const pc = makeProjector(cont, 560);
const colombia = {
  width: pc.width,
  height: pc.height,
  departamentos: cont.map((f) => ({
    name: f.properties.DPTO_CNMBR,
    bolivar: f.properties.DPTO_CNMBR === 'BOLÍVAR',
    d: pathOf(f.geometry, pc.project, 0.5),
  })),
};

const bol = mpios.filter((f) => f.properties.dpt === 'BOLIVAR');
const pb = makeProjector(bol, 560);
const titulo = (s) => s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase()).replace(/ De /g, ' de ').replace(/ Del /g, ' del ').replace(/ La /g, ' la ');
const CORRECCIONES = {
  'San Cristobal': 'San Cristóbal', 'Maria la Baja': 'María la Baja', 'El Carmen de Bolivar': 'El Carmen de Bolívar',
  Cordoba: 'Córdoba', Magangue: 'Magangué', Mompos: 'Mompós', 'El Pe¥on': 'El Peñón', 'San Martin de Loba': 'San Martín de Loba',
  Achi: 'Achí', 'Rio Viejo': 'Río Viejo', Simiti: 'Simití',
};
const bolivar = {
  width: pb.width,
  height: pb.height,
  municipios: bol.map((f) => ({
    name: CORRECCIONES[titulo(f.properties.name)] ?? titulo(f.properties.name),
    capital: /CARTAGENA/.test(f.properties.name),
    d: pathOf(f.geometry, pb.project, 0.35),
  })),
};

const outFile = join(root, 'src', 'data', 'mapas.json');
writeFileSync(outFile, JSON.stringify({ colombia, bolivar }));
console.log('mapas.json', bolivar.municipios.length, 'municipios;', colombia.departamentos.length, 'departamentos;', (JSON.stringify({ colombia, bolivar }).length / 1024).toFixed(0), 'KB');
console.log(bolivar.municipios.map((m) => m.name).join(', '));
