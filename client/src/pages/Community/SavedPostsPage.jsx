/**
 * @page SavedPostsPage
 * @description List of bookmarked community posts.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiBookmark } from 'react-icons/hi';
import { getSavedPosts } from '../../api/community.api.js';
import { FullScreenLoader, Spinner } from '../../components/common/Loader.jsx';
import PostCard from '../../components/community/PostCard.jsx';
import { useState } from 'react';

const SavedPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await getSavedPosts({ limit: 50 }); // Fetch first 50 saved
        setPosts(res.data.data.docs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSaved();
  }, []);

  if (isLoading) return <FullScreenLoader />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
          <HiBookmark className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Saved Posts</h1>
          <p className="text-slate-400">Inspiration and knowledge you've bookmarked.</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <HiBookmark className="w-12 h-12 text-slate-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No saved posts</h2>
          <p className="text-slate-400 mb-6">Explore the community feed and bookmark posts to save them for later.</p>
          <Link to="/community" className="btn-primary">Explore Community</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

    </div>
  );
};

export default SavedPostsPage;
