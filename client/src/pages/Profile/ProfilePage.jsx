/**
 * @page ProfilePage
 * @description View user's fitness profile and community stats.
 */

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineUserCircle, HiOutlineCog, HiArrowLeft, HiPhotograph, HiBookmark, HiCamera } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { fetchProfile, selectProfile, selectProfileLoading, uploadProfilePicture } from '../../store/slices/profileSlice.js';
import { getCurrentUser } from '../../store/slices/authSlice.js';
import { FullScreenLoader, Spinner } from '../../components/common/Loader.jsx';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector(selectProfile);
  const isLoading = useSelector(selectProfileLoading);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      await dispatch(uploadProfilePicture(file)).unwrap();
      // Instantly sync the auth state so the sidebar updates too
      await dispatch(getCurrentUser()).unwrap();
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  if (isLoading && !profile) return <FullScreenLoader />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* ─── HEADER & PROFILE PIC ──────────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-600 to-accent-600 relative">
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-surface/50 backdrop-blur-md rounded-full text-white hover:bg-surface/80 transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <button className="absolute top-4 right-4 p-2 bg-surface/50 backdrop-blur-md rounded-full text-white hover:bg-surface/80 transition-colors">
            <HiOutlineCog className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 mb-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-surface overflow-hidden bg-surface-border shrink-0">
                {isLoading && profile ? (
                   <div className="w-full h-full flex items-center justify-center bg-brand-500/10"><Spinner size="md" /></div>
                ) : profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-500 bg-brand-500/10">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-4 border-transparent">
                <HiCamera className="w-6 h-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium uppercase tracking-wider">Change</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleImageChange} 
                accept="image/jpeg, image/png, image/webp" 
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-display font-bold text-white">{profile?.name}</h1>
              <p className="text-brand-400 font-medium">@{profile?.username}</p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Link to="/onboarding" className="btn-secondary flex-1 sm:flex-none justify-center">Edit Profile</Link>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8 mt-6 pt-6 border-t border-surface-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-slate-400 uppercase tracking-wider">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-slate-400 uppercase tracking-wider">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-slate-400 uppercase tracking-wider">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TABS / LINKS ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to={`/community/user/${profile._id}`} className="glass-card p-6 flex items-center gap-4 hover:border-brand-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HiPhotograph className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">My Posts</h3>
            <p className="text-sm text-slate-400">View your fitness journey and media.</p>
          </div>
        </Link>

        <Link to="/community/saved" className="glass-card p-6 flex items-center gap-4 hover:border-brand-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HiBookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Saved Posts</h3>
            <p className="text-sm text-slate-400">Posts and routines you've bookmarked.</p>
          </div>
        </Link>
      </div>

      {/* ─── FITNESS PROFILE DETAILS ───────────────────────────────────────────── */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <HiOutlineUserCircle className="text-brand-400" /> Fitness Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Goals</p>
              <div className="flex flex-wrap gap-2">
                {profile.fitnessGoal?.map(goal => (
                  <span key={goal} className="badge bg-brand-500/20 text-brand-400 border border-brand-500/20">{goal}</span>
                )) || <span className="text-slate-500">Not set</span>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-xl border border-surface-border">
                <p className="text-sm text-slate-400 mb-1">Height</p>
                <p className="font-bold text-white">{profile.height || '--'} cm</p>
              </div>
              <div className="bg-surface p-4 rounded-xl border border-surface-border">
                <p className="text-sm text-slate-400 mb-1">Weight</p>
                <p className="font-bold text-white">{profile.weight || '--'} kg</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Experience Level</p>
              <p className="font-bold text-white bg-surface p-3 rounded-lg border border-surface-border">
                {profile.experienceLevel || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Available Equipment</p>
              <div className="flex flex-wrap gap-2">
                {profile.availableEquipment?.map(eq => (
                  <span key={eq} className="badge bg-surface-border text-slate-300">{eq}</span>
                )) || <span className="text-slate-500">Not set</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
