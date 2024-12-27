import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { OutletError } from '@/shared/ui/OutletError';
import { ConversationProvider } from '../model/provider';
import { Content } from './Content';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useQuery } from '@/shared/lib/hooks/useQuery';
import { conversationApi } from '../api';
import { SourceRefPath } from '@/entities/Message/model/types';
import { useSocket } from '@/shared/model/store';
import { ApiException } from '@/shared/api/error';
import { ChatSkeleton } from '@/shared/ui/ChatSkeleton';

export const Conversation = () => {
    const { id } = useParams() as { id: string };

    const setChat = useChat((state) => state.actions.setChat);
    const navigate = useNavigate();
    
    const { isLoading, isError, isRefetching, refetch, data } = useQuery(({ signal }) => conversationApi.get(id!, signal), {
        keys: [id],
        retry: 5,
        retryDelay: 2000,
        onSelect: ({ messages, ...data }) => data,
        onSuccess: ({ messages }) => {
            setChat({
                messages,
                params: {
                    id,
                    type: SourceRefPath.CONVERSATION,
                    query: { recipientId: id, session_id: useSocket.getState().session_id }
                }
            });
        },
        onError: (error) => error instanceof ApiException && error.response.status === 404 && navigate('/')
    });

    if (isLoading) return <ChatSkeleton />;

    if (isError) {
        return (
            <OutletError
                title='Something went wrong'
                description='Cannot load conversation'
                callToAction={
                    <Button onClick={refetch} className='mt-5' disabled={isRefetching}>
                        {isRefetching ? <Loader2 className='w-6 h-6 animate-spin' /> : 'try again'}
                    </Button>
                }
            />
        );
    }

    return (
        <ConversationProvider conversation={data}>
            <Content />
        </ConversationProvider>
    );
};