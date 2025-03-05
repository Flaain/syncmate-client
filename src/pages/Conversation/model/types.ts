import { Message } from '@/entities/Message/model/types';
import { Profile } from '@/entities/profile/model/types';
import { MessageFormState } from '@/features/SendMessage/model/types';
import { DataWithCursor } from '@/shared/model/types';

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

export enum GROUP_EVENTS {
    JOIN = 'group.join',
    LEAVE = 'group.leave',
    MESSAGE_READ = 'group.message.read',
    MESSAGE_SEND = 'group.message.send',
    MESSAGE_EDIT = 'group.message.edit',
    MESSAGE_DELETE = 'group.message.delete',
}

export interface ConversationStore {
    conversation: Omit<Conversation, 'messages'>;
    isRecipientTyping: boolean;
    actions: {
        handleTypingStatus: () => (action: MessageFormState, reset?: boolean) => void;
    };
}

export interface Conversation {
    _id: string;
    recipient: Recipient;
    messages: DataWithCursor<Message>;
    isInitiatorBlocked?: boolean;
    isRecipientBlocked?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetDescriptionParams {
    data: { recipient: Pick<Recipient, 'presence' | 'lastSeenAt'> } & Pick<Conversation, 'isInitiatorBlocked' | 'isRecipientBlocked'>;
    shouldDisplayTypingStatus?: boolean;
    isRecipientTyping: boolean;
}

export type Recipient = Pick<Profile, '_id' | 'isOfficial' | 'name' | 'login' | 'lastSeenAt' | 'isPrivate' | 'isDeleted' | 'presence' | 'status' | 'avatar'>;