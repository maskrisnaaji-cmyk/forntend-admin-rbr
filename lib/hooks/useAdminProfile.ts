"use client";

import { useState, useEffect, useCallback } from 'react';

export interface AdminProfile {
  name: string;
  email: string;
  initials: string;
  role: string;
}

const DEFAULT_PROFILE: AdminProfile = {
  name: 'Admin RBR',
  email: 'admin@rbr.com',
  initials: 'AR',
  role: 'Super Administrator',
};

function computeInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AD';
}

export function useAdminProfile(): AdminProfile {
  const [profile, setProfile] = useState<AdminProfile>(DEFAULT_PROFILE);

  const loadProfile = useCallback(() => {
    if (typeof window === 'undefined') return;

    let name = DEFAULT_PROFILE.name;
    let email = DEFAULT_PROFILE.email;
    let role = DEFAULT_PROFILE.role;

    // Priority 1: rbr_admin_profile (set by ProfileSettingsTab)
    const savedProfile = localStorage.getItem('rbr_admin_profile');
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        if (p.name) name = p.name;
        if (p.email) email = p.email;
        if (p.department) role = p.department;
      } catch (_) {}
    }

    // Priority 2: sessionStorage user (set on login)
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      try {
        const u = JSON.parse(sessionUser);
        // Only override if rbr_admin_profile was NOT set
        if (!savedProfile) {
          if (u.name) name = u.name;
          if (u.email) email = u.email;
        }
      } catch (_) {}
    }

    setProfile({
      name,
      email,
      initials: computeInitials(name),
      role,
    });
  }, []);

  useEffect(() => {
    loadProfile();

    // Listen for profile updates dispatched by ProfileSettingsTab
    const handler = () => loadProfile();
    window.addEventListener('admin-profile-updated', handler);
    // Also listen for storage events from other tabs
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('admin-profile-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, [loadProfile]);

  return profile;
}
