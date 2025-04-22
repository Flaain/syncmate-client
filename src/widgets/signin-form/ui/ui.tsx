import React from 'react';

import { Forgot } from '@/features/forgot';
import { Signin } from '@/features/signin';

import { SigninFormStage, useSigninForm } from '@/shared/lib/providers/signin';
import { AuthFormContainer } from '@/shared/ui/AuthFormContainer';

const components: Record<SigninFormStage, React.ReactNode> = {
    signin: <Signin />,
    forgot: <Forgot />
};

const stageInfo: Record<SigninFormStage, { title: string; description: string }> = {
    signin: {
        title: 'Sign in',
        description: 'Enter your email or login and password'
    },
    forgot: {
        title: 'Forgot password',
        description: "Let's get your password reset!"
    }
};

export const SigninForm = () => {
    const stage = useSigninForm((state) => state.stage);

    return (
        <AuthFormContainer title={stageInfo[stage].title} description={stageInfo[stage].description}>
            {components[stage]}
        </AuthFormContainer>
    );
};