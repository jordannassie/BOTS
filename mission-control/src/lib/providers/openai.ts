// OpenAI LLM Provider

import OpenAI from 'openai';
import { BaseLLMProvider } from './base';
import { LLMCompletionOptions, LLMCompletionResult } from '../types';
import { getConfig } from '../config';

export class OpenAIProvider extends BaseLLMProvider {
  name = 'openai';
  private client: OpenAI | null = null;
  
  private getClient(): OpenAI {
    if (!this.client) {
      const config = getConfig();
      this.client = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }
    return this.client;
  }
  
  isConfigured(): boolean {
    const config = getConfig();
    return Boolean(config.openai.apiKey);
  }
  
  async complete(options: LLMCompletionOptions): Promise<LLMCompletionResult> {
    this.validateMessages(options);
    
    const config = getConfig();
    const client = this.getClient();
    
    const response = await client.chat.completions.create({
      model: options.model || config.openai.model,
      messages: options.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    });
    
    const choice = response.choices[0];
    
    return {
      content: choice.message.content || '',
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
    };
  }
}
