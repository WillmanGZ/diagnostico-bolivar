const nf = (min: number, max = min) => new Intl.NumberFormat('es-CO', { minimumFractionDigits: min, maximumFractionDigits: max });

const f0 = nf(0);
const f1 = nf(1);
const f2 = nf(2);

/** Entero con separador de miles (1.234). */
export const n0 = (v: number | null | undefined) => (v == null ? 'n. d.' : f0.format(v));
/** Un decimal con coma (12,3). */
export const n1 = (v: number | null | undefined) => (v == null ? 'n. d.' : f1.format(v));
/** Dos decimales con coma (12,34). */
export const n2 = (v: number | null | undefined) => (v == null ? 'n. d.' : f2.format(v));
/** Diferencia con signo explícito (+0,5 / −0,9). */
export const sgn = (v: number | null | undefined, d = 1) => {
  if (v == null) return 'n. d.';
  const s = (d === 2 ? f2 : f1).format(Math.abs(v));
  return v > 0 ? `+${s}` : v < 0 ? `−${s}` : s;
};
/** Miles de millones de pesos → billones (1 billón = 1.000 miles de millones). */
export const billones = (mm: number) => f1.format(mm / 1000);
