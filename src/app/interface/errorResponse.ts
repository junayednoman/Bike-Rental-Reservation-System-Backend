import { TErrorSources } from './error';

export type TSimplifiedErrorResponse = {
  errorSources: TErrorSources;
  message: string;
  statusCode?: number;
};
