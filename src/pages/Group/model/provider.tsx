import React from 'react';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useSocket } from '@/shared/model/store';
import { useNavigate, useParams } from 'react-router-dom';
import { createStore } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { GroupStore } from './types';
import { groupActions } from './actions';
import { GroupContext } from './context';

const initialState: GroupStore = {
    group: null!,
    actions: null!,
    status: 'loading',
    isRefetching: false
};

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
    const { setChat, getChat } = useChat(useShallow((state) => ({ setChat: state.actions.setChat, getChat: state.actions.getChat })));
    const { id: groupId } = useParams() as { id: string };
    const { 0: store } = React.useState(() => createStore<GroupStore>((set, get) => ({
        ...initialState,
        actions: groupActions({ set, get, getChat, setChat })
    })));

    const socket = useSocket((state) => state.socket);
    const navigate = useNavigate();

    React.useEffect(() => {
        const abortController = new AbortController();

        store.getState().actions.getGroup(groupId, 'init', abortController.signal);

        return () => {
            abortController.abort();
        };
    }, []);

    return <GroupContext.Provider value={store}>{children}</GroupContext.Provider>;
};