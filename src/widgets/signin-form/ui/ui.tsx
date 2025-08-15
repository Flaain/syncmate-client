import React from 'react';

import { Forgot } from '@/features/forgot';
import { Signin } from '@/features/signin';

import { SigninFormStage, useSigninForm } from '@/shared/lib/providers/signin';

const components: Record<SigninFormStage, React.ReactNode> = {
    signin: <Signin />,
    forgot: <Forgot />
};

export const SigninForm = () => {
    const stage = useSigninForm((state) => state.stage);

    return components[stage];
};