import { Socket } from 'socket.io-client';
import { z } from 'zod';

import { IMessage } from '@/entities/message';

import { nameSchema } from '../constants';
import { ChatStore } from '../lib/providers/chat/types';

export type SchemaNameType = z.infer<typeof nameSchema>;
export type SidebarMenus = 'settings';
export type RequestStatuses = 'idle' | 'loading' | 'error';
export type Recipient = Pick<Profile, '_id' | 'isOfficial' | 'name' | 'login' | 'lastSeenAt' | 'isPrivate' | 'isDeleted' | 'presence' | 'status' | 'avatar'>;
export type INTERNAL_SOUNDS = 'new_message';
export type MessageFormState = 'send' | 'edit' | 'reply';
export type Listeners = Map<keyof GlobalEventHandlersEventMap, Set<(event: any) => void>>

export type OTP_TYPE = 'email_verification' | 'password_reset';
export type CHAT_TYPE = 'conversation' | 'group';
export type PRESENCE = 'online' | 'offline';
export type OUTLET_DETAILS_TYPE = 'email' | 'phone' | 'link' | 'bio' | 'login';

export type MESSAGE_SOURCE_REF_PATH = 'Conversation'

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

export interface EventsStore {
    listeners: Map<keyof GlobalEventHandlersEventMap, Set<(event: Event) => void>>;
    addEventListener<E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void): () => void;
}

export type EventsEntries = Array<{ type: keyof GlobalEventHandlersEventMap, listener: (event: Event) => void }>;

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
    onComplete: (event?: React.FormEvent<HTMLFormElement>) => void;
}

export interface SidebarMenuProps { 
    onClose: () => void, 
    backToParent: () => void
}

export interface Avatar {
    _id: string;
    url: string;
}

export interface Profile {
    _id: string;
    name: string;
    login: string;
    email: string;
    presence: PRESENCE;
    status?: string;
    avatar?: Avatar;
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
    status?: 'pending' | 'error';
    actions?: {
        abort?: () => void;
        remove?: () => void;
        resend?: () => void;
    };
    sender: Pick<Recipient, '_id' | 'name' | 'isDeleted' | 'avatar'>;
    sourceRefPath: MESSAGE_SOURCE_REF_PATH;
};

export interface DataWithCursor<T> {
    data: Array<T>;
    nextCursor: string | null;
}

export type SetStateInternal<T> = {
    _(partial: T | Partial<T> | {
        _(state: T): T | Partial<T>;
    }['_'], replace?: false): void;
    _(state: T | {
        _(state: T): T;
    }['_'], replace: true): void;
}['_'];

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface OutletDetailsButtonProps {
    type: OUTLET_DETAILS_TYPE;
    data: string;
}

export enum USER_EVENTS {
    PRESENCE = 'user.presence',
    ONLINE = 'user.online',
    OFFLINE = 'user.offline'
}

export interface ActionsProvider<T> {
    set: SetStateInternal<T>;
    get: () => T;
    setChat: SetStateInternal<ChatStore>;
    getChat: () => ChatStore
}

export interface DeleteMessageEventParams {
    lastMessage: IMessage;
    lastMessageSentAt: string;
    feedId: string;
}

export enum UserCheckType {
    EMAIL = 'email',
    LOGIN = 'login'
}

export type UserCheckParams = { type: UserCheckType.EMAIL; email: string } | { type: UserCheckType.LOGIN; login: string };

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