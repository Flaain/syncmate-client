import { Ban, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import { Session } from '@/entities/session';

import { selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { Button } from '@/shared/ui/button';
import { Confirm } from '@/shared/ui/Confirm';
import { Typography } from '@/shared/ui/Typography';

import { useActiveSessions } from '../lib/useActiveSessions';

import { ActiveSessionsSkeleton } from './Skeleton';

export const ActiveSessions = () => {
    const { data, isLoading, isTerminating, handleTerimanteSessions, handleDropSession } = useActiveSessions();
    const { onCloseModal, onOpenModal } = useModal(useShallow(selectModalActions));

    if (isLoading || !data) return <ActiveSessionsSkeleton />;

    return (
        <div className='flex flex-col gap-3 px-5 pt-5'>
            <div className='flex flex-col gap-5'>
                <Typography as='h2' variant='primary' weight='medium'>
                    This device
                </Typography>
                <Session session={data.currentSession} />
                {!!data.sessions.length && (
                    <>
                        <Button
                            onClick={() =>
                                onOpenModal({
                                    withHeader: false,
                                    bodyClassName: 'p-4 h-auto',
                                    content: (
                                        <Confirm
                                            text='Are you sure you want to terminate all other sessions?'
                                            onCancel={onCloseModal}
                                            onConfirmText='Terminate'
                                            onConfirmButtonVariant='destructive'
                                            onConfirm={handleTerimanteSessions}
                                        />
                                    )
                                })
                            }
                            disabled={isTerminating}
                            variant='ghost'
                            className='gap-5 dark:text-primary-destructive text-primary-destructive dark:hover:bg-primary-destructive/10 dark:focus:bg-primary-destructive/10'
                        >
                            {isTerminating ? <Loader2 className='w-5 h-5 animate-spin' /> : <Ban className='w-5 h-5' />}
                            Terminate all other sessions
                        </Button>
                        <Typography as='h2' variant='primary' weight='medium'>
                            Other devices
                        </Typography>
                        <ul className='flex flex-col gap-2 max-h-[220px] overflow-auto'>
                            {data.sessions.map((session) => (
                                <li key={session._id}>
                                    <Session
                                        withDropButton
                                        session={session}
                                        dropButtonDisabled={isTerminating}
                                        onDrop={() => handleDropSession(session._id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};