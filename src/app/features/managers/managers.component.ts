import { Component, inject } from '@angular/core';
import { ListManagersComponent } from "./components/list-managers/list-managers.component";
import { CreateManagerComponent } from "./components/create-manager/create-manager.component";
import { ModalService } from '@app/shared/services/modal.service';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroPlusCircle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-managers',
  imports: [ListManagersComponent, CommonModule, NgIcon],
    providers: [provideIcons({ heroPlusCircle, heroMagnifyingGlass })],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss'
})
export class ManagersComponent {
  _modalService = inject(ModalService)

  createManager() {
    this._modalService.open(CreateManagerComponent);
  }

}
