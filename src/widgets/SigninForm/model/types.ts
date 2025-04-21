import { SigninStage } from "@/features/Signin";

export interface SigninStore {
    stage: SigninStage;
    changeSigninStage: (stage: SigninStage) => void;
}