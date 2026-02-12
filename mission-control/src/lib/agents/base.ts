// Base Agent class - foundation for all agents

import { v4 as uuidv4 } from 'uuid';
import { 
  AgentConfig, 
  AgentState, 
  AgentStatus, 
  LLMMessage,
  Task,
  LLMProvider 
} from '../types';
import { getProvider } from '../providers';

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected state: AgentState;
  protected conversationHistory: LLMMessage[] = [];
  
  constructor(config: Partial<AgentConfig> & Pick<AgentConfig, 'id' | 'name' | 'systemPrompt'>) {
    this.config = {
      id: config.id,
      name: config.name,
      description: config.description || '',
      systemPrompt: config.systemPrompt,
      provider: config.provider || 'openai',
      model: config.model,
      enabled: config.enabled ?? true,
      capabilities: config.capabilities || [],
    };
    
    this.state = {
      id: config.id,
      status: 'idle',
      messagesProcessed: 0,
      errors: 0,
    };
  }
  
  // Get agent configuration
  getConfig(): AgentConfig {
    return { ...this.config };
  }
  
  // Get current state
  getState(): AgentState {
    return { ...this.state };
  }
  
  // Update agent status
  protected setStatus(status: AgentStatus, task?: string): void {
    this.state.status = status;
    this.state.currentTask = task;
    if (status !== 'idle') {
      this.state.lastActive = new Date();
    }
  }
  
  // Check if agent can handle a given task
  abstract canHandle(input: string): boolean;
  
  // Process input and return response
  async process(input: string): Promise<string> {
    if (!this.config.enabled) {
      throw new Error(`Agent ${this.config.name} is disabled`);
    }
    
    const taskId = uuidv4();
    this.setStatus('working', input.slice(0, 100));
    
    try {
      // Build messages with system prompt and history
      const messages: LLMMessage[] = [
        { role: 'system', content: this.config.systemPrompt },
        ...this.conversationHistory,
        { role: 'user', content: input },
      ];
      
      // Get the appropriate provider
      const provider = getProvider(this.config.provider);
      
      // Call the LLM
      const result = await provider.complete({
        messages,
        model: this.config.model,
        temperature: 0.7,
      });
      
      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: input },
        { role: 'assistant', content: result.content }
      );
      
      // Keep history manageable (last 20 messages)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }
      
      this.state.messagesProcessed++;
      this.setStatus('idle');
      
      return result.content;
    } catch (error) {
      this.state.errors++;
      this.setStatus('error');
      throw error;
    }
  }
  
  // Reset conversation history
  resetHistory(): void {
    this.conversationHistory = [];
  }
  
  // Enable/disable the agent
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.setStatus('disabled');
    } else {
      this.setStatus('idle');
    }
  }
  
  // Update provider
  setProvider(provider: LLMProvider, model?: string): void {
    this.config.provider = provider;
    if (model) {
      this.config.model = model;
    }
  }
}
