import { createStore } from 'zustand';

import { SigninStage } from '@/features/Signin';

import { createZustandContext } from '@/shared/lib/utils/createZustandContext';

import { SigninStore } from './types';

export const { Provider: SigninProvider, useContext: useSigninForm } = createZustandContext<SigninStore>(() => createStore((set) => ({
    stage: 'signin',
    changeSigninStage: (stage: SigninStage) => set({ stage })
})));