/**
 * Sub-navegación pegajosa de la landing.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SECCIONES = [
  { id: 'glampings', label: 'Domos' },
  { id: 'sedes', label: 'Ubicaciones' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'experiencias', label: 'Experiencias' },
  { id: 'galeria', label: 'Galería' },
  { id: 'faq', label: 'Preguntas' },
];

export default function SubNav() {
  const [activa, setActiva] = useState<string>('');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiva(visible.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );
    SECCIONES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      className="sticky top-0 z-40 border-b border-linea bg-fondo/95 backdrop-blur-md"
      aria-label="Secciones del hotel"
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-1 overflow-x-auto px-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECCIONES.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={activa === s.id ? 'true' : undefined}
            className={`dato relative flex h-[56px] shrink-0 items-center px-3.5 transition-colors ${
              activa === s.id ? 'text-oro-texto' : 'text-tinta-2 hover:text-tinta'
            }`}
          >
            {s.label}
            {activa === s.id && (
              <span className="absolute inset-x-3 bottom-0 h-[2px] bg-oro" aria-hidden="true" />
            )}
          </a>
        ))}

        <Link
          to="/reservar"
          className="ml-auto hidden h-[38px] shrink-0 items-center rounded-[var(--radius-control)] bg-oro px-5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-oro-texto sm:flex"
        >
          Reservar
        </Link>
      </div>
    </nav>
  );
}