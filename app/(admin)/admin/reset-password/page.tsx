'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Compass, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { resetPasswordAction } from '@/actions/auth';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const token = searchParams.get('token') || 'demo-token';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 5) {
      setErrorMsg('Password must be at least 5 characters long');
      showToast('Password is too short', 'error');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await resetPasswordAction(token, password);
      if (res.error) {
        setErrorMsg(res.error);
        showToast(res.error, 'error');
      } else if (res.message) {
        setSuccessMsg(res.message);
        showToast(res.message, 'success');
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      }
    } catch (err) {
      setErrorMsg('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-white rounded-[24px] shadow-hover border border-border/80 overflow-hidden flex flex-col">
      {/* Head */}
      <div className="p-8 text-center bg-light-gray/40 border-b border-border/50 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-soft">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-heading font-extrabold text-[22px] tracking-tight text-heading">
            RESET PASSWORD
          </h2>
          <p className="text-[13px] text-paragraph mt-1">
            Choose a new secure password for your account
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-[13px] font-medium">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-[13px] font-medium">
            {errorMsg}
          </div>
        )}

        {!successMsg && (
          <>
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
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

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Save Password'
              )}
            </Button>
          </>
        )}

        <button
          type="button"
          onClick={() => router.push('/admin/login')}
          className="flex items-center justify-center gap-2 text-[13px] font-semibold text-primary hover:underline hover:cursor-pointer mx-auto bg-transparent border-none mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[450px] bg-white rounded-[24px] shadow-hover border border-border/80 p-8 flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-[13px] font-medium text-slate-400">Loading secure key validator...</span>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
