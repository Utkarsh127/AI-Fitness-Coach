/**
 * @module layouts/AuthLayout
 * @description Centred split-screen layout for Login / Register pages.
 *
 * Left panel: decorative brand panel (hidden on mobile)
 * Right panel: form card
 */

import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => (
  <div className="min-h-screen bg-surface flex">
    {/* ─── Left decorative panel (md+) ───────────────────────────── */}
    <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-brand-900 via-surface to-surface flex-col items-center justify-center p-12">
      {/* Glowing orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-glow">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-display text-2xl font-bold text-white">FitAI</span>
        </Link>

        <h1 className="text-4xl font-display font-bold text-white leading-tight mb-4">
          Your Personal<br />
          <span className="text-brand-400">AI Fitness Coach</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Personalised workouts, AI-powered nutrition plans, and a community to keep you motivated.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { value: '50K+', label: 'Members' },
            { value: '1M+', label: 'Workouts' },
            { value: '98%', label: 'Satisfied' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-display font-bold text-brand-400">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* ─── Right form panel ──────────────────────────────────────── */}
    <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
      {/* Mobile logo */}
      <Link to="/" className="flex md:hidden items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-display text-xl font-bold text-white">FitAI</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Outlet />
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
