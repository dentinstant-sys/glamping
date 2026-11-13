import type { BoldHashResult } from '../../lib/reservas';

const BOLD_SCRIPT_URL = 'https://checkout.bold.co/library/boldPaymentButton.js';

interface BoldCheckoutConfig {
  orderId: string;
  currency: string;
  amount: string;
  apiKey: string;
  integritySignature: string;
  description: string;
  redirectionUrl: string;
  renderMode?: 'embedded';
  customerData?: string;
}

interface BoldCheckoutInstance {
  open: () => void;
  getConfig: (key: string) => string;
  updateConfig: (key: string, value: string) => void;
}

declare global {
  interface Window {
    BoldCheckout?: new (config: BoldCheckoutConfig) => BoldCheckoutInstance;
  }
}

export function cargarScriptBold(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.BoldCheckout) {
      resolve();
      return;
    }
    const yaInyectado = document.querySelector(`script[src="${BOLD_SCRIPT_URL}"]`);
    const t = setTimeout(() => reject(new Error('Bold no respondió a tiempo.')), 15_000);
    const ok = () => {
      clearTimeout(t);
      resolve();
    };
    const fail = () => {
      clearTimeout(t);
      reject(new Error('No se pudo cargar el botón de pago.'));
    };
    if (yaInyectado) {
      window.addEventListener('boldCheckoutLoaded', ok, { once: true });
      window.addEventListener('boldCheckoutLoadFailed', fail, { once: true });
      return;
    }
    const js = document.createElement('script');
    js.src = BOLD_SCRIPT_URL;
    js.onload = ok;
    js.onerror = fail;
    document.head.appendChild(js);
  });
}

export interface AbrirBoldOptions {
  hash: BoldHashResult;
  descripcion: string;
  redirectUrl: string;
  cliente?: { nombre: string; email: string };
}

export async function abrirCheckoutBold({
  hash,
  descripcion,
  redirectUrl,
  cliente,
}: AbrirBoldOptions): Promise<void> {
  await cargarScriptBold();
  if (!window.BoldCheckout) throw new Error('No se pudo iniciar el pago.');
  const checkout = new window.BoldCheckout({
    orderId: hash.orderId,
    currency: hash.currency,
    amount: String(hash.amount),
    apiKey: hash.apiKey,
    integritySignature: hash.integritySignature,
    description: descripcion,
    redirectionUrl: redirectUrl,
    renderMode: 'embedded',
    ...(cliente
      ? { customerData: JSON.stringify({ fullName: cliente.nombre, email: cliente.email }) }
      : {}),
  });
  checkout.open();
}