import Verified from '@/shared/lib/assets/icons/verified.svg?react';
import { cn } from '@/shared/lib/utils/cn';
import { useLocation } from 'react-router-dom';
import { Typography } from '@/shared/ui/Typography';
import { OutletContainer } from '@/shared/ui/OutletContainer';
import { MessageSkeleton } from '@/entities/Message/ui/Skeletons';

export const ChatSkeleton = () => {
    const { state } = useLocation();

    return (
        <OutletContainer className='flex-col'>
            <div className='min-h-[70px] flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'>
                {state && (
                    <Typography
                        as='h2'
                        size='lg'
                        weight='medium'
                        variant='primary'
                        className={cn(state.isOfficial && 'flex items-center gap-2')}
                    >
                        {state.name}
                        {state.isOfficial && (
                            <Typography>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                    </Typography>
                )}
            </div>
            <ul className='flex flex-col px-5 gap-5 py-2 overflow-hidden'>
                {[...new Array(12)].map((_, index) => <MessageSkeleton key={index} />)}
            </ul>
            <div className='sticky bottom-0 w-full min-h-[70px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'></div>
        </OutletContainer>
    );
};