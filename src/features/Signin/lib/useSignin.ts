import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../model/schema";
import { toast } from "sonner";
import { useProfile } from "@/entities/profile";
import { useSession } from "@/entities/session/model/store";
import { SigninSchemaType } from "../model/types";
import { signinApi } from "../api";
import { ApiException } from "@/shared/api/error";

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

    React.useEffect(() => {
        form.setFocus('login');
    }, [])

    const onSubmit = React.useCallback(async (data: SigninSchemaType) => {
        try {
            setLoading(true);

            const { data: profile } = await signinApi.signin(data);

            useProfile.setState({ profile });
            
            onSignin(profile._id);
        } catch (error) {
            console.error(error);
            error instanceof ApiException ? error.toastError() : toast.error('Cannot signin. Please try again later', { position: 'top-center' });
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        form,
        loading,
        onSubmit,
        isSubmitButtonDisabled: form.formState.isSubmitting || !form.formState.isValid || loading,
    };
};