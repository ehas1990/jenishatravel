'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Settings as SettingsIcon, 
  User as UserIcon, 
  Lock, 
  Globe, 
  Loader2, 
  CheckCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import { getSettings, updateSettings, updateAdminProfile } from '@/actions/settings';
import { changePasswordAction } from '@/actions/auth';

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { showToast } = useToast();

  const currentUserId = session?.user?.id || '';
  const currentUserRole = session?.user?.role || '';

  // Tab State
  const [activeTab, setActiveTab] = useState<'website' | 'profile' | 'security'>('website');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [updatingWebsite, setUpdatingWebsite] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingSecurity, setUpdatingSecurity] = useState(false);

  // Website Settings State
  const [websiteName, setWebsiteName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [footerDetails, setFooterDetails] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');

  // Profile Settings State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Password Settings State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load Settings
  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const res = await getSettings();
        const settings = res.settings as any;
        if (settings) {
          setWebsiteName(settings.websiteName || 'VistaLuxe Travel');
          setLogoUrl(settings.logoUrl || '');
          setFooterDetails(settings.footerDetails || '');
          setSocialInstagram(settings.socialInstagram || '');
          setSocialFacebook(settings.socialFacebook || '');
          setSocialTwitter(settings.socialTwitter || '');
        }
        
        if (session?.user) {
          setFullName(session.user.name || '');
          setEmail(session.user.email || '');
        }
      } catch (err) {
        showToast('Failed to load settings data', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [session, showToast]);

  // Submit Website Settings
  const handleUpdateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole !== 'ADMIN') {
      showToast('Only administrators can update global settings', 'error');
      return;
    }

    setUpdatingWebsite(true);
    try {
      const res = await updateSettings(currentUserId, {
        websiteName,
        logoUrl,
        footerDetails,
        socialInstagram,
        socialFacebook,
        socialTwitter,
      });

      if (res.error) {
        showToast(res.error, 'error');
      } else {
        showToast('Website configurations saved successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to save website configurations', 'error');
    } finally {
      setUpdatingWebsite(false);
    }
  };

  // Submit Profile Settings
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await updateAdminProfile(currentUserId, { fullName, email });
      if (res.error) {
        showToast(res.error, 'error');
      } else {
        // Update local session storage details
        await updateSession({
          name: fullName,
          email: email,
        });
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to save profile changes', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Submit Password Change
  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 5) {
      showToast('Password must be at least 5 characters', 'error');
      return;
    }

    setUpdatingSecurity(true);
    try {
      const res = await changePasswordAction(currentUserId, oldPassword, newPassword);
      if (res.error) {
        showToast(res.error, 'error');
      } else {
        showToast('Password updated successfully!', 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showToast('Failed to update account security', 'error');
    } finally {
      setUpdatingSecurity(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="text-[14px] font-semibold text-heading">Loading settings page...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title */}
      <div>
        <h1 className="font-heading font-extrabold text-[26px] text-heading">Settings</h1>
        <p className="text-[14px] text-paragraph mt-1">Configure global branding variables, update profile metadata, and change password.</p>
      </div>

      {/* Settings Layout container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start w-full">
        {/* Navigation Tabs (Left Sidebar pane) */}
        <div className="lg:col-span-1 bg-white border border-border rounded-xl shadow-soft p-3 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('website')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer text-left ${
              activeTab === 'website'
                ? 'bg-teal-50 text-primary'
                : 'text-paragraph hover:bg-light-gray hover:text-heading'
            }`}
          >
            <Globe className="w-4.5 h-4.5" />
            Website Branding
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer text-left ${
              activeTab === 'profile'
                ? 'bg-teal-50 text-primary'
                : 'text-paragraph hover:bg-light-gray hover:text-heading'
            }`}
          >
            <UserIcon className="w-4.5 h-4.5" />
            Admin Profile
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer text-left ${
              activeTab === 'security'
                ? 'bg-teal-50 text-primary'
                : 'text-paragraph hover:bg-light-gray hover:text-heading'
            }`}
          >
            <Lock className="w-4.5 h-4.5" />
            Password & Security
          </button>
        </div>

        {/* Content Sheet (Right pane) */}
        <div className="lg:col-span-3 bg-white border border-border rounded-xl shadow-soft p-6 md:p-8">
          
          {/* Tab 1: Website Branding */}
          {activeTab === 'website' && (
            <form onSubmit={handleUpdateWebsite} className="flex flex-col gap-5">
              <div className="border-b border-border/60 pb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-heading text-[16px]">Website Branding</h3>
              </div>

              {currentUserRole !== 'ADMIN' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 text-[13px] px-4 py-2.5 rounded-xl">
                  Note: Only users with the <strong>ADMIN</strong> role can update global website branding.
                </div>
              )}

              <Input
                label="Website Title Name"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                placeholder="VistaLuxe Travel"
                disabled={currentUserRole !== 'ADMIN'}
                required
              />

              <ImageUpload
                value={logoUrl}
                onChange={(url) => setLogoUrl(url as string)}
                label="Website Corporate Logo"
                disabled={currentUserRole !== 'ADMIN'}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Instagram Profile Link"
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  placeholder="https://instagram.com/vlux"
                  disabled={currentUserRole !== 'ADMIN'}
                />

                <Input
                  label="Facebook Profile Link"
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  placeholder="https://facebook.com/vlux"
                  disabled={currentUserRole !== 'ADMIN'}
                />

                <Input
                  label="Twitter / X Profile Link"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value)}
                  placeholder="https://twitter.com/vlux"
                  disabled={currentUserRole !== 'ADMIN'}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-heading font-semibold text-heading">Footer Copyright Details</label>
                <textarea
                  rows={3}
                  value={footerDetails}
                  onChange={(e) => setFooterDetails(e.target.value)}
                  placeholder="© 2026 VistaLuxe Travel. All Rights Reserved."
                  className="w-full px-4 py-3 bg-white border border-border text-[14.5px] rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-light-gray"
                  disabled={currentUserRole !== 'ADMIN'}
                  required
                />
              </div>

              {currentUserRole === 'ADMIN' && (
                <Button
                  type="submit"
                  variant="primary"
                  className="w-fit mt-2 rounded-xl"
                  disabled={updatingWebsite}
                >
                  {updatingWebsite ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    'Save Website Configurations'
                  )}
                </Button>
              )}
            </form>
          )}

          {/* Tab 2: Admin Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
              <div className="border-b border-border/60 pb-3 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-heading text-[16px]">Admin Profile</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  disabled={updatingProfile}
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@vista.luxe"
                  required
                  disabled={updatingProfile}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-fit mt-2 rounded-xl"
                disabled={updatingProfile}
              >
                {updatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile Details'
                )}
              </Button>
            </form>
          )}

          {/* Tab 3: Security */}
          {activeTab === 'security' && (
            <form onSubmit={handleUpdateSecurity} className="flex flex-col gap-5">
              <div className="border-b border-border/60 pb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-heading text-[16px]">Password & Account Security</h3>
              </div>

              <Input
                label="Current Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={updatingSecurity}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={updatingSecurity}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={updatingSecurity}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-fit mt-2 rounded-xl"
                disabled={updatingSecurity}
              >
                {updatingSecurity ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Updating Security...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
