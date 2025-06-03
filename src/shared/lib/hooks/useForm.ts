// import React from 'react';

// export interface UseFormParams<T> {
//     defaultValues: T;
// }

// export interface UseFormRegisterRule {
//     value: string;
//     message: string;
// }

// export interface UseFormRegisterParams {
//     required?: string;
//     validate?: (value: string) => Promise<string | true>;
//     max?: UseFormRegisterRule;
//     maxLength?: UseFormRegisterRule;
//     min?: UseFormRegisterRule;
//     minLength?: UseFormRegisterRule;
//     pattern?: UseFormRegisterRule;
// }

// export interface UseSimpleFormRegisterReturn {}

// export const useSimpleForm = <T>({ defaultValues }: UseFormParams<T>) => {
//     const [form, setForm] = React.useState<T>({

//     });

//     const register = (regParams?: UseFormRegisterParams): UseSimpleFormRegisterReturn => ({
//         ref: (node?: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => {}
//     });
// };