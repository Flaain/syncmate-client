import React from 'react';

import { Emoji } from 'frimousse';
import { useShallow } from 'zustand/shallow';

import { messageApi, MESSAGE_ENDPOINTS } from '@/entities/message';

import { useLatest } from '@/shared/lib/hooks/useLatest';
import { getUseSendMessageSelector, useChat } from '@/shared/lib/providers/chat';
import { selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { useLayout } from '@/shared/model/store';
import { MessageFormState } from '@/shared/model/types';
import { Confirm } from '@/shared/ui/Confirm';

import { UseMessageParams } from './types';

const MIN_HEIGHT_TEXTAREA = 50;

export const useSendMessage = ({ onChange, handleTypingStatus }: Omit<UseMessageParams, 'restrictMessaging'>) => {
    const { onOpenModal, onCloseModal, onAsyncActionModal } = useModal(selectModalActions);
    const { params, textareaRef, chatInfo, handleOptimisticUpdate } = useChat(useShallow(getUseSendMessageSelector))
    
    const currentDraft = useLayout((state) => state.drafts).get(params.id);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
    const [value, setValue] = React.useState(currentDraft?.value ?? '');
    
    const valueRef = useLatest(value, [value]);

    const onEmojiSelect = ({ emoji }: Emoji) => {
        if (textareaRef.current instanceof HTMLTextAreaElement) {
            const { selectionStart, selectionEnd } = textareaRef.current, newPos = selectionStart + emoji.length;

            setValue((prev) => `${prev.slice(0, selectionStart)}${emoji}${prev.slice(selectionEnd)}`);

            requestAnimationFrame(() => {
                textareaRef.current?.focus();
                textareaRef.current?.setSelectionRange(newPos, newPos);
            });
        }
    };

    React.useEffect(() => {
        requestAnimationFrame(() => {
            if (!textareaRef.current) return;
            
            const end = valueRef.current.length;
            
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(end, end);
        });
    }, [params.id]);

    React.useEffect(() => { 
        setValue(currentDraft?.value ?? '');
        handleResize();
    }, [currentDraft]);

    const handleResize = () => {
        requestAnimationFrame(() => {
            if (!textareaRef.current) return;

            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, MIN_HEIGHT_TEXTAREA)}px`;
        });
    }

    const onKeyUp = (_: React.KeyboardEvent<HTMLTextAreaElement>) => {}

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && 'form' in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    };

    const handleChange = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        const trimmedValue = value.trim();
        
        setValue(!trimmedValue.length ? '' : value.normalize('NFC').replace(/[\u0300-\u036f]/g, ""));
        
        onChange?.(trimmedValue);
        handleTypingStatus?.(currentDraft?.state ?? 'send');
    }, [currentDraft]);

    const setDefaultState = React.useCallback(() => {
        useLayout.setState((prevState) => {
            const newState = new Map(prevState.drafts);
            
            newState.delete(params.id);
            
            return { drafts: newState };
        })
        
        handleTypingStatus?.(currentDraft?.state ?? 'send', true);
        setValue('');

        requestAnimationFrame(() => textareaRef.current?.focus());
    }, [params.id, currentDraft]);

    const handleDeleteMessage = React.useCallback(async () => {
        await onAsyncActionModal(() => messageApi.delete({ 
            endpoint: `${MESSAGE_ENDPOINTS[params.type]}/delete/${params.id}`, 
            messageIds: [currentDraft!.selectedMessage!._id]
        }), {
            closeOnError: true,
            onResolve: () => {
                toast.success('Message deleted');
                setDefaultState();
            },
            onReject: () => {
                toast.error('Cannot delete message');
                requestAnimationFrame(() => textareaRef.current?.focus());
            }
        })
    }, [currentDraft, params.id]);
    
    const onBlur = React.useCallback(({ target: { value } }: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        const trimmedValue = value.trim();

        if ((!trimmedValue.length && !currentDraft) || trimmedValue === currentDraft?.value) return;

        useLayout.setState((prevState) => {
            const newState = new Map(prevState.drafts);
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
            setTimeout(() => textareaRef.current?.blur(), 0);

            return onOpenModal({
                content: (
                    <Confirm
                        withAvatar
                        avatarUrl={chatInfo.avatar?.url}
                        title='Delete message'
                        description='Are you sure you want to delete this message?'
                        onConfirm={handleDeleteMessage}
                        onCancel={onCloseModal}
                        name={chatInfo.name}
                        onConfirmButtonIntent='destructive'
                        onConfirmText='Delete'
                    />
                ),
                withHeader: false
            });
        }

        if (message === currentDraft!.selectedMessage!.text) return setDefaultState();

        const { onSuccess, signal, onError } = handleOptimisticUpdate(message);

        setDefaultState();

        try {
            const { data } = await messageApi.edit({
                signal,
                endpoint: `${MESSAGE_ENDPOINTS[params.type]}/edit/${currentDraft!.selectedMessage!._id}`,
                body: JSON.stringify({ message, ...params.query })
            });

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
                endpoint: `${MESSAGE_ENDPOINTS[params.type]}/send/${params.id}`, 
                body: JSON.stringify({ message, ...params.query })
            });
            
            onSuccess(data);
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
                endpoint: `${MESSAGE_ENDPOINTS[params.type]}/reply/${currentDraft!.selectedMessage!._id}`,
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
            requestAnimationFrame(() => textareaRef.current?.focus());
        }
    };

    return {
        value,
        isEmojiPickerOpen,
        setIsEmojiPickerOpen,
        onKeyUp,
        onKeyDown,
        onBlur,
        setDefaultState,
        handleSubmitMessage,
        handleChange,
        onEmojiSelect
    };
};