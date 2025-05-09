import { Component, computed, inject, linkedSignal, signal, WritableSignal } from '@angular/core';
import { ListDaysComponent } from './components/list-days/list-days.component';
import { SessionService } from '@app/auth/services/session.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { heroUser } from '@ng-icons/heroicons/outline';
import { ScheduleService } from './services/schedule.service';
import { SaveScheduleComponent } from "./components/save-schedule/save-schedule.component";
import { ManagerService } from '../managers/services/manager.service';
import { ManagerResponse } from '../managers/models/manager.response';
import { SelectManagerComponent } from "../managers/components/select-manager/select-manager.component";

@Component({
  imports: [ListDaysComponent, FormsModule, ReactiveFormsModule, SaveScheduleComponent, SelectManagerComponent],
  selector: 'app-schedule',
  template: `
  <section class="container">
    @if (employees().length > 0 && employees() !== null && role() === 'ADMIN') {
      <app-select-manager 
        title="Configuración de agenda"
        description="Selecciona un miembro del personal para ver su agenda, tambien puedes ver tu agenda seleccionando 'Mi agenda'."
        section="agenda">
      </app-select-manager>
    }
    <app-list-days></app-list-days>
    <app-save-schedule></app-save-schedule>
  </section>
  `,
  styles: `
  .container{
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    height: 100%;
  }

  `,
  providers: [provideIcons({ heroUser })]
})

export class ScheduleComponent {
  private sessionService = inject(SessionService);
  private scheduleService = inject(ScheduleService);
  private managerService = inject(ManagerService);
  role = signal('');
  employeeSelectedSignalValue = signal<string>('');
  employees: WritableSignal<ManagerResponse[]> = linkedSignal(() => this.managerService.managers());

  ngOnInit(): void {
    this.sessionService.getSession$.subscribe({
      next: (response) => {
        this.role.set(response?.role!);
        if (response?.role === 'ADMIN') {
          this.employeeSelectedSignalValue.set(response.email!);
          const employee = this.employees().find(e => e.email === response.email);
          if(employee){
            this.scheduleService.setSignalEmployeeSelected(employee);
          }
        }
      }
    });
  }

  employeeSelected(event: ManagerResponse) {
    this.scheduleService.setSignalEmployeeSelected(event);
    this.employeeSelectedSignalValue.set(event.email);
  }
}
