import { z } from 'zod';

import { version } from "../../../package.json";

export const APP_VERSION = version;
export const DEFAULT_TITLE = 'Syncmate - Sync Your Chats, Sync Your Life.'

export const noRefreshPaths = ['/auth/refresh', '/auth/signin'];

export const routerList = {
    HOME: '/',
    AUTH: '/auth',
    CONVERSATION: '/conversation/:id',
    GROUP: '/group/:id',
};
export const localStorageKeys = {
    THEME: 'theme',
    TOKEN: 'token'
};

export const MIN_LOGIN_LENGTH = 5;
export const MIN_USER_SEARCH_LENGTH = 2;
export const MESSAGES_SKELETON_COUNT = 12;
export const NAME_MAX_LENGTH = 32;
export const BIO_MAX_LENGTH = 120;
export const MAX_POINTER_DISTANCE_DDM = 180;

export const ONLY_LATIN_REGEXP = /^[a-zA-Z0-9_]*$/;
export const ALLOW_CYRILLIC_REGEXP = /^[\p{L}0-9\s]*$/u;

export const REGEXP_NAME_ERROR = 'Name must contain only letters, numbers, and spaces';
export const NAME_TO_LONG_ERROR = `Name must be at most ${NAME_MAX_LENGTH} characters long`;

export const emailForSchema = z.string().trim().min(1, 'Email is required').email('Invalid email address').toLowerCase();
export const passwordForSchema = z
    .string()
    .trim()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long');

export const nameForSchema = z.string().trim().min(1, 'Name is required').max(NAME_MAX_LENGTH, NAME_TO_LONG_ERROR);
export const nameSchema = z.object({ name: nameForSchema });

export const loginForSchema = z
    .string({ required_error: 'Login is required' })
    .trim()
    .min(MIN_LOGIN_LENGTH, 'Login must be at least 3 characters long')
    .max(32, 'Login must be at most 32 characters long')
    .toLowerCase()
    .regex(ONLY_LATIN_REGEXP, 'Invalid login. Please use only a-z, 0-9 and underscore characters');

export const passwordRules: Array<{ rule: (password: string) => boolean; message: string }> = [
    {
        rule: (password: string) => /[A-Z]/.test(password),
        message: 'Password must contain at least one uppercase letter'
    },
    {
        rule: (password: string) => /[a-z]/.test(password),
        message: 'Password must contain at least one lowercase letter'
    },
    {
        rule: (password: string) => /[0-9]/.test(password),
        message: 'Password must contain at least one number'
    },
    {
        rule: (password: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
        message: 'Password must contain at least one special character'
    }
];