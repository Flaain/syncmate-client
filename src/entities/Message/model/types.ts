import { Message, MessageStatus } from "@/shared/model/types";

export type CtxItemClickFunc = (cb?: () => void) => () => void;

export interface IdleCtxMenuProps {
    isMessageFromMe: boolean;
    message: Message;
    onCopy: () => void;
    onItemClick: CtxItemClickFunc;
}

export interface WithStatusCtxMenuProps {
    status: Exclude<MessageStatus, 'idle'>;
    actions: Message['actions']; 
    onCopy: () => void;
    onItemClick: CtxItemClickFunc;
}

export interface UseMessageProps {
    isMessageFromMe: boolean;
    isLastGroup?: boolean;
    isLast?: boolean;
    message: Message;
}

export interface MessageProps extends React.HTMLAttributes<HTMLLIElement> {
    message: Message;
    isMessageFromMe: boolean;
    isLastGroup: boolean;
    isFirst: boolean;
    isLast: boolean;
    firstMessageRef: ((node: HTMLDivElement) => void) | null;
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