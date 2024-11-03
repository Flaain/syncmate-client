import { Message } from "@/entities/Message/model/types";

export interface GroupParticipant {
    _id: string;
    name: string;
    email: string;
    userId: string;
}

export interface Group {
    _id: string;
    name: string;
    login: string;
    participants: Array<GroupParticipant>;
    isOfficial?: boolean;
    messages: Array<Message>;
    lastMessage?: Message;
    lastMessageSentAt: string;
    createdAt: string;
    updatedAt: string;
}