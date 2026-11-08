import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, createConversation } from '../../store/slices/aiCoachSlice.js';
import ConversationSidebar from './ConversationSidebar.jsx';
import ChatWindow from './ChatWindow.jsx';

const AiCoachPage = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleNewChat = () => {
    dispatch(createConversation('New Conversation'));
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] bg-gray-50 overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <ConversationSidebar 
          onNewChat={handleNewChat} 
          onCloseSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
        <ChatWindow onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
};

export default AiCoachPage;
