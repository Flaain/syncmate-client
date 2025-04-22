import { createStore } from "zustand";

import { createZustandContext } from "../../utils/createZustandContext";

import { SigninFormStage, SigninStore } from "./types";

export const { Provider: SigninProvider, useContext: useSigninForm } = createZustandContext<SigninStore>(() => createStore((set) => ({
    stage: 'signin',
    changeSigninStage: (stage: SigninFormStage) => set({ stage })
})));