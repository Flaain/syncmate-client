import { AnimatedSkeleton } from '@/shared/ui/AnimatedSkeleton';

export const SettingsSkeleton = () => (
    <>
        <div className='px-4 pt-4 pb-2 flex flex-col border-b-[12px] border-solid border-primary-dark-200 relative'>
            <div className='flex flex-col mb-5'>
                <AnimatedSkeleton className='size-32 rounded-full self-center bg-primary-dark-50' />
                <AnimatedSkeleton className='h-5 w-32 self-center bg-primary-dark-50 rounded-lg mt-2' />
            </div>
            <AnimatedSkeleton className='flex items-center gap-5 py-2 px-4 rounded-lg bg-primary-dark-50 flex-1 mb-2'>
                <AnimatedSkeleton className='size-10 rounded-full bg-primary-dark-100 flex' />
                <AnimatedSkeleton className='h-5 w-32 rounded-full bg-primary-dark-100 flex' />
            </AnimatedSkeleton>
            <AnimatedSkeleton className='flex items-center gap-5 py-2 px-4 rounded-lg bg-primary-dark-50 flex-1 mb-2'>
                <AnimatedSkeleton className='size-10 rounded-full bg-primary-dark-100 flex' />
                <AnimatedSkeleton className='h-5 w-48 rounded-full bg-primary-dark-100 flex' />
            </AnimatedSkeleton>
        </div>
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
    </>
);