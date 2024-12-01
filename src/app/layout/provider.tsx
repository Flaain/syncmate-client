import React from 'react';
import { useEvents, useLayout, useSocket } from '@/shared/model/store';
import { USER_EVENTS } from '@/shared/model/types';
import { io } from 'socket.io-client';
import { PRESENCE } from '@/entities/profile/model/types';

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const listeners = useEvents((state) => state.listeners);

    React.useEffect(() => {
        const socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });
        const abortController = new AbortController();

        socket.on('connect', () => {
            useSocket.setState({ socket, isConnected: true });

            socket.emit(USER_EVENTS.PRESENCE, { presence: PRESENCE.ONLINE });
        });

        socket.on('disconnect', () => {
            useSocket.setState({ socket, isConnected: false });
        });

        useSocket.setState({ socket });

        window.addEventListener('online', () => useLayout.setState({ connectedToNetwork: true }), { signal: abortController.signal });
        window.addEventListener('offline', () => useLayout.setState({ connectedToNetwork: false }), { signal: abortController.signal });

        return () => {
            abortController.abort();            
            socket.disconnect();
        };
    }, []);

    React.useEffect(() => {
        if (!listeners.size) return;

        const entries = [...new Map([...listeners]).entries()];

        const mappedListeners = entries.map(([type, listeners]) => {
            const lastListener = [...listeners.values()]?.pop();

            if (!lastListener) return { type, listener: () => {} };

            document.addEventListener(type, lastListener);

            return { type, listener: lastListener };
        });

        return () => {
            mappedListeners.forEach(({ type, listener }) => {
                document.removeEventListener(type, listener);
            });
        };
    }, [listeners]);

    return children;
};