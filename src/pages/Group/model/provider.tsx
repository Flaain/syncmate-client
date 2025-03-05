import React from 'react';
import { createStore } from 'zustand';
import { GroupStore } from './types';
import { GroupContext } from './context';
import { useParams } from 'react-router-dom';
import { useProfile } from '@/entities/profile';
import { useSocket } from '@/shared/model/store';
import { useShallow } from 'zustand/shallow';
import { GROUP_EVENTS } from '@/pages/Conversation/model/types';
import { Message } from '@/entities/Message/model/types';
import { useChat } from '@/shared/lib/providers/chat/context';

export const GroupProvider = ({ group, children }: { group: GroupStore['group']; children: React.ReactNode }) => {
    const { id } = useParams() as { id: string };
    const { 0: store } = React.useState(() => createStore<GroupStore>(() => ({ group })));

    const setGroupParticipant = useProfile((state) => state.actions.setGroupParticipant);
    const setChat = useChat((state) => state.actions.setChat);

    const socket = useSocket(useShallow((state) => state.socket));

    React.useEffect(() => {
        socket?.emit(GROUP_EVENTS.JOIN, { groupId: id });

        socket?.io.on('reconnect', () => socket?.emit(GROUP_EVENTS.JOIN, { groupId: id }));

        socket?.on(GROUP_EVENTS.MESSAGE_SEND, (message: Message) => {
            setChat(({ messages }) => ({ messages: { ...messages, data: [...messages.data, message] } }))
        })

        return () => {
            socket?.off(GROUP_EVENTS.MESSAGE_SEND);
            
            socket?.io.off('reconnect');

            socket?.emit(GROUP_EVENTS.LEAVE, { groupId: id });

            setGroupParticipant(null!);
        }
    }, [id]);

    return <GroupContext.Provider value={store}>{children}</GroupContext.Provider>;
};