import { PreAnimatedSkeleton } from '@/shared/ui/PreAnimatedSkeleton';

export const SettingsMenuSkeleton = () => (
    <>
        <div className='px-4 pt-4 pb-2 flex flex-col border-b-[12px] border-solid border-primary-dark-200 relative'>
            <div className='flex flex-col mb-5'>
                <PreAnimatedSkeleton className='size-32 rounded-full self-center bg-primary-dark-50' />
                <PreAnimatedSkeleton className='h-5 w-32 self-center bg-primary-dark-50 rounded-lg mt-2' />
            </div>
            <PreAnimatedSkeleton className='flex items-center gap-5 py-2 px-4 rounded-lg bg-primary-dark-50 flex-1 mb-2'>
                <PreAnimatedSkeleton className='size-10 rounded-full bg-primary-dark-100 flex' />
                <PreAnimatedSkeleton className='h-5 w-32 rounded-full bg-primary-dark-100 flex' />
            </PreAnimatedSkeleton>
            <PreAnimatedSkeleton className='flex items-center gap-5 py-2 px-4 rounded-lg bg-primary-dark-50 flex-1 mb-2'>
                <PreAnimatedSkeleton className='size-10 rounded-full bg-primary-dark-100 flex' />
                <PreAnimatedSkeleton className='h-5 w-48 rounded-full bg-primary-dark-100 flex' />
            </PreAnimatedSkeleton>
        </div>
        <ul className='mt-2 flex flex-col px-4 gap-2'>
            {[...new Array(3)].map((_, index, array) => (
                <li key={index} className='flex' style={{ opacity: (array.length - index) / array.length }}>
                    <PreAnimatedSkeleton className='flex items-center gap-5 py-2 px-4 rounded-lg bg-primary-dark-50 flex-1'>
                        <PreAnimatedSkeleton className='size-10 rounded-full bg-primary-dark-100 flex' />
                        <PreAnimatedSkeleton
                            style={{ width: `${Math.floor(Math.random() * (300 - 128 + 1) + 128)}px` }}
                            className='h-5 rounded-full bg-primary-dark-100 flex'
                        />
                    </PreAnimatedSkeleton>
                </li>
            ))}
        </ul>
    </>
);