import React from 'react';

import { Emoji, EmojiPicker as EP } from 'frimousse';

import SearchIcon from '@/shared/lib/assets/icons/search.svg?react';

import { useMenuDistance } from '@/shared/lib/hooks/useMenuDistance';
import { useChat } from '@/shared/lib/providers/chat';
import { cn } from '@/shared/lib/utils/cn';
import { useEvents } from '@/shared/model/store';

export const EmojiPicker = ({
    onClose,
    onEmojiSelect
}: {
    onClose: () => void;
    onEmojiSelect: (emoji: Emoji) => void;
}) => {
    const [shouldRemove, setShouldRemove] = React.useState(false);

    const textareaRef = useChat((state) => state.refs.textareaRef);
    const ref = React.useRef<HTMLDivElement>(null);

    useMenuDistance<HTMLDivElement>({ ref, x_distance: 250, y_distance: 300, onClose: () => setShouldRemove(true) });

    const addEventListener = useEvents((state) => state.addEventListener);

    React.useEffect(() => {
        if (!ref.current) return;
        
        document.body.style.pointerEvents = 'none';
        document.body.style.paddingRight = window.innerWidth - document.body.offsetWidth + 'px';
        document.body.classList.add('overflow-hidden');
        
        const removeKeyDownListener = addEventListener('keydown', (event) => event.key === 'Escape' && setShouldRemove(true));
        
        const removeClickListener = addEventListener('click', ({ target }) => {
            !ref.current?.contains(target as Node) && setShouldRemove(true);
        });
        
        
        return () => {
            removeKeyDownListener();
            removeClickListener();
            
            document.body.classList.remove('overflow-hidden');
            document.body.style.pointerEvents = 'auto';
            document.body.style.paddingRight = '0';

            requestAnimationFrame(() => textareaRef.current?.focus());
        };
    }, []);

    return (
        <EP.Root
            ref={ref}
            onAnimationEnd={() => shouldRemove && onClose()}
            onEmojiSelect={onEmojiSelect}
            className={cn('absolute pointer-events-auto bottom-[calc(100%+5px)] right-5 z-[999] isolate flex h-[368px] w-fit flex-col bg-white dark:border-none border-none dark:bg-menu-background-color backdrop-blur-[50px] rounded-[10px]', 
                shouldRemove ? 'fill-mode-forwards animate-out fade-out-0 zoom-out-95' : 'animate-in fade-in-80 zoom-in-95'
            )}
        >
            <div
                className='flex h-10 items-center gap-2 border-b px-3 border-solid border-primary-dark-200'
                data-slot='emoji-picker-search-wrapper'
            >
                <SearchIcon className='size-5 min-w-5 max-w-5 text-primary-gray' />
                <EP.Search
                    autoFocus
                    type='text'
                    className='outline-none caret-primary-gray appearance-none focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-200 placeholder:ease-in-out placeholder:text-primary-gray text-primary-white flex h-10 w-full rounded-md bg-transparent py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50'
                    data-slot='emoji-picker-search'
                />
            </div>
            <EP.Viewport autoFocus className='relative flex-1 outline-hidden scrollbar-hide outline-none'>
                <EP.Loading className='absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500'>
                    Loading…
                </EP.Loading>
                <EP.Empty className='absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500'>
                    No emoji found.
                </EP.Empty>
                <EP.List
                    className='select-none pb-1.5 scrollbar-hide outline-none'
                    components={{
                        CategoryHeader: ({ category, ...props }) => (
                            <div
                                className='px-3 py-2 font-medium text-neutral-600 text-xs dark:border-none border-none dark:bg-menu-background-color backdrop-blur-[50px] bg-primary-white flex flex-col dark:text-neutral-400'
                                {...props}
                            >
                                {category.label}
                            </div>
                        ),
                        Row: ({ children, ...props }) => (
                            <div className='scroll-my-1.5 px-1.5' {...props}>
                                {children}
                            </div>
                        ),
                        Emoji: ({ emoji, ...props }) => (
                            <button
                            className="relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md text-lg data-[active]:bg-neutral-100/80 dark:data-[active]:bg-neutral-800/80 before:absolute before:inset-0 before:-z-1 before:hidden before:items-center before:justify-center before:text-[2.5em] before:blur-lg before:saturate-200 before:content-(--emoji) data-[active]:before:flex"
                            style={{ "--emoji": `"${emoji.emoji}"` } as React.CSSProperties}                    
                            {...props}
                            >
                                {emoji.emoji}
                            </button>
                        )
                    }}
                />
            </EP.Viewport>
        </EP.Root>
    );
};
