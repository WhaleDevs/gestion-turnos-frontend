import { Component, inject, Input, linkedSignal, signal, effect, WritableSignal } from '@angular/core';
import { SessionService } from '@app/auth/services/session.service';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { ManagerService } from '../../services/manager.service';
import { ManagerResponse } from '../../models/manager.response';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-select-manager',
  imports: [FormsModule, NgClass],
  templateUrl: './select-manager.component.html',
  styleUrl: './select-manager.component.scss'
})
export class SelectManagerComponent {
  private sessionService = inject(SessionService);
  private scheduleService = inject(ScheduleService);
  private managerService = inject(ManagerService);
  @Input() section: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() nostyles: boolean = false;

  role = signal('');
  employeeSelectedSignalValue = signal<string>('');
  employees: WritableSignal<ManagerResponse[]> = linkedSignal(() => this.managerService.managers());

  constructor() {
    effect(() => {
      const allEmployees = this.employees();
      const currentRole = this.role();
      if (currentRole === 'ADMIN' && allEmployees.length > 0) {
        const admin = allEmployees.find(e => e.role === 'ADMIN');
        if (admin) {
          this.employeeSelectedSignalValue.set(admin.email);
          this.scheduleService.setSignalEmployeeSelected(admin);
        }
      }
    });
  }

  ngOnInit(): void {
    this.sessionService.getSession$.subscribe({
      next: (response) => {
        this.role.set(response?.role!);
      }
    });
  }

  employeeSelected(email: string) {
    const selected = this.employees().find(e => e.email === email);
    if (selected) {
      this.scheduleService.setSignalEmployeeSelected(selected);
      this.employeeSelectedSignalValue.set(selected.email);
    }
  }
  
}