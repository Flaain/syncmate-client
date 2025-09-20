import React from 'react';

import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';

import { SidebarBase } from '@/features/sidebar-menus';

import { ModalProvider } from '@/shared/lib/providers/modal';
import { StackableProvider } from '@/shared/lib/providers/stackable';
import { Toaster } from '@/shared/lib/toast';
import { useEvents, useLayout, useSocket } from '@/shared/model/store';
import { LAYOUT_EVENTS, LayoutUpdateArgs, PRESENCE, USER_EVENTS } from '@/shared/model/types';

export const LayoutProvider = () => {
    const listeners = useEvents((state) => state.listeners);

    React.useEffect(() => {
        const socket = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true });
        const abortController = new AbortController();

        socket.on('connect', () => {
            useSocket.setState({ isConnected: true });

            socket.emit(USER_EVENTS.PRESENCE, { presence: PRESENCE.online });
        });

        socket.on('disconnect', () => { useSocket.setState({ isConnected: false }) });

        socket.on(LAYOUT_EVENTS.UPDATE_DRAFT, (args: LayoutUpdateArgs) => {
            const draft = useLayout.getState().drafts.get(args.recipientId);

            if (draft && draft.state !== 'send') {
                if (args.type === 'delete') {
                    const { messageIds, recipientId } = args;

                    for (let i = 0; i < messageIds.length; i += 1) {
                        if (draft.selectedMessage?._id === messageIds[i]) {
                            useLayout.setState(({ drafts }) => {
                                const newDrafts = new Map(drafts);
    
                                draft.state === 'edit' ? newDrafts.delete(recipientId) : newDrafts.set(recipientId, {
                                    state: 'send',
                                    value: draft.value,
                                    selectedMessage: undefined
                                });
    
                                return { drafts: newDrafts };
                            });
    
                            break;
                        }
                    }
                } else {
                    const { _id, text, updatedAt, recipientId } = args;

                    draft.selectedMessage?._id === _id && useLayout.setState(({ drafts }) => {
                        const newDrafts = new Map(drafts);

                        newDrafts.set(recipientId, {
                            ...draft,
                            selectedMessage: {
                                ...draft.selectedMessage!,
                                text,
                                updatedAt,
                                hasBeenEdited: true
                            }
                        });

                        return { drafts: newDrafts };
                    });
                }
            }
        });

        useSocket.setState({ socket });

        window.addEventListener('online', () => useLayout.setState({ connectedToNetwork: true }), { signal: abortController.signal });
        window.addEventListener('offline', () => useLayout.setState({ connectedToNetwork: false }), { signal: abortController.signal });

        return () => {
            abortController.abort();

            socket.off(LAYOUT_EVENTS.UPDATE_DRAFT);

            socket.disconnect();
            
            useSocket.setState({ socket: null!, isConnected: false });
        };
    }, []);

    React.useEffect(() => {
        if (!listeners.size) return;

        const abortController = new AbortController();

        for (const { 0: type, 1: set } of Array.from(listeners.entries())) {
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
            <main className='flex h-dvh dark:bg-primary-dark-200 relative overflow-x-hidden max-w-[1680px] w-full mx-auto box-border'>
                <Toaster />
                <StackableProvider
                    base={{ content: <SidebarBase />, id: 'base', containerClassName: 'flex flex-col overflow-hidden' }}
                    containerClassName='md:border-r md:border-r-primary-dark-200 md:border-solid max-lg:fixed dark:bg-primary-dark bg-primary-white lg:max-w-[420px]'
                />
                <Outlet />
            </main>
        </ModalProvider>
    );
};