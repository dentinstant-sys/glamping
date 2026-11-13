/**
 * Detalle de sede: intro + lista de los domos de esa sede.
 */
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import GlampingCard from '../components/GlampingCard';
import Imagen from '../components/ui/Imagen';
import Button from '../components/ui/Button';
import { SkeletonCards, EstadoError, EstadoVacio } from '../components/ui/Estados';
import { useAsync } from '../lib/useAsync';
import { fetchVenueBySlug, fetchGlampings } from '../lib/catalogo';
import { fetchContactoPublico, waLink } from '../lib/contacto';

export default function Sede() {
  const { slug = '' } = useParams();
  const venue = useAsync(() => fetchVenueBySlug(slug), [slug]);
  const venueId = venue.data?.id;
  const glampings = useAsync(
    () => (venueId ? fetchGlampings(venueId) : Promise.resolve([])),
    [venueId],
  );
  const contacto = useAsync(fetchContactoPublico, []);
  const v = venue.data;

  return (
    <Layout heroOscuro={!!v}>
      {v && (
        <>
          <section className="relative flex min-h-[52svh] items-end overflow-hidden sm:min-h-[58svh]">
            <Imagen
              src={v.fotos?.[0]}
              alt={v.nombre}
              variant="oscuro"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,28,24,0.5)_0%,rgba(20,28,24,0.15)_45%,rgba(20,28,24,0.8)_100%)]"
              aria-hidden="true"
            />
            <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-12 pt-32 sm:px-8">
              <nav
                className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/75"
                aria-label="Ruta de navegación"
              >
                <Link to="/" className="transition-colors hover:text-white">
                  Inicio
                </Link>
                <span aria-hidden="true">/</span>
                <a href="/#sedes" className="transition-colors hover:text-white">
                  Ubicaciones
                </a>
                <span aria-hidden="true">/</span>
                <span className="text-[#8ce0c3]">{v.departamento}</span>
              </nav>
              <h1 className="mt-4 max-w-[16ch] text-[clamp(34px,6vw,68px)] text-white">
                {v.nombre}
              </h1>
            </div>
          </section>

          {/* Datos duros de la sede */}
          <section className="border-b border-linea bg-fondo-2">
            <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-px bg-linea sm:grid-cols-4">
              <Dato k="Departamento" v={v.departamento} />
              <Dato k="Check-in" v="3:00 p. m." />
              <Dato k="Check-out" v="12:00 m." />
              <Dato
                k="Reservas"
                v={contacto.data?.whatsapp || 'WhatsApp'}
                href={waLink(contacto.data?.whatsapp ?? '')}
              />
            </div>
          </section>

          {/* Descripción */}
          <section className="py-[var(--spacing-blk)]">
            <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
              <div className="max-w-[62ch]">
                <p className="dato dato-oro">Sobre la sede</p>
                <p className="mt-4 text-[17px] leading-relaxed text-tinta">{v.descripcion}</p>
              </div>
            </div>
          </section>
        </>
      )}

      {!v && (
        <section className="pt-32 pb-16">
          <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
            <nav className="dato flex flex-wrap items-center gap-2" aria-label="Ruta de navegación">
              <Link to="/" className="transition-colors hover:text-oro-texto">
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <a href="/#sedes" className="transition-colors hover:text-oro-texto">
                Ubicaciones
              </a>
            </nav>

            {venue.loading && (
              <div className="mt-8 flex flex-col gap-4">
                <div className="esk h-12 w-2/3 max-w-[480px]" />
                <div className="esk h-3 w-full max-w-[420px]" />
              </div>
            )}
            {venue.error && (
              <div className="mt-8">
                <EstadoError onReintentar={venue.reload} />
              </div>
            )}
            {!venue.loading && !venue.error && (
              <div className="mt-8">
                <EstadoVacio
                  titulo="Sede no encontrada"
                  mensaje="No encontramos esta sede. Quizá cambió de nombre."
                >
                  <Link to="/#sedes">
                    <Button variant="ghost">Ver todas las sedes</Button>
                  </Link>
                </EstadoVacio>
              </div>
            )}
          </div>
        </section>
      )}

      {v && (
        <section id="domos" className="seccion-alt border-y border-linea py-[var(--spacing-blk)]">
          <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
            <p className="dato dato-oro">Domos disponibles</p>
            <h2 className="mt-3 max-w-[18ch] text-[clamp(28px,4vw,44px)] text-tinta">
              Elige tu domo en {v.nombre}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] text-tinta-2">
              Tarifa por noche para dos personas, con desayuno e impuestos incluidos.
            </p>

            <div className="mt-12">
              {glampings.loading && <SkeletonCards n={3} />}
              {glampings.error && <EstadoError onReintentar={glampings.reload} />}
              {glampings.data && glampings.data.length === 0 && (
                <EstadoVacio
                  titulo="Sin domos disponibles"
                  mensaje="Esta sede aún no tiene domos publicados. Prueba otra sede o escríbenos."
                >
                  <Link to="/#sedes">
                    <Button variant="ghost">Ver otras sedes</Button>
                  </Link>
                </EstadoVacio>
              )}
              {glampings.data && glampings.data.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {glampings.data.map((g) => (
                    <GlampingCard key={g.id} glamping={g} venue={v} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {v && (
        <section className="py-[var(--spacing-blk)]">
          <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
            <div className="border border-linea bg-fondo-2 p-8 sm:p-12">
              <h2 className="max-w-[18ch] text-[clamp(26px,3.6vw,40px)] text-tinta">
                ¿Listos para {v.nombre}?
              </h2>
              <p className="mt-4 max-w-[46ch] text-[15px] text-tinta-2">
                Consulta disponibilidad y reserva en línea. Confirmación inmediata y pago seguro.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link to={`/reservar?sede=${v.slug}`}>
                  <Button variant="solid" className="w-full sm:w-auto">
                    Ver disponibilidad
                  </Button>
                </Link>
                <a
                  href={waLink(contacto.data?.whatsapp ?? '')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" className="w-full sm:w-auto">
                    Escríbenos por WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

function Dato({ k, v, href }: { k: string; v: string; href?: string }) {
  const cuerpo = (
    <>
      <p className="dato">{k}</p>
      <p className="mt-1.5 text-[15px] font-medium text-tinta">{v}</p>
    </>
  );
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-fondo-2 px-5 py-5 transition-colors hover:bg-fondo"
    >
      {cuerpo}
    </a>
  ) : (
    <div className="bg-fondo-2 px-5 py-5">{cuerpo}</div>
  );
}