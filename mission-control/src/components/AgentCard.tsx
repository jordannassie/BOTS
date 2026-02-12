'use client';

import { AgentConfig, AgentState, AgentStatus } from '@/lib/types';
import { 
  Bot, 
  Code, 
  Share2, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Power 
} from 'lucide-react';
import clsx from 'clsx';

interface AgentCardProps {
  config: AgentConfig;
  state: AgentState;
  isOrchestrator?: boolean;
  onToggle?: (enabled: boolean) => void;
}

const statusConfig: Record<AgentStatus, { color: string; label: string }> = {
  idle: { color: 'text-green-400', label: 'Ready' },
  working: { color: 'text-blue-400', label: 'Working' },
  error: { color: 'text-red-400', label: 'Error' },
  disabled: { color: 'text-gray-500', label: 'Disabled' },
};

const agentIcons: Record<string, React.ReactNode> = {
  orchestrator: <Bot className="w-6 h-6" />,
  programmer: <Code className="w-6 h-6" />,
  social_media: <Share2 className="w-6 h-6" />,
  web_dev: <Globe className="w-6 h-6" />,
};

export function AgentCard({ config, state, isOrchestrator, onToggle }: AgentCardProps) {
  const status = statusConfig[state.status];
  const icon = agentIcons[config.id] || <Bot className="w-6 h-6" />;
  
  return (
    <div
      className={clsx(
        'relative p-4 rounded-xl border transition-all duration-200',
        isOrchestrator 
          ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30' 
          : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]/50',
        !config.enabled && 'opacity-50'
      )}
    >
      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {state.status === 'working' ? (
          <Loader2 className={clsx('w-4 h-4 animate-spin', status.color)} />
        ) : state.status === 'error' ? (
          <AlertCircle className={clsx('w-4 h-4', status.color)} />
        ) : (
          <div className={clsx('w-2 h-2 rounded-full', status.color.replace('text-', 'bg-'))} />
        )}
        <span className={clsx('text-xs font-medium', status.color)}>
          {status.label}
        </span>
      </div>
      
      {/* Agent info */}
      <div className="flex items-start gap-3 mb-3">
        <div className={clsx(
          'p-2 rounded-lg',
          isOrchestrator ? 'bg-blue-500/20 text-blue-400' : 'bg-[var(--border)] text-gray-400'
        )}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white">{config.name}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{config.description}</p>
        </div>
      </div>
      
      {/* Provider badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--border)] text-gray-400">
          {config.provider}
        </span>
        {config.model && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--border)] text-gray-400">
            {config.model}
          </span>
        )}
      </div>
      
      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{state.messagesProcessed}</span>
          </div>
          {state.errors > 0 && (
            <div className="flex items-center gap-1 text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{state.errors}</span>
            </div>
          )}
        </div>
        
        {/* Toggle button (not for orchestrator) */}
        {!isOrchestrator && onToggle && (
          <button
            onClick={() => onToggle(!config.enabled)}
            className={clsx(
              'p-1.5 rounded-lg transition-colors',
              config.enabled 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
            )}
            title={config.enabled ? 'Disable agent' : 'Enable agent'}
          >
            <Power className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Current task */}
      {state.currentTask && (
        <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-300 truncate">
            {state.currentTask}
          </p>
        </div>
      )}
    </div>
  );
}
