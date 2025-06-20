import React from 'react';

import { useShallow } from 'zustand/shallow';

import { EmojiPicker } from '@/features/emoji-picker';

import ArrowDownIcon from '@/shared/lib/assets/icons/arrow_down.svg?react';
import SendIcon from '@/shared/lib/assets/icons/send.svg?react';
import SmileIcon from '@/shared/lib/assets/icons/smile.svg?react';

import { sendMessageSelector, useChat } from '@/shared/lib/providers/chat';
import { useLayout } from '@/shared/model/store';
import { Button } from '@/shared/ui/button';

import { UseMessageParams } from '../model/types';
import { useSendMessage } from '../model/useSendMessage';

import { Placeholder } from './Placeholder';
import { TopBar } from './TopBar';

export const SendMessage = ({ onChange, handleTypingStatus, restrictMessaging }: UseMessageParams) => {
    const { params, lastMessageRef, textareaRef, showAnchor } = useChat(useShallow(sendMessageSelector))
    const { handleSubmitMessage, onKeyDown, onBlur, onKeyUp, setDefaultState, handleChange, onEmojiSelect, setIsEmojiPickerOpen, isEmojiPickerOpen, value } = useSendMessage({ onChange, handleTypingStatus });
    
    const currentDraft = useLayout((state) => state.drafts).get(params.id);
    const restrictedIndex = React.useMemo(() => restrictMessaging?.findIndex(({ reason }) => reason), [restrictMessaging]);

    if (typeof restrictedIndex !== 'undefined' && restrictedIndex !== -1) {
        return <Placeholder text={restrictMessaging![restrictedIndex].message} />;
    };

    return (
        <>
            <div className='flex flex-col sticky bottom-0 w-full z-[999] pointer-events-auto'>
                {isEmojiPickerOpen && (
                    <EmojiPicker onClose={() => setIsEmojiPickerOpen(false)} onEmojiSelect={onEmojiSelect} />
                )}
                {(currentDraft?.state ?? 'send') !== 'send' && (
                    <TopBar
                        onClose={setDefaultState}
                        state={currentDraft?.state!}
                        description={currentDraft?.selectedMessage?.text!}
                    />
                )}
                <form
                    className='w-full max-h-[120px] overflow-hidden relative flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'
                    onSubmit={handleSubmitMessage}
                >
                    <textarea
                        id='message-input'
                        rows={1}
                        ref={textareaRef}
                        value={value}
                        onKeyUp={onKeyUp}
                        onBlur={onBlur}
                        onChange={handleChange}
                        onKeyDown={onKeyDown}
                        placeholder='Write a message...'
                        className='overscroll-contain disabled:opacity-50 pl-5 py-[15px] min-h-[50px] scrollbar-hide max-h-[120px] overflow-auto flex box-border flex-1 transition-all duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                    ></textarea>
                    {showAnchor && (
                        <Button
                            onClick={() => lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            disabled={!showAnchor}
                            type='button'
                            size='text'
                            className='ml-4'
                        >
                            <ArrowDownIcon className='size-6 text-primary-white' />
                        </Button>
                    )}
                    <Button
                        size='text'
                        type='button'
                        onClick={(e) => (e.stopPropagation(), setIsEmojiPickerOpen(!isEmojiPickerOpen))}
                        className='mx-5'
                    >
                        <SmileIcon className='size-6 dark:text-primary-white' />
                    </Button>
                    <Button
                        size='text'
                        type='submit'
                        disabled={!value.trim().length && currentDraft?.state !== 'edit'}
                        className='mr-5'
                    >
                        <SendIcon className='size-6 dark:text-primary-white' />
                    </Button>
                </form>
            </div>
        </>
    );
};