import { TfaType } from '@/shared/model/types';

export const getStageDescription = (tfaRequired: boolean, type: TfaType) => ({
    title: tfaRequired ? 'Almost there' : 'Sign in',
    description: tfaRequired
        ? `Inter the 6‑digit code that ${type === 0 ? 'your authenticator app generated' : 'was sent to your email'}`
        : 'Enter your email or login and password'
});