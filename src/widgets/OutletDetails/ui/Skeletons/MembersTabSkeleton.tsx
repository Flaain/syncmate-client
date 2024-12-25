import { PreAnimatedSkeleton } from '@/shared/ui/PreAnimatedSkeleton';

export const MembersTabSkeleton = () => (
    <ul className='flex flex-col gap-6 overflow-auto pt-5 px-3'>
        {[...new Array(5)].map((_, index, array) => (
            <li
                key={index}
                className='flex justify-between items-center'
                style={{ opacity: (array.length - index) / array.length }}
            >
                <div className='flex items-center gap-5 w-full'>
                    <PreAnimatedSkeleton className='dark:bg-primary-dark-50 min-w-[50px] h-[50px] space-y-5 rounded-full self-start' />
                    <PreAnimatedSkeleton className='dark:bg-primary-dark-50 w-full h-[50px] space-y-5 rounded-xl' />
                </div>
            </li>
        ))}
    </ul>
);