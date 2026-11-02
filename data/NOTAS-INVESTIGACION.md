# Notas de investigación

Registro de dónde sale cada cifra que no está en los Excel entregados por el docente. Actualizado el 2026-11-02. Los archivos descargados están en `data/raw/` y las cifras se calculan con `pnpm data`.

## Estado de los pendientes

| Pendiente | Resultado |
|---|---|
| Pobreza multidimensional de Bolívar | **Verificada con el DANE**: 17,0 % en 2025 (15,6 % en 2024) y 9,9 % nacional (11,5 % en 2024). Boletín técnico, tabla 5. |
| Pobreza monetaria de Cartagena | **Verificada con el DANE**: 34,6 % en 2025 (41,1 % en 2024), boletín técnico, gráfico 5. |
| Pobreza extrema de Cartagena | **Corregida**: el boletín del DANE da 9,3 % (la prensa decía 9,2 %). Nacional 9,6 %. |
| Grupos de gasto del IPC 2025 | **Verificados con el DANE**: el anexo del IPC de diciembre de 2025 confirma transporte 9,47 %, educación 9,19 %, restaurantes y hoteles 8,39 %, salud 7,98 % y total 4,80 %; ahora la tabla trae las 12 divisiones frente a Colombia. |
| Cobertura educativa | **Resuelta con una salvedad**: se calculó con la misma fuente para los tres territorios (ver abajo). |
| Informalidad 2016-2020 | **Resuelta con otra metodología**: el DANE solo publica con la definición anterior (por tamaño de empresa) para 13 ciudades y Cartagena. No hay total nacional para esos años. |
| Desempleo de Cartagena 2016-2020 | **Resuelto**: se calculó con la serie trimestral de la GEIH. |

## Cobertura educativa (Tabla 2)

Fuente: Ministerio de Educación Nacional, conjunto de datos abiertos «Estadísticas en educación en preescolar, básica y media por municipio» (datos.gov.co, id `nudc-7mev`). Se calculó el promedio de la cobertura neta municipal ponderado por la población de 5 a 16 años.

| | 2023 | 2024 |
|---|---|---|
| Bolívar (incluye Cartagena) | 99,5 | 97,8 |
| Cartagena | 110,0 | 109,0 |
| Colombia | 90,3 | 88,2 |

Salvedades: las tasas superan 100 % por desajustes entre la matrícula y las proyecciones de población. El valor nacional oficial del Ministerio (85,0 % en 2024, 86,3 % en 2023, ficha «D2 – Tasa de cobertura neta», proyecciones de julio de 2025) no es comparable con las cifras municipales, por eso no se mezcla. Corrección de una nota anterior: la cifra de Bolívar **sí incluye** a Cartagena.

## Informalidad (Tabla 7)

- **2021-2025 (metodología vigente):** Colombia y 13 ciudades son cifras publicadas por el DANE; Cartagena es cálculo propio (promedio de los cuatro trimestres), que reproduce las cifras oficiales.
- **2016-2020 (metodología anterior, empresas de hasta 5 trabajadores):** anexo del DANE de diciembre de 2020 a febrero de 2021. Cartagena: 54,7; 55,2; 54,2; 52,9 y 56,8. Trece ciudades: 47,5; 47,2; 47,1; 46,2 y 47,6.
- **2020:** el DANE no pudo medir marzo y abril por la pandemia; es el promedio de jul-sep y oct-dic.
- Las dos series **no son comparables**: el salto de 2020 a 2021 en Cartagena (56,8 a 62,0) es en buena parte un cambio de método.

## Desempleo (Tabla 6)

- **Colombia:** promedio anual de la serie mensual de la GEIH (anexo de diciembre de 2025); reproduce las cifras oficiales.
- **Cartagena:** promedio de los cuatro trimestres de la serie de 23 ciudades y áreas metropolitanas. 2016 a 2025: 8,1; 7,9; 7,7; 6,0; 13,1; 12,3; 10,9; 10,9; 12,4; 10,9. El método reproduce el año móvil oficial de 2021-2025.

## Tabla 1 y cifras sociales (no cambian)

| Dato | Valor | Fuente |
|---|---|---|
| Extensión de Bolívar | 25.978 km² | UPRA, Documento regional Bolívar |
| Municipios | 46 | UPRA |
| Población, proyección 2023 | 2.247.283 (cabeceras 73,2 %; rural 26,8 %) | UPRA / DANE-CNPV 2018 |
| Cartagena | 1.011.520 hab. (2025); 609,1 km² | Cartagena Cómo Vamos; POT (Decreto 0977 de 2001) |
| NBI 2018 | Bolívar 26,73 %; Cartagena 12,49 %; Colombia 14,28 % | DANE, CNPV-2018-NBI |
| Acueducto / alcantarillado 2018 | Bolívar 78,7 / 50,9; Cartagena 93,7 / 86,8; Colombia 86,4 / 76,6 | DANE, ficha territorial CNPV 2018 |
| Afiliación a salud 2018 | Bolívar 93,7; Colombia 93,5 | DANE, ECV 2018 |

Pendiente menor: la población rural de Cartagena (107.639) y la población departamental de 2025 (2,24 millones) vienen de una proyección citada por Cartagena Cómo Vamos y por prensa; conviene contrastarlas con el DANE.
