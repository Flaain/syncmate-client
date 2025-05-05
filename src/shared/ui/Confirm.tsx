import React from 'react';

import { Loader2 } from 'lucide-react';

import { Button, ButtonProps } from '@/shared/ui/button';

import { Typography } from './Typography';

/**
 * Props for the Confirm component, which displays a confirmation dialog.
 */
interface ConfirmProps {
    /**
     * Callback function triggered when the confirm action is performed.
     * Can return either void or a Promise for asynchronous operations.
     */
    onConfirm: () => void | Promise<void>;

    /**
     * Callback function triggered when the cancel action is performed.
     */
    onCancel: () => void;

    /**
     * The text message displayed in the confirmation dialog.
     */
    text: React.ReactNode;

    /**
     * Optional text for the confirm button.
     * @default 'Confirm'
     */
    onConfirmText?: string;

    /**
     * Optional text for the cancel button.
     * @default 'Cancel'
     */
    onCancelText?: string;

    /**
     * Optional variant for the confirm button styling.
     * Should match the `variant` property of the Button component.
     * @see{@link ButtonProps.variant}
     * @default 'default'
     */
    onConfirmButtonVariant?: ButtonProps['variant'];
}

export const Confirm = ({ text, onConfirm, onCancel, onCancelText = 'Cancel', onConfirmText = 'Confirm', onConfirmButtonVariant = 'default' }: ConfirmProps) => {
    const [loading, setLoading] = React.useState(false);

    const onClickConfirm = async () => {
        try {
            setLoading(true);

            await onConfirm();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-5 items-start max-w-[320px] w-full py-3 px-6 box-border'>
            {React.isValidElement(text) ? text : <Typography as='p'>{text}</Typography>}
            <div className='flex justify-center gap-5 mt-2 self-end'>
                <Button onClick={onCancel} variant='secondary' disabled={loading}>
                    {onCancelText}
                </Button>
                <Button
                    onClick={onClickConfirm}
                    disabled={loading}
                    className='min-w-[100px]'
                    variant={onConfirmButtonVariant}
                >
                    {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : onConfirmText}
                </Button>
            </div>
        </div>
    );
};
