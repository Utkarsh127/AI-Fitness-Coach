/**
 * @page RegisterPage
 * @description Registration page — name, username, email, password, confirm.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiUser, HiAtSymbol, HiSparkles } from 'react-icons/hi';

import { registerUser } from '../../store/slices/authSlice.js';
import { registerSchema } from '../../utils/validators.js';
import useAuth from '../../hooks/useAuth.js';
import { Spinner } from '../../components/common/Loader.jsx';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.rejected.match(result)) {
      setError('root', { message: result.payload });
    }
  };

  const password = watch('password', '');
  const getPasswordStrength = (pw) => {
    if (!pw) return { label: '', color: '' };
    const strong = pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw);
    const medium = pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
    if (strong) return { label: 'Strong', color: 'bg-brand-500' };
    if (medium) return { label: 'Good', color: 'bg-yellow-400' };
    return { label: 'Weak', color: 'bg-red-500' };
  };
  const strength = getPasswordStrength(password);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/20 flex items-center justify-center mb-4">
          <HiSparkles className="w-6 h-6 text-accent-400" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white">Create your account</h2>
        <p className="text-slate-400 mt-1.5">Join 50,000+ people achieving their fitness goals</p>
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="reg-name" className="label">Full name</label>
          <div className="relative">
            <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              placeholder="Enigmatic Engineer"
              className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
              {...register('name')}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label htmlFor="reg-username" className="label">Username</label>
          <div className="relative">
            <HiAtSymbol className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="reg-username"
              type="text"
              autoComplete="username"
              placeholder="enigmatic_engineer"
              className={`input pl-10 ${errors.username ? 'border-red-500' : ''}`}
              {...register('username')}
            />
          </div>
          {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="label">Email address</label>
          <div className="relative">
            <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
              {...register('email')}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-password" className="label">Password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
          {/* Strength bar */}
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-surface-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.label === 'Weak' ? 'w-1/3' : strength.label === 'Good' ? 'w-2/3' : 'w-full'}`} />
              </div>
              <span className="text-xs text-slate-400">{strength.label}</span>
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="reg-confirm" className="label">Confirm password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`input pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showConfirm ? <HiEyeOff className="w-4.5 h-4.5" /> : <HiEye className="w-4.5 h-4.5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          id="register-submit"
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full h-11 mt-2"
        >
          {isLoading ? <Spinner size="sm" /> : 'Create account'}
        </button>
      </form>

      <div className="divider my-6" />
      <p className="text-center text-slate-400 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
