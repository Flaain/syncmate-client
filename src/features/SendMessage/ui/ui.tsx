import { sendMessageSelector, useChat } from '@/shared/lib/providers/chat';
import { useLayout } from '@/shared/model/store';
import { EmojiPicker } from '@/shared/model/view';
import { Button } from '@/shared/ui/button';
import EmojiPickerFallback from '@emoji-mart/react';
import { ArrowDown, SendHorizonal, Smile } from 'lucide-react';
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { useSendMessage } from '../lib/useSendMessage';
import { UseMessageParams } from '../model/types';
import { Placeholder } from './Placeholder';
import { TopBar } from './TopBar';

export const SendMessage = ({ onChange, handleTypingStatus, restrictMessaging }: UseMessageParams) => {
    const { params, lastMessageRef, textareaRef, showAnchor } = useChat(useShallow(sendMessageSelector))

    const {
        handleSubmitMessage,
        onKeyDown,
        onBlur,
        setDefaultState,
        handleChange,
        setIsEmojiPickerOpen,
        onEmojiSelect,
        isEmojiPickerOpen,
        value
    } = useSendMessage({ onChange, handleTypingStatus });
    
    const currentDraft = useLayout((state) => state.drafts).get(params.id);
    const restrictedIndex = React.useMemo(() => restrictMessaging?.findIndex(({ reason }) => reason), [restrictMessaging]);

    if (typeof restrictedIndex !== 'undefined' && restrictedIndex !== -1) {
        return <Placeholder text={restrictMessaging![restrictedIndex].message} />;
    };

    return (
        <div className='flex flex-col sticky bottom-0 w-full z-[999]'>
            {(currentDraft?.state ?? 'send') !== 'send' && (
                <TopBar
                    onClose={setDefaultState}
                    state={currentDraft?.state!}
                    description={currentDraft?.selectedMessage?.text!}
                />
            )}
            <form
                className='w-full max-h-[120px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'
                onSubmit={handleSubmitMessage}
            >
                <textarea
                    rows={1}
                    ref={textareaRef}
                    value={value}
                    onBlur={onBlur}
                    onChange={handleChange}
                    onKeyDown={onKeyDown}
                    placeholder='Write a message...'
                    className='overscroll-contain disabled:opacity-50 leading-5 pl-5 py-[25px] min-h-[70px] scrollbar-hide max-h-[120px] overflow-auto flex box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                ></textarea>
                {showAnchor && (
                    <Button
                        onClick={() => lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        disabled={!showAnchor}
                        variant='text'
                        type='button'
                        size='icon'
                        className='pl-4'
                    >
                        <ArrowDown className='w-6 h-6' />
                    </Button>
                )}
                <Button
                    variant='text'
                    type='button'
                    size='icon'
                    className='px-4'
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEmojiPickerOpen((prev) => !prev);
                    }}
                >
                    <Smile className='w-6 h-6' />
                </Button>
                {isEmojiPickerOpen && (
                    <div className='absolute bottom-20 right-2 z-50'>
                        <React.Suspense fallback={<EmojiPickerFallback />}>
                            <EmojiPicker
                                onClickOutside={({ target }: PointerEvent) =>
                                    target !== textareaRef.current && setIsEmojiPickerOpen(false)
                                }
                                onEmojiSelect={onEmojiSelect}
                            />
                        </React.Suspense>
                    </div>
                )}
                <Button
                    variant='text'
                    size='icon'
                    type='submit'
                    disabled={!value.trim().length && currentDraft?.state !== 'edit'}
                    className='pr-5'
                >
                    <SendHorizonal className='w-6 h-6' />
                </Button>
            </form>
        </div>
    );
};