import { create } from 'zustand';

import { otpApi } from '../api';
import messageNotificationSound from '../lib/assets/sounds/message-notification.mp3';

import { layoutActions } from './actions';
import { EventsStore, LayoutStore, OtpStore, SocketStore } from './types';

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
    addEventListener: <E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E], options?: boolean | AddEventListenerOptions) => void) => {
        set((prevState) => {
            const listeners = new Map(prevState.listeners);
            
            listeners.has(type) ? listeners.set(type, new Set([...listeners.get(type)!, listener])) : listeners.set(type, new Set([listener]));
            
            return { listeners };
        });

        return () => {
            set((prevState) => {
                const listeners = new Map(prevState.listeners);

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

export const useOtp = create<OtpStore>((set, get) => ({
    otp: null!,
    isResending: false,
    onResend: async () => {
        try {
            set({ isResending: true });

            const { otp } = get();
            const { data: { retryDelay } } = await otpApi.create({ email: otp.targetEmail, type: otp.type });

            set({ otp: { ...otp, retryDelay } });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isResending: false });
        }
    }
}));