import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversationById, deleteConversation } from '../../store/slices/aiCoachSlice.js';
import { FiMessageSquare, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const ConversationSidebar = ({ onNewChat, onCloseSidebar }) => {
  const dispatch = useDispatch();
  const { conversations, activeConversation, isLoadingConversations } = useSelector((state) => state.aiCoach);

  const handleSelect = (id) => {
    dispatch(fetchConversationById(id));
    onCloseSidebar();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      dispatch(deleteConversation(id));
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Coach Chat</h2>
        <button 
          onClick={onCloseSidebar}
          className="md:hidden p-2 text-gray-500 hover:text-gray-700"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoadingConversations ? (
          <div className="flex justify-center p-4">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center p-4 text-gray-500 text-sm">
            No conversations yet. Start a new chat!
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => handleSelect(conv._id)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group
                  ${activeConversation?._id === conv._id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FiMessageSquare className="w-5 h-5 shrink-0" />
                  <span className="truncate font-medium text-sm">
                    {conv.title || 'New Conversation'}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDelete(e, conv._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                  title="Delete conversation"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
