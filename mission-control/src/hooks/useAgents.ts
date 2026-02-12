// Agents hook for fetching and managing agents

import { useCallback, useEffect } from 'react';
import { useMissionControl } from '@/store';

export function useAgents() {
  const {
    agents,
    orchestrator,
    setAgents,
    setError,
  } = useMissionControl();
  
  const fetchAgents = useCallback(async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch agents');
      }
      
      setAgents(
        { config: data.data.orchestrator, state: data.data.orchestrator.state },
        data.data.agents.map((agent: any) => ({
          config: agent,
          state: agent.state,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch agents');
    }
  }, [setAgents, setError]);
  
  const toggleAgent = useCallback(async (agentId: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId, enabled }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update agent');
      }
      
      // Refresh agents
      await fetchAgents();
    } catch (error) {
      console.error('Failed to toggle agent:', error);
      setError(error instanceof Error ? error.message : 'Failed to update agent');
    }
  }, [fetchAgents, setError]);
  
  // Fetch agents on mount
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);
  
  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, [fetchAgents]);
  
  return {
    agents,
    orchestrator,
    fetchAgents,
    toggleAgent,
  };
}
