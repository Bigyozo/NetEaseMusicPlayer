import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';

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
    throw error.error;
  }
}
