import { cn } from '@/shared/lib/utils/cn';
import { AnimatedSkeleton } from '@/shared/ui/AnimatedSkeleton';

interface FeedSkeletonProps extends React.HTMLAttributes<HTMLUListElement> {
    animate?: boolean;
    skeletonsCount?: number;
}

export const FeedSkeleton = ({ skeletonsCount = 5, animate = false, className, ...rest }: FeedSkeletonProps) => (
    <ul {...rest} className={cn('flex flex-col gap-5 overflow-auto flex-1 px-4', className)}>
        {[...new Array(skeletonsCount)].map((_, index, array) => (
            <li
                key={index}
                className='flex justify-between items-center'
                style={{ opacity: (array.length - index) / array.length }}
            >
                <div className='flex items-center gap-5 w-full'>
                    <AnimatedSkeleton
                        animate={animate}
                        className='dark:bg-primary-dark-50 min-w-[50px] h-[50px] space-y-5 rounded-full relative'
                    />
                    <div className='flex flex-col gap-2 w-full'>
                        <AnimatedSkeleton
                            animate={animate}
                            className='dark:bg-primary-dark-50 w-[80px] h-[10px] space-y-5 rounded-xl relative'
                        />
                        <AnimatedSkeleton
                            animate={animate}
                            className='dark:bg-primary-dark-50 w-full h-[15px] space-y-5 rounded-xl relative'
                        />
                    </div>
                </div>
            </li>
        ))}
    </ul>
);