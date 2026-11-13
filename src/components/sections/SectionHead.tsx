/**
 * Encabezado de sección centrado (eyebrow + título + descripción).
 */
export default function SectionHead({
  eyebrow,
  titulo,
  texto,
}: {
  eyebrow: string;
  titulo: string;
  texto?: string;
}) {
  return (
    <div className="mx-auto mb-16 max-w-[40ch] text-center">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="font-display text-[clamp(27px,4.2vw,44px)] text-tinta">{titulo}</h2>
      {texto && <p className="mx-auto mt-4 max-w-[48ch] text-tinta-2">{texto}</p>}
    </div>
  );
}