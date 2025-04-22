import { useShallow } from 'zustand/shallow';

import { selectProfileName, useProfile } from '@/entities/profile';

import { editNameModalSelector, useModal } from '@/shared/lib/providers/modal';
import { Button } from '@/shared/ui/button';
import { FormInput } from '@/shared/ui/FormInput';
import { Typography } from '@/shared/ui/Typography';

import { useEditName } from '../lib/useEditName';

export const EditName = () => {
    const { isModalDisabled, onCloseModal } = useModal(useShallow(editNameModalSelector));
    const { onSubmit, setError, error, ref } = useEditName();

    const name = useProfile(selectProfileName);

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-5'>
                <Typography as='h1' variant='primary' size='xl' weight='medium'>
                    Edit your name
                </Typography>
            </div>
            <form onSubmit={onSubmit} className='flex flex-col gap-2'>
                <FormInput
                    ref={ref}
                    onChange={() => setError(null)}
                    hasServerError={!!error}
                    defaultValue={name}
                    type='text'
                    className='dark:bg-primary-dark-200'
                    placeholder='Enter your name'
                    name='name'
                />
                {error && (
                    <p className='text-sm font-medium text-primary-destructive dark:text-primary-destructive'>
                        {error}
                    </p>
                )}
                <div className='flex items-center gap-2 justify-end mt-2'>
                    <Button type='button' variant='secondary' onClick={onCloseModal} disabled={isModalDisabled}>
                        Cancel
                    </Button>
                    <Button type='submit' size='lg' disabled={isModalDisabled}>
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
};
