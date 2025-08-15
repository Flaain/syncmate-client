import { OutletContainer } from '@/shared/ui/OutletContainer';

import { CHAT_TYPE } from '../model/types';

import { AnimatedSkeleton } from './AnimatedSkeleton';
import { MessageSkeleton } from './MessageSkeleton';
import { MessageTail } from './MessageTail';
import { Pattern } from './Pattern';

/* need to direct call MessageSkeleton for sync suspense fallback and Chat loading state when fetching data
   othervise there will be a rerender and messages skeletons will changes
*/

export const ChatSkeleton = ({ type }: { type: CHAT_TYPE }) => {
    return (
        <OutletContainer className='relative flex-col'>
            <Pattern />
            <AnimatedSkeleton className='sticky min-h-[56px] flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 top-0 z-[999]' />
            <div className='flex flex-col px-4 gap-1 py-2 flex-1 overflow-hidden max-w-3xl w-full mx-auto'>
                {[...new Array(12)].map((_, index) => MessageSkeleton({ key: index, type }))}
            </div>
            <div className='relative max-w-[803px] mx-auto w-full pl-3 pr-[23px]'>
                <AnimatedSkeleton className='w-full mx-auto sticky bottom-0 rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] mb-4 min-h-[54px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white' />
                <MessageTail
                    position='right'
                    className='dark:text-primary-dark-100 text-primary-gray bottom-4 right-3'
                />
            </div>
        </OutletContainer>
    );
};