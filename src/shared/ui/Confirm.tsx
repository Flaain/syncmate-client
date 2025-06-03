import React from 'react';

import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { Button, ButtonProps } from '@/shared/ui/button';

import { AvatarByName } from './AvatarByName';
import { Image } from './Image';
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
     * The description displayed in the confirmation dialog.
     */
    description: React.ReactNode;

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
    onConfirmButtonIntent?: ButtonProps['intent'];

    title?: string;
    withAvatar?: boolean;
    avatarUrl?: string;
    name?: string;
}

export const Confirm = ({
    withAvatar,
    title,
    description,
    onConfirm,
    avatarUrl,
    name,
    onCancel,
    onCancelText = 'Cancel',
    onConfirmText = 'Confirm',
    onConfirmButtonIntent = 'primary'
}: ConfirmProps) => {
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
        <div className='flex flex-col gap-3 items-start max-w-[320px] w-full py-3 px-5 box-border'>
            {withAvatar && title && (
                <div className='flex items-center gap-5'>
                    <Image
                        className='size-8 rounded-full'
                        src={avatarUrl}
                        skeleton={<AvatarByName name={name ?? 'Unknown'} size='sm' />}
                    />
                    <Typography as='h2' size='xl' weight='medium'>
                        {title}
                    </Typography>
                </div>
            )}
            {!withAvatar && title && (
                <Typography as='h2' size='xl' weight='medium' className='self-start'>
                    {title}
                </Typography>
            )}
            {withAvatar && !title && (
                <Image
                    className='size-8 rounded-full self-start'
                    src={avatarUrl}
                    skeleton={<AvatarByName name={name ?? 'Unknown'} size='sm' />}
                />
            )}
            {React.isValidElement(description) ? description : <Typography as='p'>{description}</Typography>}
            <div className='flex justify-center gap-2 mt-2 self-end'>
                <Button
                    onClick={onCancel}
                    ripple
                    variant='ghost'
                    intent='secondary'
                    disabled={loading}
                    className='uppercase'
                >
                    {onCancelText}
                </Button>
                <Button
                    ripple
                    onClick={onClickConfirm}
                    disabled={loading}
                    className='min-w-[100px] uppercase font-semibold'
                    variant='ghost'
                    intent={onConfirmButtonIntent}
                >
                    {loading ? <LoaderIcon className='size-5 animate-loading' /> : onConfirmText}
                </Button>
            </div>
        </div>
    );
};