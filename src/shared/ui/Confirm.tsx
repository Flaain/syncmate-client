import { Button, ButtonProps } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { Typography } from './Typography';

interface ConfirmProps {
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    text: string;
    onConfirmText?: string;
    onCancelText?: string;
    onConfirmButtonVariant?: ButtonProps['variant'];
}

export const Confirm = ({ text, onConfirm, onCancel, onCancelText = 'Cancel', onConfirmText = 'Confirm', onConfirmButtonVariant = 'default' }: ConfirmProps) => {
    const [loading, setLoading] = React.useState(false);

    const onClickConfirm = React.useCallback(async () => {
        try {
            setLoading(true);

            await onConfirm();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className='flex flex-col gap-5 items-start max-w-[350px]'>
            <Typography as='p' variant='primary'>
                {text}
            </Typography>
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
