/**
 * Detalle de domo: galería, descripción, amenidades, tarifas por tramo, CTA.
 */
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Imagen from '../components/ui/Imagen';
import Button from '../components/ui/Button';
import { EstadoError, EstadoVacio, Skeleton } from '../components/ui/Estados';
import { useAsync } from '../lib/useAsync';
import { fetchVenueBySlug, fetchGlampingBySlug, fetchSeasonalPricing } from '../lib/catalogo';
import { fmtCOP } from '../lib/format';

export default function Glamping() {
  const { venueSlug = '', glampingSlug = '' } = useParams();
  const venue = useAsync(() => fetchVenueBySlug(venueSlug), [venueSlug]);
  const venueId = venue.data?.id;
  const glamping = useAsync(
    () => (venueId ? fetchGlampingBySlug(venueId, glampingSlug) : Promise.resolve(null)),
    [venueId, glampingSlug],
  );
  const glampingId = glamping.data?.id;
  const pricing = useAsync(
    () => (glampingId ? fetchSeasonalPricing(glampingId) : Promise.resolve([])),
    [glampingId],
  );

  const cargando = venue.loading || glamping.loading;
  const g = glamping.data;
  const v = venue.data;

  return (
    <Layout heroOscuro={!!(g && v)}>
      {g && v && (
        <section className="relative flex min-h-[52svh] items-end overflow-hidden sm:min-h-[58svh]">
          <Imagen
            src={g.fotos?.[0]}
            alt={g.nombre}
            variant="oscuro"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,21,15,0.5)_0%,rgba(22,21,15,0.15)_45%,rgba(22,21,15,0.8)_100%)]"
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
              <Link to={`/sede/${v.slug}`} className="transition-colors hover:text-white">
                {v.nombre}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#a7f3d0]">{g.tipo}</span>
            </nav>
            <h1 className="mt-4 max-w-[16ch] text-[clamp(34px,6vw,68px)] text-white">{g.nombre}</h1>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        {cargando && (
          <div className="grid gap-10 pt-32 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-4">
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-[300px] w-full" />
          </div>
        )}

        {(venue.error || glamping.error) && (
          <div className="pt-32">
            <EstadoError
              onReintentar={() => {
                venue.reload();
                glamping.reload();
              }}
            />
          </div>
        )}

        {!cargando && !glamping.error && !g && (
          <div className="pt-32">
            <EstadoVacio
              titulo="Domo no encontrado"
              mensaje="Este domo no existe o ya no está disponible."
            >
              <Link to="/#glampings">
                <Button variant="ghost">Ver domos</Button>
              </Link>
            </EstadoVacio>
          </div>
        )}

        {g && v && (
          <div className="grid gap-x-14 gap-y-12 py-[var(--spacing-blk)] lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p className="dato dato-oro">Sobre el domo</p>
              <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-tinta">
                {g.descripcion}
              </p>

              <dl className="mt-10 grid grid-cols-2 gap-px border border-linea bg-linea sm:grid-cols-3">
                <Spec k="Capacidad" v={`${g.capacidad} huéspedes`} />
                <Spec k="Tipo" v={g.tipo} />
                <Spec k="Sede" v={v.nombre} />
              </dl>

              {g.amenities?.length > 0 && (
                <div className="mt-12">
                  <p className="dato dato-oro">Incluye</p>
                  <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
                    {g.amenities.map((a) => (
                      <li key={a} className="regla flex items-center gap-3 py-3.5">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.6"
                          className="h-4 w-4 shrink-0 stroke-oro"
                          aria-hidden="true"
                        >
                          <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[15px] text-tinta-2">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {g.fotos?.length > 1 && (
                <div className="mt-12">
                  <p className="dato dato-oro">Galería</p>
                  <div className="riel mt-4">
                    {g.fotos.slice(1).map((f, i) => (
                      <Imagen
                        key={i}
                        src={f}
                        alt={`${g.nombre} · foto ${i + 2}`}
                        className="aspect-[4/3] w-[75vw] max-w-[420px] object-cover sm:w-[380px]"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Panel de reserva */}
            <aside className="lg:sticky lg:top-[calc(var(--h-subnav)+24px)]">
              <div className="border border-linea bg-card p-6 shadow-sh-2">
                <p className="dato dato-oro">Tarifa por noche</p>

                {pricing.data && pricing.data.length > 0 ? (
                  <TarifaTramos
                    weekday={pricing.data[0].weekday}
                    friday={pricing.data[0].friday}
                    weekend={pricing.data[0].weekend}
                  />
                ) : (
                  <p className="numeral mt-4 text-[30px] text-tinta">
                    {fmtCOP(g.precioBase)}
                    <span className="dato ml-2 align-middle">/ noche</span>
                  </p>
                )}

                <p className="mt-5 text-[13px] leading-relaxed text-tinta-2">
                  El precio final se calcula noche por noche según el día. Desayuno e impuestos
                  incluidos.
                </p>

                <Link to={`/reservar?sede=${v.slug}&domo=${g.slug}`} className="mt-6 block">
                  <Button variant="solid" className="w-full">
                    Reservar este domo
                  </Button>
                </Link>

                <p className="dato mt-4 text-center">Confirmación inmediata</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-card px-5 py-4">
      <dt className="dato">{k}</dt>
      <dd className="mt-1.5 text-[16px] font-medium text-tinta">{v}</dd>
    </div>
  );
}

function TarifaTramos({
  weekday,
  friday,
  weekend,
}: {
  weekday: number;
  friday: number;
  weekend: number;
}) {
  const filas = [
    { label: 'Domingo a jueves', valor: weekday },
    { label: 'Viernes', valor: friday },
    { label: 'Sábado y festivos', valor: weekend },
  ];
  return (
    <dl className="mt-4">
      {filas.map((f) => (
        <div key={f.label} className="regla flex items-baseline justify-between gap-4 py-3">
          <dt className="text-[14px] text-tinta-2">{f.label}</dt>
          <dd className="numeral text-[17px] text-tinta">{fmtCOP(f.valor)}</dd>
        </div>
      ))}
    </dl>
  );
}