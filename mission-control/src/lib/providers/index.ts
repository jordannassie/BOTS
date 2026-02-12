// LLM Provider factory

import { LLMProvider } from '../types';
import { BaseLLMProvider } from './base';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import { OllamaProvider } from './ollama';
import { getConfig } from '../config';

const providers: Record<LLMProvider, BaseLLMProvider> = {
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  ollama: new OllamaProvider(),
};

export function getProvider(provider?: LLMProvider): BaseLLMProvider {
  const config = getConfig();
  const selectedProvider = provider || config.defaultProvider;
  
  const llmProvider = providers[selectedProvider];
  
  if (!llmProvider) {
    throw new Error(`Unknown LLM provider: ${selectedProvider}`);
  }
  
  if (!llmProvider.isConfigured()) {
    throw new Error(`LLM provider ${selectedProvider} is not configured. Check your environment variables.`);
  }
  
  return llmProvider;
}

export function getAvailableProviders(): LLMProvider[] {
  return (Object.keys(providers) as LLMProvider[]).filter(
    key => providers[key].isConfigured()
  );
}

export { BaseLLMProvider } from './base';
export { OpenAIProvider } from './openai';
export { AnthropicProvider } from './anthropic';
export { OllamaProvider } from './ollama';
