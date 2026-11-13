/**
 * Pie del sitio.
 */
import { Link } from 'react-router-dom';
import { useAsync } from '../../lib/useAsync';
import { fetchContactoPublico, waLink, instagramLink } from '../../lib/contacto';
import PinoMarca from '../ui/PinoMarca';

const EXPLORA = [
  { href: '/#glampings', label: 'Domos' },
  { href: '/#sedes', label: 'Ubicaciones' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#experiencias', label: 'Experiencias' },
  { href: '/#galeria', label: 'Galería' },
];

export default function Footer() {
  const contacto = useAsync(fetchContactoPublico, []);
  const wa = contacto.data?.whatsapp ?? '';
  const ig = contacto.data?.instagram ?? '';
  const correo = contacto.data?.email ?? '';

  const enlace = 'block py-2.5 text-[14.5px] text-white/70 transition-colors hover:text-white';

  return (
    <footer className="bg-sello text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <PinoMarca className="h-6 w-8 text-[#8ce0c3]" />
              <span className="font-display text-[19px] tracking-[0.22em]">ALMA VERDE</span>
            </div>
            <p className="mt-5 max-w-[36ch] text-[14.5px] leading-relaxed text-white/70">
              Domos de lujo con jacuzzi privado en cinco sedes de Colombia. Privacidad total,
              desayuno incluido y el cielo abierto sobre ti.
            </p>
          </div>

          <nav aria-label="Explora">
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#8ce0c3]">
              Explora
            </p>
            <ul className="mt-3">
              {EXPLORA.map((e) => (
                <li key={e.href}>
                  <a href={e.href} className={enlace}>
                    {e.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#8ce0c3]">
              Reserva y contacto
            </p>
            <ul className="mt-3">
              <li>
                <Link to="/reservar" className={enlace}>
                  Ver disponibilidad
                </Link>
              </li>
              <li>
                <Link to="/mi-reserva" className={enlace}>
                  Mi reserva
                </Link>
              </li>
              <li>
                <a href={waLink(wa)} target="_blank" rel="noopener noreferrer" className={enlace}>
                  {wa ? `WhatsApp ${wa}` : 'WhatsApp'}
                </a>
              </li>
              {ig && (
                <li>
                  <a
                    href={instagramLink(ig)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={enlace}
                  >
                    @{ig}
                  </a>
                </li>
              )}
              {correo && (
                <li>
                  <a href={`mailto:${correo}`} className={enlace}>
                    {correo}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/55">
            © 2026 Alma Verde · RNT ······
          </p>
          <div className="flex gap-6">
            <Link
              to="/terminos"
              className="flex min-h-[44px] items-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-white"
            >
              Términos
            </Link>
            <Link
              to="/privacidad"
              className="flex min-h-[44px] items-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-white"
            >
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}