/**
 * @module services/ai.service
 * @description Centralized AI service handling business logic and abstracting the provider.
 */

import * as geminiProvider from '../providers/gemini.provider.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';

/**
 * Generate text response using the AI Provider.
 * @param {Object} params
 * @param {string} params.prompt - The user's input message.
 * @param {string} [params.systemInstruction] - System prompt.
 * @returns {Promise<string>} The generated text.
 */
export const generateText = async ({ prompt, systemInstruction = '' }) => {
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    throw new ApiError(400, 'Prompt cannot be empty');
  }

  // The prompt here may include conversation history and large context.
  // The actual user message is already validated in the route (e.g. max 1000 chars).
  // This limit protects against massive constructed payloads.
  if (prompt.length > 100000) {
    throw new ApiError(400, 'Constructed prompt exceeds maximum allowed length');
  }

  const startTime = Date.now();
  logger.info(`AI request started. Prompt length: ${prompt.length}`);

  try {
    const result = await geminiProvider.generate(prompt, systemInstruction);
    
    const duration = Date.now() - startTime;
    logger.info(`AI request completed in ${duration}ms`);
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`AI request failed after ${duration}ms`);
    throw error;
  }
};

/**
 * Generate JSON response using the AI Provider.
 * @param {Object} params
 * @param {string} params.prompt - The user's input message.
 * @param {string} [params.systemInstruction] - System prompt describing the JSON schema.
 * @returns {Promise<Object>} The parsed JSON object.
 */
export const generateJson = async ({ prompt, systemInstruction = '' }) => {
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    throw new ApiError(400, 'Prompt cannot be empty');
  }

  const startTime = Date.now();
  logger.info(`AI JSON request started. Prompt length: ${prompt.length}`);

  try {
    const result = await geminiProvider.generate(prompt, systemInstruction, {
      responseMimeType: 'application/json',
    });
    
    const duration = Date.now() - startTime;
    logger.info(`AI JSON request completed in ${duration}ms`);
    
    return JSON.parse(result);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`AI JSON request failed after ${duration}ms: ${error.message}`);
    throw new ApiError(500, 'Failed to generate valid structured data from AI');
  }
};
