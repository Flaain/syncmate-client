import React from 'react';

import { StoreApi, useStore } from 'zustand';

import { ConversationStore } from './types';

export const ConversationContext = React.createContext<StoreApi<ConversationStore>>(null!);

export const useConversation = <U>(selector: (state: ConversationStore) => U) => {
    const store = React.useContext(ConversationContext);

    if (!store) throw new Error('useConversation must be used within a ConversationProvider');

    return useStore(store, selector);
};