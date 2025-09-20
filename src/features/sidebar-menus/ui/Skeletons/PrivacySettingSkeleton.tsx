import { AnimatedSkeleton } from '@/shared/ui/AnimatedSkeleton';
import { SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

export const PrivacySettingSkeleton = ({ label }: { label?: string }) => (
    <>
        <div className='px-2 pt-4 flex flex-col'>
            {label && (
                <Typography className='flex px-4 pb-2' weight='medium' size='md'>
                    {label}
                </Typography>
            )}
            <AnimatedSkeleton className='h-14 rounded-lg bg-primary-dark-50 mb-4' />
            <AnimatedSkeleton className='h-14 rounded-lg bg-primary-dark-50' />
        </div>
        <SidebarMenuSeparator />
        <div className='px-2 pt-4'>
            <Typography className='flex px-4 pb-2' weight='medium' size='md'>
                Exceptions
            </Typography>
            <AnimatedSkeleton className='flex items-center gap-5 py-2 px-4 rounded-lg bg-primary-dark-50 flex-1'>
                <AnimatedSkeleton className='size-10 rounded-full bg-primary-dark-100 flex' />
                <AnimatedSkeleton
                    style={{ width: `${Math.floor(Math.random() * (300 - 128 + 1) + 128)}px` }}
                    className='h-5 rounded-full bg-primary-dark-100 flex'
                />
            </AnimatedSkeleton>
        </div>
        <SidebarMenuSeparator className='h-auto'>
            You can add users as exception that will overide the settings above.
        </SidebarMenuSeparator>
    </>
);