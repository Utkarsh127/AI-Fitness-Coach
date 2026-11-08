import { Link } from 'react-router-dom';
const NotFoundPage = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center p-6">
    <div className="text-center">
      <p className="text-8xl font-display font-bold text-brand-500/30">404</p>
      <h1 className="text-2xl font-display font-bold text-white mt-2 mb-4">Page not found</h1>
      <Link to="/" className="btn-primary">Go home</Link>
    </div>
  </div>
);
export default NotFoundPage;
