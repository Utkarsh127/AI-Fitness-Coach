/**
 * @page CommunityUserPage
 * @description Public profile view for any community user, with their posts and a Message button.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiChat } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { createConversation } from '../../store/slices/messagingSlice.js';
import * as communityApi from '../../api/community.api.js';
import PostCard from '../../components/community/PostCard.jsx';
import { Spinner } from '../../components/common/Loader.jsx';
import useAuth from '../../hooks/useAuth.js';

const CommunityUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useAuth();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState(null);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await communityApi.getUserPosts(userId);
        const docs = res.data.data?.docs || [];
        setPosts(docs);
        if (docs.length > 0) {
          setAuthor(docs[0].author);
        }
      } catch {
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleMessage = async () => {
    if (userId === currentUser?._id) return;
    setIsStartingChat(true);
    await dispatch(createConversation({ participants: [userId], type: 'private' }));
    navigate('/messages');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white transition-colors">
          <HiArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-border overflow-hidden border border-surface-border flex items-center justify-center">
              {author?.profilePicture ? (
                <img src={author.profilePicture} alt={author.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-slate-400 text-lg">{author?.name?.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{author?.name || 'Community Member'}</h1>
              {author?.username && <p className="text-sm text-brand-400">@{author.username}</p>}
            </div>
          </div>

          {userId !== currentUser?._id && (
            <button
              onClick={handleMessage}
              disabled={isStartingChat}
              className="btn-primary h-10 px-4 inline-flex items-center gap-2"
            >
              {isStartingChat ? <Spinner size="sm" /> : <><HiChat className="w-4 h-4" /><span>Message</span></>}
            </button>
          )}
        </div>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : posts.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          No posts yet.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} onCommentClick={() => navigate(`/community/post/${post._id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityUserPage;
