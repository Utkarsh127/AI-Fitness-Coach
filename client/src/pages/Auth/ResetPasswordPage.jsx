/**
 * @page ResetPasswordPage
 * @description Reset password using the token from the reset email URL.
 */

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { HiEye, HiEyeOff, HiLockClosed, HiCheckCircle } from 'react-icons/hi';

import { resetUserPassword } from '../../store/slices/authSlice.js';
import { resetPasswordSchema } from '../../utils/validators.js';
import useAuth from '../../hooks/useAuth.js';
import { Spinner } from '../../components/common/Loader.jsx';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data) => {
    const result = await dispatch(resetUserPassword({ token, data }));
    if (resetUserPassword.rejected.match(result)) {
      setError('root', { message: result.payload });
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-5">
          <HiCheckCircle className="w-9 h-9 text-brand-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Password reset!</h2>
        <p className="text-slate-400">Redirecting you to sign in…</p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-4">
          <HiLockClosed className="w-6 h-6 text-brand-400" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white">Set new password</h2>
        <p className="text-slate-400 mt-1.5">Your new password must be different from previous ones.</p>
      </div>

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
        {/* New Password */}
        <div>
          <label htmlFor="reset-password" className="label">New password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="reset-password"
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
          {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="reset-confirm" className="label">Confirm new password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="reset-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your new password"
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
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        <button
          id="reset-submit"
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full h-11"
        >
          {isLoading ? <Spinner size="sm" /> : 'Reset password'}
        </button>
      </form>

      <p className="mt-5 text-center text-slate-400 text-sm">
        Remember your password?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
