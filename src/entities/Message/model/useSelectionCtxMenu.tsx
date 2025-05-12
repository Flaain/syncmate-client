import { useShallow } from "zustand/shallow";

import { selectionCtxMenuSelector, useChat } from "@/shared/lib/providers/chat";
import { selectModalActions, useModal } from "@/shared/lib/providers/modal";
import { toast } from "@/shared/lib/toast";
import { Message } from "@/shared/model/types";
import { Confirm } from "@/shared/ui/Confirm";

import { messageApi } from "../api";

import { endpoints } from "./constants";

export const useSelectionCtxMenu = (message: Message) => {
    const { selectedMessages, params, handleSelectMessage, setChat } = useChat(useShallow(selectionCtxMenuSelector));
    const { onOpenModal, onAsyncActionModal, onCloseModal } = useModal(useShallow(selectModalActions));
    
    const isSelected = selectedMessages.has(message._id);

    const handleClearSelection = () => setChat({ mode: 'default', selectedMessages: new Map() });

    const handleCopy = () => {
        let str = '';
        
        const arr = Array.from(selectedMessages.values());

        for (const { text } of arr) str += `${text}\n`;

        navigator.clipboard.writeText(str.trim());
    }

    const handleDelete = () => {
        const size = selectedMessages.size;

        onOpenModal({
            content: (
                <Confirm
                    text={`Are you sure want to delete ${size > 1 ? `${size} messages` : 'this message'}?`}
                    onCancel={onCloseModal}
                    onConfirmButtonVariant='destructive'
                    onConfirmText='Delete'
                    onConfirm={() => onAsyncActionModal(() => messageApi.delete({
                        endpoint: `${endpoints[params.type]}/delete/${params.id}`,
                        messageIds: [...selectedMessages.keys()]
                    }),
                    {
                        closeOnError: true,
                        onResolve: ({ data }) => {
                            toast.success(`${data.length} ${data.length > 1 ? 'messages' : 'message'} was deleted`);
                            setChat({ mode: 'default', selectedMessages: new Map() });
                        },
                        onReject: () => toast.error('Cannot delete messages')
                    })}
                />
            ),
            withHeader: false,
        })
    }

    return { handleCopy, handleDelete, handleClearSelection, handleSelectMessage, isSelected };
}