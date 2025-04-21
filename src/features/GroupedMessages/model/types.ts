import { IMessage } from "@/entities/Message";

export interface MessageGroupProps {
    messages: Array<IMessage>;
    isLastGroup: boolean;
}