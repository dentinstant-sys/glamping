/**
 * Hero de la landing.
 */
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VenueUI } from '../../lib/catalogo';
import { foto } from '../../lib/fotos';

export default function Hero({ venues }: { venues: VenueUI[] }) {
  const navigate = useNavigate();
  const [sede, setSede] = useState('');
  const [llegada, setLlegada] = useState('');
  const [salida, setSalida] = useState('');
  const [huespedes, setHuespedes] = useState('2');

  const hoy = new Date().toISOString().slice(0, 10);

  function buscar(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (sede) params.set('sede', sede);
    if (llegada) params.set('checkIn', llegada);
    if (salida) params.set('checkOut', salida);
    if (huespedes) params.set('huespedes', huespedes);
    navigate(`/reservar?${params.toString()}`);
  }

  return (
    <>
      <section className="relative flex min-h-[62svh] items-end overflow-hidden sm:min-h-[70svh]">
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={foto('domo-noche.jpg')}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="hero-slide hero-slide-1"
          />
          <div
            className="hero-slide hero-slide-2"
            style={{ backgroundImage: `url(${foto('atardecer.jpg')})` }}
          />
          <div
            className="hero-slide hero-slide-3"
            style={{ backgroundImage: `url(${foto('bosque.jpg')})` }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,28,24,0.5)_0%,rgba(20,28,24,0.15)_45%,rgba(20,28,24,0.75)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-16 pt-32 sm:px-8 sm:pb-24">
          <div className="flex items-center gap-3">
            <span className="text-[13px] tracking-[0.18em] text-[#8ce0c3]" aria-hidden="true">
              ★★★★★
            </span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/85">
              4.9 · Calificación de huéspedes
            </span>
          </div>

          <h1 className="mt-4 max-w-[16ch] text-[clamp(38px,7vw,80px)] text-white">
            Alma Verde
          </h1>
          <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-white/85 sm:text-[17px]">
            Domos de lujo con jacuzzi privado en cinco sedes de Colombia. Confirmación inmediata y
            pago seguro.
          </p>
        </div>
      </section>

      {/* Cuadro de reserva: monta sobre la foto en escritorio. */}
      <div className="relative z-20 mx-auto -mt-10 w-full max-w-[1280px] px-4 sm:-mt-14 sm:px-8">
        <form
          onSubmit={buscar}
          className="grid gap-px overflow-hidden rounded-[var(--radius-suave)] border border-linea bg-linea shadow-sh-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr_auto]"
          aria-label="Buscar disponibilidad"
        >
          <Campo label="Sede" htmlFor="h-sede">
            <select
              id="h-sede"
              value={sede}
              onChange={(e) => setSede(e.target.value)}
              className="w-full bg-transparent text-[16px] text-tinta focus:outline-none"
            >
              <option value="">Todas las sedes</option>
              {venues.map((v) => (
                <option key={v.id} value={v.slug}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Llegada" htmlFor="h-in">
            <input
              id="h-in"
              type="date"
              min={hoy}
              value={llegada}
              onChange={(e) => setLlegada(e.target.value)}
              className="w-full bg-transparent text-[16px] text-tinta focus:outline-none"
            />
          </Campo>

          <Campo label="Salida" htmlFor="h-out">
            <input
              id="h-out"
              type="date"
              min={llegada || hoy}
              value={salida}
              onChange={(e) => setSalida(e.target.value)}
              className="w-full bg-transparent text-[16px] text-tinta focus:outline-none"
            />
          </Campo>

          <Campo label="Huéspedes" htmlFor="h-pax">
            <select
              id="h-pax"
              value={huespedes}
              onChange={(e) => setHuespedes(e.target.value)}
              className="w-full bg-transparent text-[16px] text-tinta focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'huésped' : 'huéspedes'}
                </option>
              ))}
            </select>
          </Campo>

          <button
            type="submit"
            className="flex min-h-[68px] items-center justify-center bg-oro px-10 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-oro-texto sm:col-span-2 lg:col-span-1"
          >
            Ver disponibilidad
          </button>
        </form>
      </div>
    </>
  );
}

function Campo({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex min-h-[68px] cursor-pointer flex-col justify-center bg-card px-5 py-2.5"
    >
      <span className="dato dato-oro mb-1 text-[9.5px]">{label}</span>
      {children}
    </label>
  );
}