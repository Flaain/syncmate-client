import React from 'react';

import { StackableItemProps } from './types';

export const StackableContext = React.createContext<{ open: (menu: StackableItemProps) => void; closeAll: () => void }>(null!);

export const useStackable = () => {
    const store = React.useContext(StackableContext);

    if (!store) throw new Error('useSidebar must be used within a SidebarProvider');

    return store;
};
