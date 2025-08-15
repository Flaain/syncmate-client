import { z } from 'zod';

import { passwordForSchema } from '@/shared/constants';

export const baseSigninSchema = z.strictObject({
    login: z
        .string()
        .trim()
        .min(3, 'Login must be at least 3 characters long')
        .max(32, 'Login must be at most 32 characters long')
        .toLowerCase(),
    password: passwordForSchema
});

export const signinSchema = baseSigninSchema.and(
    z.strictObject({
        otp: z.string().min(6, ' ')
    })
);

export type SigninSchemaType = z.infer<typeof signinSchema>;
export type SigninData = SigninSchemaType & { totp?: number };