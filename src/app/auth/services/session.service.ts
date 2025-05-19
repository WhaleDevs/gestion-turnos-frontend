import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@envs/environment.development';
import { AuthResponse, UserSessionState } from '../models/session';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly url = `${environment.API_URL}/auth/me`;
  private _userSessionState = new BehaviorSubject<UserSessionState | null>(null);
  private http = inject(HttpClient);
  private isSessionRestored = false; 

  get getSession$(): Observable<UserSessionState | null> {
    return this._userSessionState.asObservable();
  }

  async restoreSessionIfNeeded(): Promise<void> {
    console.log('Restaurando sesión si es necesario...');
    console.log('isSessionRestored:', this.isSessionRestored);
    if (this.isSessionRestored) {
      console.log('La sesión ya fue restaurada');
      return;
    }
    console.log('Restaurando sesión...');
    try {
      const userData = await firstValueFrom(this.http.get<UserSessionState>(this.url));
      this._userSessionState.next(userData);
      this.isSessionRestored = true; 
      console.log('Sesión restaurada:', userData);
    } catch (err) {
      console.error('Error en restoreSession', err);
      this._userSessionState.next(null);
    }
  }

  updateSession(value: AuthResponse): void {
    this._userSessionState.next({
      role: value?.user?.role || '',
      firstName: value?.user?.firstName || '',
      lastName: value?.user?.lastName || '',
      email: value?.user?.email || ''
    });
  }

  clearSession(): void {
    this._userSessionState.next(null);
    this.isSessionRestored = false;
  }
}
