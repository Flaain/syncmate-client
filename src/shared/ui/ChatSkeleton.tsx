import { OutletContainer } from '@/shared/ui/OutletContainer';

import { MessageSkeleton } from './MessageSkeleton';
import { Pattern } from './Pattern';
import { PreAnimatedSkeleton } from './PreAnimatedSkeleton';

/* need to direct call MessageSkeleton for sync suspense fallback and Chat loading state when fetching data
   othervise there will be a rerender and messages skeletons will changes
*/ 

export const ChatSkeleton = () => {
    return (
        <OutletContainer className='relative flex-col'>
            <Pattern />
            <PreAnimatedSkeleton className='sticky min-h-[56px] flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 top-0 z-[999]' />
            <ul className='flex flex-col px-5 gap-5 py-2 flex-1 overflow-hidden'>
                {[...new Array(12)].map((_, index) => MessageSkeleton({ key: index }))}
            </ul>
            <PreAnimatedSkeleton className='sticky bottom-0 w-full min-h-[70px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white' />
        </OutletContainer>
    );
};