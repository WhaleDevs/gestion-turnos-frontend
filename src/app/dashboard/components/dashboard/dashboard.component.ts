import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionService } from '@app/auth/services/session.service';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  template: `
  <div class="dashboard">
  <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
    .dashboard {
    width: 100%;
    height: 100%;
    padding: var(--padding-m);
}`],
  standalone: true
})

export class DashboardComponent {
  private alertService = inject(AlertService);
  private scheduleService = inject(ScheduleService);
  private sessionService = inject(SessionService);
  ngOnInit(): void {
    this.sessionService.getSession$.subscribe((user) => {
      if (user) {
        this.scheduleService.getScheduleConfigForUpdateResponse(user.email).subscribe((response) => {
          if(response.data){
            this.scheduleService.setSignalScheduleConfigResponse(response.data);
          } else {
            this.alertService.showError('Error al obtener la configuración del horario');
          }
        });
      }
    });
  }
}
