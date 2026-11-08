/**
 * @page ForgotPasswordPage
 * @description Forgot password — requests a reset link by email.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { HiMail, HiArrowLeft, HiCheckCircle } from 'react-icons/hi';

import { forgotUserPassword } from '../../store/slices/authSlice.js';
import { forgotPasswordSchema } from '../../utils/validators.js';
import useAuth from '../../hooks/useAuth.js';
import { Spinner } from '../../components/common/Loader.jsx';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { isLoading } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    await dispatch(forgotUserPassword(data.email));
    setSubmitted(true);
  };

  return (
    <div>
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to sign in
      </Link>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-5">
            <HiCheckCircle className="w-9 h-9 text-brand-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Check your inbox</h2>
          <p className="text-slate-400 leading-relaxed">
            If an account exists for{' '}
            <span className="text-white font-medium">{getValues('email')}</span>, we've sent a
            password reset link. Check your spam folder if you don't see it.
          </p>
          <Link to="/login" className="btn-primary inline-flex mt-6">
            Return to sign in
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-4">
              <HiMail className="w-6 h-6 text-brand-400" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white">Forgot password?</h2>
            <p className="text-slate-400 mt-1.5">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label htmlFor="forgot-email" className="label">Email address</label>
              <div className="relative">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <button
              id="forgot-submit"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11"
            >
              {isLoading ? <Spinner size="sm" /> : 'Send reset link'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
