import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Bot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

function ModernSidebar({ onConversationSelect, activeConversationId, isCollapsed, setIsCollapsed }) {
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch chat sessions
  const fetchChatSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://127.0.0.1:8000/api/v1/conversations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChatSessions(data);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatSessions();
  }, []);

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col relative shadow-2xl h-screen`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Support
                </h1>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          <button
            onClick={() => onConversationSelect(null)}
            className="w-full text-left px-4 py-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors group border border-emerald-500/30"
          >
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 text-emerald-400 mr-2" />
              <span className={`text-sm text-emerald-300 ${isCollapsed ? 'hidden' : ''}`}>Start New Chat</span>
            </div>
          </button>
          
          {chatSessions.map((session, index) => (
            <button
              key={`${session.conversation_id}-${index}`}
              onClick={() => onConversationSelect(session.conversation_id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors group ${
                activeConversationId === session.conversation_id
                  ? 'bg-purple-600/20 border border-purple-500/30'
                  : 'hover:bg-slate-700/30'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <MessageCircle className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm text-slate-300 truncate">
                        {session.sender === 'user' ? 'You: ' : 'AI: '}
                        {session.preview}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModernSidebar;