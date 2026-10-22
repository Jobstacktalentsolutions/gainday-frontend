import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Gender, Pronouns } from '../utils/profileOptions';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  authProvider?: string;
  profileId?: string;
  fullName?: string;
  companyName?: string;
  phoneNumber?: string;
  // Candidate-only. `isProfileComplete` is false until pronouns have been set.
  gender?: Gender | null;
  pronouns?: Pronouns | null;
  brief?: string | null;
  title?: string | null;
  isProfileComplete?: boolean;
  mustChangePassword?: boolean;
  adminRole?: 'SUPER_ADMIN' | 'MANAGER' | 'MODERATOR';
  isSuperAdmin?: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  setAuth: (token: string | null, user: AuthUser | null) => void;
  clearAuth: () => void;
}

const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: getTokenFromCookie(),
      user: null,
      setAuth: (token, user) => set({ accessToken: token, user }),
      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'gainday-auth',
      // Only persist the token — user profile is always re-fetched from the API
      // on mount so a stale cached user object can never bypass the auth guard.
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
