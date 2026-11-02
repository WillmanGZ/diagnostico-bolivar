// Genera src/data/*.json a partir de los anexos oficiales del DANE guardados en data/raw/.
// Uso: npm run data
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = (f) => join(root, 'data', 'raw', f);
const out = join(root, 'src', 'data');
mkdirSync(out, { recursive: true });

const sheet = (file, name) =>
  XLSX.utils.sheet_to_json(XLSX.readFile(raw(file)).Sheets[name], { header: 1, defval: '' });
const num = (v) => (typeof v === 'number' ? v : null);
const r1 = (v) => (v === null ? null : Math.round(v * 10) / 10);
const r2 = (v) => (v === null ? null : Math.round(v * 100) / 100);
const save = (name, data) => writeFileSync(join(out, name), JSON.stringify(data, null, 1) + '\n');

const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
// Los anexos de PIB traen la serie 2005-2025 desde la columna 2.
const pibCol = (y) => 2 + (y - 2005);

/* ------------------------------ PIB total ------------------------------ */
const c1 = sheet('anex-PIBDep-TotalDep-2025pr.xlsx', 'Cuadro 1');
const c2 = sheet('anex-PIBDep-TotalDep-2025pr.xlsx', 'Cuadro 2');
const c3 = sheet('anex-PIBDep-TotalDep-2025pr.xlsx', 'Cuadro 3');
const find = (rows, name) => rows.find((r) => r[1] === name);
const bol1 = find(c1, 'Bolívar'), col1 = find(c1, 'COLOMBIA');
const bol2 = find(c2, 'Bolívar'), col2 = find(c2, 'COLOMBIA');

const pib = YEARS.map((y) => {
  const i = pibCol(y);
  return {
    year: y,
    label: y === 2024 ? '2024 (p)' : y === 2025 ? '2025 (pr)' : String(y),
    pibBol: r1(bol1[i]),
    pibCol: r1(col1[i]),
    // Participación y crecimiento ya vienen publicados por el DANE (panel derecho de cada cuadro).
    share: r2(bol1[26 + (y - 2005)]),
    growthBol: r1(bol2[26 + (y - 2006)]),
    growthCol: r1(col2[26 + (y - 2006)]),
    volBol: r1(bol2[i]),
    volCol: r1(col2[i]),
  };
});

const deptRows = (rows) => rows.slice(10).filter((r) => r[0] !== '' && r[1] && typeof r[22] === 'number');
const ranking = deptRows(c1).map((r) => ({ name: r[1], v: r[22] })).sort((a, b) => b.v - a.v);
const rankBol = ranking.findIndex((r) => r.name === 'Bolívar') + 1;
const caribe = ['Atlántico', 'Bolívar', 'Cesar', 'Córdoba', 'La Guajira', 'Magdalena', 'Sucre'];
const caribeTotal = ranking.filter((r) => caribe.includes(r.name)).reduce((s, r) => s + r.v, 0);
const caribeRank = ranking.filter((r) => caribe.includes(r.name)).map((r) => ({ name: r.name, share: r2((r.v / caribeTotal) * 100) }));
const pc = (rows, name) => find(rows, name)[22];
const pibMeta = {
  fuente: 'DANE, Cuentas nacionales departamentales, anexo PIB por departamento (base 2015), actualizado el 3 de julio de 2026',
  rankBolivar2025: rankBol,
  ranking2025: ranking.slice(0, 10).map((r) => ({ name: r.name, pib: r1(r.v), share: r2((r.v / col1[22]) * 100) })),
  caribe2025: caribeRank,
  perCapita2025: { bolivar: Math.round(pc(c3, 'Bolívar')), colombia: Math.round(pc(c3, 'COLOMBIA')) },
  perCapitaRatio: r1((pc(c3, 'Bolívar') / pc(c3, 'COLOMBIA')) * 100),
  realTotalGrowth: {
    bolivar: r1((bol2[22] / bol2[pibCol(2016)] - 1) * 100),
    colombia: r1((col2[22] / col2[pibCol(2016)] - 1) * 100),
  },
  promedioCrecimiento: {
    bolivar: r1(pib.reduce((s, p) => s + p.growthBol, 0) / pib.length),
    colombia: r1(pib.reduce((s, p) => s + p.growthCol, 0) / pib.length),
  },
  promedioParticipacion: r2(pib.reduce((s, p) => s + p.share, 0) / pib.length),
  añosPorEncima: pib.filter((p) => p.growthBol > p.growthCol).map((p) => p.year),
  añosPorDebajo: pib.filter((p) => p.growthBol < p.growthCol).map((p) => p.year),
};
save('pib.json', { serie: pib, meta: pibMeta });

/* --------------------------- PIB por actividad -------------------------- */
const a1 = sheet('anex-PIBDep-Activecono-2025pr.xlsx', 'Cuadro 1');
const a2 = sheet('anex-PIBDep-Activecono-2025pr.xlsx', 'Cuadro 2');
const BLOCKS = [
  ['agro', 'Agricultura, ganadería, caza, silvicultura y pesca'],
  ['minas', 'Explotación de minas y canteras'],
  ['industria', 'Industrias manufactureras'],
  ['electricidad', 'Electricidad, gas y agua; gestión de desechos'],
  ['construccion', 'Construcción'],
  ['comercio', 'Comercio, transporte, alojamiento y servicios de comida'],
  ['info', 'Información y comunicaciones'],
  ['financieras', 'Actividades financieras y de seguros'],
  ['inmobiliarias', 'Actividades inmobiliarias'],
  ['profesionales', 'Actividades profesionales y servicios administrativos'],
  ['admin', 'Administración pública, educación y salud'],
  ['otrosServ', 'Actividades artísticas, de entretenimiento y otros servicios'],
  ['va', 'Valor agregado total'],
  ['impuestos', 'Impuestos'],
  ['pib', 'Producto Interno Bruto'],
];
const block = (rows, k, name) => {
  const h = 8 + 47 * k;
  const slice = rows.slice(h + 1, h + 40);
  return slice.find((r) => r[1] === name);
};
const actividades = {};
BLOCKS.forEach(([key, label], k) => {
  const bol = block(a1, k, 'Bolívar'), col = block(a1, k, 'COLOMBIA');
  const bolV = block(a2, k, 'Bolívar'), colV = block(a2, k, 'COLOMBIA');
  actividades[key] = {
    label,
    bol: Object.fromEntries(YEARS.map((y) => [y, r1(bol[pibCol(y)])])),
    col: Object.fromEntries(YEARS.map((y) => [y, r1(col[pibCol(y)])])),
    volBol: Object.fromEntries(YEARS.map((y) => [y, r1(bolV[pibCol(y)])])),
    volCol: Object.fromEntries(YEARS.map((y) => [y, r1(colV[pibCol(y)])])),
  };
});
const share = (key, y, who = 'bol') => (actividades[key][who][y] / actividades.va[who][y]) * 100;
const realGrowth = (key, who = 'volBol') => (actividades[key][who][2025] / actividades[key][who][2016] - 1) * 100;
const sumKeys = (keys, y, who) => keys.reduce((s, k) => s + actividades[k][who][y], 0);

// Agrupación de las 9 categorías que pide la guía (Tabla 4).
const GRUPOS = [
  ['Agricultura, ganadería, pesca y silvicultura', ['agro']],
  ['Explotación de minas y canteras', ['minas']],
  ['Industrias manufactureras', ['industria']],
  ['Construcción', ['construccion']],
  ['Comercio, transporte, alojamiento y comidas', ['comercio']],
  ['Información y comunicaciones', ['info']],
  ['Actividades financieras e inmobiliarias', ['financieras', 'inmobiliarias']],
  ['Administración pública, educación y salud', ['admin']],
  ['Otras actividades', ['electricidad', 'profesionales', 'otrosServ']],
];
const grupos = GRUPOS.map(([label, keys]) => {
  const vb25 = sumKeys(keys, 2025, 'bol'), vc25 = sumKeys(keys, 2025, 'col');
  const vb16 = sumKeys(keys, 2016, 'bol'), vc16 = sumKeys(keys, 2016, 'col');
  const real = keys.length === 1;
  return {
    label,
    componentes: keys.map((k) => actividades[k].label),
    valor2025: r1(vb25),
    share2025: r1((vb25 / actividades.va.bol[2025]) * 100),
    shareCol2025: r1((vc25 / actividades.va.col[2025]) * 100),
    share2016: r1((vb16 / actividades.va.bol[2016]) * 100),
    shareCol2016: r1((vc16 / actividades.va.col[2016]) * 100),
    share2020: r1((sumKeys(keys, 2020, 'bol') / actividades.va.bol[2020]) * 100),
    // El crecimiento real solo es exacto para una rama individual (series encadenadas no son aditivas).
    realBol: real ? r1(realGrowth(keys[0])) : null,
    realCol: real ? r1(realGrowth(keys[0], 'volCol')) : null,
  };
});
const detalle = BLOCKS.slice(0, 12).map(([key, label]) => ({
  key,
  label,
  valor2025: actividades[key].bol[2025],
  share2025: r1(share(key, 2025)),
  share2016: r1(share(key, 2016)),
  shareCol2025: r1(share(key, 2025, 'col')),
  realBol: r1(realGrowth(key)),
  realCol: r1(realGrowth(key, 'volCol')),
}));
save('sectores.json', {
  fuente: 'DANE, Cuentas nacionales departamentales, anexo Resultados por actividad económica (base 2015), actualizado el 3 de julio de 2026',
  valorAgregado2025: actividades.va.bol[2025],
  impuestos2025: actividades.impuestos.bol[2025],
  pib2025: actividades.pib.bol[2025],
  realValorAgregado: { bolivar: r1(realGrowth('va')), colombia: r1(realGrowth('va', 'volCol')) },
  grupos,
  detalle,
  serieShares: ['agro', 'industria', 'construccion', 'comercio', 'admin'].map((k) => ({
    key: k,
    label: actividades[k].label,
    puntos: YEARS.map((y) => ({ year: y, share: r1(share(k, y)) })),
  })),
});

/* -------------------------------- IPC ---------------------------------- */
const ipcRows = sheet('ipc-ciudades.xlsx', 'VarMensuales');
const ipc = {};
let yr = null;
ipcRows.forEach((r) => {
  const m = String(r[0]).match(/Variaciones mensuales (\d{4})/);
  if (m) yr = +m[1];
  const name = String(r[0]).trim();
  if (yr && ['Total IPC', 'Cartagena', 'Barranquilla', 'Santa Marta', 'Bogotá D.C.'].includes(name)) {
    ipc[yr] ??= {};
    ipc[yr][name] = { meses: r.slice(1, 13).map(num), anual: num(r[13]) };
  }
});
const IPC_YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const inflacion = IPC_YEARS.map((y) => ({
  year: y,
  cartagena: ipc[y].Cartagena.anual,
  colombia: ipc[y]['Total IPC'].anual,
  dif: r2(ipc[y].Cartagena.anual - ipc[y]['Total IPC'].anual),
}));
save('inflacion.json', {
  fuente: 'DANE, IPC variaciones mensuales por ciudades (archivo "IPC ciudades", actualizado el 7 de octubre de 2026). Variación año corrido a diciembre.',
  serie: inflacion,
  promedio: {
    cartagena: r2(inflacion.reduce((s, p) => s + p.cartagena, 0) / inflacion.length),
    colombia: r2(inflacion.reduce((s, p) => s + p.colombia, 0) / inflacion.length),
  },
  meses2022Cartagena: ipc[2022].Cartagena.meses,
  meses2022Colombia: ipc[2022]['Total IPC'].meses,
  otrasCiudades: IPC_YEARS.map((y) => ({
    year: y,
    barranquilla: ipc[y].Barranquilla.anual,
    santaMarta: ipc[y]['Santa Marta'].anual,
    bogota: ipc[y]['Bogotá D.C.'].anual,
  })),
});

/* ---------------------- Mercado laboral de Bolívar ---------------------- */
const emp = sheet('empleo-departamentos.xls', 'Departamentos anual');
const empStart = emp.findIndex((r) => String(r[0]).trim() === 'Bolívar');
const empBlock = emp.slice(empStart, empStart + 18);
const empYears = empBlock[2]; // fila con los años 2007-2025
const empRow = (label) => {
  const row = empBlock.find((r) => String(r[0]).trim().startsWith(label));
  return Object.fromEntries(YEARS.map((y) => [y, num(row[empYears.indexOf(y)])]));
};
const bolLab = {
  td: empRow('Tasa de Desocupación'),
  tgp: empRow('Tasa Global de Participación'),
  to: empRow('Tasa de Ocupación'),
  ts: empRow('Tasa de Subocupación'),
  poblacionTotal: empRow('Población total'),
  pet: empRow('Población en edad de trabajar'),
  fuerzaTrabajo: empRow('Fuerza de trabajo'),
  ocupados: empRow('Población ocupada'),
  desocupados: empRow('Población desocupada'),
  fuera: empRow('Población fuera de la fuerza'),
};

// Colombia: promedio anual de la serie mensual de la GEIH (desocupados / fuerza de trabajo).
const nat = sheet('anex-GEIH-dic2025.xlsx', 'Total nacional');
const natHead = nat.find((r) => r[0] === 'Concepto');
let curY = null;
const natYear = natHead.map((v) => { if (typeof v === 'number') curY = v; return curY; });
const natRow = (label) => nat.find((r) => String(r[0]).trim().startsWith(label));
const natAvg = (row, y) => {
  const cols = natYear.map((yy, i) => (yy === y && typeof row[i] === 'number' ? i : -1)).filter((i) => i >= 0);
  return cols.reduce((s, i) => s + row[i], 0) / cols.length;
};
const natLab = Object.fromEntries(
  YEARS.map((y) => {
    const des = natAvg(natRow('Población desocupada'), y), ft = natAvg(natRow('Fuerza de trabajo'), y);
    return [y, {
      td: r1((des / ft) * 100),
      tgp: r1(natAvg(natRow('Tasa Global de Participación'), y)),
      to: r1(natAvg(natRow('Tasa de Ocupación'), y)),
      ocupados: r1(natAvg(natRow('Población ocupada'), y)),
      desocupados: r1(des),
    }];
  }),
);

// Cartagena: año móvil enero-diciembre de la GEIH rediseñada (solo 2021-2025).
const cm = sheet('anex-GEIH-dic2025.xlsx', 'Año_móvil_32_ciudades');
const cmStart = cm.findIndex((r) => String(r[0]).trim() === 'Cartagena');
const cmHead = cm.slice(cmStart, cmStart + 6).find((r) => r.some((v) => String(v).startsWith('Ene - Dic')));
const cmBlock = cm.slice(cmStart, cmStart + 22);
const cartRow = (label) => {
  const row = cmBlock.find((r) => String(r[0]).trim().startsWith(label));
  const o = {};
  cmHead.forEach((v, i) => {
    const m = String(v).match(/^Ene - Dic (\d{2})$/);
    if (m) o[2000 + +m[1]] = r1(num(row[i]));
  });
  return o;
};
const cartLab = { td: cartRow('Tasa de Desocupación'), tgp: cartRow('Tasa Global de Participación'), to: cartRow('Tasa de Ocupación') };

// Ocupados por rama de actividad (Bolívar, miles de personas).
const ram = sheet('empleo-departamentos.xls', 'Ocu ramas anual  Dptos CIIU 4');
const ramStart = ram.findIndex((r) => String(r[0]).trim() === 'Bolívar');
const ramBlock = ram.slice(ramStart, ramStart + 22);
const ramYears = ramBlock.find((r) => r.includes(2015));
const ramas = ramBlock
  .filter((r) => String(r[0]).trim() && !['Bolívar', 'Concepto', 'No informa', 'Total ocupados'].includes(String(r[0]).trim()) && typeof r[1] === 'number')
  .map((r) => ({ label: String(r[0]).trim(), v2016: r1(r[ramYears.indexOf(2016)]), v2019: r1(r[ramYears.indexOf(2019)]), v2020: r1(r[ramYears.indexOf(2020)]), v2025: r1(r[ramYears.indexOf(2025)]) }));
const totalOcup = ramBlock.find((r) => String(r[0]).trim() === 'Total ocupados');
const totalOcup2025 = totalOcup[ramYears.indexOf(2025)];
ramas.forEach((r) => (r.share2025 = r1((r.v2025 / totalOcup2025) * 100)));

const desempleo = YEARS.map((y) => ({
  year: y,
  bolivar: r1(bolLab.td[y]),
  colombia: natLab[y].td,
  dif: r1(bolLab.td[y] - natLab[y].td),
  cartagena: cartLab.td[y] ?? null,
  tgpBol: r1(bolLab.tgp[y]), tgpCol: natLab[y].tgp,
  toBol: r1(bolLab.to[y]), toCol: natLab[y].to,
  ocupadosBol: r1(bolLab.ocupados[y]), desocupadosBol: r1(bolLab.desocupados[y]),
  fuerzaTrabajoBol: r1(bolLab.fuerzaTrabajo[y]),
}));
save('empleo.json', {
  fuente: 'DANE, GEIH. Bolívar: anexo "Empleo departamentos" (serie anual). Colombia: promedio anual de la serie mensual del anexo GEIH de diciembre de 2025. Cartagena: año móvil enero-diciembre (GEIH rediseñada, solo 2021-2025).',
  serie: desempleo,
  ramas: ramas.sort((a, b) => b.v2025 - a.v2025),
  totalOcupados2025: r1(totalOcup2025),
});

/* ----------------------------- Informalidad ----------------------------- */
// Cartagena: promedio de los cuatro trimestres no traslapados (ene-mar, abr-jun, jul-sep, oct-dic) de la
// hoja "Prop informalidad". Reproduce las cifras oficiales (nacional 55,7 % y 55,9 %; Cartagena 49,6 % en 2025).
const inf = sheet('anex-GEIHEISS-oct-dic2025.xlsx', 'Prop informalidad');
const infAnual = (name) => {
  const row = inf.find((r) => String(r[0]).trim() === name);
  const vals = row.slice(1).filter((v) => v !== '');
  return Object.fromEntries([2021, 2022, 2023, 2024, 2025].map((y, i) => {
    const q = [0, 3, 6, 9].map((k) => vals[i * 12 + k]);
    return [y, r1(q.reduce((s, v) => s + v, 0) / 4)];
  }));
};
const infCart = infAnual('Cartagena');
// Cifras oficiales publicadas en el boletín técnico GEIH oct-dic 2025, gráfico 6 (año enero-diciembre).
const infColombia = { 2021: 59.4, 2022: 57.9, 2023: 56.4, 2024: 55.9, 2025: 55.7 };
const inf13 = { 2021: 45.0, 2022: 43.5, 2023: 41.7, 2024: 41.9, 2025: 42.2 };
const informalidad = YEARS.map((y) => ({
  year: y,
  cartagena: infCart[y] ?? null,
  colombia: infColombia[y] ?? null,
  trece: inf13[y] ?? null,
  dif: infCart[y] != null ? r1(infCart[y] - infColombia[y]) : null,
}));
save('informalidad.json', {
  fuente: 'DANE, GEIH, boletín técnico y anexo "Empleo informal y seguridad social", octubre-diciembre de 2025. Metodología vigente desde el rediseño de la GEIH (2021).',
  serie: informalidad,
});

console.log('Datos generados en src/data/');
console.log({ rankBol, pibRatio: pibMeta.perCapitaRatio, cartLab, infCart });
