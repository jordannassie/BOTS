// Main Orchestrator Agent - routes requests to specialized sub-agents

import { BaseAgent } from './base';
import { LLMMessage } from '../types';
import { getProvider } from '../providers';

interface AgentRouting {
  agentId: string;
  confidence: number;
  reasoning: string;
}

export class OrchestratorAgent extends BaseAgent {
  private subAgents: Map<string, BaseAgent> = new Map();
  
  constructor() {
    super({
      id: 'orchestrator',
      name: 'Mission Control',
      description: 'Main orchestrator that manages and routes tasks to specialized agents',
      systemPrompt: `You are Mission Control, the main AI orchestrator. Your role is to:
1. Understand user requests and determine the best agent to handle them
2. Coordinate between multiple agents when needed
3. Provide clear, helpful responses
4. Delegate specialized tasks to the appropriate sub-agents

Available agent types and their capabilities:
- programmer: Code writing, debugging, software architecture, technical documentation
- social_media: Social media content, marketing copy, engagement strategies, platform-specific content
- web_dev: Web development, frontend/backend, UI/UX, responsive design, web technologies

When you need to delegate, respond with JSON in this format:
{"delegate": "agent_id", "task": "specific task description"}

If you can handle the request directly, just respond normally.
If multiple agents are needed, explain your plan to coordinate them.`,
      provider: 'openai',
      capabilities: ['routing', 'coordination', 'general-assistance'],
    });
  }
  
  // Register a sub-agent
  registerAgent(agent: BaseAgent): void {
    this.subAgents.set(agent.getConfig().id, agent);
  }
  
  // Unregister a sub-agent
  unregisterAgent(agentId: string): void {
    this.subAgents.delete(agentId);
  }
  
  // Get all registered agents
  getRegisteredAgents(): BaseAgent[] {
    return Array.from(this.subAgents.values());
  }
  
  // Get agent by ID
  getAgent(agentId: string): BaseAgent | undefined {
    return this.subAgents.get(agentId);
  }
  
  // Check if orchestrator can handle (it handles everything by routing)
  canHandle(_input: string): boolean {
    return true; // Orchestrator can handle any input
  }
  
  // Analyze input and determine best agent(s) to handle it
  async analyzeAndRoute(input: string): Promise<AgentRouting | null> {
    const agentDescriptions = Array.from(this.subAgents.values())
      .filter(agent => agent.getConfig().enabled)
      .map(agent => {
        const config = agent.getConfig();
        return `- ${config.id}: ${config.name} - ${config.description}. Capabilities: ${config.capabilities.join(', ')}`;
      })
      .join('\n');
    
    if (!agentDescriptions) {
      return null; // No agents available
    }
    
    const routingPrompt = `Analyze this user request and determine if it should be delegated to a specialized agent.

Available agents:
${agentDescriptions}

User request: "${input}"

If this request should be handled by a specialized agent, respond with ONLY valid JSON:
{"agentId": "agent_id", "confidence": 0.0-1.0, "reasoning": "brief explanation"}

If you should handle this directly (general questions, coordination, or unclear requests), respond with:
{"agentId": "orchestrator", "confidence": 1.0, "reasoning": "handling directly"}

Respond with ONLY the JSON, no other text.`;

    try {
      const provider = getProvider(this.config.provider);
      const result = await provider.complete({
        messages: [
          { role: 'system', content: 'You are a routing analyzer. Respond only with valid JSON.' },
          { role: 'user', content: routingPrompt },
        ],
        temperature: 0.3,
      });
      
      // Parse the routing decision
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const routing = JSON.parse(jsonMatch[0]) as AgentRouting;
        return routing;
      }
    } catch (error) {
      console.error('Routing analysis failed:', error);
    }
    
    return null;
  }
  
  // Process with intelligent routing
  async processWithRouting(input: string): Promise<{
    response: string;
    handledBy: string;
    delegatedTo?: string;
  }> {
    this.setStatus('working', 'Analyzing request...');
    
    try {
      // First, analyze and route
      const routing = await this.analyzeAndRoute(input);
      
      // If no routing or should handle directly
      if (!routing || routing.agentId === 'orchestrator' || routing.confidence < 0.6) {
        const response = await this.process(input);
        return {
          response,
          handledBy: 'orchestrator',
        };
      }
      
      // Delegate to the appropriate agent
      const targetAgent = this.subAgents.get(routing.agentId);
      
      if (!targetAgent || !targetAgent.getConfig().enabled) {
        // Fallback to orchestrator if agent not available
        const response = await this.process(input);
        return {
          response,
          handledBy: 'orchestrator',
        };
      }
      
      // Process with the delegated agent
      const response = await targetAgent.process(input);
      
      return {
        response,
        handledBy: routing.agentId,
        delegatedTo: routing.agentId,
      };
    } catch (error) {
      this.state.errors++;
      this.setStatus('error');
      throw error;
    } finally {
      this.setStatus('idle');
    }
  }
  
  // Get status of all agents
  getAllAgentStates(): { id: string; state: ReturnType<BaseAgent['getState']> }[] {
    const states: { id: string; state: ReturnType<BaseAgent['getState']> }[] = [
      { id: 'orchestrator', state: this.getState() }
    ];
    
    this.subAgents.forEach((agent, id) => {
      states.push({ id, state: agent.getState() });
    });
    
    return states;
  }
}

// Singleton instance
let orchestratorInstance: OrchestratorAgent | null = null;

export function getOrchestrator(): OrchestratorAgent {
  if (!orchestratorInstance) {
    orchestratorInstance = new OrchestratorAgent();
  }
  return orchestratorInstance;
}
