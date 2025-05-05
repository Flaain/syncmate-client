import { PreAnimatedSkeleton } from '@/shared/ui/PreAnimatedSkeleton';
import { Typography } from '@/shared/ui/Typography';

export const DataStorageMenuSkeleton = () => (
    <div className='px-4 pt-4 flex flex-col relative'>
        <Typography as='h2' title='Automatic cached files' className='px-4 mb-5' weight='medium' size='lg'>
            Automatic cached files
        </Typography>
        <PreAnimatedSkeleton className='py-2 px-4 h-14 rounded-lg bg-primary-dark-50 mb-4' />
        <PreAnimatedSkeleton className='py-2 px-4 h-14 rounded-lg bg-primary-dark-50/50 mb-4 before:!border-primary-gray/10' />
        <PreAnimatedSkeleton className='py-2 px-4 h-14 rounded-lg bg-primary-dark-50/10 before:border-none' />
    </div>
);