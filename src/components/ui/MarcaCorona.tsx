/**
 * Marca "Corona" de Royal Glamping.
 *
 * Cinco picos ascendentes hacia el centro: uno por sede. De cerca son las puntas
 * de una diadema; de lejos, cinco estrellas sobre el horizonte — las dos cosas
 * que vende la marca en un solo dibujo.
 *
 * Los trazos toman `currentColor` (heredan el color del texto que los rodea, así
 * funcionan igual sobre hero oscuro y sobre lienzo claro); los puntos llevan el
 * champaña, que es el acento único de la identidad.
 *
 * Para tamaños muy pequeños (favicon) existe la variante sólida en
 * `public/favicon.svg`: a 16 px el trazo fino de aquí se pierde.
 */
export default function MarcaCorona({
  className = '',
  colorPuntos = 'var(--color-oro)',
}: {
  className?: string;
  /** Color de los cinco puntos. Sobre fondos oscuros usa el champaña claro. */
  colorPuntos?: string;
}) {
  return (
    <svg
      viewBox="0 0 60 30"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
        <path d="M6 26V17M18 26V11M30 26V5M42 26V11M54 26V17" />
        <path d="M3 26h54" strokeOpacity="0.4" />
      </g>
      <g fill={colorPuntos}>
        <circle cx="6" cy="15.4" r="1.5" />
        <circle cx="18" cy="9.4" r="1.5" />
        <circle cx="30" cy="3.4" r="1.8" />
        <circle cx="42" cy="9.4" r="1.5" />
        <circle cx="54" cy="15.4" r="1.5" />
      </g>
    </svg>
  );
}
