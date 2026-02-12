// Base LLM Provider interface

import { LLMCompletionOptions, LLMCompletionResult } from '../types';

export abstract class BaseLLMProvider {
  abstract name: string;
  
  abstract complete(options: LLMCompletionOptions): Promise<LLMCompletionResult>;
  
  abstract isConfigured(): boolean;
  
  protected validateMessages(options: LLMCompletionOptions): void {
    if (!options.messages || options.messages.length === 0) {
      throw new Error('Messages array cannot be empty');
    }
  }
}
