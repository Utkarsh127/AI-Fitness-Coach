/**
 * @module providers/gemini.provider
 * @description Google Gemini API provider integration.
 */

import { GoogleGenAI } from '@google/genai';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';

let aiClient = null;

/**
 * Get or initialize the Gemini client.
 */
const getClient = () => {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
      logger.error('Gemini API key is missing or invalid in configuration.');
      throw new ApiError(503, 'AI service is not configured (AI_NOT_CONFIGURED)');
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
};

/**
 * Generate text using Google Gemini.
 * @param {string} prompt - The user's prompt.
 * @param {string} [systemInstruction] - Optional system instruction to guide the AI.
 */
export const generate = async (prompt, systemInstruction = '', options = {}) => {
  const client = getClient();
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';

  try {
    const config = { ...options };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    // Call the model
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    if (!response.text) {
      throw new Error('Empty response from model');
    }

    return response.text;
  } catch (error) {
    // Normalize provider errors
    logger.error(`Gemini Provider Error: ${error.message}`);
    
    if (error.status === 429) {
      throw new ApiError(429, 'AI service rate limited (AI_RATE_LIMITED)');
    } else if (error.status === 404 || error.message.includes('not found')) {
      throw new ApiError(503, 'AI model unavailable (AI_MODEL_UNAVAILABLE)');
    } else if (error.status === 401 || error.status === 403) {
      throw new ApiError(503, 'AI configuration error (AI_INVALID_API_KEY)');
    } else if (error.message.includes('timeout')) {
      throw new ApiError(504, 'AI service timeout (AI_TIMEOUT)');
    }
    
    throw new ApiError(502, 'AI provider error (AI_PROVIDER_ERROR)');
  }
};
