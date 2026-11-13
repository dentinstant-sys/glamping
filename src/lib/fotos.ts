/**
 * Resolver de fotos del catálogo.
 *
 * El seed siembra cada venue/glamping con el NOMBRE de archivo de la foto del
 * bundle (p. ej. "atardecer.jpg"). Esas fotos viven en src/assets/fotos/ y Vite
 * las versiona/optimiza; este resolver mapea la clave del seed a la URL final.
 *
 * El admin reemplazará esas fotos por URLs reales de Storage: cuando
 * el valor ya es una URL (http/https), una ruta absoluta, un data: o blob:,
 * se devuelve TAL CUAL. Es decir, el bundle es solo el estado inicial; el admin
 * manda. Si la clave no existe (foto retirada), se devuelve undefined y el
 * componente <Imagen> cae al placeholder de marca.
 */
const modulos = import.meta.glob('../assets/fotos/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const MAPA: Record<string, string> = {};
for (const ruta in modulos) {
  const nombre = ruta.split('/').pop();
  if (nombre) MAPA[nombre] = modulos[ruta];
}

/** Devuelve la URL servible de una foto, o undefined si no hay/clave desconocida. */
export function resolverFoto(valor?: string): string | undefined {
  if (!valor) return undefined;
  // Ya es servible (admin/Storage, ruta pública, data/blob) → pasar tal cual.
  if (/^(https?:)?\/\//.test(valor) || /^(\/|data:|blob:)/.test(valor)) return valor;
  // Clave local del bundle → resolver por nombre de archivo.
  return MAPA[valor.split('/').pop() ?? valor];
}

/** Acceso directo por clave conocida (hero, galería, sello…). Lanza si falta. */
export function foto(clave: string): string {
  const url = MAPA[clave];
  if (!url) throw new Error(`Foto del bundle no encontrada: ${clave}`);
  return url;
}
