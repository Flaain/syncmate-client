import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils/cn';
import { ProfileIndicator } from './ProfileIndicator';

export interface AvatarByNameProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
    isOnline?: boolean;
}

const avatarVariants = cva(
    'flex flex-grow-0 leading-none flex-shrink-0 basis-auto justify-center items-center rounded-full dark:bg-primary-white bg-primary-dark-100 font-bold dark:text-primary-dark-200 text-primary-white',
    {
        variants: {
            size: {
                sm: 'size-8 text-md',
                md: 'size-10 text-xl',
                lg: 'size-[50px] text-2xl',
                xl: 'size-14 text-3xl',
                '2xl': 'size-16 text-4xl',
                '3xl': 'size-20 text-5xl',
                '4xl': 'size-24 text-6xl',
                '5xl': 'size-28 text-7xl'
            }
        },
        defaultVariants: {
            size: 'md'
        }
    }
);

export const AvatarByName = ({ name, className, children, size, isOnline, ...rest }: AvatarByNameProps) => {
    const nameParts = name.split(' ');
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : '';
    const lastNameInitial = nameParts[1] ? nameParts[1][0] : '';

    return (
        <span {...rest} className={cn('relative', avatarVariants({ size, className }))}>
            {children || (
                <>
                    {firstNameInitial.toUpperCase()}
                    {lastNameInitial.toUpperCase()}
                </>
            )}
            {isOnline && <ProfileIndicator />}
        </span>
    );
};