/**
 * Cálculo de tarifa noche por noche en el CLIENTE — solo para el estimado en
 * vivo del wizard.
 *
 * El total REAL lo recalcula el backend (crearBooking). Esto es coherente con
 * functions/src/lib/tarifa.ts: mismos tramos y misma regla de festivos/vísperas.
 * Si difieren, manda el backend.
 */
import { festivosDelAnio } from './festivos';

export type TramoTarifa = 'weekday' | 'friday' | 'weekend';

export interface ReglaTarifa {
  weekday: number;
  friday: number;
  weekend: number;
  validFrom: Date;
  validTo: Date;
}

export interface NocheCalculada {
  fecha: Date;
  tramo: TramoTarifa;
  precio: number;
}

function esFestivo(fecha: Date): boolean {
  const ymd = fecha.toISOString().slice(0, 10);
  return festivosDelAnio(fecha.getUTCFullYear()).has(ymd);
}

/** Clasifica una noche en su tramo (igual lógica que el backend). */
export function tramoDeNoche(fecha: Date): TramoTarifa {
  const dow = fecha.getUTCDay();
  if (dow === 6) return 'weekend';
  const manana = new Date(fecha);
  manana.setUTCDate(fecha.getUTCDate() + 1);
  if (esFestivo(fecha) || esFestivo(manana)) return 'weekend';
  if (dow === 5) return 'friday';
  return 'weekday';
}

function precioNoche(fecha: Date, tramo: TramoTarifa, reglas: ReglaTarifa[], base: number): number {
  const r = reglas.find((x) => fecha >= x.validFrom && fecha <= x.validTo);
  return r ? r[tramo] : base;
}

/** Desglose noche por noche entre checkIn (incl.) y checkOut (excl.). */
export function calcularDesglose(
  checkIn: Date,
  checkOut: Date,
  reglas: ReglaTarifa[],
  base: number,
): NocheCalculada[] {
  const out: NocheCalculada[] = [];
  for (let d = new Date(checkIn); d < checkOut; d.setUTCDate(d.getUTCDate() + 1)) {
    const fecha = new Date(d);
    const tramo = tramoDeNoche(fecha);
    out.push({ fecha, tramo, precio: precioNoche(fecha, tramo, reglas, base) });
  }
  return out;
}

export function totalDesglose(noches: NocheCalculada[]): number {
  return noches.reduce((a, n) => a + n.precio, 0);
}

/** Cuenta de noches entre dos 'YYYY-MM-DD'. */
export function contarNoches(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(`${checkIn}T00:00:00Z`).getTime();
  const b = new Date(`${checkOut}T00:00:00Z`).getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}
