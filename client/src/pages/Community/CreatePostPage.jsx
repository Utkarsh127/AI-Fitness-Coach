/**
 * @page CreatePostPage
 * @description Form to create a new community post with image uploads.
 */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiPhotograph, HiX } from 'react-icons/hi';
import { createPost } from '../../store/slices/communitySlice.js';
import { Spinner } from '../../components/common/Loader.jsx';

const POST_TYPES = [
  'General Fitness', 'Workout', 'Progress Photo', 'Transformation', 
  'Achievement', 'Question', 'Nutrition', 'Mobility', 'Challenge'
];

const CreatePostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [caption, setCaption] = useState('');
  const [postType, setPostType] = useState('General Fitness');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('Public');
  
  const [images, setImages] = useState([]); // File objects
  const [previewUrls, setPreviewUrls] = useState([]); // Local Object URLs for preview
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    setError(''); // Clear previous error

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} is too large (max 5MB).`);
        return false;
      }
      return true;
    });
    
    if (images.length + validFiles.length > 4) {
      setError('You can only upload up to 4 images per post.');
      return;
    }
    
    setImages(prev => [...prev, ...validFiles]);
    
    const newUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Cleanup object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && images.length === 0) {
      setError('Please add a caption or an image to post.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('postType', postType);
    formData.append('tags', tags);
    formData.append('visibility', visibility);
    
    images.forEach(img => {
      formData.append('images', img);
    });

    const result = await dispatch(createPost(formData));
    if (createPost.fulfilled.match(result)) {
      navigate('/community', { replace: true });
    } else {
      setError(result.payload || 'Failed to create post');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 px-4 sm:px-0">
      
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white bg-surface-border/30 rounded-full hover:bg-surface-border transition-colors">
          <HiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">Create Post</h1>
          <p className="text-sm text-slate-400 mt-1">Share your fitness journey</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-surface to-surface-border/20 border border-surface-border rounded-3xl shadow-lg shadow-black/40 p-5 sm:p-8 space-y-6">
        
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="shrink-0">⚠️</span> {error}
          </div>
        )}

        <div>
          <textarea
            placeholder="What's on your mind? Share your fitness journey..."
            className="w-full min-h-[160px] p-4 bg-surface-border/10 border border-transparent focus:border-surface-border focus:bg-surface-border/20 rounded-2xl text-lg text-white resize-none placeholder:text-slate-400 transition-colors focus:outline-none"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className={`grid gap-3 ${previewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-square sm:aspect-auto sm:h-64 rounded-2xl overflow-hidden bg-surface border border-slate-500/30 shadow-md shadow-black/20 group">
                <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center justify-center transition-all hover:bg-red-500/80 hover:scale-105 shadow-lg"
                  aria-label="Remove image"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-surface-border/50 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <div className="sm:col-span-2 flex items-center justify-between bg-surface-border/10 p-3 rounded-2xl border border-surface-border/50">
            <div className="relative">
              <input 
                type="file" 
                multiple 
                accept="image/jpeg,image/png,image/webp" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={images.length >= 4}
                aria-label="Add Photos"
              />
              <button type="button" className={`h-10 px-5 rounded-xl inline-flex items-center gap-2 bg-surface hover:bg-surface-border text-white border border-surface-border transition-colors font-medium text-sm ${images.length >= 4 ? 'opacity-50' : ''}`}>
                <HiPhotograph className="w-5 h-5 text-brand-400" /> Add Photos
              </button>
            </div>
            <span className="text-sm font-medium text-slate-400 px-3">{images.length}/4</span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
            <select className="w-full h-12 px-4 rounded-xl bg-surface-border/30 border border-surface-border focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white outline-none transition-all appearance-none cursor-pointer" value={postType} onChange={(e) => setPostType(e.target.value)}>
              {POST_TYPES.map(t => <option key={t} value={t} className="bg-surface">{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Visibility</label>
            <select className="w-full h-12 px-4 rounded-xl bg-surface-border/30 border border-surface-border focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white outline-none transition-all appearance-none cursor-pointer" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option value="Public" className="bg-surface">Public</option>
              <option value="Followers" className="bg-surface">Followers Only</option>
              <option value="Private" className="bg-surface">Private</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Hashtags</label>
            <input 
              type="text" 
              className="w-full h-12 px-4 rounded-xl bg-surface-border/30 border border-surface-border focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white outline-none transition-all placeholder:text-slate-500" 
              placeholder="e.g. fitness, calisthenics, PR (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

        </div>

        <div className="pt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="h-12 px-8 min-w-[140px] rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? <Spinner size="sm" /> : 'Post'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreatePostPage;
