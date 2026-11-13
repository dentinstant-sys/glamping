/**
 * Wizard de reserva de 5 pasos.
 */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import WizardShell from '../components/wizard/WizardShell';
import ResumenReserva from '../components/wizard/ResumenReserva';
import Imagen from '../components/ui/Imagen';
import Motif from '../components/ui/Motif';
import Button from '../components/ui/Button';
import { SkeletonCards, EstadoError, EstadoVacio } from '../components/ui/Estados';
import { useAsync } from '../lib/useAsync';
import {
  fetchVenues,
  fetchGlampings,
  fetchExtras,
  fetchSeasonalPricing,
  type VenueUI,
  type GlampingUI,
  type ExtraUI,
} from '../lib/catalogo';
import { calcularDesglose, totalDesglose, contarNoches } from '../lib/tarifa';
import { fmtCOP, fmtFecha } from '../lib/format';
import {
  crearBooking,
  generateBoldHash,
  crearPreferenciaMercadoPago,
  confirmarPorWhatsapp,
} from '../lib/reservas';
import { fetchPasarelas } from '../lib/checkout';
import { abrirCheckoutBold } from '../components/wizard/bold';
import CalendarioFechas from '../components/wizard/CalendarioFechas';

type Paso = 1 | 2 | 3 | 4 | 5;
type FaseConfirm = 'form' | 'creando' | 'pagando' | 'redirigiendo' | 'whatsapp-listo' | 'error';

export default function Reservar() {
  const [sp] = useSearchParams();
  const venues = useAsync(fetchVenues, []);
  const pasarelasAsync = useAsync(fetchPasarelas, []);
  const pasarelas = pasarelasAsync.data ?? { bold: false, mercadopago: false };

  const [paso, setPaso] = useState<Paso>(1);
  const [venue, setVenue] = useState<VenueUI | null>(null);
  const [glamping, setGlamping] = useState<GlampingUI | null>(null);
  const [checkIn, setCheckIn] = useState(sp.get('checkIn') ?? '');
  const [checkOut, setCheckOut] = useState(sp.get('checkOut') ?? '');
  const [huespedes, setHuespedes] = useState(Number(sp.get('huespedes')) || 2);
  const [extrasSel, setExtrasSel] = useState<Record<string, number>>({});

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [fase, setFase] = useState<FaseConfirm>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [waUrl, setWaUrl] = useState('');
  const [waNumero, setWaNumero] = useState('');

  const glampings = useAsync(
    () => (venue ? fetchGlampings(venue.id) : Promise.resolve([])),
    [venue?.id],
  );
  const extras = useAsync(
    () => (venue ? fetchExtras(venue.id) : fetchExtras()),
    [venue?.id],
  );
  const pricing = useAsync(
    () => (glamping ? fetchSeasonalPricing(glamping.id) : Promise.resolve([])),
    [glamping?.id],
  );

  useEffect(() => {
    if (!venue && venues.data) {
      const s = sp.get('sede');
      if (s) {
        const v = venues.data.find((x) => x.slug === s);
        if (v) {
          setVenue(v);
          setPaso((p) => (p === 1 ? 2 : p));
        }
      }
    }
  }, [venues.data, venue, sp]);

  useEffect(() => {
    if (venue && !glamping && glampings.data) {
      const d = sp.get('domo');
      if (d) {
        const g = glampings.data.find((x) => x.slug === d);
        if (g) {
          setGlamping(g);
          setPaso((p) => (p < 3 ? 3 : p));
        }
      }
    }
  }, [glampings.data, venue, glamping, sp]);

  const noches = contarNoches(checkIn, checkOut);
  const desglose = useMemo(() => {
    if (!glamping || noches <= 0) return [];
    const reglas = pricing.data ?? [];
    return calcularDesglose(
      new Date(`${checkIn}T00:00:00Z`),
      new Date(`${checkOut}T00:00:00Z`),
      reglas,
      glamping.precioBase,
    );
  }, [glamping, checkIn, checkOut, noches, pricing.data]);

  const alojamiento = totalDesglose(desglose);
  const extrasTotal = useMemo(() => {
    const lista = extras.data ?? [];
    return Object.entries(extrasSel).reduce((acc, [id, cant]) => {
      const e = lista.find((x) => x.id === id);
      return acc + (e ? e.precio * cant : 0);
    }, 0);
  }, [extrasSel, extras.data]);
  const total = alojamiento + extrasTotal;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formOk = nombre.trim() && emailOk && telefono.trim() && aceptaTerminos;

  async function confirmar() {
    if (!venue || !glamping) return;
    setFase('creando');
    setErrorMsg('');
    try {
      const extrasInput = Object.entries(extrasSel)
        .filter(([, c]) => c > 0)
        .map(([extraId, cantidad]) => ({ extraId, cantidad }));

      const reserva = await crearBooking({
        venueId: venue.id,
        glampingId: glamping.id,
        checkIn,
        checkOut,
        cliente: { nombre, email, telefono },
        huespedes,
        extras: extrasInput,
      });

      const hash = await generateBoldHash(reserva.bookingId);
      setFase('pagando');
      await abrirCheckoutBold({
        hash,
        descripcion: `Reserva ${reserva.numero} · Alma Verde`,
        redirectUrl: `${window.location.origin}/mi-reserva?numero=${reserva.numero}`,
        cliente: { nombre, email },
      });
    } catch (e) {
      const msg = (e as { message?: string }).message ?? 'No pudimos crear la reserva.';
      setErrorMsg(msg);
      setFase('error');
    }
  }

  async function confirmarMercadoPago() {
    if (!venue || !glamping) return;
    setFase('creando');
    setErrorMsg('');
    try {
      const extrasInput = Object.entries(extrasSel)
        .filter(([, c]) => c > 0)
        .map(([extraId, cantidad]) => ({ extraId, cantidad }));

      const reserva = await crearBooking({
        venueId: venue.id,
        glampingId: glamping.id,
        checkIn,
        checkOut,
        cliente: { nombre, email, telefono },
        huespedes,
        extras: extrasInput,
        metodoPago: 'mercadopago',
      });

      const { initPoint } = await crearPreferenciaMercadoPago(reserva.bookingId);
      setFase('redirigiendo');
      window.location.href = initPoint;
    } catch (e) {
      const msg = (e as { message?: string }).message ?? 'No pudimos abrir el pago.';
      setErrorMsg(msg);
      setFase('error');
    }
  }

  async function confirmarWhatsapp() {
    if (!venue || !glamping) return;
    const ventana = window.open('', '_blank');
    setFase('creando');
    setErrorMsg('');
    try {
      const extrasInput = Object.entries(extrasSel)
        .filter(([, c]) => c > 0)
        .map(([extraId, cantidad]) => ({ extraId, cantidad }));

      const reserva = await crearBooking({
        venueId: venue.id,
        glampingId: glamping.id,
        checkIn,
        checkOut,
        cliente: { nombre, email, telefono },
        huespedes,
        extras: extrasInput,
        metodoPago: 'whatsapp',
      });

      const { url } = await confirmarPorWhatsapp(reserva.bookingId);
      setWaUrl(url);
      setWaNumero(reserva.numero);
      if (ventana) {
        ventana.location.href = url;
      }
      setFase('whatsapp-listo');
    } catch (e) {
      if (ventana) ventana.close();
      const msg = (e as { message?: string }).message ?? 'No pudimos crear la reserva.';
      setErrorMsg(msg);
      setFase('error');
    }
  }

  return (
    <WizardShell paso={paso}>
      <div className="mx-auto grid max-w-[1140px] gap-8 px-6 py-12 lg:grid-cols-[1fr_340px]">
        <div>
          {paso === 1 && (
            <Seccion titulo="¿Dónde quieres escaparte?" subtitulo="Elige una de nuestras cinco sedes.">
              {venues.loading && <SkeletonCards n={5} />}
              {venues.error && <EstadoError onReintentar={venues.reload} />}
              {venues.data && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {venues.data.map((v) => (
                    <CardSelect
                      key={v.id}
                      seleccionado={venue?.id === v.id}
                      onClick={() => {
                        setVenue(v);
                        setGlamping(null);
                      }}
                      imagen={v.fotos?.[0]}
                      titulo={v.nombre}
                      subtitulo={v.departamento}
                    />
                  ))}
                </div>
              )}
            </Seccion>
          )}

          {paso === 2 && (
            <Seccion
              titulo="Elige tu domo"
              subtitulo="Cada domo, una experiencia distinta. Tarifa por noche, por pareja."
            >
              {glampings.loading && <SkeletonCards n={3} />}
              {glampings.error && <EstadoError onReintentar={glampings.reload} />}
              {glampings.data && glampings.data.length === 0 && (
                <EstadoVacio
                  titulo="Sin domos en esta sede"
                  mensaje="Prueba otra sede para ver disponibilidad."
                />
              )}
              {glampings.data && glampings.data.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {glampings.data.map((g) => (
                    <CardSelect
                      key={g.id}
                      seleccionado={glamping?.id === g.id}
                      onClick={() => setGlamping(g)}
                      imagen={g.fotos?.[0]}
                      titulo={g.nombre}
                      subtitulo={`${g.tipo} · desde ${fmtCOP(g.precioDesde)}`}
                    />
                  ))}
                </div>
              )}
            </Seccion>
          )}

          {paso === 3 && (
            <Seccion
              titulo="¿Cuándo llegan?"
              subtitulo="Selecciona tus fechas. El precio se calcula noche por noche según el día."
            >
              {venue && glamping ? (
                <CalendarioFechas
                  venueId={venue.id}
                  glampingId={glamping.id}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }}
                />
              ) : (
                <p className="text-tinta-2">Primero elige sede y domo.</p>
              )}

              <div className="mt-6">
                <span className="dato dato-oro mb-2 block">
                  Huéspedes
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setHuespedes((h) => Math.max(1, h - 1))}
                    className="flex h-11 w-11 items-center justify-center border border-linea-3 text-lg text-oro-texto transition-colors hover:border-oro"
                    aria-label="Quitar huésped"
                  >
                    −
                  </button>
                  <span className="font-display text-xl text-oro-texto">{huespedes}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setHuespedes((h) =>
                        Math.min(glamping?.capacidad ?? 6, h + 1),
                      )
                    }
                    className="flex h-11 w-11 items-center justify-center border border-linea-3 text-lg text-oro-texto transition-colors hover:border-oro"
                    aria-label="Agregar huésped"
                  >
                    +
                  </button>
                  <span className="text-sm text-tinta-2">
                    personas{glamping ? ` · máx ${glamping.capacidad}` : ''}
                  </span>
                </div>
              </div>

              <p className="mt-6 text-sm text-tinta-2">
                {noches > 0
                  ? `${noches} noche${noches > 1 ? 's' : ''} · estimado ${fmtCOP(alojamiento)}`
                  : 'Selecciona llegada y salida.'}
              </p>

              {noches > 0 && desglose.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-tinta-2">
                  {desglose.map((n) => (
                    <li key={n.fecha.toISOString()} className="flex justify-between">
                      <span>
                        {fmtFecha(n.fecha.toISOString().slice(0, 10))} · {tramoLabel(n.tramo)}
                      </span>
                      <span>{fmtCOP(n.precio)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Seccion>
          )}

          {paso === 4 && (
            <Seccion
              titulo="Haz tu noche inolvidable"
              subtitulo="Opcional. Agrega experiencias a tu estadía."
            >
              {extras.loading && <SkeletonCards n={2} />}
              {extras.error && <EstadoError onReintentar={extras.reload} />}
              {extras.data && extras.data.length === 0 && (
                <p className="text-tinta-2">No hay experiencias disponibles por ahora.</p>
              )}
              {extras.data && extras.data.length > 0 && (
                <div className="space-y-3">
                  {extras.data.map((e) => (
                    <ExtraRow
                      key={e.id}
                      extra={e}
                      cantidad={extrasSel[e.id] ?? 0}
                      onToggle={() =>
                        setExtrasSel((s) => ({ ...s, [e.id]: s[e.id] ? 0 : 1 }))
                      }
                    />
                  ))}
                </div>
              )}
            </Seccion>
          )}

          {paso === 5 && (
            <Seccion titulo="Confirma y paga" subtitulo="Tus datos y el método de pago.">
              {fase === 'form' && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nombre completo">
                      <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        className="min-h-[52px] w-full rounded-[var(--radius-control)] border border-linea bg-fondo-2 px-4 text-[16px] text-tinta transition-colors placeholder:text-tinta-3 focus:border-oro focus:bg-card focus:outline-none"
                      />
                    </Field>
                    <Field label="Correo">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@email.com"
                        className="min-h-[52px] w-full rounded-[var(--radius-control)] border border-linea bg-fondo-2 px-4 text-[16px] text-tinta transition-colors placeholder:text-tinta-3 focus:border-oro focus:bg-card focus:outline-none"
                      />
                    </Field>
                  </div>
                  <Field label="WhatsApp">
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+57 ···"
                      className="min-h-[52px] w-full rounded-[var(--radius-control)] border border-linea bg-fondo-2 px-4 text-[16px] text-tinta transition-colors placeholder:text-tinta-3 focus:border-oro focus:bg-card focus:outline-none"
                    />
                  </Field>

                  <label className="flex items-start gap-3 py-2 text-sm text-tinta-2">
                    <input
                      type="checkbox"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      className="mt-1 h-5 w-5 accent-oro"
                    />
                    <span>
                      Acepto los{' '}
                      <Link to="/terminos" className="text-oro-texto underline">
                        términos y condiciones
                      </Link>
                      , la política de cancelación y el reglamento del domo.
                    </span>
                  </label>

                  <CheckoutCTAs
                    pasarelas={pasarelas}
                    formOk={!!formOk}
                    onBold={confirmar}
                    onMercadoPago={confirmarMercadoPago}
                    onWhatsapp={confirmarWhatsapp}
                  />
                </div>
              )}

              {(fase === 'creando' || fase === 'pagando' || fase === 'redirigiendo') && (
                <div className="py-10 text-center text-tinta-2">
                  <div className="esk mx-auto mb-4 h-12 w-12 rounded-full" />
                  <p>
                    {fase === 'creando' && 'Creando tu reserva…'}
                    {fase === 'pagando' &&
                      'Abrimos el pago seguro de Bold. Completa el pago en la ventana que apareció.'}
                    {fase === 'redirigiendo' &&
                      'Te llevamos al pago seguro de Mercado Pago. No cierres esta pestaña.'}
                  </p>
                  {fase === 'pagando' && (
                    <button
                      type="button"
                      onClick={() => setFase('form')}
                      className="mt-6 text-sm text-oro-texto underline underline-offset-2"
                    >
                      Volver
                    </button>
                  )}
                </div>
              )}

              {fase === 'whatsapp-listo' && (
                <div className="py-10 text-center">
                  <h2 className="font-display text-[clamp(22px,3.5vw,30px)] text-tinta">
                    Reserva {waNumero} creada
                  </h2>
                  <p className="mx-auto mt-3 max-w-[44ch] text-tinta-2">
                    Te confirmamos por WhatsApp. Toca el botón para escribirnos y coordinar el pago.
                  </p>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-[var(--radius-control)] bg-[#6B6F58] px-9 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition hover:brightness-110"
                  >
                    Abrir WhatsApp
                  </a>
                  <div className="mt-4">
                    <Link
                      to={`/mi-reserva?numero=${waNumero}`}
                      className="text-sm text-oro-texto underline underline-offset-2"
                    >
                      Ver el estado de mi reserva
                    </Link>
                  </div>
                </div>
              )}

              {fase === 'error' && (
                <EstadoError
                  titulo="No pudimos completar la reserva"
                  mensaje={errorMsg}
                  onReintentar={() => setFase('form')}
                />
              )}
            </Seccion>
          )}

          {fase === 'form' && (
            <div className="regla mt-12 flex items-center justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={() => setPaso((p) => Math.max(1, p - 1) as Paso)}
                className={`dato flex min-h-[52px] items-center gap-2 px-2 transition-colors hover:text-oro-texto ${
                  paso === 1 ? 'invisible' : ''
                }`}
              >
                <span aria-hidden="true">←</span> Atrás
              </button>

              {paso < 5 && (
                <Button
                  variant="solid"
                  disabled={!puedeAvanzar(paso, { venue, glamping, noches })}
                  onClick={() => setPaso((p) => (p + 1) as Paso)}
                >
                  Continuar
                </Button>
              )}
            </div>
          )}
        </div>

        <ResumenReserva
          huespedes={huespedes}
          noches={noches}
          desglose={desglose}
          alojamiento={alojamiento}
          extras={extrasTotal}
          total={total}
        />
      </div>
    </WizardShell>
  );
}

function Seccion({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1 className="max-w-[16ch] text-[clamp(28px,5vw,46px)] text-tinta">{titulo}</h1>
      <p className="mt-4 max-w-[52ch] text-tinta-2">{subtitulo}</p>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="dato dato-oro mb-2 block">
        {label}
      </span>
      {children}
    </label>
  );
}

const MUSGO = '#6B6F58';

function CheckoutCTAs({
  pasarelas,
  formOk,
  onBold,
  onMercadoPago,
  onWhatsapp,
}: {
  pasarelas: { bold: boolean; mercadopago: boolean };
  formOk: boolean;
  onBold: () => void;
  onMercadoPago: () => void;
  onWhatsapp: () => void;
}) {
  const botonWhatsapp = (
    <button
      type="button"
      disabled={!formOk}
      onClick={onWhatsapp}
      className="flex min-h-[52px] w-full items-center justify-center rounded-[var(--radius-control)] border border-transparent px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition hover:brightness-110 disabled:opacity-45"
      style={{ backgroundColor: MUSGO }}
    >
      Confirmar por WhatsApp
    </button>
  );

  const enLinea: { clave: string; etiqueta: string; onClick: () => void }[] = [];
  if (pasarelas.mercadopago) {
    enLinea.push({ clave: 'mercadopago', etiqueta: 'Pagar con Mercado Pago', onClick: onMercadoPago });
  }
  if (pasarelas.bold) {
    enLinea.push({ clave: 'bold', etiqueta: 'Pagar con Bold', onClick: onBold });
  }

  if (enLinea.length > 0) {
    return (
      <div className="mt-6 space-y-3">
        {enLinea.map((p, i) => (
          <Button
            key={p.clave}
            variant={i === 0 ? 'solid' : 'ghost'}
            className="w-full"
            disabled={!formOk}
            onClick={p.onClick}
          >
            {p.etiqueta}
          </Button>
        ))}
        <p className="dato text-center">o coordina y paga por</p>
        {botonWhatsapp}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {botonWhatsapp}
      <div className="border border-linea bg-card p-5 opacity-60">
        <p className="font-display text-[11px] uppercase tracking-[0.2em] text-tinta-2">
          Pago en línea
        </p>
        <p className="mt-1 text-xs text-tinta-2">Disponible próximamente</p>
      </div>
    </div>
  );
}

function CardSelect({
  seleccionado,
  onClick,
  imagen,
  titulo,
  subtitulo,
}: {
  seleccionado: boolean;
  onClick: () => void;
  imagen?: string;
  titulo: string;
  subtitulo: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={seleccionado}
      className={`relative overflow-hidden border text-left transition-colors duration-200 ${
        seleccionado ? 'border-oro ring-2 ring-oro' : 'border-linea hover:border-linea-3'
      }`}
    >
      <Imagen src={imagen} alt={titulo} className="aspect-[16/10] w-full object-cover" />
      {seleccionado && (
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-oro text-sm text-white">
          ✓
        </span>
      )}
      <div className="p-4">
        <h3 className="font-display text-lg text-tinta">{titulo}</h3>
        <p className="text-sm text-tinta-2">{subtitulo}</p>
      </div>
    </button>
  );
}

function ExtraRow({
  extra,
  cantidad,
  onToggle,
}: {
  extra: ExtraUI;
  cantidad: number;
  onToggle: () => void;
}) {
  const activo = cantidad > 0;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={activo}
      className={`flex w-full items-center justify-between gap-4 border p-4 text-left transition-colors ${
        activo ? 'border-oro bg-[rgba(46,139,110,0.07)]' : 'border-linea bg-card hover:border-linea-3'
      }`}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden border border-linea">
          {extra.fotoUrl ? (
            <Imagen src={extra.fotoUrl} alt={extra.nombre} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-card-2">
              <Motif className="h-6 w-6 text-oro" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-[19px] text-tinta">{extra.nombre}</h3>
          <p className="mt-0.5 text-[13.5px] text-tinta-2">{extra.descripcion}</p>
          <p className="numeral mt-1.5 text-[15px] text-oro-texto">{fmtCOP(extra.precio)}</p>
        </div>
      </div>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center border ${
          activo ? 'border-oro bg-oro text-white' : 'border-linea-3'
        }`}
        aria-hidden="true"
      >
        {activo ? '✓' : ''}
      </span>
    </button>
  );
}

function tramoLabel(t: string): string {
  return t === 'friday' ? 'viernes' : t === 'weekend' ? 'fin de semana' : 'entre semana';
}

function puedeAvanzar(
  paso: Paso,
  ctx: { venue: VenueUI | null; glamping: GlampingUI | null; noches: number },
): boolean {
  if (paso === 1) return !!ctx.venue;
  if (paso === 2) return !!ctx.glamping;
  if (paso === 3) return ctx.noches > 0;
  return true;
}