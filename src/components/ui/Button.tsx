/**
 * Botón de marca.
 *
 * Sin píldora y sin "lift" en hover: eran dos de los rasgos que hacían ver el
 * sitio como plantilla, y el desplazamiento vertical mueve el layout. El radio
 * es el suave de control (8px) — ni filo puro ni píldora —,
 * la etiqueta va en mono y el hover cambia color, no posición.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost';
  children: ReactNode;
}

const base =
  'inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2.5 rounded-[var(--radius-control)] border px-9 font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40';

const variants = {
  solid:
    'border-oro bg-oro text-white hover:not-disabled:border-oro-texto hover:not-disabled:bg-oro-texto',
  ghost:
    'border-linea-2 bg-transparent text-tinta hover:not-disabled:border-oro hover:not-disabled:text-oro-texto',
};

export default function Button({ variant = 'solid', children, className = '', ...rest }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
