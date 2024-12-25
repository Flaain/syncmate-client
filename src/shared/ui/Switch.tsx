import { HTMLAttributes } from 'react';
import { cn } from '../lib/utils/cn';

export const Switch = ({
    onChange,
    checked,
    className,
    checkboxClassName,
    children,
    ...rest
}: HTMLAttributes<HTMLInputElement> & {
    checked?: boolean;
    checkboxClassName?: string;
    children?: React.ReactNode;
}) => {
    return (
        <label className={cn('inline-flex items-center cursor-pointer', className)}>
            {children}
            <input {...rest} onChange={onChange} type='checkbox' className='sr-only peer' />
            <div
                className={cn(
                    'relative w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-0.5 after:start-[4px] after:bg-primary-dark-50 after:border-primary-dark-50 after:border after:border-solid after:rounded-full after:size-4 after:transition-all peer-checked:bg-primary-white',
                    checkboxClassName
                )}
            ></div>
        </label>
    );
};