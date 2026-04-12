import OpenAI from 'openai';

let _client: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI => {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY no está configurada.');
    _client = new OpenAI({ apiKey });
  }
  return _client;
};
