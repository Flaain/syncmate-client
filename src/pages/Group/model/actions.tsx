import { ActionsProvider } from '@/shared/model/types';
import { GroupStore } from './types';
import { groupApi } from '../api';
import { redirect } from 'react-router-dom';
import { ApiException } from '@/shared/api/error';
import { useSocket } from '@/shared/model/store';

export const groupActions = ({ set, get, getChat, setChat }: ActionsProvider<GroupStore>): GroupStore['actions'] => ({
    getGroup: async (id, action, signal) => {
        try {
            action === 'refetch' && set({ isRefetching: true });

            const { data: { messages, ...group } } = await groupApi.get(id, signal);

            set({ group, status: 'idle', isRefetching: false });

            setChat({
                messages: messages.data,
                previousMessagesCursor: messages.nextCursor,
                params: {
                    id: group._id,
                    query: { groupId: group._id, session_id: useSocket.getState().session_id },
                    type: 'group'
                }
            })
        } catch (error) {
            console.error(error);

            error instanceof ApiException && (error.response.status === 404 ? redirect('/') : set({ status: 'error', isRefetching: false }));
        }
    }
});
