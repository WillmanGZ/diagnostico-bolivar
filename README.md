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

## Créditos

Cifras: DANE, Ministerio de Educación Nacional y las fuentes citadas en cada tabla (ver la página «Fuentes»). Fotografías: Wikimedia Commons, con autor y licencia en cada pie de foto.
