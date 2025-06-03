import React from 'react';

import { useNavigate } from 'react-router-dom';
import { createStore } from 'zustand';

import { DEFAULT_TITLE } from '@/shared/constants';
import { addEventListenerSelector } from '@/shared/model/selectors';
import { useEvents } from '@/shared/model/store';

import { chatActions } from './actions';
import { ChatContext } from './context';
import { ChatProviderProps, ChatStore } from './types';

const initialState: Omit<ChatStore, 'actions'> = {
    params: null!,
    isContextActionsBlocked: false,
    showDetails: false,
    isUpdating: false,
    chatInfo: null,
    messages: { data: new Map(), nextCursor: null },
    selectedMessages: new Map(),
    mode: 'default',
    showAnchor: false,
    refs: {
        lastMessageRef: React.createRef(),
        listRef: React.createRef(),
        textareaRef: React.createRef(),
        bottomPlaceholderRef: React.createRef(),
    },
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const { 0: store } = React.useState(() => createStore<ChatStore>((set, get) => ({ ...initialState, actions: chatActions(set, get) })));

    const navigate = useNavigate();
    const addEventListener = useEvents(addEventListenerSelector);

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => event.key === 'Escape' && navigate('/'));

        return () => {
            removeEventListener();

            document.title = DEFAULT_TITLE;
        }
    }, []);

    return <ChatContext.Provider value={store}>{children}</ChatContext.Provider>;
};