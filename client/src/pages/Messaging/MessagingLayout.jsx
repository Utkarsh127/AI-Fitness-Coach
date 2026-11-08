/**
 * @page MessagingLayout
 * @description Master layout for the Chat System combining list and window.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConversations,
  setActiveConversation,
  createConversation,
  receiveSocketMessage,
  setTyping,
  clearTyping,
} from '../../store/slices/messagingSlice.js';
import socketClient from '../../sockets/socketClient.js';
import useAuth from '../../hooks/useAuth.js';
import ConversationList from '../../components/messaging/ConversationList.jsx';
import ChatWindow from '../../components/messaging/ChatWindow.jsx';
import toast from 'react-hot-toast';

const MessagingLayout = () => {
  const dispatch = useDispatch();
  const { user, token } = useAuth();
  const { conversations, activeConversationId, onlineUsers } = useSelector(state => state.messaging);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  useEffect(() => {
    // 1. Fetch Conversations
    dispatch(fetchConversations({ limit: 50 }));

    // 2. Add Socket Listeners
    const socket = socketClient.getSocket();
    if (socket) {
      const handleTyping = (data) => dispatch(setTyping(data));
      const handleStopTyping = (data) => dispatch(clearTyping(data));

      socket.on('typing', handleTyping);
      socket.on('stopTyping', handleStopTyping);

      // Fetch online users to sync state upon opening layout
      socket.emit('requestOnlineUsers');

      return () => {
        socket.off('typing', handleTyping);
        socket.off('stopTyping', handleStopTyping);
      };
    }
  }, [dispatch]);

  // Handle mobile selection
  const handleSelect = (id) => {
    dispatch(setActiveConversation(id));
    setIsMobileListOpen(false); // Hide list on mobile
  };

  const handleBack = () => {
    dispatch(setActiveConversation(null));
    setIsMobileListOpen(true);
  };

  // Called when user selects someone from the New Chat modal
  const handleNewChat = async (selectedUser) => {
    const result = await dispatch(createConversation({
      participants: [selectedUser._id],
      type: 'private',
    }));

    if (createConversation.fulfilled.match(result)) {
      // activeConversationId already set in slice
      setIsMobileListOpen(false);
    }
  };

  const activeConversation = conversations.find(c => c._id === activeConversationId);

  return (
    <div className="flex h-[calc(100vh-64px)] -mx-4 -mt-8 sm:-mx-6 lg:-mx-8 overflow-hidden bg-surface">

      {/* Sidebar (List) */}
      <div className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${!isMobileListOpen ? 'hidden md:block' : 'block'}`}>
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleSelect}
          onlineUsers={onlineUsers}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main Area (Chat) */}
      <div 
        className={`flex-1 h-full min-w-0 ${isMobileListOpen ? 'hidden md:flex' : 'flex'}`}
        data-conversation-id={activeConversationId || 'none'}
      >
        <ChatWindow
          conversation={activeConversation}
          onBack={handleBack}
          onlineUsers={onlineUsers}
        />
      </div>

    </div>
  );
};

export default MessagingLayout;
