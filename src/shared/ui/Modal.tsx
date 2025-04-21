import React from 'react';

import { XIcon } from 'lucide-react';

import { ModalBodyProps, ModalProps } from '../lib/providers/modal/types';
import { cn } from '../lib/utils/cn';

import { Typography } from './Typography';

const ModalHeader = ({ title, withCloseButton, closeHandler, disabled }: Omit<ModalProps, 'children' | 'onRemove' | 'bodyClassName' | 'size' | 'withHeader'>) => {
    if (!title && !withCloseButton) {
        throw new Error('Please use at least one of title or withCloseButton props or provide falsy withHeader prop');
    }

    if (title && !withCloseButton) {
        return (
            <Typography variant='primary' size='3xl' weight='bold'>
                {title}
            </Typography>
        );
    }

    return (
        <>
            {title ? (
                <div className='flex items-center justify-between w-full'>
                    <Typography variant='primary' size='3xl' weight='bold'>
                        {title}
                    </Typography>
                    <button onClick={closeHandler} disabled={disabled}>
                        <XIcon className='dark:text-white' />
                    </button>
                </div>
            ) : (
                <button onClick={closeHandler} className='self-end' disabled={disabled}>
                    <XIcon className='dark:text-white' />
                </button>
            )}
        </>
    );
};

const ModalContainer = ({ children, onRemove, closeHandler, disabled, _shouldRemove }: Omit<ModalProps, 'title' | 'withHeader' | 'withCloseButton' | 'bodyClassName' | 'size'>) => {
    const handleOverlayClick = ({ target, currentTarget }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        !disabled && target === currentTarget && closeHandler();
    };

    return (
        <div onAnimationEnd={() => _shouldRemove && onRemove()} className={cn('fixed inset-0 z-[9999] duration-200 ease-in-out', _shouldRemove ? 'animate-out fade-out' : 'animate-in fade-in')}>
            <div className={cn('w-full h-full flex items-center justify-center p-5 bg-modal', disabled && 'pointer-events-none')} onClick={handleOverlayClick}>
                {children}
            </div>
        </div>
    );
};

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(({ children, _shouldRemove, className, disabled, ...rest }, ref) => {
    return (
        <div
            ref={ref}
            tabIndex={-1}
            className={cn(
                'duration-200 ease-in-out outline-none flex flex-col gap-5 overflow-auto dark:bg-primary-dark-100 dark:border-primary-dark-200 bg-white rounded-lg box-border border border-solid border-primary-gray',
                className,
                disabled && 'pointer-events-none',
                _shouldRemove ? 'slide-out-to-bottom-5 fade-out animate-out' : 'slide-in-from-bottom-5 fade-in animate-in'
            )}
            {...rest}
        >
            {children}
        </div>
    );
});

/**
 * @name Modal
 *
 * @param {boolean} [_shouldRemove] Please do not provide this prop by ur self. It's intended for **internal** use only
 */
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({ onRemove, closeHandler, children, withHeader = true, disabled, withCloseButton = true, _shouldRemove, ...config }, ref) => {
    return (
        <ModalContainer onRemove={onRemove} closeHandler={closeHandler} disabled={disabled} _shouldRemove={_shouldRemove}>
            <ModalBody ref={ref} className={config.bodyClassName} disabled={disabled} _shouldRemove={_shouldRemove}>
                {withHeader && (
                    <ModalHeader
                        title={config.title}
                        withCloseButton={withCloseButton}
                        closeHandler={closeHandler}
                    />
                )}
                {children}
            </ModalBody>
        </ModalContainer>
    );
});