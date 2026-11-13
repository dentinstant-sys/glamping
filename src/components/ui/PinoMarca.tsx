/**
 * Marca de agua vectorial: tres pinos en trazo fino, el mismo lenguaje de
 * línea 1.5 de los iconos del sitio. Pedida para que los fondos
 * planos respiren sin competir con el contenido.
 *
 * Reglas de uso (para que siga siendo elegante):
 *  - SIEMPRE decorativa: aria-hidden y pointer-events-none vienen puestos.
 *  - Opacidad la pone quien la usa (3–6%); el color va por currentColor.
 *  - En móvil se oculta desde el sitio de uso (hidden sm:block): a ese ancho
 *    es ruido, no atmósfera.
 */
import type { CSSProperties } from 'react';

export default function PinoMarca({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`pointer-events-none select-none ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Pino central, el protagonista */}
      <path d="M120 12 L94 58 h14 L84 96 h16 L74 134 h92 L140 96 h16 L122 58 h14 Z" />
      <path d="M120 134 v14" />
      {/* Pino izquierdo, menor */}
      <path d="M52 58 L34 92 h9 L28 122 h48 L61 92 h9 Z" />
      <path d="M52 122 v10" />
      {/* Pino derecho, menor y más bajo */}
      <path d="M196 72 L180 102 h8 L174 128 h44 L204 102 h8 Z" />
      <path d="M196 128 v9" />
      {/* Suelo sugerido, tres trazos sueltos */}
      <path d="M18 148 h34 M96 152 h52 M188 148 h30" strokeWidth="1.2" />
    </svg>
  );
}