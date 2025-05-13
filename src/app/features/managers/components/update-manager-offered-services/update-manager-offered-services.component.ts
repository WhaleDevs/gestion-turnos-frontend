import { Component, computed, inject } from '@angular/core';
import { AlertService } from '@app/shared/services/alert.service';
import { ManagerService } from '../../services/manager.service';
import { ModalService } from '@app/shared/services/modal.service';
import { OfferedServicesService } from '@app/features/offered-services/services/offered-services.service';
import { OfferedResponse } from '@app/features/offered-services/models/offeredResponse';
import { UserOfferedServicesDto } from '../../models/userOfferedServiceDto.dto';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-update-manager-offered-services',
  imports: [],
  templateUrl: './update-manager-offered-services.component.html',
  styleUrl: './update-manager-offered-services.component.scss'
})
export class UpdateManagerOfferedServicesComponent {
  private _service: ManagerService = inject(ManagerService);
  private _alerts: AlertService = inject(AlertService);
  private _modalService = inject(ModalService);
  private _offeredServices: OfferedServicesService = inject(OfferedServicesService);
  selectedManager = computed(() => this._service.selectedManager());
  offeredServices = computed(() => this._offeredServices.signalOfferedServices());

  selectedServices: OfferedResponse[] = [];

  constructor() {
    this._offeredServices.getOfferedServices().subscribe();
    const manager = this.selectedManager();
    if (manager && manager.offeredServices) {
      this.selectedServices = [...manager.offeredServices]; // Asignamos los servicios previamente asignados
    }
  }

  ngOnInit() {
    console.log(this.selectedManager());
    console.log(this.offeredServices());
    //por que muestra los servicios vacios?
  }


  
  isServiceSelected(service: any): boolean {
    return this.selectedServices.some(selected => selected.id === service.id);
  }

  
  toggleServiceSelection(service: any): void {
    const index = this.selectedServices.findIndex(selected => selected.id === service.id);
    
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
  }

  updateManagerOfferedServices() {
    // Abrir el modal y esperar el resultado de confirmación
    this._modalService.openWithResult(ConfirmDialogComponent, {}, {
      message: '¿Estás seguro de que querés actualizar los servicios ofrecidos?'
    }).subscribe((confirm: boolean) => {
      // Si el usuario confirma la acción
      if (confirm) {
        // Crear el DTO con los servicios seleccionados
        const request: UserOfferedServicesDto = {
          userId: this.selectedManager().id,
          offeredServicesIds: this.selectedServices.map(service => service.id)
        };
  
        // Llamar al servicio para actualizar los servicios del manager
        this._service.updateManagerOfferedServices(request).subscribe({
          next: () => {
            // Mostrar mensaje de éxito y cerrar el modal
            this._alerts.showSuccess('Servicios actualizados correctamente');
            this._modalService.close();
          },
          error: (err) => {
            // Mostrar mensaje de error
            console.error(err); // Loguear error
            this._alerts.showError('Error al actualizar los servicios');
          }
        });
      }
    });
  }
  
}
