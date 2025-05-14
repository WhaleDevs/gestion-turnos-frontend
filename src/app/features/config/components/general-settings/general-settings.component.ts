import { Component, computed, inject } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertService } from '@app/shared/services/alert.service';
import { ModalService } from '@app/shared/services/modal.service';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { FormErrorComponent } from "../../../../shared/components/form-error/form-error.component";
import { GeneralSettingsForUpdateDto } from '../../models/generalSettingsForUpdateDto.dto';

@Component({
  selector: 'app-general-settings',
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss',
})
export class GeneralSettingsComponent {
  private readonly configService = inject(ConfigService);
  private readonly fb = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  private readonly modalService = inject(ModalService);
  generalSettings = computed(() => this.configService.generalSettings());

  form: FormGroup = this.fb.group({
    address: ['', ],
    email: ['', Validators.email],
    phone: [''],
    limitDaysToReserve: [0],
  });

  constructor() {
    this.configService.getGeneralSettings().subscribe({
      next: () => {
        const settings = this.generalSettings(); // ya está actualizada por el signal

        this.form = this.fb.group({
          address: [settings.address || ''],
          email: [settings.email || '', Validators.email],
          phone: [settings.phoneNumber || ''],
          limitDaysToReserve: [settings.limitDaysToReserve ?? 30],
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  updateGeneralSettings() {
    if (this.form.valid) {
      this.modalService
        .openWithResult(ConfirmDialogComponent, {}, {message: '¿Estás seguro de querer actualizar la configuración general?'})
        .subscribe((result) => {
          if (result) {
            const request: GeneralSettingsForUpdateDto = {
              address: this.form.value.address,
              email: this.form.value.email,
              phoneNumber: this.form.value.phone,
              limitDaysToReserve: this.form.value.limitDaysToReserve,
            };

            this.configService
              .updateGeneralSettings(request)
              .subscribe({
                next: () => {
                  this.alertService.showSuccess('Configuración actualizada');
                },
                error: (error) => {
                  this.alertService.showError(error.message);
                },
              });
          }
        });
    }
  }
}
