/**
 * Estados compartidos: Skeleton, EstadoError, EstadoVacio.
 * Cubren los estados obligatorios loading/error/empty del criterio defendible.
 *
 * El esqueleto imita la forma REAL de la tarjeta nueva (foto 4/5 + líneas), no
 * una caja genérica: si el hueco no tiene la forma de lo que va a llegar, el
 * contenido salta al cargar.
 */
import type { ReactNode } from 'react';
import Button from './Button';

/** Bloque skeleton con shimmer (clase .esk de index.css). */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`esk ${className}`} aria-hidden="true" />;
}

/** Rejilla de tarjetas-esqueleto para listados (domos/sedes). */
export function SkeletonCards({ n = 3 }: { n?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="border border-linea">
          {/* Misma proporción que la ficha real (3:2): si el hueco no tiene la
              forma de lo que va a llegar, el contenido salta al cargar. */}
          <Skeleton className="aspect-[3/2] w-full" />
          <div className="flex flex-col gap-3 p-5">
            <Skeleton className="h-2.5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface EstadoProps {
  titulo: string;
  mensaje: string;
  children?: ReactNode;
}

/** Estado de error con acción de recuperación. */
export function EstadoError({
  titulo = 'Algo salió mal',
  mensaje = 'No pudimos cargar la información. Inténtalo de nuevo.',
  onReintentar,
}: {
  titulo?: string;
  mensaje?: string;
  onReintentar?: () => void;
}) {
  return (
    <div className="regla flex flex-col items-start gap-5 py-14" role="status">
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-oro)"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
      </svg>
      <div>
        <p className="font-display text-[clamp(22px,3vw,28px)] text-tinta">{titulo}</p>
        <p className="mt-2 max-w-[44ch] text-[15px] text-tinta-2">{mensaje}</p>
      </div>
      {onReintentar && (
        <Button variant="ghost" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

/** Estado vacío (ej. sede sin domos). */
export function EstadoVacio({ titulo, mensaje, children }: EstadoProps) {
  return (
    <div className="regla flex flex-col items-start gap-5 py-14">
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-oro)"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <path d="M3 19l6-8 4 5 3-4 5 7z" strokeLinejoin="round" />
        <circle cx="8" cy="7" r="2" />
      </svg>
      <div>
        <p className="font-display text-[clamp(22px,3vw,28px)] text-tinta">{titulo}</p>
        <p className="mt-2 max-w-[44ch] text-[15px] text-tinta-2">{mensaje}</p>
      </div>
      {children}
    </div>
  );
}
