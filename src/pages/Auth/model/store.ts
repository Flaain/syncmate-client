import { createStore } from 'zustand';

import { createZustandContext } from '@/shared/lib/utils/createZustandContext';

import { AuthStage, AuthStore } from './types';

export const { Provider: AuthProvider, useContext: useAuth } = createZustandContext<AuthStore>(() => createStore((set) => ({
    authStage: 'welcome',
    changeAuthStage: (stage: AuthStage) => set({ authStage: stage })
})));