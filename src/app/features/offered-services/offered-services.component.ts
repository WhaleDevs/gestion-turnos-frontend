import { Component, computed, inject } from '@angular/core';
import { OfferedResponse } from './models/offeredResponse';
import { provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash, heroPlus } from '@ng-icons/heroicons/outline';
import { NgIcon } from '@ng-icons/core';
import { ModalService } from '@app/shared/services/modal.service';
import { CreateOfferedServiceComponent } from './components/create-offered-service/create-offered-service.component';
import { OfferedServicesService } from './services/offered-services.service';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { OfferedDtoForUpdate } from './models/offeredDtoForUpdate';
@Component({
  selector: 'app-offered-services',
  imports: [NgIcon],
  templateUrl: './offered-services.component.html',
  styleUrl: './offered-services.component.scss',
  providers: [provideIcons({ heroPencilSquare, heroTrash, heroPlus })]
})
export class OfferedServicesComponent {
  private modalService = inject(ModalService);
  private offeredServicesService = inject(OfferedServicesService);
  offeredServices = computed(() => this.offeredServicesService.signalOfferedServices())

  constructor() {
    this.offeredServicesService.getOfferedServices().subscribe({
      next: (response) => {
        this.offeredServicesService.signalOfferedServices.set(response.data!);
      }
    })
  }

  addOfferedService() {
    this.offeredServicesService.setOfferedToEditFlag(false);
    this.offeredServicesService.setOfferedToEdit(null);
    this.modalService.open(CreateOfferedServiceComponent);
  }

  editOfferedService(service: OfferedResponse) {
    const serviceToUpdate: OfferedDtoForUpdate = this.mapToDto(service);
    this.offeredServicesService.setOfferedToEditFlag(true);
    this.offeredServicesService.setOfferedToEdit(serviceToUpdate);
    this.modalService.open(CreateOfferedServiceComponent);
  }
  
  deleteOfferedService(id: number) {
    this.modalService.openWithResult(ConfirmDialogComponent, {}, { message: '¿Estás seguro de que querés eliminar este servicio?' }).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.offeredServicesService.deleteOfferedService(id).subscribe();
      }else{
        this.modalService.close();
      }
    })
  }

  mapToDto(service: OfferedResponse): OfferedDtoForUpdate {
    return {
      id: service.id,
      title: service.title,
      description: service.description!,
      price: service.price
    }
  }
}
