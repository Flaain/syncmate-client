import { AnimatedSkeleton } from '@/shared/ui/AnimatedSkeleton';
import { SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

export const ActiveSessionsMenuSkeleton = () => (
    <>
        <div className='flex flex-col px-4'>
            <Typography as='h2' size='lg' weight='medium' className='px-4 py-2'>
                This device
            </Typography>
            <AnimatedSkeleton className='flex h-14 rounded-lg bg-primary-dark-50' />
        </div>
        <>
            <SidebarMenuSeparator className='h-10'>Logs out all devices except for this one.</SidebarMenuSeparator>
            <ul className='px-4 pb-2 flex flex-col gap-5 overflow-auto h-fill-available box-border'>
                {[...Array(5)].map((_, i) => (
                    <li key={i} className='flex'>
                        <AnimatedSkeleton
                            className='flex-1 h-14 rounded-lg bg-primary-dark-50'
                            style={{ opacity: 1 - i * 0.2 }}
                        />
                    </li>
                ))}
            </ul>
        </>
    </>
);