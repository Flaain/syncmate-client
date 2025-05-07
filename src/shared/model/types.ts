import { Socket } from 'socket.io-client';
import { z } from 'zod';

import { nameSchema } from '../constants';
import { ChatStore } from '../lib/providers/chat/types';

// you might be wondering why not use enum instead of "as const" so i readed this post - https://t.me/temaProg/49. And decided to use as const instea, maybe im wrong.

export const USER_EVENTS = {
    PRESENCE: 'user.presence',
    ONLINE: 'user.online',
    OFFLINE: 'user.offline'
} as const;

export const PRESENCE = {
    online: 'online',
    offline: 'offline'
} as const;

export const CHAT_TYPE = {
    Conversation: 'Conversation',
} as const;

export type SetStateInternal<T> = {
    _(partial: T | Partial<T> | {  _(state: T): T | Partial<T>; }['_'], replace?: false): void;
    _(state: T | { _(state: T): T }['_'], replace: true): void;
}['_'];

export type SchemaNameType = z.infer<typeof nameSchema>;
export type Listeners = Map<keyof GlobalEventHandlersEventMap, Set<(event: any) => void>>
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type EventsEntries = Array<{ type: keyof GlobalEventHandlersEventMap, listener: (event: Event) => void }>;

export type Recipient = Pick<Profile, '_id' | 'isOfficial' | 'name' | 'login' | 'lastSeenAt' | 'isPrivate' | 'isDeleted' | 'presence' | 'bio' | 'avatar'>;
export type UserCheckParams = { type: Extract<UserCheckType, 'email'>; email: string } | { type: Extract<UserCheckType, 'login'>; login: string };

export type PRESENCE = keyof typeof PRESENCE;
export type CHAT_TYPE = keyof typeof CHAT_TYPE;

export type INTERNAL_SOUNDS = 'new_message';
export type RequestStatuses = 'idle' | 'loading' | 'error';
export type MessageFormState = 'send' | 'edit' | 'reply';
export type OtpType = 'email_verification' | 'password_reset';
export type OutletDetailsButtonType = 'email' | 'link' | 'bio' | 'login';
export type UserCheckType = 'email' | 'login';
export type MessageStatus = 'pending' | 'error' | 'idle';

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
    selectedMessage?: Message;
}

export interface EventsStore {
    listeners: Map<keyof GlobalEventHandlersEventMap, Set<(event: any) => void>>;
    addEventListener<E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void): () => void;
}

export interface SocketStore {
    socket: Socket;
    session_id: string | null;
    isConnected: boolean;
}

export interface Otp {
    targetEmail: string;
    retryDelay: number;
    type: OtpType;
}

export interface OtpStore {
    otp: Otp;
    isResending: boolean;
    onResend: () => Promise<void>;
}

export interface OtpProps extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
    disabled?: boolean;
    onResendCB?: () => void;
    onComplete: (event?: React.FormEvent<HTMLFormElement>) => void;
}

export interface SidebarMenuProps { 
    onClose: (shouldRemove?: boolean) => void;
}

export interface Avatar {
    _id: string;
    url: string;
}

export interface Profile {
    _id: string;
    name: string;
    lastName?: string;
    login: string;
    email: string;
    presence: PRESENCE;
    bio?: string;
    avatar?: Avatar;
    counts: {
        archived_chats: number;
        active_sessions: number;
    }
    lastSeenAt: string;
    isOfficial: boolean;
    isPrivate: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export type Message = {
    _id: string;
    hasBeenEdited: boolean;
    text: string;
    replyTo?: Pick<Message, '_id' | 'text' | 'sourceRefPath'> & { sender: Pick<Recipient, '_id' | 'name' | 'isDeleted' | 'avatar'>; }
    inReply?: boolean;
    readedAt?: string;
    hasBeenRead?: boolean;
    alreadyRead?: boolean;
    createdAt: string;
    updatedAt: string;
    status?: MessageStatus;
    actions?: {
        abort?: () => void;
        remove?: () => void;
        resend?: () => void;
    };
    sender: Pick<Recipient, '_id' | 'name' | 'isDeleted' | 'avatar'>;
    sourceRefPath: CHAT_TYPE;
};

export interface DataWithCursor<T> {
    data: T;
    nextCursor: string | null;
}

export interface OutletDetailsButtonProps {
    type: OutletDetailsButtonType;
    data: string;
}

export interface ActionsProvider<T> {
    set: SetStateInternal<T>;
    get: () => T;
    setChat: SetStateInternal<ChatStore>;
    getChat: () => ChatStore
}

export interface DeleteMessageEventParams {
    lastMessage: Message;
    lastMessageSentAt: string;
    feedId: string;
}

export interface Pagination {
    query: string;
    page?: number;
    limit?: number;
}

export interface WrappedInPagination<T> {
    items: Array<T>;
    meta: {
        total_items: number;
        remaining_items: number;
        total_pages: number;
        current_page: number;
        next_page: number | null;
    }
}