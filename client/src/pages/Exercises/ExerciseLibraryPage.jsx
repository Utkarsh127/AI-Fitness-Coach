/**
 * @page ExerciseLibraryPage
 * @description Searchable exercise database with filters.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiSearch, HiFilter, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import useDebounce from '../../hooks/useDebounce.js';
import { fetchExercises } from '../../store/slices/exerciseSlice.js';
import { FullScreenLoader, Spinner } from '../../components/common/Loader.jsx';

const EXERCISE_CATEGORIES = ['All', 'Calisthenics', 'Strength Training', 'Hybrid', 'Mobility', 'Conditioning'];

const ExerciseLibraryPage = () => {
  const dispatch = useDispatch();
  const { exercises, pagination, isLoading, error } = useSelector(state => state.exercise);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = {
      page,
      limit: 12,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(category !== 'All' && { category }),
    };
    dispatch(fetchExercises(params));
  }, [dispatch, debouncedSearch, category, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ─── HEADER & SEARCH ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Exercise Library</h1>
          <p className="text-slate-400">Discover and master new movements.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search exercises..." 
            className="input pl-10 bg-surface border-surface-border w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ─── FILTERS ────────────────────────────────────────────────── */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <HiFilter className="w-5 h-5 text-brand-400" /> Filter:
        </div>
        <select 
          className="input bg-surface-border py-2 text-sm max-w-[200px]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {EXERCISE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* ─── EXERCISE GRID ──────────────────────────────────────────── */}
      {isLoading && exercises.length === 0 ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="glass-card p-12 text-center text-red-400 flex flex-col items-center">
          <p className="font-bold text-lg mb-2">Failed to load exercises</p>
          <p className="text-sm">{error}</p>
          <button onClick={() => dispatch(fetchExercises({ page: 1, limit: 12 }))} className="mt-4 btn-secondary">Retry</button>
        </div>
      ) : exercises.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          No exercises found matching your criteria.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exercises.map(exercise => (
              <Link to={`/exercises/${exercise.slug}`} key={exercise._id} className="bg-surface border border-surface-border rounded-2xl overflow-hidden hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 transition-all group flex flex-col h-full">
                <div className="w-full aspect-[4/3] bg-surface-border relative overflow-hidden shrink-0">
                  {exercise.imageUrl ? (
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%231E293B'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%2364748B' font-family='sans-serif' font-size='16px' font-weight='bold' font-style='normal'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-brand-500/10 group-hover:bg-brand-500/20 transition-colors">
                      <span className="text-xs uppercase tracking-wider font-bold text-brand-300">{exercise.category}</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider rounded-lg text-brand-400 border border-white/10">
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-lg text-white mb-1 group-hover:text-brand-400 transition-colors line-clamp-1">{exercise.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{exercise.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-surface-border flex flex-wrap gap-2">
                    {exercise.muscleGroups?.slice(0, 3).map(m => (
                      <span key={m} className="text-[10px] px-2 py-1.5 rounded-md bg-surface-border/50 text-slate-300 font-medium uppercase tracking-wide">{m}</span>
                    ))}
                    {exercise.muscleGroups.length > 3 && (
                      <span className="text-[10px] px-2 py-1.5 rounded-md bg-surface-border/50 text-slate-500 font-medium uppercase">+{exercise.muscleGroups.length - 3}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ─── PAGINATION ────────────────────────────────────────────── */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary h-10 w-10 p-0 flex items-center justify-center disabled:opacity-50"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-slate-300 font-medium">Page {page} of {pagination.totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="btn-secondary h-10 w-10 p-0 flex items-center justify-center disabled:opacity-50"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseLibraryPage;
