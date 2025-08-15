import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";

import { useProfile } from "@/entities/profile";
import { useSession } from "@/entities/session";

import { otpApi } from "@/shared/api";
import { ApiException } from "@/shared/api/error";
import { useAuth } from "@/shared/lib/providers/auth";
import { useOtp } from "@/shared/model/store";

import { signupApi } from "../api";
import { steps } from "../model/constants";
import { signupSchema } from "../model/schema";
import { SignupSchemaType } from "../model/types";

export const useSignup = () => {
    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    
    const isLastStep = step === steps.length - 1;
    
    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            login: '',
            birthDate: '',
            otp: ''
        },
        disabled: loading,
        mode: 'all',
        shouldFocusError: true
    })

    const password = form.watch('password');
    const confirmPassword = form.watch('confirmPassword');

    React.useEffect(() => {
        if (!confirmPassword.trim().length) return;

        const timeout = setTimeout(() => {
            form.trigger('confirmPassword');
        }, 100 /* not sure if needed, just a little debounce */);

        return () => clearTimeout(timeout);
    }, [password, confirmPassword]);

    React.useEffect(() => {
        requestAnimationFrame(() => {
            form.setFocus(steps[step].fields[0]);
        })
    }, [step]);
    
    const isNextButtonDisabled = loading || !form.getValues(steps[step].fields).every(Boolean) || !!Object.keys(form.formState.errors).some((key) => key === 'root' ? Object.keys(form.formState.errors.root!).some((root_key) => steps[step].fields.includes(root_key as FieldPath<SignupSchemaType>)) : steps[step].fields.includes(key as FieldPath<SignupSchemaType>));

    const onFormChange = (event: React.ChangeEvent<HTMLFormElement>) => {
        if (event.target instanceof HTMLElement && form.formState.errors.root?.[event.target.name]) {
            const fieldName = event.target.name;
            
            steps[step].fields.includes(fieldName as FieldPath<SignupSchemaType>) && form.clearErrors(`root.${fieldName}`)
        }
    }

    const changeAuthStage = useAuth((state) => state.changeAuthStage);

    const setGlobalError = () => form.setError('root.server', { message: 'Cannot process signup. Please try again' }, { shouldFocus: true });

    const checkEmail = async ({ email }: SignupSchemaType) => {
        await signupApi.check({ type: 'email', email: email.toLowerCase().trim() });

        setStep((prevState) => prevState + 1);
    };

    const checkLogin = async ({ login, email }: SignupSchemaType) => {
        const trimmedEmail = email.toLowerCase().trim();

        await signupApi.check({ type: 'login', login: login.toLowerCase().trim() });
                    
        const { data: { retryDelay } } = await otpApi.create({ email: trimmedEmail, type: 'email_verification' });
        
        useOtp.setState({ target: trimmedEmail, type: 'email_verification', retryDelay });
        
        setStep((prevState) => prevState + 1);
    };
    
    const onOtpResend = async () => {
        try {
            form.clearErrors('root.otp');
            form.setValue('otp', '');
            
            setLoading(true);

            const { data: { retryDelay } } = await otpApi.create({ email: form.getValues().email.trim(), type: 'email_verification' });

            useOtp.setState({ retryDelay });
        } catch (error) {
            console.error(error);
            form.setError('root.otp', { message: 'Cannot resend otp code. Please try again' }, { shouldFocus: true });
        } finally {
            setLoading(false);
        }
    };

    const signUp = async ({ confirmPassword, ...rest }: SignupSchemaType) => {
        const { data } = await signupApi.signup(rest);

        useProfile.setState({ profile: data });
        useSession.getState().actions.onSignin(data._id);
    };

    const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();
            
            setLoading(true);

            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

            if (!isValid) return;

            const data = form.getValues();

            const formActions: Record<number, (data: SignupSchemaType) => Promise<void>> = { 0: checkEmail, 1: checkLogin, 2: signUp };

            await formActions[step](data);
        } catch (error) {
            console.error(error);
            if (error instanceof ApiException && error.response.data.errors) {
                const fields = steps[step].fields;
                
                let atleastOneErrorWasSet = false;

                error.response.data.errors.forEach(({ path, message }, i) => {
                    if (fields.includes(path as FieldPath<SignupSchemaType>)) {
                        form.setError(`root.${path}`, { message });

                        atleastOneErrorWasSet = true;

                        !i && requestAnimationFrame(() => form.setFocus(path as FieldPath<SignupSchemaType>));
                    }
                });

                !atleastOneErrorWasSet && setGlobalError();
            } else {
                setGlobalError();
            }
        } finally {
            setLoading(false);
        }
    };

    const onBack = () => {
        if (!step) return changeAuthStage('welcome');

        isLastStep && form.resetField('otp');

        form.reset(undefined, { keepValues: true });
        
        setStep((prevState) => prevState - 1);
    }

    return {
        loading,
        isLastStep,
        step,
        form,
        isNextButtonDisabled,
        onSubmit,
        onFormChange,
        onOtpResend,
        onBack
    }
}