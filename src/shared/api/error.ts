import { ExternalToast, toast } from 'sonner';
import { ApiResponseFailureResult, RequestConfig } from './API';

export enum AppExceptionCode {
    INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
    FORM = 'FORM'
}

export interface IAppException {
    message: string;
    config?: RequestConfig;
    response?: ApiResponseFailureResult;
}

export class AppException extends Error implements IAppException {
    readonly config?: RequestConfig;
    readonly response?: ApiResponseFailureResult;

    constructor(error: IAppException) {
        super(error.message);
    }

    toastError(message?: string, options: ExternalToast = { position: 'top-center' }) {
        toast.error(message || this.message || 'Something went wrong', options);
    }
}