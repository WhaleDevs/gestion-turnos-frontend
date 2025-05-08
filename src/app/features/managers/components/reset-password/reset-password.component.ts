import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ValidationErrors,
  AbstractControl,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { ResetPasswordDto } from '../../models/resetPasswordDto.dto';
import { AlertService } from '@app/shared/services/alert.service';
import { ManagerService } from '../../services/manager.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private _alerts = inject(AlertService);
  private _managerService = inject(ManagerService);

  resetPasswordForm = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [this.passwordsMatchValidator()],
    }
  );

  constructor() {}

  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pass = group.get('newPassword')?.value;
      const confirm = group.get('confirmPassword')?.value;
      return pass === confirm ? null : { passwordsMismatch: true };
    };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this._alerts.showError('Verificá los campos antes de continuar');
      return;
    }

    const { newPassword } = this.resetPasswordForm.value;
    const userId = this._managerService.selectedManager().id;

    if (!newPassword) {
      this._alerts.showError('La nueva contraseña es requerida');
      return;
    }

    const payload: ResetPasswordDto = {
      userId,
      newPassword,
    };

    this._managerService.resetPassword(payload).subscribe({
      next: () => {
        this._alerts.showSuccess('Contraseña restablecida correctamente');
        this.resetPasswordForm.reset();
      },
      error: () => {
        this._alerts.showError('Error al restablecer la contraseña');
      },
    });
  }
}
