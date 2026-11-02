# Bolívar en cifras

Sitio web de diagnóstico socioeconómico y análisis macroeconómico del departamento de Bolívar (Colombia): PIB, inflación, desempleo e informalidad entre 2016 y 2025, comparados con el total nacional y con datos oficiales del DANE.

**Sitio publicado:** https://diagnostico-bolivar.vercel.app

Trabajo de **Fundamentos de Economía**, Universidad Libre (Barranquilla), por Willman Alfredo Giraldo Zambrano y Jaime Enrique Ariza Ortiz. Docente: Mg. Deiber E. Puello C.

## Qué es

Una página que solo muestra información: tablas, gráficas, mapas y fotos, con una interpretación bajo cada resultado. No tiene base de datos, servidor ni formularios. Todo se genera una vez al compilar y se sirve como archivos estáticos.

| Página | Contenido |
|---|---|
| Inicio | Cifras clave y recorrido de la investigación |
| Departamento | Ubicación, población, municipios, geografía, cultura (Tablas 1 y 2) |
| PIB | Valor, crecimiento real y participación nacional; estructura sectorial (Tablas 3 y 4) |
| Inflación | IPC de Cartagena frente al nacional y grupos de gasto (Tablas 5 y 5b) |
| Empleo | Desempleo, ocupación, ramas e informalidad (Tablas 6, 6b y 7) |
| Diagnóstico | Fortalezas, problemas, sectores con potencial, estrategias (Tabla 8) |
| Conclusiones | Seis conclusiones |
| Fuentes | Referencias, notas metodológicas y créditos de fotos |

## Cómo funciona

```
data/raw/*.xlsx, *.xls, *.json   anexos originales del DANE y del Ministerio de Educación
        │   pnpm data  (scripts/build-data.mjs)
        ▼
src/data/*.json                  cifras ya calculadas: PIB, sectores, inflación, empleo, informalidad, educación
        │   importadas por las páginas de Astro
        ▼
src/pages/*.astro                páginas con tablas, gráficas SVG, mapas y textos de interpretación
        │   pnpm build
        ▼
dist/                            HTML y CSS estáticos, sin JavaScript
        │   git push a main
        ▼
Vercel                           publica el sitio y aplica los encabezados de seguridad
```

- **Los datos no se escriben a mano.** Un script lee los anexos del DANE y calcula crecimiento, participación, diferencias en puntos porcentuales, promedios anuales y comparaciones con Colombia. Las cifras de las tablas salen de ahí.
- **Las gráficas y los mapas se dibujan al compilar** como SVG (`LineChart`, `ColumnChart`, `MapaColombia`, `MapaBolivar`), con título, descripción y tabla equivalente para lectores de pantalla. No se descarga ninguna librería de gráficas.
- **Los textos de interpretación** están en las páginas `.astro` y usan las mismas cifras de los JSON, así que gran parte de las cifras citadas en el texto se actualizan solas. Algunas cifras escritas a mano (ver «Actualizar los datos») deben revisarse.

## Estructura del repositorio

```
src/
  pages/        una página por sección (más 404 y robots.txt)
  components/   Tabla, Interpretacion, LineChart, ColumnChart, MapaColombia, MapaBolivar, Foto, Pager
  layouts/      BaseLayout: cabecera, menú, pie, metadatos SEO y datos estructurados
  data/         JSON generados, créditos de las fotos (fotos.ts) y mapas.json
  lib/          formato de números (es-CO) y navegación
  assets/fotos/ fotografías de Wikimedia Commons
  styles/       global.css (tema claro y oscuro, sin estilos en línea)
scripts/        build-data.mjs, build-maps.mjs, build-og.mjs
data/raw/       fuentes originales (reproducibilidad)
data/NOTAS-INVESTIGACION.md   de dónde sale cada cifra que no viene en los Excel del docente
public/         favicon, imagen para compartir, manifiesto
vercel.json     instalación, caché y encabezados de seguridad
```

## Datos y metodología

| Dato | Fuente | Cómo se obtiene |
|---|---|---|
| PIB, crecimiento, participación, PIB por habitante | DANE, cuentas nacionales departamentales (base 2015) | Se lee directo del anexo |
| PIB por actividad | DANE, resultados por actividad económica | Se agrupan las 12 ramas en las 9 categorías de la guía |
| Inflación | DANE, IPC por ciudades (archivo del docente) | Variación año corrido a diciembre de Cartagena y del total nacional |
| Grupos de gasto del IPC | DANE, anexo del IPC de diciembre de 2025 | Variación por división, Cartagena frente al total |
| Desempleo, ocupación, participación de Bolívar | DANE, GEIH por departamentos (archivo del docente) | Se lee directo |
| Desempleo de Colombia y de Cartagena | DANE, GEIH (anexo de diciembre de 2025) | **Cálculo propio:** promedio de los 12 meses o de los 4 trimestres de cada año |
| Informalidad | DANE, GEIH, empleo informal | 2021-2025 con la metodología vigente; 2016-2020 con la anterior (**no comparables**) |
| Cobertura educativa | Ministerio de Educación, datos abiertos por municipio | Promedio ponderado por población de 5 a 16 años |
| Pobreza, NBI, servicios públicos, salud | DANE (pobreza 2025, censo 2018, ECV 2018) | Se transcriben con su año |

Puntos que conviene tener presentes:

- El crecimiento es **real** (en volumen); la participación se calcula con valores a **precios corrientes**.
- Las cifras de 2024 son provisionales y las de 2025 preliminares.
- El DANE no publica inflación por departamento: se usa **Cartagena** como referencia de la capital.
- Los cálculos propios reproducen las cifras oficiales del DANE (desempleo nacional, informalidad nacional y la de Cartagena en 2025), y así se comprobó.

## Desarrollo

Requiere Node 22.23 o superior y [pnpm](https://pnpm.io) 11 (la versión exacta está fijada en `packageManager`; con Corepack basta `corepack enable`).

```bash
pnpm install
pnpm dev        # servidor local en http://localhost:4321
pnpm check      # verificación de tipos de Astro y TypeScript
pnpm build      # genera dist/
pnpm preview    # sirve dist/
pnpm verify     # check + build
```

### Actualizar los datos

1. Descargar el anexo nuevo del DANE y guardarlo en `data/raw/` (los nombres de archivo y hojas están en `scripts/build-data.mjs`).
2. Regenerar las cifras: 

```bash
pnpm data   # lee data/raw y escribe src/data/*.json
pnpm maps   # geometrías de los mapas -> src/data/mapas.json
pnpm og     # imagen para compartir y apple-touch-icon -> public/
```

3. Revisar los textos de interpretación que mencionan cifras escritas a mano (por ejemplo, la Tabla 2 en `departamento.astro` y los comentarios de `diagnostico.astro` y `conclusiones.astro`).
4. Ejecutar `pnpm verify` antes de subir.

En los cálculos más delicados (informalidad y desempleo de Cartagena) el script se detiene con un mensaje claro si la estructura de un anexo cambia, en lugar de generar cifras erróneas.

## Despliegue en Vercel

1. Subir el repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importar el repositorio (plan Hobby, gratuito). `vercel.json` ya define la instalación con pnpm, la salida y los encabezados de seguridad.
3. Cada `git push` a `main` publica en producción; las demás ramas generan vistas previas.

## Buenas prácticas aplicadas

**Seguridad**
- Sin JavaScript propio ni estilos en línea: la política de seguridad de contenido (CSP) es estricta (`default-src 'none'`, solo imágenes y hojas de estilo propias, con hash para el CSS incrustado). `frame-ancestors`, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy` y COOP van como encabezados en `vercel.json`.
- Dependencias: `pnpm-lock.yaml` versionado, instalación con `--frozen-lockfile` (en Vercel además con `--prod`, así las herramientas de desarrollo no se instalan en el despliegue), `minimumReleaseAge` de 3 días y sin scripts de instalación permitidos (`pnpm-workspace.yaml`), `pnpm audit` en CI y Dependabot semanal.
- `xlsx` (solo para procesar los Excel en local, nunca en producción) se instala desde la distribución oficial de SheetJS porque el paquete de npm tiene avisos sin corregir.
- Los enlaces externos usan `rel="noopener noreferrer"`.

**Accesibilidad**
- HTML semántico, un solo `h1` por página, enlace «Saltar al contenido», navegación con etiquetas, `lang="es"` y contraste AA en tema claro y oscuro.
- Tablas con `caption` y `scope`, regiones desplazables enfocables con teclado, gráficas SVG con título y descripción y diferenciadas por forma y trazo, no solo por color.
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`; menú móvil sin JavaScript.

**SEO**
- Título y descripción únicos por página, URL canónica, Open Graph y Twitter con imagen y texto alternativo, datos estructurados JSON-LD (sitio, página, autores y miga de pan), `sitemap`, `robots.txt` y manifiesto.

**Rendimiento**
- Cero JavaScript, CSS incrustado, fuentes del sistema, imágenes WebP responsivas con `srcset`, tamaño explícito y carga diferida (la imagen principal se carga con prioridad alta), caché inmutable para `/_astro/*`.
- Lighthouse local (móvil y escritorio): 100 en rendimiento, accesibilidad, buenas prácticas y SEO.

## Límites

- Los datos departamentales de empleo vienen de una encuesta y tienen más margen de error que los nacionales.
- La informalidad tiene dos series que no se pueden comparar entre sí (cambio de metodología en 2021).
- La cobertura educativa puede superar 100 % por desajustes con las proyecciones de población.
- Las explicaciones de causas en el texto (pandemia, tasas de interés, turismo) son hipótesis, no resultados de las tablas.

## Créditos

Cifras: DANE, Ministerio de Educación Nacional y las fuentes citadas en cada tabla (ver la página «Fuentes»). Fotografías: Wikimedia Commons, con autor y licencia en cada pie de foto.
