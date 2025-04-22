import React from 'react';

import { sessionApi } from '@/entities/session';

import { useQuery } from '@/shared/lib/hooks/useQuery';
import { useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';

export const useActiveSessions = () => {
    const { data, isLoading, setData: setSessions } = useQuery(({ signal }) => sessionApi.getSessions(signal));
    
    const [isTerminating, setIsTerminating] = React.useState(false);

    const onAsyncActionModal = useModal((state) => state.actions.onAsyncActionModal);
    
    const handleTerimanteSessions = async () => {
        setIsTerminating(true);

        await onAsyncActionModal(sessionApi.terminateAllSessions, {
            onResolve: ({ data: { deletedCount } }) => {
                setSessions((prevState) => ({ ...prevState!, sessions: [] }));
                toast.success(`${deletedCount} ${deletedCount > 1 ? 'sessions' : 'session'} was terminated`);
            },
            onReject: (error) => {
                console.error(error);
                toast.error('Failed to terminate sessions');
            }
        });

        setIsTerminating(false);
    };

    const handleDropSession = (sessionId: string) => {
        setSessions((prevState) => ({
            ...prevState!,
            sessions: prevState!.sessions.filter((session) => session._id !== sessionId)
        }));
    };

    return { data, isLoading, isTerminating, handleDropSession, handleTerimanteSessions };
};