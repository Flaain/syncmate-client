import React from 'react';

import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';

import { Sidebar } from '@/widgets/sidebar';

import { ModalProvider } from '@/shared/lib/providers/modal';
import { Toaster } from '@/shared/lib/toast';
import { uuidv4 } from '@/shared/lib/utils/uuidv4';
import { useEvents, useLayout, useSocket } from '@/shared/model/store';
import { PRESENCE, USER_EVENTS } from '@/shared/model/types';

export const LayoutProvider = () => {
    const listeners = useEvents((state) => state.listeners);

    React.useEffect(() => {
        const session_id = uuidv4();
        const socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true, query: { session_id } });
        const abortController = new AbortController();

        socket.on('connect', () => {
            useSocket.setState({ isConnected: true });

            socket.emit(USER_EVENTS.PRESENCE, { presence: PRESENCE.online });
        });

        socket.on('disconnect', () => { useSocket.setState({ isConnected: false }) });

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

        const abortController = new AbortController();

        for (const [type, set] of Array.from(listeners.entries())) {
            const lastListener = Array.from(set).pop();

            if (!lastListener) continue;

            document.addEventListener(type, lastListener, { signal: abortController.signal });
        }

        return () => {
            abortController.abort();
        };
    }, [listeners]);

    return (
        <ModalProvider>
            <main className='flex h-dvh dark:bg-primary-dark-200 relative'>
                <Toaster />
                <Sidebar />
                <Outlet />
            </main>
        </ModalProvider>
    );
};