/**
 * @component ConversationList
 * @description Sidebar listing all active chats with a New Chat modal.
 */

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HiUser, HiOutlineUserGroup, HiPencilAlt, HiSearch, HiX, HiChat } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth.js';
import { searchUsers } from '../../api/user.api.js';
import { Spinner } from '../common/Loader.jsx';

// ─── New Chat Modal ───────────────────────────────────────────────────────────
const NewChatModal = ({ onClose, onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    // Load all users on open
    loadUsers('');
  }, []);

  const loadUsers = async (q) => {
    setIsLoading(true);
    try {
      const res = await searchUsers(q);
      setUsers(res.data.data || []);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    loadUsers(q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md glass-card rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <h3 className="text-lg font-bold text-white">New Message</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-surface-border transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-surface-border">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name, username or email..."
              className="input pl-9"
              value={query}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* User List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-surface-border">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              {query ? 'No users found' : 'No other users yet'}
            </div>
          ) : (
            users.map(u => (
              <button
                key={u._id}
                onClick={() => onSelectUser(u)}
                className="w-full flex items-center gap-3 p-4 hover:bg-surface-border/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 border border-white/10 shadow-[0_0_10px_rgba(139,92,246,0.15)] overflow-hidden flex items-center justify-center shrink-0">
                  {u.profilePicture ? (
                    <img src={u.profilePicture} alt={u.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {u.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{u.name}</p>
                  <p className="text-sm text-slate-400 truncate">@{u.username}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Conversation List ────────────────────────────────────────────────────────
const ConversationList = ({ conversations, activeId, onSelect, onlineUsers, onNewChat }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectUser = (selectedUser) => {
    setShowModal(false);
    onNewChat(selectedUser);
  };

  return (
    <>
      <div className="h-full overflow-y-auto w-full bg-surface-border/10 border-r border-surface-border flex flex-col">
        {/* Header */}
        <div className="p-4 sticky top-0 bg-surface z-10 border-b border-surface-border flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <button
            id="new-chat-btn"
            onClick={() => setShowModal(true)}
            className="p-2 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 hover:text-brand-300 transition-colors"
            title="New Chat"
          >
            <HiPencilAlt className="w-5 h-5" />
          </button>
        </div>

        {/* Local Search */}
        <div className="p-3 border-b border-surface-border">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-surface-border/30 border border-surface-border rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation items */}
        <div className="divide-y divide-surface-border flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-4 h-full min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center">
                <HiChat className="w-8 h-8 text-brand-400" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">No conversations yet</p>
                <p className="text-sm text-slate-500 mb-4">Start a new chat to connect with others</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary h-10 px-5 inline-flex items-center gap-2"
              >
                <HiPencilAlt className="w-4 h-4" />
                Start New Chat
              </button>
            </div>
          ) : (
            conversations.map(conv => {
              let name, image, isOnline = false, isGroup = conv.type === 'group';

              if (isGroup) {
                name = conv.groupName || 'Group Chat';
                image = conv.groupImage;
              } else {
                const otherUser = conv.participants?.find(p => p._id !== user._id) || conv.participants?.[0];
                name = otherUser?.name || 'Unknown User';
                image = otherUser?.profilePicture;
                isOnline = onlineUsers.includes(otherUser?._id);
              }

              const isActive = activeId === conv._id;

              // Filter based on search query
              if (searchQuery.trim() && !name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return null;
              }

              // Count unread — messages are not loaded here, so we show based on lastMessage
              return (
                <button
                  key={conv._id}
                  onClick={() => onSelect(conv._id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-surface-border/50 transition-colors text-left ${isActive ? 'bg-surface-border/80' : ''}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 border border-white/10 shadow-[0_0_10px_rgba(139,92,246,0.15)] overflow-hidden flex items-center justify-center shrink-0">
                      {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover"
                          onError={e => { e.currentTarget.style.display = 'none'; }} />
                      ) : isGroup ? (
                        <HiOutlineUserGroup className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {isOnline ? (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-surface" />
                    ) : (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-500 rounded-full border-2 border-surface" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-white truncate pr-2">{name}</h3>
                      {conv.lastActivity && (
                        <span className="text-xs text-slate-500 shrink-0">
                          {formatDistanceToNow(new Date(conv.lastActivity), { addSuffix: false }).replace('about ', '')}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-400 truncate">
                      {conv.lastMessage ? (
                        conv.lastMessage.messageType === 'Text' ? (
                          <span>
                            {conv.lastMessage.sender?._id === user._id ? 'You: ' : ''}
                            {conv.lastMessage.content}
                          </span>
                        ) : (
                          <span className="italic">📸 {conv.lastMessage.messageType}</span>
                        )
                      ) : (
                        <span className="italic text-slate-500">New conversation</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {showModal && (
        <NewChatModal
          onClose={() => setShowModal(false)}
          onSelectUser={handleSelectUser}
        />
      )}
    </>
  );
};

export default ConversationList;
