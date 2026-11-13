import { useMemo } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import { useAsync } from '../../lib/useAsync';
import { fetchFechasOcupadas } from '../../lib/reservas';

function aFecha(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function aYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function CalendarioFechas({
  venueId, glampingId, checkIn, checkOut, onChange,
}: {
  venueId: string; glampingId: string; checkIn: string; checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
}) {
  const ocupadasAsync = useAsync(
    () => fetchFechasOcupadas(venueId, glampingId), [venueId, glampingId],
  );

  const deshabilitadas = useMemo(() => {
    const dias = (ocupadasAsync.data ?? []).map(aFecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return [{ before: hoy }, ...dias];
  }, [ocupadasAsync.data]);

  const selected: DateRange | undefined = checkIn
    ? { from: aFecha(checkIn), to: checkOut ? aFecha(checkOut) : undefined }
    : undefined;

  function handleSelect(range: DateRange | undefined) {
    if (!range?.from) { onChange('', ''); return; }
    const from = aYmd(range.from);
    const to = range.to && range.to.getTime() !== range.from.getTime() ? aYmd(range.to) : '';
    onChange(from, to);
  }

  return (
    <div>
      {ocupadasAsync.loading && (
        <p className="mb-3 text-sm text-tinta-2">Cargando disponibilidad…</p>
      )}
      {ocupadasAsync.error && (
        <p className="mb-3 text-sm text-tinta-2">
          No pudimos cargar la disponibilidad; puedes elegir fechas y las validamos al confirmar.
        </p>
      )}
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        disabled={deshabilitadas}
        excludeDisabled
        locale={es}
        numberOfMonths={1}
        weekStartsOn={1}
      />
      <p className="mt-2 text-xs text-tinta-2">Los días en gris no están disponibles.</p>
    </div>
  );
}