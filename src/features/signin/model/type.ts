export type SigninWithTFA =
    | {
          tfaRequired: boolean;
          type: 0;
      }
    | {
          tfaRequired: boolean;
          type: 1;
          retryDelay: number;
      };