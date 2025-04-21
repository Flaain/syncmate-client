import { create } from 'zustand';

import { useProfile } from '@/entities/profile';

import { SessionStore } from './types';

export const useSession = create<SessionStore>((set) => ({
    userId: null!,
    isAuthInProgress: true,
    isAuthorized: false,
    actions: {
        onSignin: (userId) => set({ userId, isAuthorized: true, isAuthInProgress: false }),
        onSignout: () => {
            set({ userId: null!, isAuthorized: false, isAuthInProgress: false });
            useProfile.setState({ profile: null! });
        }
    }
}));