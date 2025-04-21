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

export const MIN_USER_SEARCH_LENGTH = 2;
export const MESSAGES_SKELETON_COUNT = 12;
export const MAX_NAME_LENGTH = 32;
export const MAX_POINTER_DISTANCE_DDM = 200;

export const onlyLatinRegExp = /^[a-zA-Z0-9_]*$/;
export const allowCyrillicRegExp = /^[\p{L}0-9\s]*$/u;
export const regExpError = 'Name must contain only letters, numbers, and spaces';
export const nameToLongError = `Name must be at most ${MAX_NAME_LENGTH} characters long`;

export const emailForSchema = z.string().trim().min(1, 'Email is required').email('Invalid email address').toLowerCase();
export const passwordForSchema = z
    .string()
    .trim()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long');

export const nameForSchema = z.string().trim().min(1, 'Name is required').max(MAX_NAME_LENGTH, nameToLongError);
export const nameSchema = z.object({ name: nameForSchema });

export const loginForSchema = z
    .string()
    .trim()
    .min(4, 'Login must be at least 5 characters long')
    .max(32, 'Login must be at most 32 characters long')
    .toLowerCase()
    .regex(onlyLatinRegExp, 'Invalid login. Please use only a-z, 0-9 and underscore characters');

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