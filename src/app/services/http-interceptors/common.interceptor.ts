import { catchError } from 'rxjs/operators';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';

export const commonInterceptor: HttpInterceptorFn = (req, next) => {
  return next(
    req.clone({
      withCredentials: true
    })
  ).pipe(catchError(handleError));
};

function handleError(error: HttpErrorResponse): never {
  const apiError = error.error;
  const message =
    (apiError && (apiError.msg || apiError.message)) || error.message || 'Request failed';
  const err = new Error(message) as Error & { msg?: string };
  if (apiError && apiError.msg) {
    err.msg = apiError.msg;
  }
  throw err;
}
