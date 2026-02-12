// Core types for Mission Control

export type AgentStatus = 'idle' | 'working' | 'error' | 'disabled';

export type LLMProvider = 'openai' | 'anthropic' | 'ollama';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  provider: LLMProvider;
  model?: string;
  enabled: boolean;
  capabilities: string[];
}

export interface AgentState {
  id: string;
  status: AgentStatus;
  currentTask?: string;
  lastActive?: Date;
  messagesProcessed: number;
  errors: number;
}

export interface Task {
  id: string;
  agentId: string;
  input: string;
  output?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  message: string;
  agentId: string;
  delegatedTo?: string[];
  conversationId: string;
}

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMCompletionOptions {
  messages: LLMMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMCompletionResult {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
