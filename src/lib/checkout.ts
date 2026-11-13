/**
 * Lectura del estado del checkout.
 *
 * `settings/bold-public` y `settings/mercadopago-public` son de lectura pública
 * (ver firestore.rules). Cada una dice si esa pasarela está habilitada.
 *
 * Las dos conviven: el dueño enciende la que quiera desde Ajustes, o ambas, o
 * ninguna. Sin pasarelas en línea el checkout cae al camino "Confirmar por
 * WhatsApp". Cualquier error o ausencia se trata como deshabilitada — camino
 * seguro: más vale no ofrecer un pago que ofrecer uno roto.
 *
 * Aquí NUNCA se leen credenciales privadas: la llave de identidad de Bold y la
 * public key de Mercado Pago son públicas por diseño, y ni siquiera se traen
 * porque el front no las necesita para el flujo de redirección.
 */
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface PasarelasDisponibles {
  bold: boolean;
  mercadopago: boolean;
}

/** `true` solo si el documento existe y dice explícitamente que está habilitada. */
async function habilitada(docId: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'settings', docId));
    return snap.exists() && snap.data().habilitado === true;
  } catch {
    return false;
  }
}

export async function fetchPasarelas(): Promise<PasarelasDisponibles> {
  const [bold, mercadopago] = await Promise.all([
    habilitada('bold-public'),
    habilitada('mercadopago-public'),
  ]);
  return { bold, mercadopago };
}
