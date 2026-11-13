/**
 * Item de FAQ desplegable (details/summary, accesible por teclado).
 */
export default function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group regla">
      <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-6 py-4 marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="text-[16.5px] font-medium leading-snug text-tinta transition-colors group-open:text-oro-texto">
          {q}
        </span>
        <span
          className="relative h-3 w-3 shrink-0 text-oro transition-transform duration-300 group-open:rotate-45"
          aria-hidden="true"
        >
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
        </span>
      </summary>
      <p className="max-w-[68ch] pb-5 text-[15px] leading-relaxed text-tinta-2">{a}</p>
    </details>
  );
}