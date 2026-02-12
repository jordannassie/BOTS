// Chat API endpoint - main entry point for user messages

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getOrchestrator, initializeAgents } from '@/lib/agents';

export async function POST(request: NextRequest) {
  try {
    // Initialize agents if not already done
    initializeAgents();
    
    const body = await request.json();
    const { message, conversationId } = body;
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    const orchestrator = getOrchestrator();
    
    // Process with intelligent routing
    const result = await orchestrator.processWithRouting(message);
    
    return NextResponse.json({
      success: true,
      data: {
        message: result.response,
        handledBy: result.handledBy,
        delegatedTo: result.delegatedTo,
        conversationId: conversationId || uuidv4(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
