import React from 'react';

import EyeIcon from '@/shared/lib/assets/icons/eye.svg?react';
import EyeCrossIcon from '@/shared/lib/assets/icons/eyecross.svg?react';

import { cn } from '../lib/utils/cn';

import { Button } from './button';
import { Input, InputProps } from './input';

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <Input
            {...props}
            type={showPassword ? 'text' : 'password'}
            className={cn('hide-password-toggle', className)}
            ref={ref}
        >
            <Button
                type='button'
                variant='text'
                size='icon'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={!props.value || !props.value.toString().trim().length || props.disabled}
            >
                {showPassword ? <EyeIcon className='size-4' /> : <EyeCrossIcon className='size-4' aria-hidden='true' />}
                <span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
        </Input>
    );
});
