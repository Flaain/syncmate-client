import { Avatar } from "@/entities/profile/model/types";
import { Recipient } from "@/pages/Conversation/model/types";
import { ApiException } from "@/shared/api/error";
import { ChatStore } from "@/shared/lib/providers/chat/types";

export enum SenderRefPath {
    USER = 'User',
    PARTICIPANT = 'Participant'
}

export interface REMOVE_THIS_LATER {
    _id: string;
    name?: string;
    avatar?: Avatar;
    user: Recipient;
}

export type MessageSender =
    | { sender: Pick<Recipient, '_id' | 'name' | 'isDeleted' | 'avatar'>; senderRefPath: SenderRefPath.USER }
    | { sender: REMOVE_THIS_LATER; senderRefPath: SenderRefPath.PARTICIPANT };

export type ReplySender =
    | { sender: Pick<Recipient, '_id' | 'name'>; senderRefPath: SenderRefPath.USER }
    | { sender: REMOVE_THIS_LATER; senderRefPath: SenderRefPath.PARTICIPANT };

export type Message = {
    _id: string;
    hasBeenRead: boolean;
    hasBeenEdited: boolean;
    text: string;
    replyTo?: Pick<Message, '_id' | 'text'> & ReplySender;
    inReply?: boolean;
    createdAt: string;
    updatedAt: string;
    abort?: () => void;
    isPending?: boolean;
    error?: ApiException['config'];
} & MessageSender;

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