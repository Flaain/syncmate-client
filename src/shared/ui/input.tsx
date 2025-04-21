import React from 'react';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const inputVariants = cva(
    'box-border transition-all duration-200 ease-in-out flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
    {
        variants: {
            variant: {
                form: 'hover:ring-1 dark:focus-visible:ring-primary-dark-50 dark:hover:ring-primary-dark-50 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 placeholder:ease-in-out dark:ring-offset-0 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
            }
        },
        defaultVariants: {
            variant: 'form'
        }
    }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, type, ...props }, ref) => {
    return (
        <input
            {...props}
            type={type}
            className={cn(inputVariants({ variant }), className)}
            ref={ref}
        />
    );
});

Input.displayName = 'Input';

export { Input };

