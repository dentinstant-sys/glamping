/**
 * Panel lateral "Tu reserva" del wizard.
 */
import type { ReactNode } from 'react';
import { fmtCOP, noches as fmtNoches } from '../../lib/format';
import type { NocheCalculada } from '../../lib/tarifa';
import { useAsync } from '../../lib/useAsync';
import { fetchContactoPublico } from '../../lib/contacto';

interface Props {
  huespedes: number;
  noches: number;
  desglose: NocheCalculada[];
  alojamiento: number;
  extras: number;
  total: number;
  children?: ReactNode;
}

export default function ResumenReserva({
  huespedes,
  noches,
  alojamiento,
  extras,
  total,
  children,
}: Props) {
  const pub = useAsync(fetchContactoPublico, []);
  const pct = pub.data?.porcentajeSena ?? null;
  const sena =
    pct != null && total > 0 ? Math.round((alojamiento * pct) / 100) + extras : null;
  const saldo = sena != null ? total - sena : 0;
  const mostrarSena = sena != null && saldo > 0;

  return (
    <aside className="border border-linea bg-card p-6 shadow-sh-2 lg:sticky lg:top-[calc(var(--h-subnav)+24px)]">
      <h2 className="dato dato-oro">Tu reserva</h2>

      <dl className="mt-5 space-y-1.5 text-sm text-tinta-2">
        <Linea label="Huéspedes" valor={String(huespedes)} />
        {noches > 0 && <Linea label="Noches" valor={fmtNoches(noches)} />}
        {alojamiento > 0 && <Linea label="Alojamiento" valor={fmtCOP(alojamiento)} />}
        {extras > 0 && <Linea label="Experiencias" valor={fmtCOP(extras)} />}
      </dl>

      <div className="regla mt-5 flex items-baseline justify-between gap-3 pt-5">
        <span className="dato">Total estimado</span>
        <span className="numeral text-[24px] text-oro-texto">
          {total > 0 ? fmtCOP(total) : '—'}
        </span>
      </div>

      {sena != null && saldo > 0 && (
        <div className="mt-5 border border-linea-2 bg-[rgba(46,139,110,0.07)] p-4">
          <div className="flex items-baseline justify-between gap-3 py-0.5">
            <span className="text-[13px] font-medium text-tinta">Pagas ahora para reservar</span>
            <span className="numeral text-[17px] text-oro-texto">{fmtCOP(sena)}</span>
          </div>
          <div className="flex items-baseline justify-between gap-3 py-0.5">
            <span className="text-[13px] text-tinta-2">Saldo al llegar</span>
            <span className="numeral text-[14px] text-tinta-2">{fmtCOP(saldo)}</span>
          </div>
        </div>
      )}

      {children}

      <p className="mt-4 text-[11.5px] leading-relaxed text-tinta-3">
        {mostrarSena
          ? 'Pago en línea seguro. Abonas la seña ahora y el saldo al llegar.'
          : 'Pago seguro · confirmación inmediata. El total final se confirma al reservar.'}
      </p>
    </aside>
  );
}

function Linea({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between py-1">
      <dt>{label}</dt>
      <dd className="text-tinta">{valor}</dd>
    </div>
  );
}