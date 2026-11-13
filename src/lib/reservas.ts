/**
 * Llamadas a las Cloud Functions de reserva/pago.
 * El total y la disponibilidad los decide el backend (crearBooking).
 */
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export interface CrearBookingInput {
  venueId: string;
  glampingId: string;
  checkIn: string;
  checkOut: string;
  cliente: { nombre: string; email: string; telefono: string };
  huespedes: number;
  extras?: { extraId: string; cantidad: number }[];
  /** Camino de cierre. Default 'bold'. Define la ventana de la pre-reserva. */
  metodoPago?: 'bold' | 'mercadopago' | 'whatsapp';
}

export interface CrearBookingResult {
  bookingId: string;
  numero: string;
  noches: number;
  total: number;
  desglose: { fecha: string; tramo: string; precio: number }[];
}

export interface BoldHashResult {
  orderId: string;
  amount: number;
  currency: string;
  integritySignature: string;
  apiKey: string;
}

export interface PreferenciaMercadoPagoResult {
  preferenceId: string;
  /** URL de Checkout Pro a la que se redirige al huésped. */
  initPoint: string;
  /** Seña a cobrar (COP), calculada en el servidor. */
  amount: number;
  currency: string;
}

export interface ConsultarBookingResult {
  numero: string;
  estado: string;
  checkIn: string;
  checkOut: string;
  noches: number;
  huespedes: number;
  cliente: { nombre: string };
  total: number;
  pago: { estado: string; monto: number };
  extras: { nombre: string; cantidad: number }[];
}

const _crearBooking = httpsCallable<CrearBookingInput, CrearBookingResult>(
  functions,
  'crearBooking',
);
const _generateBoldHash = httpsCallable<{ bookingId: string }, BoldHashResult>(
  functions,
  'generateBoldHash',
);
const _crearPreferenciaMercadoPago = httpsCallable<
  { bookingId: string },
  PreferenciaMercadoPagoResult
>(functions, 'crearPreferenciaMercadoPago');
const _consultarBooking = httpsCallable<
  { numero: string; email: string },
  ConsultarBookingResult
>(functions, 'consultarBooking');
const _confirmarPorWhatsapp = httpsCallable<{ bookingId: string }, { url: string; numero: string }>(
  functions,
  'confirmarPorWhatsapp',
);
const _fechasOcupadas = httpsCallable<
  { venueId: string; glampingId: string; desde?: string; hasta?: string },
  { ocupadas: string[] }
>(functions, 'fechasOcupadas');

export async function crearBooking(input: CrearBookingInput): Promise<CrearBookingResult> {
  return (await _crearBooking(input)).data;
}

export async function generateBoldHash(bookingId: string): Promise<BoldHashResult> {
  return (await _generateBoldHash({ bookingId })).data;
}

export async function crearPreferenciaMercadoPago(
  bookingId: string,
): Promise<PreferenciaMercadoPagoResult> {
  return (await _crearPreferenciaMercadoPago({ bookingId })).data;
}

export async function consultarBooking(
  numero: string,
  email: string,
): Promise<ConsultarBookingResult> {
  return (await _consultarBooking({ numero, email })).data;
}

export async function confirmarPorWhatsapp(bookingId: string): Promise<{ url: string; numero: string }> {
  return (await _confirmarPorWhatsapp({ bookingId })).data;
}

export async function fetchFechasOcupadas(
  venueId: string,
  glampingId: string,
): Promise<string[]> {
  const { data } = await _fechasOcupadas({ venueId, glampingId });
  return data.ocupadas;
}
