import { messageApi } from "@/entities/Message";
import { endpoints } from "@/entities/Message/model/constants";
import { useChat } from "@/shared/lib/providers/chat/context";
import { useModal } from "@/shared/lib/providers/modal";
import { selectModalActions } from "@/shared/lib/providers/modal/store";
import { useEvents } from "@/shared/model/store";
import { Confirm } from "@/shared/ui/Confirm";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/button";
import { Trash, X } from "lucide-react";
import React from "react";
import { useShallow } from "zustand/shallow";

export const SelectState = () => {
    const { onOpenModal, onAsyncActionModal, onCloseModal } = useModal(useShallow(selectModalActions));
    const { selectedMessages, params, setChat } = useChat(useShallow((state) => ({
        params: state.params,
        selectedMessages: state.selectedMessages,
        setChat: state.actions.setChat
    })));

    const addEventListener = useEvents((state) => state.addEventListener);

    React.useEffect(() => {
        const removeListener = addEventListener('keydown', ({ key }) => {
            key === 'Escape' && setChat({ mode: 'default', selectedMessages: new Map() })
        });

        return () => removeListener();
    }, []);

    const handleDelete = () => {
        const size = selectedMessages.size;

        onOpenModal({
            content: (
                <Confirm
                    text={`Do you want to delete ${size > 1 ? `${size} messages` : 'this message'}?`}
                    onCancel={onCloseModal()}
                    onConfirmButtonVariant='destructive'
                    onConfirmText='Delete'
                    onConfirm={() => onAsyncActionModal(() => messageApi.delete({
                        endpoint: `${endpoints[params.type]}/delete/${params.id}`,
                        messageIds: [...selectedMessages.keys()]
                    }),
                    {
                        closeOnError: true,
                        onResolve: () => {
                            // toast.success(`${size} ${size > 1 ? 'messages' : 'message'} was deleted`, { position: 'top-center' });
                            setChat({ mode: 'default', selectedMessages: new Map() })
                        },
                        onReject: () => {} // toast.error('Cannot delete messages')
                    })}
                />
            ),
            withHeader: false,
            bodyClassName: 'h-auto p-5'
        })
    }

    return (
        <div className='flex items-center size-full'>
            <Button variant='text' size='icon' className='mr-2' onClick={() => setChat({ mode: 'default', selectedMessages: new Map() })}>
                <X className='w-6 h-6' />
            </Button>
            <Typography>{`${selectedMessages.size} ${selectedMessages.size > 1 ? 'messages' : 'message'}`}</Typography>
            <Button
                onClick={handleDelete}
                variant='ghost'
                className='dark:text-red-500 dark:hover:bg-red-500/20 gap-2 ml-auto'
            >
                <Trash className='w-6 h-6 text-red-500' />
                Delete
            </Button>
        </div>
    );
};
