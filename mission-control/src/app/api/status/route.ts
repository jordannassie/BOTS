// Status API endpoint - health check and system status

import { NextResponse } from 'next/server';
import { getOrchestrator, initializeAgents } from '@/lib/agents';
import { getAvailableProviders } from '@/lib/providers';

export async function GET() {
  try {
    initializeAgents();
    
    const orchestrator = getOrchestrator();
    const allStates = orchestrator.getAllAgentStates();
    const availableProviders = getAvailableProviders();
    
    // Calculate aggregate stats
    const totalAgents = allStates.length;
    const activeAgents = allStates.filter(a => a.state.status === 'working').length;
    const errorAgents = allStates.filter(a => a.state.status === 'error').length;
    const totalMessagesProcessed = allStates.reduce((sum, a) => sum + a.state.messagesProcessed, 0);
    const totalErrors = allStates.reduce((sum, a) => sum + a.state.errors, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        status: errorAgents > 0 ? 'degraded' : 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        providers: {
          available: availableProviders,
          count: availableProviders.length,
        },
        agents: {
          total: totalAgents,
          active: activeAgents,
          errors: errorAgents,
          states: allStates,
        },
        metrics: {
          messagesProcessed: totalMessagesProcessed,
          totalErrors,
        },
      },
    });
  } catch (error) {
    console.error('Status API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
