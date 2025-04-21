import { Socket } from 'socket.io-client';
import { create } from 'zustand';

import { MessageFormState } from '@/features/SendMessage';

import { IMessage } from '@/entities/Message';

import messageNotificationSound from '../lib/assets/sounds/message-notification.mp3';

import { layoutActions } from './actions';

export type INTERNAL_SOUNDS = 'new_message';

export interface LayoutStore {
    drafts: Map<string, Draft>;
    connectedToNetwork: boolean;
    actions: {
        playSound: (sound: INTERNAL_SOUNDS, cb?: (sound: HTMLAudioElement) => void) => void;
    };
    sounds: Record<INTERNAL_SOUNDS, HTMLAudioElement>;
}

export interface Draft {
    value: string;
    state: MessageFormState;
    selectedMessage?: IMessage;
}

export type Listeners = Map<keyof GlobalEventHandlersEventMap, Set<(event: any) => void>>

export interface EventsStore {
    listeners: Map<any, any>;
    addEventListener<E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void): () => void;
}

export interface SocketStore {
    socket: Socket;
    session_id: string | null;
    isConnected: boolean;
}

export const useLayout = create<LayoutStore>((_, get) => ({
    drafts: new Map(),
    connectedToNetwork: true,
    actions: layoutActions({ get }),
    sounds: {
        new_message: new Audio(messageNotificationSound),
    }
}));

export const useEvents = create<EventsStore>((set) => ({
    listeners: new Map(),
    addEventListener: <E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void) => {
        set((prevState) => {
            const listeners = new Map([...prevState.listeners]);

            listeners.has(type) ? listeners.set(type, new Set([...listeners.get(type)!, listener])) : listeners.set(type, new Set([listener]));

            return { listeners };
        });

        return () => {
            set((prevState) => {
                const listeners = new Map([...prevState.listeners]);

                listeners.get(type)?.delete(listener);
                !listeners.get(type)?.size && listeners.delete(type);

                return { listeners };
            });
        };
    }
}));

export const useSocket = create<SocketStore>(() => ({
    socket: null!,
    session_id: null,
    isConnected: false,
}));