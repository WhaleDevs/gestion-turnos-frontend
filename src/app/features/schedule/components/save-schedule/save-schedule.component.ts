import { Component } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { AlertService } from '@app/shared/services/alert.service';
import { ApiResponse } from '@app/shared/models/api-response';
import { ScheduleConfigResponse } from '../../models/responses/schedule.response';

@Component({
  selector: 'app-save-schedule',
  template: `
  <div class="save-schedule">
    <button class="btn primary-dark full light" (click)="onSave()">Guardar Agenda</button>
  </div>
  `,
  standalone: true,
  styles: [`
    .save-schedule {
      @media screen and (max-width: 768px) {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        background: var(--primary-light);
        backdrop-filter: blur(10px);
        padding: var(--padding-m) 0;
      }
    }
    .btn {
      color: var(--text-light);
      border-radius: var(--border-radius-m);
      background-color: var(--primary-dark);

      &:hover {
        background-color: var(--primary);
      }

      @media screen and (max-width: 768px) {
        border-radius: 0;
        width: 100%;
      }
    }
  `]
})
export class SaveScheduleComponent {
  constructor(private scheduleService: ScheduleService, private alertService: AlertService) { }

  onSave() {
    this.scheduleService.updateScheduleConfigForUpdate().subscribe({
      next: () => {
        this.alertService.showSuccess('Agenda guardada correctamente');
      },
      error: (error: Error) => {
        this.alertService.showError('Error al guardar la agenda: ' + error.message);
      }
    });
  }
}
