/**
 * Consulta de reserva (/mi-reserva).
 * El huésped ingresa número + email y ve el estado de su reserva.
 */
import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { EstadoError } from '../components/ui/Estados';
import { consultarBooking, type ConsultarBookingResult } from '../lib/reservas';
import { fmtCOP, fmtFecha, noches as fmtNoches } from '../lib/format';

const ESTADO_LABEL: Record<string, string> = {
  pendiente: 'Pendiente de pago',
  confirmada: 'Confirmada',
  'en-curso': 'En curso',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
  'no-show': 'No llegó',
};

const ESTADO_TONO: Record<string, string> = {
  pendiente: 'border-warn/45 text-warn',
  confirmada: 'border-ok/45 text-ok',
  'en-curso': 'border-info/45 text-info',
  finalizada: 'border-linea-3 text-tinta-2',
  cancelada: 'border-bad/45 text-bad',
  'no-show': 'border-bad/45 text-bad',
};

export default function MiReserva() {
  const [sp] = useSearchParams();
  const [numero, setNumero] = useState(sp.get('numero') ?? '');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [reserva, setReserva] = useState<ConsultarBookingResult | null>(null);

  async function buscar(e: FormEvent) {
    e.preventDefault();
    setEstado('cargando');
    setErrorMsg('');
    try {
      const r = await consultarBooking(numero.trim(), email.trim());
      setReserva(r);
      setEstado('ok');
    } catch (err) {
      setErrorMsg((err as { message?: string }).message ?? 'No encontramos esa reserva.');
      setEstado('error');
    }
  }

  return (
    <Layout>
      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 pt-36 pb-[var(--spacing-blk)] sm:px-8 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="dato dato-oro">Tu reserva</p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(32px,5vw,56px)] text-tinta">
            Consulta tu reserva
          </h1>
          <p className="mt-6 max-w-[40ch] text-tinta-2">
            Ingresa el número de tu reserva y el correo con el que la hiciste.
          </p>

          <form onSubmit={buscar} className="mt-9 flex flex-col gap-5" noValidate>
            <Campo
              etiqueta="Número de reserva"
              id="numero"
              value={numero}
              onChange={setNumero}
              placeholder="ROY-00001"
              autoComplete="off"
            />
            <Campo
              etiqueta="Correo"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="tucorreo@email.com"
              autoComplete="email"
            />
            <Button variant="solid" type="submit" disabled={estado === 'cargando'} className="mt-2">
              {estado === 'cargando' ? 'Buscando…' : 'Buscar reserva'}
            </Button>
          </form>
        </div>

        <div>
          {estado === 'error' && <EstadoError titulo="No encontramos tu reserva" mensaje={errorMsg} />}

          {estado === 'ok' && reserva && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="numeral text-[clamp(28px,4vw,40px)]">{reserva.numero}</p>
                <span
                  className={`rounded-[var(--radius-control)] border px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] ${
                    ESTADO_TONO[reserva.estado] ?? 'border-linea-3 text-tinta-2'
                  }`}
                >
                  {ESTADO_LABEL[reserva.estado] ?? reserva.estado}
                </span>
              </div>

              <dl className="mt-9">
                <Fila k="Huésped" v={reserva.cliente.nombre} />
                <Fila k="Llegada" v={fmtFecha(reserva.checkIn)} />
                <Fila k="Salida" v={fmtFecha(reserva.checkOut)} />
                <Fila k="Estadía" v={fmtNoches(reserva.noches)} />
                <Fila k="Huéspedes" v={String(reserva.huespedes)} numerica />
                {reserva.extras.length > 0 && (
                  <Fila k="Experiencias" v={reserva.extras.map((e) => e.nombre).join(', ')} />
                )}
                <Fila k="Total" v={fmtCOP(reserva.total)} numerica />
                <Fila
                  k="Pago"
                  v={`${reserva.pago.estado}${
                    reserva.pago.monto ? ` · ${fmtCOP(reserva.pago.monto)}` : ''
                  }`}
                />
              </dl>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Campo({
  etiqueta,
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
}: {
  etiqueta: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="dato dato-oro mb-2 block">
        {etiqueta}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="min-h-[52px] w-full rounded-[var(--radius-control)] border border-linea bg-card px-4 text-[16px] text-tinta transition-colors placeholder:text-tinta-3 focus:border-oro focus:outline-none"
      />
    </div>
  );
}

function Fila({ k, v, numerica = false }: { k: string; v: string; numerica?: boolean }) {
  return (
    <div className="regla flex items-baseline justify-between gap-6 py-4">
      <dt className="dato shrink-0">{k}</dt>
      <dd className={`text-right ${numerica ? 'numeral text-[16px] text-tinta' : 'text-[15px] text-tinta'}`}>
        {v}
      </dd>
    </div>
  );
}