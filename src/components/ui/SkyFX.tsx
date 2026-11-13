/**
 * Cielo estrellado detrás del contenido.
 */
import { useEffect, useRef } from 'react';

const PALETA = [
  '#FFFFFF',
  '#EAF0F7',
  '#D6E2F0',
  '#FFFFFF',
  '#8CE0C3', // verde menta claro: ata el cielo a la marca Alma Verde
];

export default function SkyFX() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function build(): boolean {
      const w = window.innerWidth || document.documentElement.clientWidth || 0;
      const h = window.innerHeight || document.documentElement.clientHeight || 0;
      if (w < 2 || h < 2) return false;

      const n = Math.max(28, Math.round((w * h) / 9000));
      let out = '';

      for (let i = 0; i < n; i++) {
        const big = Math.random() < 0.08;
        const s = big ? Math.random() * 1.8 + 1.6 : Math.random() * 1.1 + 0.7;
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const op = ((big ? 0.62 : 0.28) + Math.random() * 0.28).toFixed(2);
        const c = PALETA[(Math.random() * PALETA.length) | 0];
        let st =
          `position:absolute;left:${x}%;top:${y}%;width:${s.toFixed(2)}px;` +
          `height:${s.toFixed(2)}px;border-radius:50%;background:${c};opacity:${op}`;
        if (big) st += `;box-shadow:0 0 ${(s * 2.4).toFixed(1)}px ${(s * 0.5).toFixed(1)}px ${c}`;
        if (!reduce && Math.random() < 0.1)
          st += `;animation:twf ${(Math.random() * 3.5 + 2.8).toFixed(2)}s ease-in-out ${(
            Math.random() * 5
          ).toFixed(2)}s infinite`;
        out += `<span style="${st}"></span>`;
      }

      for (let j = 0; j < 2; j++) {
        const ax = (10 + Math.random() * 80).toFixed(1);
        const ay = (8 + Math.random() * 84).toFixed(1);
        const az = (10 + Math.random() * 8).toFixed(1);
        const anim = reduce
          ? ''
          : `;animation:twf ${(3 + Math.random() * 2).toFixed(2)}s ease-in-out ${(
              Math.random() * 3
            ).toFixed(2)}s infinite`;
        out +=
          `<span style="position:absolute;left:${ax}%;top:${ay}%;width:${az}px;height:${az}px;` +
          `transform:translate(-50%,-50%);opacity:.85;filter:drop-shadow(0 0 6px rgba(140,224,195,.55))${anim}">` +
          `<svg viewBox="0 0 24 24" width="${az}" height="${az}">` +
          `<path d="M12 0c.6 7 4.4 11 12 12-7.6 1-11.4 5-12 12-.6-7-4.4-11-12-12 7.6-1 11.4-5 12-12z" fill="#8CE0C3"/>` +
          `</svg></span>`;
      }

      el!.innerHTML = out;
      return true;
    }

    let intentos = 0;
    let raf = 0;
    const intentar = () => {
      if (build() || intentos++ > 30) return;
      raf = requestAnimationFrame(intentar);
    };
    intentar();

    let t: number;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 250);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="skyfx" aria-hidden="true" />;
}