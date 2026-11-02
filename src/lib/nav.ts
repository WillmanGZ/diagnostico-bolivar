export const nav = [
  { href: '/', label: 'Inicio', short: 'Inicio' },
  { href: '/departamento', label: 'Departamento', short: 'Departamento' },
  { href: '/pib', label: 'PIB', short: 'PIB' },
  { href: '/inflacion', label: 'Inflación', short: 'Inflación' },
  { href: '/empleo', label: 'Empleo', short: 'Empleo' },
  { href: '/diagnostico', label: 'Diagnóstico', short: 'Diagnóstico' },
  { href: '/conclusiones', label: 'Conclusiones', short: 'Conclusiones' },
  { href: '/fuentes', label: 'Fuentes', short: 'Fuentes' },
] as const;

export function pager(path: string) {
  const i = nav.findIndex((n) => n.href === path);
  return { prev: i > 0 ? nav[i - 1] : null, next: i >= 0 && i < nav.length - 1 ? nav[i + 1] : null };
}
