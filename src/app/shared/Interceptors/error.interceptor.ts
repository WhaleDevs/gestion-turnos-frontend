import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { environment } from '@envs/environment.development';

export interface ErrorResponse {
  message: string;
  code: number;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private alertService = inject(AlertService);
  constructor() { }
  private url = environment.API_URL;
  private excludedUrls = [this.url + '/auth/login', this.url + '/auth/register'];
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.excludedUrls.includes(req.url)) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Ocurrió un error inesperado';
          console.log(error)
          if (error.error.message && typeof error.error === 'object') {
            const errorData = error.error as ErrorResponse;
          errorMessage = errorData.message || errorMessage;
        }

        this.alertService.showError(errorMessage);

        return throwError(() => new Error(errorMessage));
      }))
    }

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
