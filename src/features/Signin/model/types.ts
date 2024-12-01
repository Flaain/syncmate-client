import { z } from 'zod';
import { signinSchema } from './schema';

export type SigninStage = 'signin' | 'forgot';
export type SigninSchemaType = z.infer<typeof signinSchema>;