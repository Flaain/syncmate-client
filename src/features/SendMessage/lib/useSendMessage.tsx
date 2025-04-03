import { messageApi } from '@/entities/Message';
import { endpoints } from '@/entities/Message/model/constants';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useModal } from '@/shared/lib/providers/modal';
import { selectModalActions } from '@/shared/lib/providers/modal/store';
import { useLayout } from '@/shared/model/store';
import { Confirm } from '@/shared/ui/Confirm';
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { EmojiData, MessageFormState, UseMessageParams } from '../model/types';

export const useSendMessage = ({ onChange, handleTypingStatus }: Omit<UseMessageParams, 'restrictMessaging'>) => {
    const { onCloseModal, onOpenModal, onAsyncActionModal } = useModal(selectModalActions);
    const { params, lastMessageRef, textareaRef, handleOptimisticUpdate } = useChat(useShallow((state) => ({ 
        textareaRef: state.refs.textareaRef,
        lastMessageRef: state.refs.lastMessageRef,
        params: state.params,
        handleOptimisticUpdate: state.actions.handleOptimisticUpdate
    })));
    
    const currentDraft = useLayout((state) => state.drafts).get(params.id);

    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
    const [value, setValue] = React.useState(currentDraft?.value ?? '');

    const onEmojiSelect = React.useCallback(({ native }: EmojiData) => {
        const { selectionStart, selectionEnd } = textareaRef.current as HTMLTextAreaElement;
        const newCaretPosition = selectionStart + native.length;

        setValue((prev) => `${prev.slice(0, selectionStart)}${native}${prev.slice(selectionEnd)}`);
        setTimeout(() => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(newCaretPosition, newCaretPosition)
        }, 0);
    }, []);

    React.useEffect(() => { 
        if (!textareaRef.current) return;
        
        const end = value.length;
        
        textareaRef.current.setSelectionRange(end, end);
        textareaRef.current.focus();
     }, []);

    React.useEffect(() => { setValue(currentDraft?.value ?? '') }, [currentDraft]);

    React.useEffect(() => {
        if (!textareaRef.current) return;

        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 50)}px`;
    }, [value]);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && 'form' in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    }, []);

    const handleChange = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        const trimmedValue = value.trim();
        
        setValue(!trimmedValue.length ? '' : value.normalize('NFC').replace(/[\u0300-\u036f]/g, ""));
        
        onChange?.(trimmedValue);
        handleTypingStatus?.(currentDraft?.state ?? 'send');
    }, [currentDraft]);

    const setDefaultState = React.useCallback(() => {
        useLayout.setState((prevState) => {
            const newState = new Map([...prevState.drafts]);
            
            newState.delete(params.id);
            
            return { drafts: newState };
        })
        
        handleTypingStatus?.(currentDraft?.state ?? 'send', true);
        setValue('');

        textareaRef.current?.focus();
    }, [params.id, currentDraft]);

    const handleDeleteMessage = React.useCallback(async () => {
        onAsyncActionModal(() => messageApi.delete({ 
            endpoint: `${endpoints[params.type]}/delete/${params.id}`, 
            messageIds: [currentDraft!.selectedMessage!._id]
        }), {
            closeOnError: true,
            onResolve: () => {
                // toast.success('Message deleted', { position: 'top-center' });
                setDefaultState();
            },
            onReject: () => {
                // toast.error('Cannot delete message', { position: 'top-center' });
                textareaRef.current?.focus();
            }
        })
    }, [currentDraft, params.id]);
    
    const onBlur = React.useCallback(({ target: { value } }: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        const trimmedValue = value.trim();

        if ((!trimmedValue.length && !currentDraft) || trimmedValue === currentDraft?.value) return;

        useLayout.setState((prevState) => {
            const newState = new Map([...prevState.drafts]);
            const isEmpty = !trimmedValue.length && currentDraft?.state === 'send';

            isEmpty ? newState.delete(params.id) : newState.set(params.id, currentDraft ? { ...currentDraft, value: trimmedValue } : { 
                state: 'send', 
                value: trimmedValue 
            });

            return { drafts: newState };
        })
    }, [params.id, currentDraft]);

    const onSendEditedMessage = async (message: string) => {
        if (!message.length) {
            return onOpenModal({
                content: (
                    <Confirm
                        onCancel={onCloseModal()}
                        onConfirm={handleDeleteMessage}
                        onConfirmText='Delete'
                        text='Are you sure you want to delete this message?'
                        onConfirmButtonVariant='destructive'
                    />
                ),
                withHeader: false,
                bodyClassName: 'h-auto p-5 w-[400px]'
            });
        }

        if (message === currentDraft!.selectedMessage!.text) return setDefaultState();
        
        const { onSuccess, signal, onError } = handleOptimisticUpdate(message);
        
        setDefaultState();

        try {
            const { data } = await messageApi.edit({ 
                signal,
                endpoint: `${endpoints[params.type]}/edit/${currentDraft!.selectedMessage!._id}`,
                body: JSON.stringify({ message, ...params.query }),
             })
            
            onSuccess(data);
        } catch (error) {
            console.error(error);
            onError(error, 'Cannot edit message');
        }
    };

    const onSendMessage = async (message: string) => {
        if (!message.length) return;

        const { onSuccess, signal, onError } = handleOptimisticUpdate(message);
        
        setDefaultState();
        
        try {
            const { data } = await messageApi.send({ 
                signal, 
                endpoint: `${endpoints[params.type]}/send/${params.id}`, 
                body: JSON.stringify({ message, ...params.query })
            });
            
            onSuccess(data);
            
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });          
        } catch (error) {
            console.error(error);
            onError(error, 'Cannot send message');
        }
    };

    const onReplyMessage = async (message: string) => {
        if (!message.length) return;

        const { onSuccess, signal, onError } = handleOptimisticUpdate(message);
        
        setDefaultState();
        
        try {
            const { data } = await messageApi.reply({
                signal, 
                endpoint: `${endpoints[params.type]}/reply/${currentDraft!.selectedMessage!._id}`,
                body: JSON.stringify({ message, ...params.query })
             })
            
            onSuccess(data);
        } catch (error) {
            console.error(error);
            onError(error, 'Cannot reply message');
        }
    }

    const handleSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();

            const actions: Record<MessageFormState, (message: string) => Promise<void>> = {
                send: onSendMessage,
                edit: onSendEditedMessage,
                reply: onReplyMessage
            };
            
            await actions[currentDraft?.state ?? 'send'](value.trim());
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => textareaRef.current?.focus(), 0);
        }
    };

    return {
        value,
        isEmojiPickerOpen,
        setIsEmojiPickerOpen,
        onKeyDown,
        onBlur,
        setDefaultState,
        handleSubmitMessage,
        handleChange,
        onEmojiSelect
    };
};