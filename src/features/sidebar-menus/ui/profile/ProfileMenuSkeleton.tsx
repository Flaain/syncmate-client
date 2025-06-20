import { MIN_LOGIN_LENGTH } from '@/shared/constants';
import { AnimatedSkeleton } from '@/shared/ui/AnimatedSkeleton';
import { SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';

export const ProfileMenuSkeleton = () => (
    <>
        <div className='px-4 pt-4 flex flex-col relative'>
            <AnimatedSkeleton className='size-32 rounded-full self-center bg-primary-dark-50 mb-5' />
            <AnimatedSkeleton className='py-2 px-4 h-14 rounded-lg bg-primary-dark-50 mb-5' />
            <AnimatedSkeleton className='py-2 px-4 h-14 rounded-lg bg-primary-dark-50 mb-5' />
            <AnimatedSkeleton className='py-2 px-4 h-14 rounded-lg bg-primary-dark-50' />
        </div>
        <SidebarMenuSeparator className='h-auto'>
            Any details such as age, occupation or city.
            <br />
            Example: 23 y.o. designer from San Francisco
        </SidebarMenuSeparator>
        <AnimatedSkeleton className='flex w-[calc(100%-32px)] py-2 px-4 h-14 rounded-lg bg-primary-dark-50 m-4' />
        <SidebarMenuSeparator className='h-auto'>
            You can use a-z, 0-9 and underscore.
            <br />
            Minimum length is {MIN_LOGIN_LENGTH} characters.
        </SidebarMenuSeparator>
    </>
);