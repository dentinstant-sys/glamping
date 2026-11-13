/**
 * Acceso de lectura al catálogo en Firestore.
 * Tipos cliente (formas planas para la UI) + funciones de fetch.
 * Las colecciones y la forma de los documentos siguen shared/types/firestore.ts.
 */
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export interface VenueUI {
  id: string;
  slug: string;
  nombre: string;
  departamento: string;
  descripcion: string;
  fotos: string[];
  orden: number;
}

export interface GlampingUI {
  id: string;
  venueId: string;
  slug: string;
  nombre: string;
  tipo: string;
  capacidad: number;
  descripcion: string;
  amenities: string[];
  fotos: string[];
  /** Tarifa base por noche (respaldo si no hay tarifa por temporada). */
  precioBase: number;
  /** Precio "desde" a mostrar: el tramo más barato de seasonalPricing (lo que
   *  edita el panel en Tarifas), o precioBase si no hay regla. */
  precioDesde: number;
}

export interface ExtraUI {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  unidad: string;
  categoria: string;
  fotoUrl?: string;
  venueId?: string;
}

export interface TestimonialUI {
  id: string;
  nombre: string;
  texto: string;
  rating: number;
  venueId?: string;
}

export interface ReglaTarifaUI {
  weekday: number;
  friday: number;
  weekend: number;
  validFrom: Date;
  validTo: Date;
}

/** El "desde": tramo más barato de las reglas del domo, o precioBase si no hay. */
function desdeDeReglas(
  reglas: { weekday?: number; friday?: number; weekend?: number }[],
  precioBase: number,
): number {
  let min = 0;
  for (const r of reglas) {
    for (const v of [r.weekday, r.friday, r.weekend]) {
      if (typeof v === 'number' && v > 0 && (min === 0 || v < min)) min = v;
    }
  }
  return min > 0 ? min : precioBase || 0;
}

/** Mapa glampingId → precio "desde" leyendo todo seasonalPricing (colección
 *  pequeña, lectura pública). Una regla por domo (doc id = glampingId). */
async function fetchPreciosDesde(): Promise<Map<string, number>> {
  const snap = await getDocs(collection(db, 'seasonalPricing'));
  const m = new Map<string, number>();
  for (const d of snap.docs) {
    const r = d.data() as { glampingId?: string; weekday?: number; friday?: number; weekend?: number };
    const gid = r.glampingId ?? d.id;
    const desde = desdeDeReglas([r], 0);
    if (desde > 0) m.set(gid, desde);
  }
  return m;
}

/** Sedes activas, ordenadas por `orden`. */
export async function fetchVenues(): Promise<VenueUI[]> {
  const q = query(collection(db, 'venues'), where('activa', '==', true), orderBy('orden'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VenueUI, 'id'>) }));
}

/** Una sede por slug (o null). */
export async function fetchVenueBySlug(slug: string): Promise<VenueUI | null> {
  const q = query(collection(db, 'venues'), where('slug', '==', slug), where('activa', '==', true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<VenueUI, 'id'>) };
}

/** Domos activos de una sede (con precio "desde" desde seasonalPricing). */
export async function fetchGlampings(venueId: string): Promise<GlampingUI[]> {
  const q = query(
    collection(db, 'venues', venueId, 'glampings'),
    where('activo', '==', true),
  );
  const [snap, precios] = await Promise.all([getDocs(q), fetchPreciosDesde()]);
  return snap.docs.map((d) => {
    const g = { id: d.id, ...(d.data() as Omit<GlampingUI, 'id' | 'precioDesde'>) };
    return { ...g, precioDesde: precios.get(d.id) ?? g.precioBase };
  });
}

/** Un domo por slug dentro de una sede. */
export async function fetchGlampingBySlug(
  venueId: string,
  slug: string,
): Promise<GlampingUI | null> {
  const q = query(
    collection(db, 'venues', venueId, 'glampings'),
    where('slug', '==', slug),
    where('activo', '==', true),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const g = { id: d.id, ...(d.data() as Omit<GlampingUI, 'id' | 'precioDesde'>) };
  const reglas = await fetchSeasonalPricing(d.id);
  return { ...g, precioDesde: desdeDeReglas(reglas, g.precioBase) };
}

/** Domos destacados (muestra para la landing): los primeros N activos. */
export async function fetchGlampingsDestacados(limite = 3): Promise<GlampingUI[]> {
  const [snap, precios] = await Promise.all([
    getDocs(query(collectionGroup(db, 'glampings'), where('activo', '==', true))),
    fetchPreciosDesde(),
  ]);
  return snap.docs
    .map((d) => {
      const g = { id: d.id, ...(d.data() as Omit<GlampingUI, 'id' | 'precioDesde'>) };
      return { ...g, precioDesde: precios.get(d.id) ?? g.precioBase };
    })
    .slice(0, limite);
}

/** Extras activos (globales + de una sede si se indica). */
export async function fetchExtras(venueId?: string): Promise<ExtraUI[]> {
  const snap = await getDocs(query(collection(db, 'extras'), where('activo', '==', true)));
  const todos = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ExtraUI, 'id'>) }));
  return todos.filter((e) => !e.venueId || !venueId || e.venueId === venueId);
}

/** Testimonios aprobados. */
export async function fetchTestimonials(): Promise<TestimonialUI[]> {
  const snap = await getDocs(
    query(collection(db, 'testimonials'), where('aprobado', '==', true)),
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TestimonialUI, 'id'>) }));
}

/** Reglas de tarifa por temporada de un domo. */
export async function fetchSeasonalPricing(glampingId: string): Promise<ReglaTarifaUI[]> {
  const snap = await getDocs(
    query(collection(db, 'seasonalPricing'), where('glampingId', '==', glampingId)),
  );
  return snap.docs.map((d) => {
    const r = d.data() as {
      weekday: number;
      friday: number;
      weekend: number;
      validFrom: { toDate(): Date };
      validTo: { toDate(): Date };
    };
    return {
      weekday: r.weekday,
      friday: r.friday,
      weekend: r.weekend,
      validFrom: r.validFrom.toDate(),
      validTo: r.validTo.toDate(),
    };
  });
}

/** Verifica existencia de doc (placeholder de futuros usos). */
export async function existeVenue(venueId: string): Promise<boolean> {
  return (await getDoc(doc(db, 'venues', venueId))).exists();
}
