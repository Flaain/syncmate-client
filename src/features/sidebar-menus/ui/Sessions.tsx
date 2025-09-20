import { Session } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { SidebarMenuButton, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

import { useSessionsMenu } from '../model/useActiveSessionsMenu';

import { SessionsError } from './SessionsError';
import { SessionsSkeleton } from './Skeletons/SessionsSkeleton';

export const Sessions = () => {
    const { isLoading, isError, isRefetching, isTerminating, data, refetch, onOpenModal, getModalConfig } = useSessionsMenu();

    if (isLoading) return <SessionsSkeleton />;

    if (isError) return <SessionsError onRefetch={refetch} isRefetching={isRefetching} />;

    return (
        <>
            <div className='flex flex-col px-2'>
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
                    <ul className='px-2 pb-2 overflow-auto box-border'>
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
