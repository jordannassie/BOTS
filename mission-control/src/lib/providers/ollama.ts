// Ollama LLM Provider (for local models)

import { BaseLLMProvider } from './base';
import { LLMCompletionOptions, LLMCompletionResult } from '../types';
import { getConfig } from '../config';

export class OllamaProvider extends BaseLLMProvider {
  name = 'ollama';
  
  isConfigured(): boolean {
    // Ollama doesn't need API key, just check if baseUrl is set
    const config = getConfig();
    return Boolean(config.ollama.baseUrl);
  }
  
  async complete(options: LLMCompletionOptions): Promise<LLMCompletionResult> {
    this.validateMessages(options);
    
    const config = getConfig();
    
    // Convert messages to Ollama format
    const messages = options.messages.map(m => ({
      role: m.role,
      content: m.content,
    }));
    
    const response = await fetch(`${config.ollama.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || config.ollama.model,
        messages,
        stream: false,
        options: {
          temperature: options.temperature ?? 0.7,
          num_predict: options.maxTokens ?? 2048,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.message?.content || '',
      usage: data.eval_count ? {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      } : undefined,
    };
  }
}
