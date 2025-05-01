import { z } from 'zod';

import { passwordForSchema } from '@/shared/constants';

export const signinSchema = z.strictObject({
    login: z.string().trim().min(3, 'Login must be at least 3 characters long').max(32, 'Login must be at most 32 characters long').toLowerCase(),
    password: passwordForSchema
});

export type SigninSchemaType = z.infer<typeof signinSchema>;