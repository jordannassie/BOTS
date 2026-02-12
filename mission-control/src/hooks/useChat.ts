// Chat hook for Mission Control

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMissionControl } from '@/store';
import { Message } from '@/lib/types';

export function useChat() {
  const {
    messages,
    addMessage,
    clearMessages,
    isLoading,
    setLoading,
    setError,
    conversationId,
    setConversationId,
  } = useMissionControl();
  
  const [lastHandledBy, setLastHandledBy] = useState<string | null>(null);
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    addMessage(userMessage);
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Update conversation ID
      if (data.data.conversationId) {
        setConversationId(data.data.conversationId);
      }
      
      // Add assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.data.message,
        timestamp: new Date(data.data.timestamp),
        agentId: data.data.handledBy,
      };
      addMessage(assistantMessage);
      
      setLastHandledBy(data.data.handledBy);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Add error message to chat
      const errorResponse: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `Error: ${errorMessage}`,
        timestamp: new Date(),
        agentId: 'system',
      };
      addMessage(errorResponse);
    } finally {
      setLoading(false);
    }
  }, [isLoading, conversationId, addMessage, setLoading, setError, setConversationId]);
  
  const resetChat = useCallback(() => {
    clearMessages();
    setConversationId(uuidv4());
    setLastHandledBy(null);
  }, [clearMessages, setConversationId]);
  
  return {
    messages,
    sendMessage,
    resetChat,
    isLoading,
    lastHandledBy,
  };
}
