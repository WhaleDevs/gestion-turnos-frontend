import { Component, inject } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login.request';
import { AuthResponse, UserSessionState } from '../../models/session';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() { 
    console.log('LoginComponent constructor');
  }

  onLogin(formData: LoginRequest) {
    this.authService.login(formData).subscribe({
      next: (response: AuthResponse) => {
        console.log('Login correcto:', response);
        this.router.navigate(['dashboard']);
      },
      error: (error) => {
        if (error.status === 401) {
          console.log('Credenciales incorrectas:', error.error.message);
        } else {
          console.log('Error inesperado:', error);
        }
      }
    });
  }

}
