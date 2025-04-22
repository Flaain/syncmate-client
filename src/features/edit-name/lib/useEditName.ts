import React from 'react';

import { useShallow } from 'zustand/shallow';

import { profileApi, selectProfileName, useProfile } from '@/entities/profile';

import { MAX_NAME_LENGTH, NAME_TO_LONG_ERROR } from '@/shared/constants';
import { selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';

export const useEditName = () => {
    const [error, setError] = React.useState<string | null>(null);
    
    const profileName = useProfile(selectProfileName);
    const ref = React.useRef<HTMLInputElement>(null);

    const { onCloseModal, onAsyncActionModal } = useModal(useShallow(selectModalActions));

    const handleError = (error: string) => {
        setError(error);
        ref.current?.focus();
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const form = new FormData(event.currentTarget);
        const name = form.get('name')?.toString().trim();

        if (name === profileName) return onCloseModal();
        if (!name || !name.length) return handleError('Name is required');
        if (name.length > MAX_NAME_LENGTH) return handleError(NAME_TO_LONG_ERROR);

        onAsyncActionModal(() => profileApi.name({ name }), {
            onResolve: () => useProfile.setState((prevState) => ({ profile: { ...prevState.profile, name } })),
            onReject: () => toast.error('Failed to change name'),
            closeOnError: true
        });
    };

    return { error, ref, setError, onSubmit };
};