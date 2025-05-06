import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent } from '@app/shared/components/form-error/form-error.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEnvelope, heroKey, heroUserCircle } from '@ng-icons/heroicons/outline';
import { ManagerService } from '../../services/manager.service';
import { AlertService } from '@app/shared/services/alert.service';
import { ErrorResponse } from '@app/shared/Interceptors/error.interceptor';
import { ModalService } from '@app/shared/services/modal.service';

@Component({
  selector: 'app-create-manager',
  imports: [ReactiveFormsModule, CommonModule, NgIcon, FormErrorComponent],
  providers: [provideIcons({ heroUserCircle, heroEnvelope, heroKey })],
  templateUrl: './create-manager.component.html',
  styleUrl: './create-manager.component.scss'
})
export class CreateManagerComponent {
  private fb = inject(FormBuilder);
  private _service: ManagerService = inject(ManagerService);
  private _alerts: AlertService = inject(AlertService);
  private _modal: ModalService = inject(ModalService);

  managerForm: FormGroup = this.fb.group({
    firstName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(6)],
    ],
  });

  constructor() {}

  create() {
    if (this.managerForm.valid) {
      const managerDto = {
        firstName: this.managerForm.value.firstName,
        lastName: this.managerForm.value.lastName,
        email: this.managerForm.value.email,
        password: this.managerForm.value.password,
      };

      console.log('Manager DTO:', managerDto);

      this._service.create(managerDto).subscribe({
        next: () => {
          this._modal.close();
        },
        error: (error:ErrorResponse) => {
          this._alerts.showError(error.message)
        }
      });

    } else {
      console.log('Formulario inválido');
    }
  }
}
