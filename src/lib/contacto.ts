/**
 * Contacto público del sitio (WhatsApp + correo).
 * Fuente única: settings/publico, que el panel admin replica desde sus Ajustes.
 * Lectura sin sesión (regla pública). Si el doc falta o falla la red, devuelve
 * cadenas vacías y los enlaces degradan a wa.me/ sin romper la página.
 */
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface ContactoPublico {
  whatsapp: string;
  email: string;
  /** Usuario de Instagram, sin la arroba. Vacío si no se ha publicado. */
  instagram: string;
  /** % de seña replicado desde Ajustes. null si aún no se ha publicado. */
  porcentajeSena: number | null;
  /** Álbum público de la galería del Home (lista de URLs). */
  galeria: string[];
}

const VACIO: ContactoPublico = {
  whatsapp: '',
  email: '',
  instagram: '',
  porcentajeSena: null,
  galeria: [],
};

export async function fetchContactoPublico(): Promise<ContactoPublico> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'publico'));
    const d: Record<string, unknown> = snap.exists() ? snap.data() : {};
    return {
      whatsapp: (d.whatsapp ?? '').toString(),
      email: (d.email ?? '').toString(),
      instagram: (d.instagram ?? '').toString().replace(/^@/, ''),
      porcentajeSena: d.porcentajeSena != null ? Number(d.porcentajeSena) : null,
      galeria: Array.isArray(d.galeria) ? (d.galeria as unknown[]).map(String) : [],
    };
  } catch {
    return { ...VACIO };
  }
}

/** Enlace a Instagram. Cadena vacía si no hay usuario configurado. */
export function instagramLink(usuario: string): string {
  const u = (usuario || '').trim().replace(/^@/, '');
  return u ? `https://instagram.com/${u}` : '';
}

/** Enlace wa.me limpiando el número (solo dígitos). Mensaje opcional pre-armado. */
export function waLink(numero: string, mensaje?: string): string {
  const d = (numero || '').replace(/\D/g, '');
  const base = d ? `https://wa.me/${d}` : 'https://wa.me/';
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
