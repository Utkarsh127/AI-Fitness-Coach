/**
 * @module services/aiCoach.service
 * @description Higher-level AI coach logic combining context, prompt building, and the base AI service.
 */

import * as aiService from './ai.service.js';
import * as aiContextService from './aiContext.service.js';

const COACH_PERSONA = `
You are an expert, knowledgeable, and encouraging AI Fitness Coach. 
Your specialties include strength training, calisthenics, hybrid training, bodyweight training, progressive overload, and skill development (like handstands, muscle-ups, front levers, etc.).

Guidelines:
1. Provide practical, highly personalized answers using the user's data provided below.
2. Prefer progressive, realistic recommendations.
3. Keep responses reasonably brief, avoiding unnecessary verbosity. Format nicely with markdown (bullet points, bold text).
4. If asked to diagnose pain or medical issues, clarify you are not a doctor and recommend professional medical evaluation. Avoid dangerous weight-loss advice.
5. If the user asks for something outside of fitness/nutrition/wellness, politely steer the conversation back to fitness.
6. Acknowledge their recent workouts or PRs if it naturally fits the conversation.

Here is the user's current fitness context:
`;

/**
 * Generates a response for a conversation, including context and history.
 * @param {string} userId - The user's ID.
 * @param {Array} conversationHistory - Array of previous messages { role, content }.
 * @param {string} newMessage - The latest user message.
 * @returns {Promise<string>} The AI's response text.
 */
export const getCoachResponse = async (userId, conversationHistory, newMessage) => {
  // 1. Build the dynamic context
  const userContext = await aiContextService.buildUserContext(userId);

  // 2. Combine persona and context into the system instruction
  const systemInstruction = COACH_PERSONA + userContext;

  // 3. Format the conversation history for Gemini.
  // Gemini expects a single prompt or an array of parts. Since we have a simple generateText method,
  // we will construct a single formatted text prompt containing the history.
  // We limit to the last 15 messages to save quota.
  
  const recentHistory = conversationHistory.slice(-15);
  
  let fullPrompt = '';
  if (recentHistory.length > 0) {
    fullPrompt += '### CONVERSATION HISTORY ###\n';
    recentHistory.forEach(msg => {
      const speaker = msg.role === 'assistant' ? 'Coach' : 'User';
      fullPrompt += `${speaker}: ${msg.content}\n\n`;
    });
    fullPrompt += '### END HISTORY ###\n\n';
  }
  
  fullPrompt += `User: ${newMessage}\nCoach:`;

  // 4. Call the base AI service
  const responseText = await aiService.generateText({
    prompt: fullPrompt,
    systemInstruction,
  });

  return responseText;
};
