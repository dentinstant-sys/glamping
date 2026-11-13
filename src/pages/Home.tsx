/**
 * Landing pública de Alma Verde.
 */
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import SubNav from '../components/sections/SubNav';
import FAQItem from '../components/sections/FAQItem';
import GlampingCard from '../components/GlampingCard';
import Imagen from '../components/ui/Imagen';
import PinoMarca from '../components/ui/PinoMarca';
import Reveal from '../components/ui/Reveal';
import { foto } from '../lib/fotos';
import { SkeletonCards, EstadoError } from '../components/ui/Estados';
import { useAsync } from '../lib/useAsync';
import { fetchContactoPublico, waLink } from '../lib/contacto';
import { fetchVenues, fetchGlampingsDestacados, fetchTestimonials } from '../lib/catalogo';
import { STATS, EXPERIENCIAS, FAQ } from '../content/landing';

const ico = 'h-6 w-6 shrink-0 stroke-current';
const IcoJacuzzi = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={ico} aria-hidden="true">
    <path d="M3 11h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3z" strokeLinejoin="round" />
    <path d="M8 11V6a2 2 0 1 1 4 0" strokeLinecap="round" />
    <path d="M6 22l1-2M18 22l-1-2" strokeLinecap="round" />
  </svg>
);
const IcoDesayuno = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={ico} aria-hidden="true">
    <path d="M4 13h12v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2z" strokeLinejoin="round" />
    <path d="M16 14h2a2 2 0 1 0 0-4h-2" strokeLinecap="round" />
    <path d="M7 6c0-1 1-1 1-2M11 6c0-1 1-1 1-2" strokeLinecap="round" />
  </svg>
);
const IcoWifi = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={ico} aria-hidden="true">
    <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" strokeLinecap="round" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IcoCama = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={ico} aria-hidden="true">
    <path d="M3 18v-8M21 18v-5H3M3 13V8a2 2 0 0 1 2-2h5v7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="10" r="1.6" />
  </svg>
);
const IcoServicio = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={ico} aria-hidden="true">
    <path d="M3 18h18M5 18a7 7 0 0 1 14 0" strokeLinecap="round" />
    <path d="M12 8V6" strokeLinecap="round" />
    <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IcoPrivacidad = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={ico} aria-hidden="true">
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
  </svg>
);

const SERVICIOS = [
  { Ico: IcoJacuzzi, nombre: 'Jacuzzi privado', texto: 'Climatizado y de uso exclusivo, a cualquier hora de tu estadía.' },
  { Ico: IcoDesayuno, nombre: 'Desayuno incluido', texto: 'Servido en la puerta de tu domo o dentro del jacuzzi.' },
  { Ico: IcoCama, nombre: 'Cama king', texto: 'Ropa de cama de hotel y el domo entero para ustedes dos.' },
  { Ico: IcoWifi, nombre: 'Wifi en el domo', texto: 'Cobertura en todos los domos, por si el mundo llama.' },
  { Ico: IcoServicio, nombre: 'Servicio 24/7', texto: 'Atención a tu domo a cualquier hora del día o la noche.' },
  { Ico: IcoPrivacidad, nombre: 'Privacidad total', texto: 'Domos aislados entre sí, rodeados de naturaleza.' },
];

export default function Home() {
  const venues = useAsync(fetchVenues, []);
  const destacados = useAsync(fetchGlampingsDestacados, []);
  const testimonios = useAsync(fetchTestimonials, []);
  const contacto = useAsync(fetchContactoPublico, []);

  const venuesById = new Map((venues.data ?? []).map((v) => [v.id, v]));

  return (
    <Layout heroOscuro>
      <Hero venues={venues.data ?? []} />
      <SubNav />

      {/* ── Datos duros ────────────────────────────────────────────────── */}
      <section className="border-b border-linea bg-fondo-2">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-px bg-linea sm:grid-cols-4">
          <Dato k="Check-in" v="3:00 p. m." />
          <Dato k="Check-out" v="12:00 m." />
          <Dato k="Sedes" v="5 en Colombia" />
          <Dato
            k="Reservas"
            v={contacto.data?.whatsapp || 'WhatsApp'}
            href={waLink(contacto.data?.whatsapp ?? '')}
          />
        </div>
      </section>

      {/* ── Domos: el producto ─────────────────────────────────────────── */}
      <section id="glampings" className="relative overflow-hidden py-[var(--spacing-blk)]">
        <PinoMarca className="pointer-events-none absolute -right-24 top-14 hidden w-[440px] select-none text-oro opacity-[0.06] sm:block" />
        <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8">
          <Encabezado
            etiqueta="Nuestros domos"
            titulo="Elige dónde vas a dormir"
            texto="Tarifa por noche para dos personas, con desayuno e impuestos incluidos."
          />

          <div className="mt-12">
            {destacados.loading && <SkeletonCards n={3} />}
            {destacados.error && <EstadoError onReintentar={destacados.reload} />}
            {destacados.data && venues.data && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {destacados.data.map((g) => {
                  const v = venuesById.get(g.venueId);
                  return v ? <GlampingCard key={g.id} glamping={g} venue={v} /> : null;
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Ubicaciones ────────────────────────────────────────────────── */}
      <section id="sedes" className="seccion-alt relative overflow-hidden border-y border-linea py-[var(--spacing-blk)]">
        <PinoMarca className="pointer-events-none absolute -left-20 bottom-14 hidden w-[400px] select-none text-oro opacity-[0.06] sm:block" />
        <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8">
          <Encabezado
            etiqueta="Ubicaciones"
            titulo="Cinco sedes, cinco paisajes"
            texto="El mismo lujo y la misma privacidad, en cinco rincones distintos de Colombia."
          />

          <div className="mt-12">
            {venues.loading && <SkeletonCards n={5} />}
            {venues.error && <EstadoError onReintentar={venues.reload} />}
            {venues.data && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {venues.data.map((v) => (
                  <Link
                    key={v.id}
                    to={`/sede/${v.slug}`}
                    className="ficha group flex flex-col focus-visible:outline-offset-4"
                  >
                    <div className="aspect-[3/2] overflow-hidden">
                      <Imagen
                        src={v.fotos?.[0]}
                        alt={v.nombre}
                        className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-royal)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="dato dato-oro">{v.departamento}</p>
                      <h3 className="mt-2 text-[24px] text-tinta">{v.nombre}</h3>
                      <p className="mt-2 line-clamp-2 text-[14.5px] text-tinta-2">{v.descripcion}</p>
                      <span className="dato dato-oro mt-4 inline-flex items-center gap-2">
                        Ver la sede <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Servicios ──────────────────────────────────────────────────── */}
      <section id="servicios" className="relative overflow-hidden py-[var(--spacing-blk)]">
        <PinoMarca className="absolute -right-16 top-10 hidden w-[440px] text-oro opacity-[0.05] sm:block" />
        <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8">
          <Encabezado etiqueta="Servicios" titulo="Lo que incluye tu estadía" />
          <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((s) => (
              <li key={s.nombre} className="flex gap-4">
                <span className="text-oro">
                  <s.Ico />
                </span>
                <div>
                  <h3 className="text-[19px] text-tinta">{s.nombre}</h3>
                  <p className="mt-1.5 max-w-[38ch] text-[14.5px] text-tinta-2">{s.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Experiencias · banda verde-bosque ──────────────────────────── */}
      <section id="experiencias" className="seccion-bosque relative overflow-hidden py-[var(--spacing-blk)]">
        <PinoMarca className="absolute -left-14 bottom-6 hidden w-[380px] text-oro-claro opacity-[0.06] sm:block" />
        <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8">
          <div>
            <p className="dato text-oro-claro">Experiencias</p>
            <h2 className="mt-3 max-w-[18ch] text-[clamp(28px,4vw,44px)] text-white">
              Suma algo más a tu noche
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] text-white/70">
              Opcionales que puedes agregar durante la reserva o pedirnos antes de llegar.
            </p>
          </div>
          <div className="mt-12 grid gap-x-10 sm:grid-cols-2">
            {EXPERIENCIAS.map((e) => (
              <div key={e.num} className="flex gap-5 border-t border-[color:var(--color-linea-bosque)] py-6">
                <span className="numeral shrink-0 pt-1 text-[13px] text-oro-claro">{e.num}</span>
                <div>
                  <h3 className="text-[20px] text-white">{e.nombre}</h3>
                  <p className="mt-1.5 max-w-[42ch] text-[14.5px] text-white/70">{e.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galería ────────────────────────────────────────────────────── */}
      <section id="galeria" className="relative overflow-hidden py-[var(--spacing-blk)]">
        <PinoMarca className="pointer-events-none absolute -right-16 top-10 hidden w-[360px] select-none text-oro opacity-[0.06] sm:block" />
        <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8">
          <Encabezado etiqueta="Galería" titulo="Lo que se vive aquí arriba" />
          <Reveal>
            <div className="mt-12 grid grid-cols-2 gap-3 md:auto-rows-[230px] md:grid-cols-4 md:gap-4">
              {GALERIA.map((g, i) => (
                <div key={i} className={`group overflow-hidden rounded-[var(--radius-suave)] ${g.clase}`}>
                  <Imagen
                    src={g.foto}
                    alt={g.alt}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-royal)] group-hover:scale-[1.04]"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Opiniones ──────────────────────────────────────────────────── */}
      <section className="seccion-alt relative overflow-hidden border-y border-linea py-[var(--spacing-blk)]">
        <PinoMarca className="pointer-events-none absolute -left-16 bottom-10 hidden w-[380px] select-none text-oro opacity-[0.06] sm:block" />
        <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Encabezado etiqueta="Opiniones" titulo="Lo que dicen los huéspedes" />
            <div className="flex items-center gap-3">
              <span className="numeral text-[38px] text-oro-texto">4.9</span>
              <div>
                <span className="text-[13px] tracking-[0.16em] text-oro" aria-hidden="true">★★★★★</span>
                <p className="dato mt-0.5">de 5</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            {testimonios.loading && <SkeletonCards n={3} />}
            {testimonios.error && <EstadoError onReintentar={testimonios.reload} />}
            {testimonios.data && testimonios.data.length > 0 && (
              <div className="grid gap-6 md:grid-cols-3">
                {testimonios.data.map((t) => (
                  <figure key={t.id} className="ficha flex flex-col p-6">
                    <div className="text-[13px] tracking-[0.2em] text-oro" aria-label={`${t.rating} de 5 estrellas`}>
                      {'★'.repeat(t.rating)}
                      <span className="text-tinta-3">{'★'.repeat(5 - t.rating)}</span>
                    </div>
                    <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-tinta-2">
                      «{t.texto}»
                    </blockquote>
                    <figcaption className="dato mt-5">{t.nombre}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative py-[var(--spacing-blk)]">
        <PinoMarca className="absolute bottom-12 left-10 hidden w-[300px] text-oro opacity-[0.045] lg:block" />
        <div className="relative mx-auto grid max-w-[1280px] gap-10 px-6 sm:px-8 lg:grid-cols-[0.6fr_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--h-subnav)+28px)] lg:self-start">
            <Encabezado etiqueta="Preguntas frecuentes" titulo="Antes de tu llegada" />
          </div>
          <div>
            {FAQ.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA · bosque sobre foto de bosque ──────────────────────────── */}
      <section className="relative overflow-hidden">
        <img
          src={foto('bosque.jpg')}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(35,43,29,0.68)_0%,rgba(24,30,20,0.9)_100%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-[clamp(70px,10vw,130px)] sm:px-8">
          <h2 className="max-w-[15ch] text-[clamp(32px,5.5vw,64px)] text-white">
            Tu domo te está esperando
          </h2>
          <p className="mt-5 max-w-[46ch] text-white/85">
            Consulta disponibilidad en segundos. Confirmación inmediata, pago seguro y todos los
            detalles por correo.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/reservar"
              className="flex min-h-[56px] items-center justify-center rounded-[var(--radius-control)] bg-oro px-10 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-oro-texto"
            >
              Ver disponibilidad
            </Link>
            <a
              href={waLink(contacto.data?.whatsapp ?? '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[56px] items-center justify-center rounded-[var(--radius-control)] border border-white/45 px-10 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-linea">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-px bg-linea lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-fondo px-6 py-8">
              <p className="numeral text-[30px] text-oro-texto">{s.valor}</p>
              <p className="dato mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function Encabezado({
  etiqueta,
  titulo,
  texto,
}: {
  etiqueta: string;
  titulo: string;
  texto?: string;
}) {
  return (
    <div>
      <p className="dato dato-oro">{etiqueta}</p>
      <h2 className="mt-3 max-w-[18ch] text-[clamp(28px,4vw,44px)] text-tinta">{titulo}</h2>
      {texto && <p className="mt-4 max-w-[52ch] text-[15px] text-tinta-2">{texto}</p>}
    </div>
  );
}

function Dato({ k, v, href }: { k: string; v: string; href?: string }) {
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-fondo-2 px-5 py-5 transition-colors hover:bg-fondo"
    >
      <p className="dato">{k}</p>
      <p className="mt-1.5 text-[15px] font-medium text-oro-texto">
        {v}{' '}
        <span aria-hidden="true" className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          ↗
        </span>
      </p>
    </a>
  ) : (
    <div className="bg-fondo-2 px-5 py-5">
      <p className="dato">{k}</p>
      <p className="mt-1.5 text-[15px] font-medium text-tinta">{v}</p>
    </div>
  );
}

const GALERIA = [
  { alt: 'Domos al atardecer', foto: 'atardecer.jpg', clase: 'col-span-2 row-span-2 aspect-square md:aspect-auto' },
  { alt: 'Domo iluminado de noche', foto: 'domo-noche.jpg', clase: 'col-span-2 aspect-[16/10] md:aspect-auto' },
  { alt: 'Domo burbuja', foto: 'burbuja.jpg', clase: 'aspect-square md:aspect-auto' },
  { alt: 'Jacuzzi con vista al valle', foto: 'jacuzzi-valle.jpg', clase: 'aspect-square md:aspect-auto' },
  { alt: 'Domos en el bosque', foto: 'bosque.jpg', clase: 'col-span-2 aspect-[16/10] md:aspect-auto' },
  { alt: 'Panorámica de la sede entre montañas', foto: 'panorama-sede.jpg', clase: 'col-span-2 aspect-[16/10] md:aspect-auto' },
];