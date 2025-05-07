import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { Button } from '@/shared/ui/button';
import { SidebarMenuError } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

import { ActiveSessionsMenuSkeleton } from './Skeleton';

export const ActiveSessionsMenuError = ({ onRefetch, isRefetching }: { onRefetch: () => void; isRefetching: boolean }) => (
    <SidebarMenuError bgSkeleton={<ActiveSessionsMenuSkeleton />}>
        <div className='px-4 flex flex-1 flex-col gap-5'>
            <Typography align='center' weight='medium'>
                An error occurred while receiving the sessions.
                <br />
                Please try again.
            </Typography>
            <Button onClick={onRefetch} disabled={isRefetching}>
                {isRefetching ? <LoaderIcon className='size-6 animate-loading' /> : 'try again'}
            </Button>
        </div>
    </SidebarMenuError>
);
