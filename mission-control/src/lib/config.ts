// Configuration management

import { LLMProvider } from './types';

export interface AppConfig {
  defaultProvider: LLMProvider;
  openai: {
    apiKey: string;
    model: string;
  };
  anthropic: {
    apiKey: string;
    model: string;
  };
  ollama: {
    baseUrl: string;
    model: string;
  };
}

export function getConfig(): AppConfig {
  return {
    defaultProvider: (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || 'openai',
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4o',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    },
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama3',
    },
  };
}

export function validateConfig(config: AppConfig): string[] {
  const errors: string[] = [];
  
  if (config.defaultProvider === 'openai' && !config.openai.apiKey) {
    errors.push('OPENAI_API_KEY is required when using OpenAI as default provider');
  }
  
  if (config.defaultProvider === 'anthropic' && !config.anthropic.apiKey) {
    errors.push('ANTHROPIC_API_KEY is required when using Anthropic as default provider');
  }
  
  return errors;
}
