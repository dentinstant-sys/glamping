/**
 * Indicador de progreso del wizard (5 pasos).
 */
const PASOS = ['Sede', 'Domo', 'Fechas', 'Experiencias', 'Confirmar'];

export default function Stepper({ paso }: { paso: number }) {
  const pct = (paso / PASOS.length) * 100;
  return (
    <div className="border-b border-linea">
      <ol className="mx-auto flex max-w-[1140px] gap-1.5 overflow-x-auto px-6 py-[18px]" aria-label="Progreso de la reserva">
        {PASOS.map((label, i) => {
          const n = i + 1;
          const activo = n === paso;
          const hecho = n < paso;
          return (
            <li
              key={label}
              aria-current={activo ? 'step' : undefined}
              className={`dato flex items-center gap-2 whitespace-nowrap px-2 py-1.5 ${
                activo ? 'text-oro-texto' : hecho ? 'text-tinta-2' : 'text-tinta-3'
              }`}
            >
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center border text-[11px] ${
                  activo
                    ? 'border-oro bg-oro text-white'
                    : hecho
                      ? 'border-oro text-oro'
                      : 'border-linea-3'
                }`}
              >
                {hecho ? '✓' : n}
              </span>
              {label}
            </li>
          );
        })}
      </ol>
      <div className="h-[3px] bg-linea">
        <div
          className="h-full bg-gradient-to-r from-oro to-oro-texto transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}