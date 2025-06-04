import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import ModernSidebar from './Sidebar';
import '../styles/globals.css';

function ChatPage() {
  const [chatHistory, setChatHistory] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Fetch conversations from the backend
  const fetchConversations = async () => {
    try {
      const token = localStorage?.getItem('token');
      if (!token) return;

      const response = await fetch('http://127.0.0.1:8000/api/v1/conversations/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        localStorage?.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Check if the user is authenticated and fetch data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchChatHistory();
      fetchConversations();
    }
  }, [navigate]);

  // Fetch chat history from the backend
  const fetchChatHistory = async (selectedConversationId = null) => {
    try {
      const token = localStorage?.getItem('token');
      if (!token) {
        const mockHistory = [{ sender: 'bot', message: 'Hello! How can I help you today?' }];
        setChatHistory(mockHistory);
        return;
      }

      let url = 'http://127.0.0.1:8000/api/v1/history/';
      if (selectedConversationId) {
        url += `?conversation_id=${selectedConversationId}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        localStorage?.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatHistory(data);

      // Extract the latest conversation ID (optional)
      if (data.length > 0) {
        setConversationId(data[0].conversation_id);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Show sample data for demo
      const mockHistory = [
        { sender: 'bot', message: 'Hello! How can I help you today?' }
      ];
      setChatHistory(mockHistory);
    }
  };

  // Handle sending a question to the backend
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    
    // Add user message immediately for better UX
    const newMessage = { sender: 'user', message: question };
    setChatHistory(prev => [...prev, newMessage]);
    
    const currentQuestion = question;
    setQuestion(''); // Clear input immediately

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const requestBody = { 
        question: currentQuestion, 
        use_rag: true
      };

      // Only add conversation_id if it exists
      if (conversationId) {
        requestBody.conversation_id = conversationId;
      }

      const response = await fetch('http://127.0.0.1:8000/api/v1/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      if (response.status === 401) {
        localStorage?.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send question');
      }

      const data = await response.json();
      
      // Add bot response
      const botMessage = { sender: 'bot', message: data.answer };
      setChatHistory(prev => [...prev, botMessage]);

      // Set or update the conversation ID and refresh conversations
      setConversationId(data.conversation_id);
      fetchConversations();
      
    } catch (error) {
      console.error('Error details:', error);
      // Show error message to user
      const errorMessage = {
        sender: 'bot',
        message: error.message || 'Something went wrong. Please try again.'
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setConversationId(null);
    setChatHistory([]);
  };

  // Handle conversation selection from sidebar
  const handleConversationSelect = (convId) => {
    if (convId === null) {
      // Start new chat
      setChatHistory([]);
      setConversationId(null);
    } else {
      setConversationId(convId);
      fetchChatHistory(convId);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ModernSidebar 
        onConversationSelect={handleConversationSelect}
        activeConversationId={conversationId}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Chat Area */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-20' : 'ml-72'
      }`}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Customer Support
                  </h1>
                  <p className="text-sm text-gray-500">We're here to help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Container */}
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              
              {/* Chat Messages */}
              <div className="h-96 md:h-[500px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/30 to-white/30">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Bot className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-lg font-medium">Start a conversation</p>
                    <p className="text-sm">Ask me anything, I'm here to help!</p>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'bot' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl transition-all duration-200 hover:shadow-md ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                      placeholder="Type your message..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                      disabled={loading}
                    />
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !question.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none font-medium"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {loading ? 'Sending...' : 'Send'}
                    </span>
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Press Enter to send • AI responses may take a moment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;