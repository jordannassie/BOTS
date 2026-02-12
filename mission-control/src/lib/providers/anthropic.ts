// Anthropic (Claude) LLM Provider

import Anthropic from '@anthropic-ai/sdk';
import { BaseLLMProvider } from './base';
import { LLMCompletionOptions, LLMCompletionResult, LLMMessage } from '../types';
import { getConfig } from '../config';

export class AnthropicProvider extends BaseLLMProvider {
  name = 'anthropic';
  private client: Anthropic | null = null;
  
  private getClient(): Anthropic {
    if (!this.client) {
      const config = getConfig();
      this.client = new Anthropic({
        apiKey: config.anthropic.apiKey,
      });
    }
    return this.client;
  }
  
  isConfigured(): boolean {
    const config = getConfig();
    return Boolean(config.anthropic.apiKey);
  }
  
  async complete(options: LLMCompletionOptions): Promise<LLMCompletionResult> {
    this.validateMessages(options);
    
    const config = getConfig();
    const client = this.getClient();
    
    // Separate system message from conversation messages
    const systemMessage = options.messages.find(m => m.role === 'system');
    const conversationMessages = options.messages.filter(m => m.role !== 'system');
    
    // Anthropic requires alternating user/assistant messages
    const formattedMessages: Array<{ role: 'user' | 'assistant'; content: string }> = 
      conversationMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
    
    const response = await client.messages.create({
      model: options.model || config.anthropic.model,
      max_tokens: options.maxTokens ?? 2048,
      system: systemMessage?.content,
      messages: formattedMessages,
    });
    
    const textContent = response.content.find(c => c.type === 'text');
    
    return {
      content: textContent?.type === 'text' ? textContent.text : '',
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }
}
