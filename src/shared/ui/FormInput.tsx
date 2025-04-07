import React from 'react';
import { cn } from '../lib/utils/cn';
import { PasswordInput } from './PasswordInput';
import { Input } from './input';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasServerError?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(({ hasServerError, className, ...props }, ref) => {
    const c = cn(hasServerError && 'ring-1 dark:hover:ring-primary-destructive dark:ring-primary-destructive/60 dark:focus-visible:ring-primary-destructive/60', className);

    return props.type === 'password' ? (
        <PasswordInput
            {...props}
            placeholder='Enter your password'
            className={c}
            value={props.value?.toString().replace(/\s/g, '')}
        />
    ) : (
        <Input {...props} ref={ref} className={c} />
    );
});
