/**
 * Header fijo con nav.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PinoMarca from '../ui/PinoMarca';

const NAV = [
  { href: '/#glampings', label: 'Domos' },
  { href: '/#sedes', label: 'Ubicaciones' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#galeria', label: 'Galería' },
  { href: '/#faq', label: 'Preguntas' },
];

export default function Header({ heroOscuro = false }: { heroOscuro?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierto]);

  const sobreHero = heroOscuro && !scrolled && !abierto;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        sobreHero ? 'bg-transparent' : 'border-b border-linea bg-fondo'
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3.5 sm:px-8">
        <Link
          to="/"
          onClick={() => setAbierto(false)}
          className={`-my-2 flex items-center gap-2.5 py-2 transition-colors ${
            sobreHero ? 'text-white' : 'text-tinta'
          }`}
          aria-label="Alma Verde — inicio"
        >
          <PinoMarca
            className="h-6 w-8"
            style={{ color: sobreHero ? '#8ce0c3' : 'var(--color-oro)' }}
          />
          <span className="font-display text-[19px] tracking-[0.22em]">ALMA VERDE</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`dato transition-colors ${
                sobreHero ? 'text-white/85 hover:text-white' : 'text-tinta-2 hover:text-oro-texto'
              }`}
            >
              {n.label}
            </a>
          ))}
          <Link
            to="/reservar"
            className={`flex min-h-[44px] items-center rounded-[var(--radius-control)] px-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] transition-colors ${
              sobreHero
                ? 'border border-white/60 text-white hover:bg-white hover:text-tinta'
                : 'bg-oro text-white hover:bg-oro-texto'
            }`}
          >
            Reservar
          </Link>
        </nav>

        <button
          className={`-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden ${
            sobreHero ? 'text-white' : 'text-tinta'
          }`}
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          <span
            className={`h-[1.5px] w-6 bg-current transition-transform duration-300 ${
              abierto ? 'translate-y-[6.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-[1.5px] w-6 bg-current transition-opacity duration-300 ${abierto ? 'opacity-0' : ''}`}
          />
          <span
            className={`h-[1.5px] w-6 bg-current transition-transform duration-300 ${
              abierto ? '-translate-y-[6.5px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {abierto && (
        <nav
          className="flex h-[calc(100dvh-65px)] flex-col justify-between overflow-y-auto border-t border-linea bg-fondo px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-2 md:hidden"
          aria-label="Móvil"
        >
          <ul>
            {NAV.map((n) => (
              <li key={n.href} className="regla">
                <a
                  href={n.href}
                  onClick={() => setAbierto(false)}
                  className="flex min-h-[60px] items-center text-[22px] text-tinta"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            to="/reservar"
            onClick={() => setAbierto(false)}
            className="mt-6 flex min-h-[56px] items-center justify-center rounded-[var(--radius-control)] bg-oro font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white"
          >
            Reservar
          </Link>
        </nav>
      )}
    </header>
  );
}