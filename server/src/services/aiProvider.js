const PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

let service;
switch (PROVIDER) {
  case 'groq':
    console.log('🤖 AI Provider: Groq (Llama 3.3 70B)');
    service = require('./groqService');
    break;
  case 'gemini':
  default:
    console.log('🤖 AI Provider: Google Gemini');
    service = require('./geminiService');
    break;
}

module.exports = service;
