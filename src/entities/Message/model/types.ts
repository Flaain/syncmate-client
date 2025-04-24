import { Message } from "@/shared/model/types";

export interface IdleCtxMenuProps {
    isMessageFromMe: boolean;
    message: Message;
    onCopy: () => void;
    onItemClick: (cb: () => void) => () => void;
}

export interface PossibleCtxActions {
    reply: () => void;
    edit: () => void;
    delete: () => void;
    copy: () => void;
    select: () => void;
    abort: () => void;
    resend: () => void;
    remove: () => void;
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