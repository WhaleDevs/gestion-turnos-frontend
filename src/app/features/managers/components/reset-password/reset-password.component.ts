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
import { heroEye, heroEyeSlash, heroLockClosed } from '@ng-icons/heroicons/outline';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, NgIcon, NgClass],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers: [provideIcons({heroLockClosed, heroEyeSlash, heroEye})]
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private _alerts = inject(AlertService);
  private _managerService = inject(ManagerService);

  statusButton = 'hidePassword';
  statusButton2 = 'hidePassword';

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
  showPassword() {
    this.statusButton = this.statusButton === 'hidePassword' ? 'showPassword' : 'hidePassword';
  }

  showPassword2() {
    this.statusButton2 = this.statusButton2 === 'hidePassword' ? 'showPassword' : 'hidePassword';
  }

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

  get passwordsAreEqual(): boolean {
    const pass = this.resetPasswordForm.get('newPassword')?.value;
    const confirm = this.resetPasswordForm.get('confirmPassword')?.value;
    return !!pass && !!confirm && pass === confirm;
  }
  
  
  

}
