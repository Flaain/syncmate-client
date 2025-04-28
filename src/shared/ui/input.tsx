import React from 'react';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils/cn';

import { Label } from './label';
import { Typography } from './Typography';

// Обновляем интерфейс, добавляя новый вариант
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
    label?: string;
}

const inputVariants = cva(
    'box-border transition-all duration-200 ease-in-out flex w-full outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out',
    {
        variants: {
            variant: {
                destructive: 'caret-primary-destructive',
                primary: 'bg-transparent caret-primary-purple dark:focus-visible:ring-primary-purple dark:hover:ring-primary-purple dark:text-primary-white font-normal peer border border-solid border-primary-gray/20 dark:focus-visible:border-primary-purple dark:hover:border-primary-purple',
                dark: 'dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 text-white dark:placeholder:text-white placeholder:opacity-50 dark:focus-visible:ring-primary-dark-50 dark:hover:ring-primary-dark-50 placeholder:opacity-50 border-none'
            },
            _size: {
                base: 'h-[54px] rounded-[10px] p-[15px] text-base',
                sm: 'h-10 px-3 py-4 rounded-md text-sm'
            },
            outline: {
                none: 'ring-0 hover:ring-0',
                primary: 'hover:ring-1 focus-visible:ring-2',
                secondary: 'hover:ring-1 focus-visible:ring-1'
            }
        },
        defaultVariants: {
            variant: 'primary',
            _size: 'base',
            outline: 'none'
        }
    }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, _size, outline, label, type, ...props }, ref) => {
    return label ? (
        <Label className='relative'>
            <input
                {...props}
                type={type}
                placeholder=''
                className={cn(inputVariants({ variant, _size, outline }), className)}
                ref={ref}
            />
            <Typography className='absolute select-none pointer-events-none text-base font-normal whitespace-nowrap duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-left start-[10px] px-[5px] bg-white dark:bg-primary-dark-150 dark:text-primary-gray peer-focus:dark:text-primary-purple peer-hover:dark:text-primary-purple peer-focus:-translate-y-4 peer-focus:font-normal peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-placeholder-shown:font-normal rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto'>
                {label}
            </Typography>
        </Label>
    ) : (
        // Передаем новый вариант и сюда
        <input
            {...props}
            type={type}
            className={cn(inputVariants({ variant, _size, outline }), className)}
            ref={ref}
        />
    );
});

Input.displayName = 'Input';

export { Input };
