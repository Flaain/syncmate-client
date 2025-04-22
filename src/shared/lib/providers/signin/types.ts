export type SigninFormStage = 'signin' | 'forgot';

export interface SigninStore {
    stage: SigninFormStage;
    changeSigninStage: (stage: SigninFormStage) => void;
}