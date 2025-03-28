import { Recipient } from "@/pages/Conversation/model/types";

export enum SourceRefPath {
    CONVERSATION = 'Conversation'
}

export type Message = {
    _id: string;
    hasBeenEdited: boolean;
    text: string;
    replyTo?: Pick<Message, '_id' | 'text'> & { sender: Pick<Recipient, '_id' | 'name' | 'isDeleted' | 'avatar'>; sourceRefPath: SourceRefPath.CONVERSATION };
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
    sender: Pick<Recipient, '_id' | 'name' | 'isDeleted' | 'avatar'>; sourceRefPath: SourceRefPath.CONVERSATION;
}

export interface UseMessageProps {
    message: Message;
}

export interface MessageProps extends React.HTMLAttributes<HTMLLIElement> {
    message: Message;
    isMessageFromMe: boolean;
    isLastGroup: boolean;
    isFirst: boolean;
    isLast: boolean;
}

export interface ContextMenuProps {
    message: Message;
    isMessageFromMe: boolean;
    onClose: () => void;
}

export interface DeleteMessageRes {
    isLastMessage: boolean;
    lastMessage: Message;
    lastMessageSentAt: string;
}

export interface DefaultParamsAPI {
    endpoint: string;
    body: string;
    signal?: AbortSignal;
}

export interface DeleteParamsAPI extends Omit<DefaultParamsAPI, 'body'> {
    messageIds: Array<string>;
}