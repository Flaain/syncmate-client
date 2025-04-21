import { Forgot } from '@/features/Forgot';
import { Signin, SigninStage } from '@/features/Signin';

import { AuthFormContainer } from '@/shared/ui/AuthFormContainer';

import { stageDescription } from '../model/constants';
import { useSigninForm } from '../model/store';

const components: Record<SigninStage, React.ReactNode> = {
    signin: <Signin />,
    forgot: <Forgot />
};

export const SigninForm = () => {
    const stage = useSigninForm((state) => state.stage);

    return (
        <AuthFormContainer title={stageDescription[stage].title} description={stageDescription[stage].description}>
            {components[stage]}
        </AuthFormContainer>
    );
};