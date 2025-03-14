import React from 'react';
import { useEvents, useLayout, useSocket } from '@/shared/model/store';
import { USER_EVENTS } from '@/shared/model/types';
import { io } from 'socket.io-client';
import { PRESENCE } from '@/entities/profile/model/types';
import { uuidv4 } from '@/shared/lib/utils/uuidv4';

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const listeners = useEvents((state) => state.listeners);

    React.useEffect(() => {
        const session_id = uuidv4();
        const socket = io(import.meta.env.VITE_BASE_URL, {  withCredentials: true, query: { session_id } });
        const abortController = new AbortController();

        socket.on('connect', () => {
            useSocket.setState({ isConnected: true });

            socket.emit(USER_EVENTS.PRESENCE, { presence: PRESENCE.ONLINE });
        });

        socket.on('disconnect', () => {
            useSocket.setState({ isConnected: false });
        });

        useSocket.setState({ socket, session_id });

        window.addEventListener('online', () => useLayout.setState({ connectedToNetwork: true }), { signal: abortController.signal });
        window.addEventListener('offline', () => useLayout.setState({ connectedToNetwork: false }), { signal: abortController.signal });

        return () => {
            abortController.abort();            
            socket.disconnect();

            useSocket.setState({ socket: null!, session_id: null, isConnected: false });
        };
    }, []);

    React.useEffect(() => {
        if (!listeners.size) return;
        console.log('listeners', listeners);
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