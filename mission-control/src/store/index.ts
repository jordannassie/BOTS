// Zustand store for Mission Control state

import { create } from 'zustand';
import { AgentConfig, AgentState, Message } from '@/lib/types';

interface AgentData {
  config: AgentConfig;
  state: AgentState;
}

interface MissionControlStore {
  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  
  // Agents
  agents: AgentData[];
  orchestrator: AgentData | null;
  setAgents: (orchestrator: AgentData, agents: AgentData[]) => void;
  updateAgentState: (agentId: string, state: Partial<AgentState>) => void;
  
  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  selectedAgent: string | null;
  setSelectedAgent: (agentId: string | null) => void;
  
  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
  
  // Conversation
  conversationId: string | null;
  setConversationId: (id: string) => void;
}

export const useMissionControl = create<MissionControlStore>((set) => ({
  // Messages
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  clearMessages: () => set({ messages: [] }),
  
  // Agents
  agents: [],
  orchestrator: null,
  setAgents: (orchestrator, agents) => set({ orchestrator, agents }),
  updateAgentState: (agentId, newState) => set((state) => {
    if (agentId === 'orchestrator' && state.orchestrator) {
      return {
        orchestrator: {
          ...state.orchestrator,
          state: { ...state.orchestrator.state, ...newState },
        },
      };
    }
    
    return {
      agents: state.agents.map((agent) =>
        agent.config.id === agentId
          ? { ...agent, state: { ...agent.state, ...newState } }
          : agent
      ),
    };
  }),
  
  // UI State
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  selectedAgent: null,
  setSelectedAgent: (agentId) => set({ selectedAgent: agentId }),
  
  // Error handling
  error: null,
  setError: (error) => set({ error }),
  
  // Conversation
  conversationId: null,
  setConversationId: (id) => set({ conversationId: id }),
}));
