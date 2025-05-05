import { Component, computed, effect, inject, signal } from '@angular/core';
import { ManagerService } from '../../services/manager.service';
import { ManagerResponse } from '../../models/manager.response';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-list-managers',
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroPencilSquare, heroTrash })],  
  templateUrl: './list-managers.component.html',
  styleUrl: './list-managers.component.scss'
})
export class ListManagersComponent {
  _service: ManagerService = inject(ManagerService);
  managers = computed(() => this._service.managers())

  ngOnInit() {
    this._service.getManagers().subscribe();
  }

  updateManager(manager: ManagerResponse) {
    // Implementar navegación o abrir modal
    console.log('Editar manager:', manager);
  }

  deleteManager(id: number) {
    // Confirmar y eliminar
    console.log('Eliminar manager con id:', id);
  }

}
