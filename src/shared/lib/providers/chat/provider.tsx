import React from 'react';

import { useNavigate } from 'react-router-dom';
import { createStore } from 'zustand';

import { useEvents } from '@/shared/model/store';

import { chatActions } from './actions';
import { ChatContext } from './context';
import { ChatProviderProps, ChatStore } from './types';

const initialState: Omit<ChatStore, 'actions'> = {
    params: null!,
    isContextActionsBlocked: false,
    showDetails: false,
    messages: { data: new Map(), nextCursor: null },
    selectedMessages: new Map(),
    mode: 'default',
    showAnchor: false,
    refs: {
        lastMessageRef: React.createRef(),
        listRef: React.createRef(),
        textareaRef: React.createRef()
    },
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const { 0: store } = React.useState(() => createStore<ChatStore>((set, get) => ({ ...initialState, actions: chatActions(set, get) })));

    const navigate = useNavigate();
    const addEventListener = useEvents((state) => state.addEventListener);

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => {
            event.key === 'Escape' && navigate('/');
        });

        return () => {
            removeEventListener();
        };
    }, [])

    return <ChatContext.Provider value={store}>{children}</ChatContext.Provider>;
};