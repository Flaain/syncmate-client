import React from 'react';
import { sessionAPI, useSession } from '@/entities/session';

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const isAuthorized = useSession((state) => state.isAuthorized);

    React.useEffect(() => {
        if (!isAuthorized) return;
        console.log('test', isAuthorized);
        const { actions: { onSignout } } = useSession.getState();

        sessionAPI.subscribeRefreshError(onSignout);

        return () => {
            sessionAPI.unsubscribeRefreshError(onSignout);
        };
    }, [isAuthorized]);

    return children;
};