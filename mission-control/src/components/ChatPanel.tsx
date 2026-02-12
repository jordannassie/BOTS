'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Message } from '@/lib/types';
import { Send, RotateCcw, User, Bot, Code, Share2, Globe, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const agentInfo: Record<string, { icon: React.ReactNode; name: string; color: string }> = {
  orchestrator: { 
    icon: <Bot className="w-4 h-4" />, 
    name: 'Mission Control',
    color: 'text-blue-400 bg-blue-400/10'
  },
  programmer: { 
    icon: <Code className="w-4 h-4" />, 
    name: 'Programmer',
    color: 'text-green-400 bg-green-400/10'
  },
  social_media: { 
    icon: <Share2 className="w-4 h-4" />, 
    name: 'Social Media',
    color: 'text-pink-400 bg-pink-400/10'
  },
  web_dev: { 
    icon: <Globe className="w-4 h-4" />, 
    name: 'Web Dev',
    color: 'text-orange-400 bg-orange-400/10'
  },
  system: {
    icon: <Bot className="w-4 h-4" />,
    name: 'System',
    color: 'text-red-400 bg-red-400/10'
  },
};

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const agent = message.agentId ? agentInfo[message.agentId] : agentInfo.orchestrator;
  
  return (
    <div
      className={clsx(
        'flex gap-3 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-[var(--accent)]' : agent?.color
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          agent?.icon
        )}
      </div>
      
      {/* Message content */}
      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-4 py-2.5',
          isUser 
            ? 'bg-[var(--accent)] text-white rounded-br-sm' 
            : 'bg-[var(--card)] border border-[var(--border)] rounded-bl-sm'
        )}
      >
        {!isUser && agent && (
          <p className={clsx('text-xs font-medium mb-1', agent.color.split(' ')[0])}>
            {agent.name}
          </p>
        )}
        <div className="message-content text-sm whitespace-pre-wrap">
          {message.content}
        </div>
        <p className={clsx(
          'text-xs mt-1',
          isUser ? 'text-blue-200' : 'text-gray-500'
        )}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { messages, sendMessage, resetChat, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Mission Control</h2>
            <p className="text-xs text-gray-400">Talk to your AI agents</p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="p-2 rounded-lg hover:bg-[var(--card)] text-gray-400 hover:text-white transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 rounded-full bg-[var(--card)] mb-4">
              <Bot className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Welcome to Mission Control</h3>
            <p className="text-gray-400 max-w-md">
              I'm your main orchestrator. Tell me what you need and I'll route your request 
              to the right specialist agent.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                'Help me write a Python function',
                'Create a Twitter thread about AI',
                'Build a React component',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 text-sm rounded-full bg-[var(--card)] border border-[var(--border)] 
                           text-gray-300 hover:border-[var(--accent)] hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-blue-400/10 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border)]">
        <div className="flex items-end gap-2 bg-[var(--card)] rounded-xl border border-[var(--border)] p-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Mission Control..."
            className="flex-1 bg-transparent border-none outline-none resize-none text-white 
                     placeholder-gray-500 px-2 py-1 max-h-[150px]"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              input.trim() && !isLoading
                ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                : 'bg-[var(--border)] text-gray-500 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
