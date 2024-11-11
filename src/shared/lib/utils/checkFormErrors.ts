import { ApiException } from '@/shared/api/error';
import { FieldPath, FieldValues } from 'react-hook-form';

export interface CheckFormErrorsParams<T extends FieldValues> {
    error: unknown;
    fields: Array<FieldPath<T>>;
    onIncludes?: (error: { path: string; message: string }) => void;
}

export const checkFormErrors = <T extends FieldValues>({ error, fields, onIncludes }: CheckFormErrorsParams<T>) => {
    if (error instanceof ApiException) {
        error.response.data.errors?.forEach(({ path, message }) => {
            fields.includes(path as FieldPath<T>) && onIncludes?.({ path, message });
        });

        !error.response.data.errors && error.toastError();
    }
};