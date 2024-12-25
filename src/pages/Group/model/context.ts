import React from 'react';
import { StoreApi, useStore } from 'zustand';
import { GroupStore } from './types';

export const GroupContext = React.createContext<StoreApi<GroupStore>>(null!);

export const useGroup = <U>(selector: (state: GroupStore) => U) => {
    const store = React.useContext(GroupContext);

    if (!store) throw new Error('useGroup must be used within a GroupProvider');

    return useStore(store, selector);
};