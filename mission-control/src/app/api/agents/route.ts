// Agents API endpoint - get and manage agents

import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator, initializeAgents, getAgentSummary } from '@/lib/agents';

// GET - List all agents and their status
export async function GET() {
  try {
    initializeAgents();
    
    const summary = getAgentSummary();
    
    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Agents API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PATCH - Update agent settings
export async function PATCH(request: NextRequest) {
  try {
    initializeAgents();
    
    const body = await request.json();
    const { agentId, enabled, provider, model } = body;
    
    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
        { status: 400 }
      );
    }
    
    const orchestrator = getOrchestrator();
    const agent = orchestrator.getAgent(agentId);
    
    if (!agent) {
      return NextResponse.json(
        { error: `Agent '${agentId}' not found` },
        { status: 404 }
      );
    }
    
    // Update agent settings
    if (typeof enabled === 'boolean') {
      agent.setEnabled(enabled);
    }
    
    if (provider) {
      agent.setProvider(provider, model);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...agent.getConfig(),
        state: agent.getState(),
      },
    });
  } catch (error) {
    console.error('Agents API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
