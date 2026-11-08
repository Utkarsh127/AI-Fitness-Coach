import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, optimisticUserMessage } from '../../store/slices/aiCoachSlice.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiSend, FiMenu } from 'react-icons/fi';

const ChatWindow = ({ onOpenSidebar }) => {
  const dispatch = useDispatch();
  const { activeConversation, isLoadingActive, isSendingMessage } = useSelector((state) => state.aiCoach);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !activeConversation || isSendingMessage) return;

    const message = input.trim();
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    dispatch(optimisticUserMessage(message));
    dispatch(sendMessage({ conversationId: activeConversation._id, message }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeConversation && !isLoadingActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
        <button onClick={onOpenSidebar} className="md:hidden absolute top-4 left-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <FiMenu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🤖</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Fitness Coach</h2>
        <p className="text-gray-500 text-center max-w-md">
          Select a conversation or start a new one. I'm here to help you achieve your fitness goals based on your unique profile and workout history.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Mobile Header overlay */}
      <div className="md:hidden flex items-center p-3 border-b border-gray-200 bg-white z-10">
        <button onClick={onOpenSidebar} className="p-2 mr-2 text-gray-600 rounded-md hover:bg-gray-100">
          <FiMenu className="w-6 h-6" />
        </button>
        <span className="font-semibold text-gray-800 truncate">
          {activeConversation?.title || 'Loading...'}
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {isLoadingActive ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeConversation?.messages.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                Send a message to start chatting with your AI coach.
              </div>
            )}
            
            {activeConversation?.messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg._id || index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] md:max-w-[75%] rounded-2xl p-4
                    ${isUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}
                  `}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm md:prose-base prose-indigo">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {isSendingMessage && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4 flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything..."
            className="flex-1 bg-transparent resize-none outline-none py-2 px-4 max-h-32 text-gray-800"
            rows={1}
            disabled={isSendingMessage || isLoadingActive}
            maxLength={1000}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSendingMessage || isLoadingActive}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 mb-0.5 mr-0.5"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2 text-xs text-gray-400">
          AI can make mistakes. Consider consulting a professional for serious medical issues.
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
