import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@envs/environment.development';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { LoginRequest } from '../models/login.request';
import { RegisterRequest } from '../models/register.request';
import { SessionService } from './session.service';
import { AuthResponse } from '../models/session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.API_URL}/auth`;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
  ) { }

  login(loginCredentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, loginCredentials)
      .pipe(
        tap((data: AuthResponse) => this.sessionService.updateSession(data)),
        catchError((error) => {
          this.sessionService.clearSession();
          return throwError(() => error); 
        })
      );
  }
  
  register(registerCredentials: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/register`, registerCredentials);
  }

  logout(): void {
    this.http.post(`${this.url}/logout`,{}).subscribe({
      next: () => this.sessionService.clearSession(),
      error: (err) => console.error('Error en logout', err),
    });
  }
}
