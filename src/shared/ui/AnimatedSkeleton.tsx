import { cn } from '../lib/utils/cn';

export interface AnimatedSkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
    animate?: boolean;
}

export const AnimatedSkeleton = ({ animate = true, className, children, ...rest }: AnimatedSkeletonProps) => (
    <span
        {...rest}
        className={cn(
            'relative',
            className,
            animate &&
                'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/10 before:to-transparent overflow-hidden isolate before:border-t before:border-primary-gray/30'
        )}
    >
        {children}
    </span>
);