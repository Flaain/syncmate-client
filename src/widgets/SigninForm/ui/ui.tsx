import { Signin } from '@/features/Signin/ui/ui';
import { Forgot } from '@/features/Forgot/ui/ui';
import { SigninStage } from '@/features/Signin/model/types';
import { stageDescription } from '../model/constants';
import { useSigninForm } from '../model/store';
import { AuthFormContainer } from '@/shared/ui/AuthFormContainer';

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