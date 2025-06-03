import React from 'react';

import EyeIcon from '@/shared/lib/assets/icons/eye.svg?react';
import EyeCrossIcon from '@/shared/lib/assets/icons/eyecross.svg?react';

import { cn } from '../lib/utils/cn';

import { Button } from './button';
import { Input, InputProps } from './input';

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!, []);

    const onShowPasswordClick = () => {
        setShowPassword((prev) => !prev);
        requestAnimationFrame(() => {
            const l = inputRef.current?.value.length;

            l && inputRef.current?.setSelectionRange(l, l); // need to avoid bug when cursor caret auto placed on start after click on show/hide password btn
            inputRef.current?.focus();
        });
    }

    return (
        <Input
            {...props}
            type={showPassword ? 'text' : 'password'}
            className={cn('hide-password-toggle', className)}
            ref={inputRef}
        >
            <Button
                type='button'
                size='icon'
                className='absolute right-0 rounded-tl-none rounded-bl-none rounded-tr-lg rounded-br-lg dark:ring-primary-dark-50 h-full'
                onClick={onShowPasswordClick}
                disabled={!props.value || !props.value.toString().trim().length || props.disabled}
            >
                {showPassword ? (
                    <EyeIcon className='size-4 dark:text-primary-white' />
                ) : (
                    <EyeCrossIcon className='size-4 dark:text-primary-white' aria-hidden='true' />
                )}
                <span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
        </Input>
    );
});
