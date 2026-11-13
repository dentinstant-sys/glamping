/**
 * Reveal on scroll: aplica la clase .rv (oculto) y añade .in al entrar en
 * viewport, replicando los reveals del bundle.
 * Degrada con elegancia: si IntersectionObserver no existe o el usuario pide
 * menos movimiento, el contenido queda visible (la clase .rv ya lo neutraliza
 * vía prefers-reduced-motion en index.css).
 */
import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /** Retraso escalonado en ms (para cascadas de tarjetas). */
  delay?: number;
}

export default function Reveal({ children, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('in');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`rv ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
