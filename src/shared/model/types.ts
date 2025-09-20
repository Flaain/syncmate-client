import { OTPInputProps } from 'input-otp';
import { Socket } from 'socket.io-client';
import { z } from 'zod';

import { nameSchema } from '../constants';
import { ChatStore } from '../lib/providers/chat/types';

export const USER_EVENTS = {
    PRESENCE: 'user.presence',
    ONLINE: 'user.online',
    OFFLINE: 'user.offline'
} as const;

export const LAYOUT_EVENTS = {
    UPDATE_DRAFT: 'layout.draft.update'
} as const;

export const PRESENCE = {
    online: 'online',
    offline: 'offline'
} as const;

export const CHAT_TYPE = {
    Conversation: 'Conversation',
    Group: 'Group'
} as const;

export const TFA_TYPE = {
    0: 'APP',
    1: 'EMAIL',
} as const;

export const SOCKET_ERROR_CODE = {
    TOKEN_EXPIRED: 'TOKEN_EXPIRED'
} as const;

export type SetStateInternal<T> = {
    _(partial: T | Partial<T> | {  _(state: T): T | Partial<T>; }['_'], replace?: false): void;
    _(state: T | { _(state: T): T }['_'], replace: true): void;
}['_'];

export type TimeoutType = ReturnType<typeof setTimeout>;
export type LayoutUpdateArgs = ({ type: 'delete', messageIds: Array<string> } | { type: 'edit', _id: string; text: string; updatedAt: string }) & { recipientId: string }
export type SchemaNameType = z.infer<typeof nameSchema>;
export type Listeners = Map<keyof GlobalEventHandlersEventMap, Set<(event: any) => void>>
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type TfaType = keyof typeof TFA_TYPE;
export type EventsEntries = Array<{ type: keyof GlobalEventHandlersEventMap, listener: (event: Event) => void }>;

export type Recipient = Pick<Profile, '_id' | 'isOfficial' | 'name' | 'login' | 'isDeleted' | 'presence' | 'bio' | 'avatar' | 'email'> & {
    lastSeenAt?: string;
};

export type UserCheckParams = { type: Extract<UserCheckType, 'email'>; email: string } | { type: Extract<UserCheckType, 'login'>; login: string };

export type PRESENCE = keyof typeof PRESENCE;
export type CHAT_TYPE = keyof typeof CHAT_TYPE;

export type INTERNAL_SOUNDS = 'new_message';
export type RequestStatuses = 'idle' | 'loading' | 'error';
export type MessageFormState = 'send' | 'edit' | 'reply';
export type OtpType = 'email_verification' | 'password_reset' | 'tfa_signin';
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
    addEventListener<E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void, options?: boolean | AddEventListenerOptions): () => void;
}

export interface SocketStore {
    socket: Socket;
    isConnected: boolean;
}

export interface Otp {
    targetEmail: string;
    retryDelay: number;
    type: OtpType;
}

export interface OtpStore {
    target: string;
    retryDelay: number;
    type: OtpType;
}

export type OtpProps = Omit<OTPInputProps, 'render' | 'maxLength'> & {
    withResend?: boolean;
    containerClassName?: string;
    onResend?: () => void | Promise<void>;
};

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
    lastSeenAt: string;
    isOfficial: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    counts: {
        archived_chats: number;
        active_sessions: number;
    }
}

export type MessageUnionFields =
    | { sender: Pick<Recipient, '_id'>; sourceRefPath: Extract<CHAT_TYPE, 'Conversation'> }
    | { sender: Pick<Recipient, '_id' | 'name' | 'isDeleted' | 'avatar'>; sourceRefPath: Extract<CHAT_TYPE, 'Group'> };

export type Message = {
    _id: string;
    hasBeenEdited: boolean;
    text: string;
    replyTo?: Pick<Message, '_id' | 'text' | 'sourceRefPath'> & { sender: Pick<Recipient, '_id' | 'name' | 'isDeleted'> };
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
} & MessageUnionFields;

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