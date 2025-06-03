import ChatsPlaceholderIcon from '@/shared/lib/assets/icons/chatsplaceholder.svg?react';

import { Pattern } from '@/shared/ui/Pattern';
import { Typography } from '@/shared/ui/Typography';

export const Home = () => {
    return (
        <div className='max-lg:hidden flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white px-2 relative'>
            <Pattern />
            <Typography as='h1' variant='primary' size='2xl' weight='bold' align='center' className='max-w-[400px] z-10'>
                Select a chat to start messaging or create one
            </Typography>
            <ChatsPlaceholderIcon className='text-primary-white size-32 z-10' />
        </div>
    );
};