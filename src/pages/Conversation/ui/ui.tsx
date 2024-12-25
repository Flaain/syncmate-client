import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { OutletError } from '@/shared/ui/OutletError';
import { Content } from './Content';
import { useConversation } from '../model/context';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import { RequestStatuses } from '@/shared/model/types';
import { OutletSkeleton } from '@/shared/ui/OutletSkeleton';

export const Conversation = () => {
    const { id } = useParams();
    const { status, error, isRefetching, getConversation } = useConversation(useShallow((state) => ({
        status: state.status,
        error: state.error,
        isRefetching: state.isRefetching,
        getConversation: state.actions.getConversation
    })));

    const components: Record<Exclude<RequestStatuses, 'refetching'>, React.ReactNode> = {
        error: (
            <OutletError
                title='Something went wrong'
                description={error! ?? 'Cannot load conversation'}
                callToAction={
                    <Button onClick={() => getConversation({ action: 'refetch', recipientId: id! })} className='mt-5'>
                        {isRefetching ? <Loader2 className='w-6 h-6 animate-spin' /> : 'try again'}
                    </Button>
                }
            />
        ),
        loading: <OutletSkeleton />,
        idle: <Content />
    };

    return components[status as keyof typeof components];
};