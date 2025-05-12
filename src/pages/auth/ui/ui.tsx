import React from 'react';

import { SigninForm } from '@/widgets/signin-form';
import { SignupForm } from '@/widgets/signup-form';

import { AuthStage, useAuth } from '@/shared/lib/providers/auth';
import { SigninProvider } from '@/shared/lib/providers/signin';

import { Welcome } from './Welcome';

const stages: Record<AuthStage, React.ReactNode> = {
    welcome: <Welcome />,
    signIn: (
        <SigninProvider>
            <SigninForm />
        </SigninProvider>
    ),
    signUp: <SignupForm />
};

export const Auth = () => {
    const stage = useAuth((state) => state.authStage);

    return (
        <section className='w-full h-svh flex items-center px-5 justify-center bg-primary-dark-200'>
            {stages[stage]}
        </section>
    );
};