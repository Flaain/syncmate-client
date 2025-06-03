import { useShallow } from "zustand/shallow";

import { selectionCtxMenuSelector, useChat } from "@/shared/lib/providers/chat";
import { selectModalActions, useModal } from "@/shared/lib/providers/modal";
import { toast } from "@/shared/lib/toast";
import { Message } from "@/shared/model/types";
import { Confirm } from "@/shared/ui/Confirm";

import { messageApi } from "../api";

import { MESSAGE_ENDPOINTS } from "./constants";

export const useSelectionCtxMenu = (message: Message) => {
    const { selectedMessages, chatInfo, params, handleSelectMessage, setChat } = useChat(useShallow(selectionCtxMenuSelector));
    const { onOpenModal, onAsyncActionModal, onCloseModal } = useModal(useShallow(selectModalActions));
    
    const isSelected = selectedMessages.has(message._id);

    const handleClearSelection = () => setChat({ mode: 'default', selectedMessages: new Map() });

    const handleCopy = () => {
        let str = '';
        
        for (const { text } of Array.from(selectedMessages.values())) str += `${text}\n`;

        navigator.clipboard.writeText(str.trim());
    }

    const onConfirm = () => onAsyncActionModal(() => messageApi.delete({
        endpoint: `${MESSAGE_ENDPOINTS[params.type]}/delete/${params.id}`,
        messageIds: Array.from(selectedMessages.keys())
    }),
    {
        closeOnError: true,
        onResolve: ({ data }) => {
            toast.success(`${data.length} ${data.length > 1 ? 'messages' : 'message'} was deleted`);
            setChat({ mode: 'default', selectedMessages: new Map() });
        },
        onReject: () => toast.error('Cannot delete messages')
    });

    const handleDelete = () => {
        const size = selectedMessages.size;

        onOpenModal({
            content: (
                <Confirm
                    withAvatar
                    avatarUrl={chatInfo.avatar?.url}
                    name={chatInfo.name}
                    title={`Delete ${size > 1 ? `${size} messages` : 'message'}`}
                    description={`Are you sure want to delete ${size > 1 ? `${size} messages` : 'this message'}?`}
                    onCancel={onCloseModal}
                    onConfirmButtonIntent='destructive'
                    onConfirmText='Delete'
                    onConfirm={onConfirm}
                />
            ),
            withHeader: false
        });
    }

    return { handleCopy, handleDelete, handleClearSelection, handleSelectMessage, isSelected };
}