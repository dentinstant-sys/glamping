/**
 * Motivo de marca: luna creciente + estrella.
 * Tomado del hero del bundle (viewBox 64×64). Hereda el color vía currentColor.
 */
export default function Motif({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <path d="M41 7a23 23 0 1 0 17 39A19 19 0 0 1 41 7z" />
      <path d="M51 8l1.7 4.6L57 14l-4.3 1.4L51 20l-1.7-4.6L45 14l4.3-1.4z" />
    </svg>
  );
}
