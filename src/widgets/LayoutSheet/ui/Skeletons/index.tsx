import { useProfile } from '@/entities/profile';
import { APP_VERSION } from '@/shared/constants';
import { Typography } from '@/shared/ui/Typography';

export const LayoutSheetSkeleton = () => {
    const { profile } = useProfile();

    return (
        <div className='flex flex-col py-8 h-full'>
            <Typography as='p' variant='secondary' className='flex flex-col mt-auto px-4'>
                Syncmate Web, {new Date().getFullYear()}
                <Typography variant='secondary'>
                    Version {APP_VERSION}
                </Typography>
            </Typography>
        </div>
    );
}