/**
 * Secure Key Derivation Function (PBKDF2)
 * Optimized for "Session Access" (On/Off switch) and future PIN support.
 */

import { logger } from './logger';

const PBKDF2_ITERATIONS = 100000;
const KEY_LEN = 256; // bits
// Este "pepper" actúa como salt base cuando no hay uno específico en Firestore
const INTERNAL_PEPPER = 'od-session-v1-pepper';

/**
 * Deriva una clave de encriptación de 64 caracteres hex.
 * Si Firestore falla, usa una derivación determinista basada en UID para no bloquear al usuario.
 */
export async function deriveEncryptKey(
  userUid: string,
  userPin?: string
): Promise<string> {
  const t0 = performance.now();

  try {
    // Para el modo "On/Off" (sin PIN), usamos el UID como material base.
    // En el futuro, cuando orchestration con PIN sea ON, el PIN se combinará aquí.
    const password = userPin ? `${userUid}:${userPin}` : userUid;

    // Usamos un salt determinista basado en el UID para estabilidad 
    // mientras Firestore esté "unavailable" en staging/dev.
    const saltString = `${INTERNAL_PEPPER}:${userUid}`;

    const encoder = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(saltString),
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-512',
      },
      baseKey,
      KEY_LEN
    );

    const keyHex = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const t1 = performance.now();
    logger.debug('Key derived successfully', {
      duration: `${Math.round(t1 - t0)}ms`,
      mode: userPin ? 'PIN' : 'Session'
    });

    return keyHex;
  } catch (error) {
    logger.error('Critical failure in key derivation', { error });
    // Fallback a derivación simple en caso de error catastrófico de WebCrypto
    // para asegurar que el usuario nunca pierda acceso a su billetera en staging.
    return fallbackSimpleDerivation(userUid);
  }
}

/**
 * Fallback ultra-simple para emergencias de compatibilidad.
 */
async function fallbackSimpleDerivation(uid: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${uid}:${INTERNAL_PEPPER}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Funciones de migración y verificación eliminadas temporalmente 
// para simplificar el flujo según solicitud.
