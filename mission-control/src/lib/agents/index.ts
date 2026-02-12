// Agent exports and initialization

export { BaseAgent } from './base';
export { OrchestratorAgent, getOrchestrator } from './orchestrator';
export { ProgrammerAgent } from './programmer';
export { SocialMediaAgent } from './social-media';
export { WebDevAgent } from './web-dev';

import { getOrchestrator } from './orchestrator';
import { ProgrammerAgent } from './programmer';
import { SocialMediaAgent } from './social-media';
import { WebDevAgent } from './web-dev';

let initialized = false;

// Initialize all agents and register with orchestrator
export function initializeAgents(): void {
  if (initialized) return;
  
  const orchestrator = getOrchestrator();
  
  // Register specialized agents
  orchestrator.registerAgent(new ProgrammerAgent());
  orchestrator.registerAgent(new SocialMediaAgent());
  orchestrator.registerAgent(new WebDevAgent());
  
  initialized = true;
  console.log('Mission Control agents initialized');
}

// Get agent summary for display
export function getAgentSummary() {
  const orchestrator = getOrchestrator();
  const agents = orchestrator.getRegisteredAgents();
  
  return {
    orchestrator: {
      ...orchestrator.getConfig(),
      state: orchestrator.getState(),
    },
    agents: agents.map(agent => ({
      ...agent.getConfig(),
      state: agent.getState(),
    })),
  };
}
