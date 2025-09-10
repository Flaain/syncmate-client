import React from 'react';

import { StackableItemProps, StackableNodesRef } from './types';

export const StackableContext = React.createContext<{
    open: (menu: StackableItemProps) => void;
    nodesRef: React.RefObject<Record<string, StackableNodesRef> | null>;
    isClosing: React.RefObject<boolean>;
}>(null!);

export const useStackable = () => {
    const store = React.useContext(StackableContext);

    if (!store) throw new Error('useSidebar must be used within a SidebarProvider');

    return store;
};