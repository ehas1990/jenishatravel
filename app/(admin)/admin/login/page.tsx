'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Compass, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginAction } from '@/actions/auth';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  // Load remembered email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('vlux_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('rememberMe', rememberMe.toString());

      const res = await loginAction(null, formData);

      if (res?.error) {
        setErrorMsg(res.error);
        showToast(res.error, 'error');
      } else if (res?.success) {
        if (rememberMe) {
          localStorage.setItem('vlux_remembered_email', email);
        } else {
          localStorage.removeItem('vlux_remembered_email');
        }
        
        showToast('Login successful! Welcome back.', 'success');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-white rounded-[24px] shadow-hover border border-border/80 overflow-hidden flex flex-col animate-fade-in">
      {/* Brand Header */}
      <div className="p-8 text-center bg-light-gray/40 border-b border-border/50 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-soft">
          <Compass className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h2 className="font-heading font-extrabold text-[22px] tracking-tight text-heading">
            VISTALUXE TRAVEL
          </h2>
          <p className="text-[13px] text-paragraph mt-1">
            Sign in to access the luxury agency admin panel
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-[13px] font-medium">
            {errorMsg}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@vista.luxe"
          required
          disabled={loading}
          containerClassName="w-full"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            containerClassName="w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-600 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Remember Me & Recover password */}
        <div className="flex items-center justify-between text-[13px] font-medium mt-1">
          <label className="flex items-center gap-2 text-heading cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 border border-border rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            />
            Remember Me
          </label>
          <button
            type="button"
            onClick={() => router.push('/admin/forgot-password')}
            className="text-primary hover:underline hover:cursor-pointer bg-transparent border-none outline-none"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl animate-pulse-subtle"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[450px] bg-white rounded-[24px] shadow-hover border border-border/80 p-8 flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-[13px] font-medium text-slate-400">Loading secure uploader...</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
