import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery';
import { Typography } from '@/shared/ui/Typography';
import { LucideMessagesSquare } from 'lucide-react';

export const Home = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (isMobile) return null;

    return (
        <div className='max-md:hidden flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white px-2'>
            <Typography as='h1' variant='primary' size='2xl' weight='bold' align='center' className='max-w-[400px]'>
                Select a chat to start messaging or create one!
            </Typography>
            <LucideMessagesSquare className='w-32 h-32 dark:text-primary-white text-primary-dark-200' />
        </div>
    );
};