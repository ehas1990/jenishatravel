'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { forgotPasswordAction } from '@/actions/auth';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await forgotPasswordAction(email);
      if (res.error) {
        setErrorMsg(res.error);
        showToast(res.error, 'error');
      } else if (res.message) {
        setSuccessMsg(res.message);
        showToast(res.message, 'success');
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
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
            RECOVER PASSWORD
          </h2>
          <p className="text-[13px] text-paragraph mt-1">
            Enter your email to receive a password reset link
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
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vista.luxe"
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
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </>
        )}

        {/* Back Link */}
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
