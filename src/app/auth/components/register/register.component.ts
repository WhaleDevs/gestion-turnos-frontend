import { Component, inject } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../models/register.request';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [AuthFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  onRegister(formData: RegisterRequest) {
    this.authService.register(formData).subscribe({
      next: () => {
        this.router.navigate(['auth/login']);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error.error.data.message);
      }
    });
  }
}
