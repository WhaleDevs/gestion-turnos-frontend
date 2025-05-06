import { Component, inject, signal } from '@angular/core';
import { ListDaysComponent } from './components/list-days/list-days.component';
import { SessionService } from '@app/auth/services/session.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { heroUser } from '@ng-icons/heroicons/outline';
import { ScheduleService } from './services/schedule.service';
import { SaveScheduleComponent } from "./components/save-schedule/save-schedule.component";

@Component({
  imports: [ListDaysComponent, FormsModule, ReactiveFormsModule, SaveScheduleComponent],
  selector: 'app-schedule',
  template: `
  <section class="container">
    @if (employees().length > 0 && employees() !== null && role() === 'ADMIN') {
      <div class="navigation-container">
        <h3>Configuración de agenda</h3>
        <p>Selecciona el empleado para ver su agenda, tambien puedes ver tu agenda seleccionando "Mi agenda".</p>
        <select
          class="input"
          name="employees"
          id="employees"
          [(ngModel)]="employeeSelectedSignalValue"
          (ngModelChange)="employeeSelected($event)"
        >
          <option value="">Seleccionar agenda</option>
          <option value="Mi agenda">Mi agenda</option>
          @for (employee of employees(); track $index) {
            <option [value]="employee.name">{{ employee.name }}</option>
          }
        </select>
      </div>
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
  .navigation-container{
    height: auto;
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-elevation-medium);
    background-color: var(--background-light);
    padding: var(--padding-m);
    width: 100%;
    height: 100%;
  }
  `,
  providers: [provideIcons({ heroUser })]
})

export class ScheduleComponent {
  private sessionService = inject(SessionService);
  private scheduleService = inject(ScheduleService);
  role = signal('');
  employeeSelectedSignalValue = signal('');
  employees = signal([
    {
      id: 1,
      name: 'Empleado 1'
    },
    {
      id: 2,
      name: 'Empleado 2'
    },
    {
      id: 3,
      name: 'Empleado 3'
    }
  ]);

  ngOnInit(): void {
    this.sessionService.getSession$.subscribe({
      next: (response) => {
        this.role.set(response?.role!);
        if (response?.role === 'ADMIN') {
          this.employeeSelectedSignalValue.set('Mi agenda');
          this.scheduleService.setSignalEmployeeSelected('Mi agenda');
        }
      }
    });
  }

  employeeSelected(event: string) {
    this.employeeSelectedSignalValue.set(event);
    this.scheduleService.setSignalEmployeeSelected(event);
  }
}
