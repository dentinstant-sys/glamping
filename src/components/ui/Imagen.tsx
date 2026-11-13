/**
 * Imagen con placeholder elegante de marca.
 *
 * `variant`:
 *   - "claro"  (def.): sobre tarjetas suaves (domos, opciones del wizard).
 *   - "oscuro": sobre fondos que llevan texto encima (tarjetas de sede al pie).
 */
import { useState } from 'react';
import Motif from './Motif';
import { resolverFoto } from '../../lib/fotos';

interface Props {
  src?: string;
  alt: string;
  className?: string;
  variant?: 'claro' | 'oscuro';
}

export default function Imagen({ src, alt, className = '', variant = 'claro' }: Props) {
  const [error, setError] = useState(false);
  const url = resolverFoto(src);

  if (!url || error) {
    const fondo =
      variant === 'oscuro'
        ? 'bg-[linear-gradient(160deg,#1b2e25,#122119)]'
        : 'bg-[linear-gradient(135deg,#f4f8f6,#e8f2ee)]';
    const tinte = variant === 'oscuro' ? 'text-white/20' : 'text-oro/25';
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${fondo} ${className}`}
        role="img"
        aria-label={alt}
      >
        <Motif className={`h-[34%] max-h-20 min-h-9 w-auto ${tinte}`} />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
      className={className}
    />
  );
}