import { ApiResponseFailureResult, RequestConfig } from './API';

export enum ApiExceptionCode {
    INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
    FORM = 'FORM'
}

export interface IApiException {
    message: string;
    config: RequestConfig;
    response: ApiResponseFailureResult;
}

export class ApiException extends Error implements IApiException {
    readonly config: RequestConfig;
    readonly response: ApiResponseFailureResult;

    constructor(error: IApiException) {
        super(error.message);

        this.config = error.config;
        this.response = error.response;
    }
}