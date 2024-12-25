import { useParams } from 'react-router-dom';
import { useGroup } from '../model/context';
import { useShallow } from 'zustand/shallow';
import { RequestStatuses } from '@/shared/model/types';
import { OutletError } from '@/shared/ui/OutletError';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { Content } from './Content';
import { OutletSkeleton } from '@/shared/ui/OutletSkeleton';

export const Group = () => {
    const { id } = useParams();
    const { status, isRefetching, getGroup } = useGroup(useShallow((state) => ({ 
        status: state.status,
        isRefetching: state.isRefetching,
        getGroup: state.actions.getGroup, 
    })));

    const components: Record<Exclude<RequestStatuses, 'refetching'>, React.ReactNode> = {
        error: (
            <OutletError
                title='Something went wrong'
                description='Cannot load group'
                callToAction={
                    <Button disabled={isRefetching} onClick={() => getGroup(id!, 'refetch')} className='mt-5'>
                        {isRefetching ? <Loader2 className='size-6 animate-spin' /> : 'try again'}
                    </Button>
                }
            />
        ),
        loading: <OutletSkeleton />,
        idle: <Content />
    };

    return components[status as keyof typeof components];
};
