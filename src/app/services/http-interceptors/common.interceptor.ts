import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';

import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { StorageService } from '../storage.service';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {
  constructor(private storgeService: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cookie = this.storgeService.getStorage('cookie');
    if (cookie) {
      return next
        .handle(
          req.clone({
            withCredentials: true,
            setParams: {
              cookie
            }
          })
        )
        .pipe(catchError(this.handleError));
    } else {
      return next
        .handle(
          req.clone({
            withCredentials: true
          })
        )
        .pipe(catchError(this.handleError));
    }
  }

  private handleError(error: HttpErrorResponse): never {
    throw error.error;
  }
}
