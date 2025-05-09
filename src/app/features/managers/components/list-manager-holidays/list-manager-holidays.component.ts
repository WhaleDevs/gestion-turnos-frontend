import { Component, computed, inject } from '@angular/core';
import { ManagerService } from '../../services/manager.service';
import { CreateHolidayComponent } from '../create-holiday/create-holiday.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEye, heroPlus, heroTrash } from '@ng-icons/heroicons/outline';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ModalService } from '@app/shared/services/modal.service';

@Component({
  selector: 'app-list-manager-holidays',
  imports: [CreateHolidayComponent, NgIcon],
  templateUrl: './list-manager-holidays.component.html',
  styleUrl: './list-manager-holidays.component.scss',
  providers: [provideIcons({ heroTrash, heroPlus, heroEye })],
})
export class ListManagerHolidaysComponent {
  private managerService = inject(ManagerService);
  private modalService = inject(ModalService);
  manager = computed(() => this.managerService.selectedManager());
  holidays = computed(() => this.managerService.holidays());
  view: 'list' | 'create' = 'list';


  ngOnInit() {
    this.managerService.getHolidays(this.manager().id).subscribe();
  }

  toggleView() {
    if (this.view === 'list') {
      this.view = 'create';
    } else {
      this.view = 'list';
    }
  }

  deleteHoliday(holidayId: number) {
    this.modalService.openWithResult(ConfirmDialogComponent).subscribe((result) => {
      if (result) {
        this.managerService.deleteHoliday(holidayId).subscribe();
      }
    });
  }
}
