import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionService } from '@app/auth/services/session.service';
import { ManagerService } from '@app/features/managers/services/manager.service';
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
  private managerService = inject(ManagerService);
  private role = signal<string>('');
  ngOnInit(): void {
    this.sessionService.getSession$.subscribe((user) => {
      if (user) {
        this.role.set(user.role);
        this.scheduleService.getScheduleConfigForUpdateResponse(user.email).subscribe((response) => {
          if(response.data){
            this.scheduleService.setSignalScheduleConfigResponse(response.data);
          } else {
            this.alertService.showError('Error al obtener la configuración del horario');
          }
        });
      }
    });
    if(this.role() === 'ADMIN'){
    this.managerService.getManagers().subscribe();
    }
  }
}
