import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { signupSchema } from "./schema";

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