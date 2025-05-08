import { Component, computed, effect, inject, signal } from '@angular/core';
import { ManagerService } from '../../services/manager.service';
import { ManagerResponse } from '../../models/manager.response';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroSparkles, heroTrash } from '@ng-icons/heroicons/outline';
import { ErrorResponse } from '@app/shared/Interceptors/error.interceptor';
import { AlertService } from '@app/shared/services/alert.service';
import { ModalService } from '@app/shared/services/modal.service';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CreateHolidayComponent } from '../create-holiday/create-holiday.component';


@Component({
  selector: 'app-list-managers',
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroPencilSquare, heroTrash, heroSparkles })],
  templateUrl: './list-managers.component.html',
  styleUrl: './list-managers.component.scss',
})
export class ListManagersComponent {
  private _service: ManagerService = inject(ManagerService);
  private _alerts: AlertService = inject(AlertService);
  private _modalService = inject(ModalService);
  managers = computed(() => this._service.managers());
  ngOnInit() {
    this._service.getManagers().subscribe();
  }

  updateManager(manager: ManagerResponse) {
    // Implementar navegación o abrir modal
    console.log('Editar manager:', manager);
  }

  addHolidays(manager: ManagerResponse){
    this._service.selectedManager.set(manager);

    this._modalService.open(CreateHolidayComponent);
  }

  deleteManager(id: number) {
    // Confirmar y eliminar
    this._modalService.openWithResult(
      ConfirmDialogComponent,
      {},
      {
        message: '¿Estás seguro de que querés eliminar este empleado?',
      }
    ).subscribe((confirm: boolean) => {
      if(confirm){
        this._service.delete(id).subscribe({
          next: () => {
            this._alerts.showSuccess('Empleado eliminado');
          },
          error: (error: ErrorResponse) => {
            this._alerts.showError(error.message);
          },
        });
      }
    });
    
  }
}
