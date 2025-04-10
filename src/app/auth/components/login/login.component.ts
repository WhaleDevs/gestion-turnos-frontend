import { Component, inject } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login.request';
import { AuthResponse, UserSessionState } from '../../models/session';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { AlertService } from '@app/shared/services/alert.service';
import { ApiResponse } from '@app/shared/models/api-response';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent],
  template: `
    <app-auth-form
      title="Iniciar Sesión"
      buttonText="I N G R E S A R"
      (formSubmit)="onLogin($event)"
    >
    </app-auth-form>
  `,
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  constructor() {
    console.log('LoginComponent constructor');
  }

  onLogin(formData: LoginRequest) {
    this.authService.login(formData).subscribe({
      next: () => {
        this.alertService.showSuccess('Inicio de sesión exitoso');
        this.router.navigate(['dashboard']);
      },
    });
  }
}
