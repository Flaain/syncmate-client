import { ApiException } from '@/shared/api/error';
import { useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { changePasswordAPI } from '../api';
import { steps } from '../model/constants';
import { changePasswordSchema } from '../model/schema';
import { ActionPasswordType, ChangePasswordSchemaType } from '../model/types';

export const useChangePassword = () => {
    const [step, setStep] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const onAsyncActionModal = useModal((state) => state.actions.onAsyncActionModal);

    const form = useForm<ChangePasswordSchemaType>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: ''
        },
        disabled: isLoading,
        mode: 'onSubmit'
    });

    React.useEffect(() => {
        setTimeout(form.setFocus, 0, steps[step].fields[0]);
    }, [step])

    const checkErrors = React.useCallback((error: unknown) => {
        if (error instanceof ApiException) {
            error.response.data.errors?.forEach(({ path, message }) => {
                steps[step].fields.includes(path as FieldPath<ChangePasswordSchemaType>) && form.setError(path as FieldPath<ChangePasswordSchemaType>, { message }, { shouldFocus: true });  
            })
        }
        setTimeout(form.setFocus, 0, steps[step].fields[0]);
    }, [step])

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault()

            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

            if (!isValid) return;

            const { currentPassword, newPassword } = form.getValues();

            setIsLoading(true);

            const actions = {
                0: () => onAsyncActionModal(() => changePasswordAPI.changePassword({ type: ActionPasswordType.CHECK, currentPassword }), {
                        onReject: checkErrors,
                        onResolve: () => setStep((prevState) => prevState + 1),
                        closeOnSuccess: false
                    }),
                1: () => onAsyncActionModal(() => changePasswordAPI.changePassword({ type: ActionPasswordType.SET, currentPassword, newPassword }), {
                        onReject: checkErrors,
                        onResolve: () => toast.success('Password changed successfully')
                    }),
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { form, step, setStep, onSubmit };
};