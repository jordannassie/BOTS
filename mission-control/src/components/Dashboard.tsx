'use client';

import { useAgents } from '@/hooks/useAgents';
import { AgentCard } from './AgentCard';
import { ChatPanel } from './ChatPanel';
import { Activity, Cpu, Zap, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export function Dashboard() {
  const { agents, orchestrator, toggleAgent } = useAgents();
  
  // Calculate stats
  const totalAgents = agents.length + (orchestrator ? 1 : 0);
  const activeAgents = agents.filter(a => a.state.status === 'working').length + 
    (orchestrator?.state.status === 'working' ? 1 : 0);
  const totalMessages = agents.reduce((sum, a) => sum + a.state.messagesProcessed, 0) +
    (orchestrator?.state.messagesProcessed || 0);
  const totalErrors = agents.reduce((sum, a) => sum + a.state.errors, 0) +
    (orchestrator?.state.errors || 0);
  
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Mission Control</h1>
              <p className="text-xs text-gray-400">AI Agent Orchestrator</p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-500/10">
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Active</p>
                <p className="text-sm font-semibold text-white">{activeAgents}/{totalAgents}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Messages</p>
                <p className="text-sm font-semibold text-white">{totalMessages}</p>
              </div>
            </div>
            
            {totalErrors > 0 && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500/10">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Errors</p>
                  <p className="text-sm font-semibold text-red-400">{totalErrors}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents panel */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Agents</h2>
            
            {/* Orchestrator */}
            {orchestrator && (
              <AgentCard
                config={orchestrator.config}
                state={orchestrator.state}
                isOrchestrator
              />
            )}
            
            {/* Sub-agents */}
            <div className="space-y-3">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.config.id}
                  config={agent.config}
                  state={agent.state}
                  onToggle={(enabled) => toggleAgent(agent.config.id, enabled)}
                />
              ))}
            </div>
            
            {agents.length === 0 && !orchestrator && (
              <div className="text-center py-8 text-gray-400">
                <Cpu className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Loading agents...</p>
              </div>
            )}
          </div>
          
          {/* Chat panel */}
          <div className="lg:col-span-2 h-[calc(100vh-180px)] rounded-xl border border-[var(--border)] overflow-hidden">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
