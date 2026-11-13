/**
 * Helpers de formato — español colombiano.
 */

/** Formatea un entero COP como "$420.000". */
export function fmtCOP(n: number): string {
  return `$${Math.round(n).toLocaleString('es-CO')}`;
}

/** Formatea una fecha 'YYYY-MM-DD' (UTC) como "14 ago 2026". */
export function fmtFecha(ymd: string): string {
  const d = new Date(`${ymd}T00:00:00.000Z`);
  return d.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Pluraliza "noche"/"noches". */
export function noches(n: number): string {
  return n === 1 ? '1 noche' : `${n} noches`;
}
