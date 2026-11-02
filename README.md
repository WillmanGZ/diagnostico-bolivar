# Bolívar en cifras

Diagnóstico socioeconómico y análisis macroeconómico del departamento de Bolívar (Colombia): PIB, inflación, desempleo e informalidad 2016-2025 frente al total nacional.

Trabajo de **Fundamentos de Economía**, Facultad de Ingeniería, Universidad Libre (Barranquilla), por Willman Alfredo Giraldo Zambrano y Jaime Enrique Ariza Ortiz. Docente: Mg. Deiber E. Puello C.

Sitio estático hecho con [Astro](https://astro.build), sin JavaScript en el cliente, pensado para desplegarse gratis en Vercel.

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

## Datos

Los anexos originales del DANE están en `data/raw/`. Las cifras de las tablas se generan con:

```bash
pnpm data   # lee data/raw/*.xlsx y escribe src/data/*.json
pnpm maps   # geometrías de los mapas -> src/data/mapas.json
pnpm og     # imagen para compartir y apple-touch-icon -> public/
```

Las cifras que no salen de esos archivos (tablas 1 y 2) y sus pendientes de verificación están documentadas en `data/NOTAS-INVESTIGACION.md`.

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

## Créditos

Cifras: DANE y las fuentes citadas en cada tabla (ver la página «Fuentes»). Fotografías: Wikimedia Commons, con autor y licencia en cada pie de foto.
