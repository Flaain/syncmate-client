import { cn } from '@/shared/lib/utils/cn';
import { AnimatedSkeleton } from '@/shared/ui/AnimatedSkeleton';

import { ESTIMATED_MESSAGE_SIZE } from '../constants';
import { CHAT_TYPE } from '../model/types';

import { MessageTail } from './MessageTail';

export const MessageSkeleton = ({ key, type }: { key?: number; type: CHAT_TYPE }) => {
    const index = Math.round(Math.random());

    return (
        <div className='flex gap-2 my-1' key={key}>
            {type === 'Group' && !index && (
                <AnimatedSkeleton className='max-xl:hidden self-end dark:bg-primary-dark-50 min-w-[40px] max-w-[40px] h-10 space-y-5 rounded-full' />
            )}
            <div className={cn('flex items-center w-full gap-5 relative justify-start', index && 'justify-end')}>
                <AnimatedSkeleton
                    style={{
                        height: `${Math.floor(Math.random() * (100 - ESTIMATED_MESSAGE_SIZE + 1) + ESTIMATED_MESSAGE_SIZE)}px`,
                        width: `${Math.floor(Math.random() * 101) + 120}px`
                    }}
                    className={cn(
                        'dark:bg-primary-dark-50 box-border pl-5 pr-12 py-1 w-full max-w-[480px] flex items-end gap-3 self-start',
                        index
                            ? 'rounded-es-[15px] rounded-ss-[15px] rounded-se-[15px] rounded-ee-[0px]'
                            : 'rounded-ss-[15px] rounded-es-[0px] rounded-se-[15px] rounded-ee-[15px]'
                    )}
                />
                <MessageTail
                    position={index ? 'right' : 'left'}
                    className='dark:text-primary-dark-50 text-primary-gray'
                />
            </div>
        </div>
    );
};