/**
 * Festivos colombianos (Ley Emiliani) para el cálculo de tramos en el cliente.
 * Espejo de functions/src/lib/festivos.ts — mantener sincronizados.
 */
const cache = new Map<number, Set<string>>();

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function fechaUTC(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m - 1, d));
}
function sumar(d: Date, dias: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + dias);
  return r;
}
function lunesSiguiente(d: Date): Date {
  const dow = d.getUTCDay();
  if (dow === 1) return d;
  const delta = (8 - dow) % 7;
  return sumar(d, delta === 0 ? 7 : delta);
}
function domingoPascua(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return fechaUTC(year, mes, dia);
}

export function festivosDelAnio(year: number): Set<string> {
  const hit = cache.get(year);
  if (hit) return hit;
  const dias: Date[] = [
    fechaUTC(year, 1, 1),
    fechaUTC(year, 5, 1),
    fechaUTC(year, 7, 20),
    fechaUTC(year, 8, 7),
    fechaUTC(year, 12, 8),
    fechaUTC(year, 12, 25),
    lunesSiguiente(fechaUTC(year, 1, 6)),
    lunesSiguiente(fechaUTC(year, 3, 19)),
    lunesSiguiente(fechaUTC(year, 6, 29)),
    lunesSiguiente(fechaUTC(year, 8, 15)),
    lunesSiguiente(fechaUTC(year, 10, 12)),
    lunesSiguiente(fechaUTC(year, 11, 1)),
    lunesSiguiente(fechaUTC(year, 11, 11)),
  ];
  const p = domingoPascua(year);
  dias.push(sumar(p, -3), sumar(p, -2));
  dias.push(lunesSiguiente(sumar(p, 39)), lunesSiguiente(sumar(p, 60)), lunesSiguiente(sumar(p, 68)));
  const set = new Set(dias.map(ymd));
  cache.set(year, set);
  return set;
}
