import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { Message } from '@/entities/Message/model/types';
import { MessageFormState } from '@/features/SendMessage/model/types';

export interface LayoutStore {
    drafts: Map<string, Draft>;
    isSheetOpen: boolean;
    connectedToNetwork: boolean;
}

export interface Draft {
    value: string;
    state: MessageFormState;
    selectedMessage?: Message;
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

export const useLayout = create<LayoutStore>(() => ({
    drafts: new Map(),
    isSheetOpen: false,
    connectedToNetwork: true
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