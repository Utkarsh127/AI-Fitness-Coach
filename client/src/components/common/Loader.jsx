/**
 * @module components/common/Loader
 * @description Full-screen and inline spinner variants.
 */

/**
 * Full-screen centred loading spinner.
 * Used while checkAuth() is running on mount.
 */
export const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-surface flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-surface-border border-t-brand-500 animate-spin" />
      <p className="text-slate-400 text-sm font-medium">Loading…</p>
    </div>
  </div>
);

/**
 * Inline spinner — centred within its container.
 * @param {{ size?: 'sm' | 'md' | 'lg', className?: string }} props
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div
      className={`rounded-full border-2 border-surface-border border-t-brand-500 animate-spin ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

/** Default export: full-screen loader */
export default FullScreenLoader;
