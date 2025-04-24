import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import ErrorLaptop from '@/shared/lib/assets/errors/laptop.svg?react';

import { ApiException } from '@/shared/api';
import { useQuery } from '@/shared/lib/hooks/useQuery';
import { setChatSelector, useChat } from '@/shared/lib/providers/chat';
import { useSocket } from '@/shared/model/store';
import { CHAT_TYPE } from '@/shared/model/types';
import { Button } from '@/shared/ui/button';
import { ChatSkeleton } from '@/shared/ui/ChatSkeleton';
import { OutletError } from '@/shared/ui/OutletError';

import { conversationApi } from '../api';
import { ConversationProvider } from '../model/provider';

import { Content } from './Content';

export const Conversation = ({ fallback }: { fallback?: React.ReactNode }) => {
    const { id } = useParams() as { id: string };
    
    const setChat = useChat(setChatSelector);
    const navigate = useNavigate();
    
    const { isLoading, isError, isRefetching, refetch, data } = useQuery(({ signal }) => conversationApi.get(id!, signal), {
        keys: [id],
        retry: 5,
        retryDelay: 2000,
        onSelect: ({ messages, ...data }) => data,
        onSuccess: ({ messages }) => {
            setChat({
                messages: { data: new Map(messages.data), nextCursor: messages.nextCursor },
                params: {
                    id,
                    type: CHAT_TYPE.Conversation,
                    query: { recipientId: id, session_id: useSocket.getState().session_id }
                }
            });
        },
        onError: (error) => error instanceof ApiException && error.response.status === 404 && navigate('/')
    });

    if (!data && isLoading) return fallback ?? <ChatSkeleton />;

    if (isError) {
        return (
            <OutletError
                img={<ErrorLaptop width='100%' height='100%' />}
                title='Something went wrong'
                description='Cannot load conversation'
                callToAction={
                    <Button onClick={refetch} className='mt-5' disabled={isRefetching}>
                        {isRefetching ? <Loader2 className='size-6 animate-spin' /> : 'try again'}
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