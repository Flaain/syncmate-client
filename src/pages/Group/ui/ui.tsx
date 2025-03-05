import { useNavigate, useParams } from 'react-router-dom';
import { OutletError } from '@/shared/ui/OutletError';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { Content } from './Content';
import { ChatSkeleton } from '@/shared/ui/ChatSkeleton';
import { useQuery } from '@/shared/lib/hooks/useQuery';
import { groupApi } from '../api';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useSocket } from '@/shared/model/store';
import { SourceRefPath } from '@/entities/Message/model/types';
import { ApiException } from '@/shared/api/error';
import { GroupProvider } from '../model/provider';
import { useProfile } from '@/entities/profile';

export const Group = () => {
    const { id } = useParams() as { id: string };

    const setChat = useChat((state) => state.actions.setChat);
    const navigate = useNavigate();
    const setGroupParticipant = useProfile((state) => state.actions.setGroupParticipant);
    
    const { data, isLoading, isError, isRefetching, refetch } = useQuery(({ signal }) => groupApi.get(id, signal), {
        keys: [id],
        retry: 5,
        retryDelay: 2000,
        onSelect: ({ messages, me, ...data }) => data,
        onSuccess: ({ messages, me }) => {
            setGroupParticipant(me);
            setChat({
                messages,
                params: {
                    id,
                    query: { groupId: id, session_id: useSocket.getState().session_id },
                    type: SourceRefPath.GROUP
                }
            });
        },
        onError: (error) => error instanceof ApiException && error.response.status === 404 && navigate('/')
    });

    if (!data && isLoading) return <ChatSkeleton />;

    if (isError) {
        return (
            <OutletError
                title='Something went wrong'
                description='Cannot load group'
                callToAction={
                    <Button onClick={refetch} className='mt-5' disabled={isRefetching}>
                        {isRefetching ? <Loader2 className='size-6 animate-spin' /> : 'try again'}
                    </Button>
                }
            />
        );
    }

    return (
        <GroupProvider group={data}>
            <Content />
        </GroupProvider>
    );
};