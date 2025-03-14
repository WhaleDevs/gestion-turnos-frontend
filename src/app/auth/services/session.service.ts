import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@envs/environment.development';
import { AuthResponse, UserSessionState } from '../models/session';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly url = `${environment.API_URL}/auth/me`;
  private _userSessionState = new BehaviorSubject<UserSessionState | null>(null);
  private http = inject(HttpClient);
  private router = inject(Router);
  get getSession$(): Observable<UserSessionState | null> {
    return this._userSessionState.asObservable() as Observable<UserSessionState | null>;
  }

  set setSession(value: AuthResponse) {
    this._userSessionState.next(value?.user);
  }

  constructor() {
    this.restoreSession();
  }

  restoreSession(): void {
    this.getAdminInfo();
  }

  getAdminInfo(): void {
      this.http.get<UserSessionState>(this.url).subscribe({
        next: (data: UserSessionState) => {
          this._userSessionState.next(data);
          if(this._userSessionState.value === null){
            console.log('No hay usuario logueado');
          }else{
            this.router.navigate(['dashboard']);
          }
        },
        error: (err) => {
          console.error('Error en restoreSession', err);
          this._userSessionState.next(null);
        },
      });
  }

  clearSession(): void {
    this._userSessionState.next(null);
  }
  
}
