import { z } from "zod";
import { signupSchema } from "./schema";
import { UseFormReturn } from "react-hook-form";

export type SignupSchemaType = z.infer<typeof signupSchema>;

export interface ISignupContext {
    step: number;
    loading: boolean;
    isLastStep: boolean;
    form: UseFormReturn<SignupSchemaType>;
    isNextButtonDisabled: boolean;
    onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}