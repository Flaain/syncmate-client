import { Session } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { SidebarMenuButton, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

import { useActiveSessionsMenu } from '../../model/useActiveSessionsMenu';

import { ActiveSessionsMenuError } from './Error';
import { ActiveSessionsMenuSkeleton } from './Skeleton';

export const ActiveSessionsMenuContent = () => {
    const { isLoading, isError, isRefetching, isTerminating, data, refetch, onOpenModal, getModalConfig } = useActiveSessionsMenu();

    if (isLoading) return <ActiveSessionsMenuSkeleton />;

    if (isError) return <ActiveSessionsMenuError onRefetch={refetch} isRefetching={isRefetching} />;

    return (
        <>
            <div className='flex flex-col px-4'>
                <Typography as='h2' size='lg' weight='medium' className='px-4 py-2'>
                    This device
                </Typography>
                <SidebarMenuButton className='h-16'>
                    <Session session={data.currentSession} isCurrent />
                </SidebarMenuButton>
                {!!data.sessions.length && (
                    <Button
                        ripple
                        variant='ghost'
                        intent='destructive'
                        disabled={isTerminating}
                        onClick={() => onOpenModal(getModalConfig())}
                    >
                        Terminate All Other Sessions
                    </Button>
                )}
            </div>
            {!!data.sessions.length && (
                <>
                    <SidebarMenuSeparator className='h-10'>
                        Logs out all devices except for this one.
                    </SidebarMenuSeparator>
                    <ul className='px-4 pb-2 overflow-auto h-fill-available box-border'>
                        {data.sessions.map((session) => (
                            <li key={session._id}>
                                <SidebarMenuButton
                                    className='h-16'
                                    onClick={() => onOpenModal(getModalConfig(session._id))}
                                >
                                    <Session session={session} />
                                </SidebarMenuButton>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
};
