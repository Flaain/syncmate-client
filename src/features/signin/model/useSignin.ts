import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useProfile } from "@/entities/profile";
import { useSession } from "@/entities/session";

import { ApiException } from "@/shared/api";

import { signinApi } from "../api";
import { signinSchema, SigninSchemaType } from "../model/schema";

export const useSignin = () => {
    const [loading, setLoading] = React.useState(false);
    
    const onSignin = useSession((state) => state.actions.onSignin);
    
    const form = useForm<SigninSchemaType>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            login: "",
            password: "",
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    const onChangeForm = () => {
        form.formState.errors.root?.server && form.clearErrors('root.server');
    };

    const onSubmit = async (data: SigninSchemaType) => {
        try {
            setLoading(true);

            const { data: profile } = await signinApi.signin(data);

            useProfile.setState({ profile });
            
            onSignin(profile._id);
        } catch (error) {
            console.error(error);
           
            form.setError('root.server', { message: error instanceof ApiException ? error.response.data.message : 'Cannot process signin. Please try again' });
            
            requestAnimationFrame(() => form.setFocus('login'));
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        onSubmit,
        onChangeForm,
        isSubmitButtonDisabled: form.formState.isSubmitting || !form.formState.isValid || loading || !!form.formState.errors.root?.server,
    };
};