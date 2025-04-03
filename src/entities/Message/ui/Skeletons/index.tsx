import { cn } from '@/shared/lib/utils/cn';
import { PreAnimatedSkeleton } from '@/shared/ui/PreAnimatedSkeleton';

export const MessageSkeleton = ({ key }: { key: number }) => {
    const index = Math.round(Math.random());
    const isEven = !(index % 2);

    return (
        <li className='flex gap-2' key={key}>
            <PreAnimatedSkeleton className='max-xl:hidden self-end dark:bg-primary-dark-50 min-w-[40px] max-w-[40px] h-10 space-y-5 rounded-full' />
            <div
                className={cn(
                    'flex items-center w-full gap-5 relative',
                    index % 2 ? 'xl:justify-start justify-end' : 'justify-start'
                )}
            >
                <PreAnimatedSkeleton
                    style={{ height: `${Math.floor(Math.random() * 101) + 40}px`, width: `${Math.floor(Math.random() * 101) + 120}px` }}
                    className={cn(
                        'dark:bg-primary-dark-50 box-border pl-5 pr-12 py-1 mt-2 w-full max-w-[480px] flex items-end gap-3 self-start',
                        !isEven
                            ? 'rounded-es-[15px] rounded-ss-[15px] xl:rounded-ee-[15px] rounded-se-[15px] rounded-ee-[0px] xl:rounded-ss-[15px] xl:rounded-es-[0px]'
                            : 'rounded-ss-[15px] rounded-es-[0px] rounded-se-[15px] rounded-ee-[15px]'
                    )}
                />
                <svg
                    width='11'
                    height='20'
                    viewBox='0 0 11 20'
                    fill='currentColor'
                    className={cn('text-primary-dark-50 absolute z-10 bottom-0 w-[11px] h-5 block', {
                        ['-right-[11px] xl:-left-[11px] max-xl:scale-x-[-1]']: !isEven,
                        ['-left-[11px]']: isEven
                    })}
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M11 0C11 6.42858 7.76471 15.3571 1.29412 17.1429C1.29412 17.1429 0 17.1429 0 18.5714C0 20 1.29412 20 1.29412 20L11 20V0Z'
                        fill='currentColor'
                    />
                </svg>
            </div>
        </li>
    );
};
