/**
 * @page LoginPage
 * @description Login page — email + password with password visibility toggle,
 *              Zod validation, server-error display, and redirect after login.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiLightningBolt } from 'react-icons/hi';

import { loginUser } from '../../store/slices/authSlice.js';
import { loginSchema } from '../../utils/validators.js';
import useAuth from '../../hooks/useAuth.js';
import { Spinner } from '../../components/common/Loader.jsx';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(loginSchema) });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.rejected.match(result)) {
      setError('root', { message: result.payload });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-4">
          <HiLightningBolt className="w-6 h-6 text-brand-400" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white">Welcome back</h2>
        <p className="text-slate-400 mt-1.5">Sign in to your FitAI account</p>
      </div>

      {/* Server error */}
      {errors.root && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {errors.root.message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="label">
            Email address
          </label>
          <div className="relative">
            <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`input pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="label mb-0">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <HiEyeOff className="w-4.5 h-4.5" /> : <HiEye className="w-4.5 h-4.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full h-11 mt-2"
        >
          {isLoading ? <Spinner size="sm" /> : 'Sign in'}
        </button>
      </form>

      {/* Divider */}
      <div className="divider my-6" />

      {/* Register link */}
      <p className="text-center text-slate-400 text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Create one for free
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
