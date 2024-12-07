import { Message } from '@/entities/Message/model/types';
import { Profile } from '@/entities/profile/model/types';
import { MessageFormState, OptimisticFunc } from '@/features/SendMessage/model/types';

export type ConversationStatuses = 'idle' | 'loading' | 'refetching' | 'error';

export interface ConversationWithMeta {
    conversation: Pick<Conversation, '_id' | 'recipient' | 'messages' | 'createdAt' | 'isInitiatorBlocked' | 'isRecipientBlocked'>;
    nextCursor: string | null;
}

export enum CONVERSATION_EVENTS {
    JOIN = 'conversation.join',
    LEAVE = 'conversation.leave',
    CREATED = 'conversation.created',
    DELETED = 'conversation.deleted',
    MESSAGE_READ = 'conversation.message.read',
    MESSAGE_SEND = 'conversation.message.send',
    MESSAGE_EDIT = 'conversation.message.edit',
    MESSAGE_DELETE = 'conversation.message.delete',
    USER_PRESENCE = 'conversation.user.presence',
    USER_BLOCK = 'conversation.user.block',
    USER_UNBLOCK = 'conversation.user.unblock',
    START_TYPING = 'conversation.start.typing',
    STOP_TYPING = 'conversation.stop.typing'
}

export interface ConversationStore {
    conversation: Omit<ConversationWithMeta['conversation'], 'messages'>;
    status: ConversationStatuses;
    error: string | null;
    isRecipientTyping: boolean;
    actions: {
        getConversation: ({ action, recipientId, abortController }: { action: 'init' | 'refetch'; recipientId: string; abortController?: AbortController }) => Promise<void>;
        getPreviousMessages: () => Promise<void>;
        handleTypingStatus: () => (action: MessageFormState, reset?: boolean) => void;
        handleOptimisticUpdate: OptimisticFunc;
    };
}

export interface Conversation {
    _id: string;
    recipient: Recipient;
    messages: Array<Message>;
    lastMessage?: Message;
    lastMessageSentAt: string;
    createdAt: string;
    updatedAt: string;
    isInitiatorBlocked?: boolean;
    isRecipientBlocked?: boolean;
}

export interface GetDescriptionParams {
    data: { recipient: Pick<Recipient, 'presence' | 'lastSeenAt'> } & Pick<Conversation, 'isInitiatorBlocked' | 'isRecipientBlocked'>;
    shouldDisplayTypingStatus?: boolean;
    isRecipientTyping: boolean;
}

export type Recipient = Pick<Profile, '_id' | 'isOfficial' | 'email' | 'name' | 'login' | 'lastSeenAt' | 'isPrivate' | 'isDeleted' | 'presence' | 'status' | 'avatar'>;