// Individual agent API endpoint

import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator, initializeAgents } from '@/lib/agents';

// GET - Get specific agent details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    initializeAgents();
    
    const orchestrator = getOrchestrator();
    
    // Check if it's the orchestrator
    if (params.id === 'orchestrator') {
      return NextResponse.json({
        success: true,
        data: {
          ...orchestrator.getConfig(),
          state: orchestrator.getState(),
        },
      });
    }
    
    const agent = orchestrator.getAgent(params.id);
    
    if (!agent) {
      return NextResponse.json(
        { error: `Agent '${params.id}' not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...agent.getConfig(),
        state: agent.getState(),
      },
    });
  } catch (error) {
    console.error('Agent API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Send message directly to specific agent
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    initializeAgents();
    
    const body = await request.json();
    const { message } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    const orchestrator = getOrchestrator();
    
    // Handle orchestrator
    if (params.id === 'orchestrator') {
      const response = await orchestrator.process(message);
      return NextResponse.json({
        success: true,
        data: {
          message: response,
          agentId: 'orchestrator',
          timestamp: new Date().toISOString(),
        },
      });
    }
    
    const agent = orchestrator.getAgent(params.id);
    
    if (!agent) {
      return NextResponse.json(
        { error: `Agent '${params.id}' not found` },
        { status: 404 }
      );
    }
    
    const response = await agent.process(message);
    
    return NextResponse.json({
      success: true,
      data: {
        message: response,
        agentId: params.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Agent API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
