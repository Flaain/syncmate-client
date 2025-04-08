import { Session } from '@/entities/session/ui/ui';
import { selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/button';
import { Hand, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useActiveSessions } from '../lib/useActiveSessions';
import { ActiveSessionsSkeleton } from './Skeletons/ActiveSessionsSkeleton';

export const ActiveSessions = () => {
    const { data, isLoading, isTerminating, handleTerimanteSessions, handleDropSession } = useActiveSessions();
    const { onCloseModal, onOpenModal } = useModal(useShallow(selectModalActions));

    if (isLoading || !data) return <ActiveSessionsSkeleton />;

    const onConfirm = () => {
        onCloseModal();
        handleTerimanteSessions();
    };

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
                                    bodyClassName: 'max-w-[350px] p-5 h-auto',
                                    content: (
                                        <Confirm
                                            text='Are you sure you want to terminate all other sessions?'
                                            onCancel={onCloseModal}
                                            onConfirm={onConfirm}
                                        />
                                    )
                                })
                            }
                            disabled={isTerminating}
                            variant='ghost'
                            className='gap-5 dark:text-primary-destructive text-primary-destructive dark:hover:bg-primary-destructive/10 dark:focus:bg-primary-destructive/10'
                        >
                            {isTerminating ? <Loader2 className='w-5 h-5 animate-spin' /> : <Hand className='w-5 h-5' />}
                            Terminate all other sessions
                        </Button>
                        <Typography as='h2' variant='primary' weight='medium'>
                            Other devices
                        </Typography>
                        <ul className='flex flex-col gap-2 max-h-[210px] overflow-auto'>
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