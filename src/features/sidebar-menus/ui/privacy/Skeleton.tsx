import { AnimatedSkeleton } from '@/shared/ui/AnimatedSkeleton';
import { SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';

export const PrivacyAndSecurityMenuSkeleton = () => (
    <>
        <div className='px-2 pt-4 flex flex-col relative'>
            <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50 mb-4' />
            <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/50 mb-4 before:!border-primary-gray/10' />
            <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/10 before:border-none' />
        </div>
        <SidebarMenuSeparator className='h-auto'>Manage your privacy settings accross all devices</SidebarMenuSeparator>
        <div className='px-2 flex flex-col relative'>
            <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50 mb-4' />
            <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/50 mb-4 before:!border-primary-gray/10' />
            <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/30 mb-4 before:!border-primary-gray/10' />
            <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/20 mb-4 before:!border-primary-gray/10' />
            <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/10 before:border-none' />
        </div>
    </>
);