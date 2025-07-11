import { CHAT_TYPE } from "@/shared/model/types";

export const MESSAGE_ENDPOINTS: Record<CHAT_TYPE, string> = {
    Conversation: 'conversation/message',
    Group: 'group/message'
};

export const ctxMenuIconStyles = 'size-5'