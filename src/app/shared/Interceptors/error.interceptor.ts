import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

export interface ErrorResponse {
  message: string;
  code: number;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private alertService = inject(AlertService);
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error inesperado';
        console.log(error)
        if (error.error.data.message && typeof error.error === 'object') {
          const errorData = error.error.data as ErrorResponse;
          errorMessage = errorData.message || errorMessage;
        }

        this.alertService.showError(errorMessage);

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
