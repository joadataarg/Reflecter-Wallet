/**
 * Gemini Service (Client-side)
 * Consumes the server-side API route to protect API keys
 */

import { logger } from '../utils/logger';
import { createSDKError, ErrorCode, getErrorMessage } from '../utils/errors';

export const getWeb3Explanation = async (topic: string): Promise<string> => {
  try {
    logger.debug('Fetching AI explanation', { topic });

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw createSDKError(ErrorCode.NETWORK_ERROR, {
        status: response.status,
        detail: errorData.error
      });
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    const message = getErrorMessage(error);
    logger.error('Gemini Service failure', { error: message, topic });
    return "No se pudo obtener la explicación en este momento. Por favor, intenta más tarde.";
  }
};
