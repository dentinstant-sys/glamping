/**
 * Hook genérico de carga asíncrona con estados idle/loading/error/data.
 * Sirve para las lecturas de catálogo (loading → skeleton, error → recuperación).
 */
import { useEffect, useState, useCallback } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(() => {
    let activo = true;
    setLoading(true);
    setError(null);
    fn()
      .then((res) => {
        if (activo) setData(res);
      })
      .catch((e) => {
        if (activo) setError(e?.message ?? 'Ocurrió un error al cargar la información.');
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const [nonce, setNonce] = useState(0);
  useEffect(run, [run, nonce]);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, reload };
}
