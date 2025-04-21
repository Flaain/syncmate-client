import { createStore } from 'zustand';

import { createZustandContext } from '@/shared/lib/utils/createZustandContext';

import { prevMenu } from './constants';
import { SettingMenu, SettingsStore } from './types';

export const { Provider: SettingsProvider, useContext: useSettings } = createZustandContext<SettingsStore>(() => createStore((set) => ({
    menu: 'main',
    actions: {
        onBack: () => set((prevState) => ({ menu: prevMenu[prevState.menu as keyof typeof prevMenu] })),
        onMenuChange: (menu: SettingMenu) => set({ menu })
    }
})));