import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(
        req.clone({
          withCredentials: true
        })
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): never {
    const apiError = error.error;
    const message =
      (apiError && (apiError.msg || apiError.message)) || error.message || 'Request failed';
    const err = new Error(message) as Error & { msg?: string };
    if (apiError && apiError.msg) {
      err.msg = apiError.msg;
    }
    throw err;
  }
}
