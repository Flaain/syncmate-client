import { AnimatedSkeleton } from '@/shared/ui/AnimatedSkeleton';
import { SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';

export const PrivacySkeleton = () => (
    <>
        <ul className='mt-2 flex flex-col px-4 gap-2'>
            {[...new Array(3)].map((_, index, array) => (
                <li key={index} className='flex' style={{ opacity: (array.length - index) / array.length }}>
                    <AnimatedSkeleton className='flex items-center gap-5 py-2 px-4 rounded-lg bg-primary-dark-50 flex-1'>
                        <AnimatedSkeleton className='size-10 rounded-full bg-primary-dark-100 flex' />
                        <AnimatedSkeleton
                            style={{ width: `${Math.floor(Math.random() * (300 - 128 + 1) + 128)}px` }}
                            className='h-5 rounded-full bg-primary-dark-100 flex'
                        />
                    </AnimatedSkeleton>
                </li>
            ))}
        </ul>
        <SidebarMenuSeparator className='h-auto'>Manage your privacy settings accross all devices</SidebarMenuSeparator>
        <div className='px-4 flex flex-col relative'>
            {[...Array(5)].map((_, i) => (
                <AnimatedSkeleton
                    key={i}
                    className='py-2 px-2 h-14 flex flex-col gap-2 rounded-lg bg-primary-dark-50 mb-4'
                    style={{ opacity: 1 - i * 0.2 }}
                >
                    <AnimatedSkeleton
                        className='before:border-none rounded-full h-3 border-none bg-primary-dark-100 flex'
                        style={{ width: `${Math.floor(Math.random() * (250 - 128 + 1) + 128)}px` }}
                    />
                    <AnimatedSkeleton
                        className='before:border-none rounded-full h-3 border-none bg-primary-dark-100 flex'
                        style={{ width: `${Math.floor(Math.random() * (120 - 80 + 1) + 80)}px` }}
                    />
                </AnimatedSkeleton>
            ))}
        </div>
    </>
);