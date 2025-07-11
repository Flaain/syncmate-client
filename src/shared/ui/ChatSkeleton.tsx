import { OutletContainer } from '@/shared/ui/OutletContainer';

import { AnimatedSkeleton } from './AnimatedSkeleton';
import { MessageSkeleton } from './MessageSkeleton';
import { Pattern } from './Pattern';

/* need to direct call MessageSkeleton for sync suspense fallback and Chat loading state when fetching data
   othervise there will be a rerender and messages skeletons will changes
*/ 

export const ChatSkeleton = () => {
    return (
        <OutletContainer className='relative flex-col'>
            <Pattern />
            <AnimatedSkeleton className='sticky min-h-[56px] flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 top-0 z-[999]' />
            <div className='flex flex-col px-4 gap-1 py-2 flex-1 overflow-hidden max-w-3xl w-full mx-auto'>
                {[...new Array(12)].map((_, index) => MessageSkeleton({ key: index }))}
            </div>
            <AnimatedSkeleton className='max-w-3xl w-[calc(100%-12px)] mx-auto sticky bottom-0 rounded-2xl mb-4 min-h-[54px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white' />
        </OutletContainer>
    );
};