import { z } from 'zod';

import { emailForSchema, loginForSchema, nameForSchema, passwordForSchema, passwordRules } from '@/shared/constants';

export const firstStepSignUpSchema = z
    .object({
        email: emailForSchema,
        password: passwordForSchema,
        confirmPassword: z.string().trim().min(1, 'Confirm password is required')
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        for (const { rule, message } of passwordRules) {
            !rule(password) && ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['password'],
                message
            });
        }

        confirmPassword !== password && ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmPassword'],
            message: 'Passwords do not match'
        });
    });

export const secondStepSignUpSchema = z.object({
    name: nameForSchema,
    login: loginForSchema,
    birthDate: z.coerce
        .date({ required_error: 'Birth date is required' })
        .min(new Date('1900-01-01'), 'Invalid birth date')
        .transform((date, ctx) => {
            const today = new Date();
            const fourteenYearsAgo = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
            
            if (date.getTime() > fourteenYearsAgo.getTime()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'You must be at least 14 years old'
                });
            }

            return date.toISOString();
        }) as unknown as z.ZodEffects<z.ZodDate, string, string>
});

export const thirdStepSignUpSchema = z.object({ otp: z.string().min(6, ' ') });

export const signupSchema = firstStepSignUpSchema.and(secondStepSignUpSchema).and(thirdStepSignUpSchema);