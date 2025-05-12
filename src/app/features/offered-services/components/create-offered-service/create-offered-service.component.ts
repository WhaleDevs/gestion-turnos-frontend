import { Component, computed, inject, linkedSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCurrencyDollar,
  heroDocumentText,
  heroPencilSquare
} from '@ng-icons/heroicons/outline';
import { OfferedServicesService } from '../../services/offered-services.service';
import { OfferedDtoForCreation } from '../../models/offeredDtoForCreation';
import { ModalService } from '@app/shared/services/modal.service';
import { AlertService } from '@app/shared/services/alert.service';
import { OfferedDtoForUpdate } from '../../models/offeredDtoForUpdate';
import { FormErrorComponent } from "../../../../shared/components/form-error/form-error.component";
@Component({
  selector: 'app-create-offered-service',
  standalone: true,
  imports: [NgIcon, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './create-offered-service.component.html',
  styleUrl: './create-offered-service.component.scss',
  providers: [
    provideIcons({
      heroPencilSquare,
      heroDocumentText,
      heroCurrencyDollar
    })
  ]
})
export class CreateOfferedServiceComponent {
  private offeredServicesService = inject(OfferedServicesService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  editOfferedServiceFlag = computed(() => this.offeredServicesService.signalOfferedToEditFlag());
  editOfferedService = linkedSignal(() => this.offeredServicesService.signalOfferedToEdit());
  id = computed(() => this.editOfferedService()?.id);

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0)])
  });


  ngOnInit(): void {
    this.form.patchValue({
      title: this.editOfferedService()?.title,
      description: this.editOfferedService()?.description,
      price: this.editOfferedService()?.price
    });
  }

  submit(): void {
    if (this.editOfferedServiceFlag()) {
      this.editOfferedServiceCall();
    } else {
      this.createOfferedService();
    }
  }

  editOfferedServiceCall(): void {
    if (this.form.valid) {
      const serviceData = this.form.value;
      this.offeredServicesService.setOfferedToEdit({
        ...serviceData,
        id: this.id()
      } as OfferedDtoForUpdate);
      this.offeredServicesService.updateOfferedService().subscribe({
        next: () => {
          this.modalService.close();
        },
        error: (error) => {
          this.alertService.showError(error.error.data.message);
        }
      });
    } else {
      this.alertService.showError('Por favor, complete todos los campos');
      this.form.markAllAsTouched();
    }
  }

  createOfferedService(): void {
    if (this.form.valid) {
      const serviceData = this.form.value;
      this.offeredServicesService.setOfferedServiceToCreate(serviceData as OfferedDtoForCreation);
      this.offeredServicesService.createOfferedService().subscribe({
        next: () => {
          this.modalService.close();
        },
        error: (error) => {
          this.alertService.showError(error.error.data.message);
        }
      });
    } else {
      this.alertService.showError('Por favor, complete todos los campos');
      this.form.markAllAsTouched();
    }
  }

}
