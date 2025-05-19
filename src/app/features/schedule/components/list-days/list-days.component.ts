import { Component, computed, effect, inject, signal } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { DayComponent } from "../day/day.component";
import { SaveScheduleComponent } from '../save-schedule/save-schedule.component';
import { NgClass } from '@angular/common';
import { ScheduleDayConfigForUpdateDto } from '../../models/requests-dto/scheduleConfigForUpdate.dto';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUser } from '@ng-icons/heroicons/outline';
import { FormsModule } from '@angular/forms';
import { SessionService } from '@app/auth/services/session.service';
import { ManagerResponse } from '@app/features/managers/models/manager.response';

@Component({
  selector: 'app-list-days',
  imports: [DayComponent, NgClass, NgIcon, FormsModule, SaveScheduleComponent ],
  templateUrl: './list-days.component.html',
  styleUrls: ['./list-days.component.scss'],
  providers: [provideIcons({ heroUser })],
  standalone: true
})
export class ListDaysComponent {

  private scheduleService = inject(ScheduleService);
  private sessionService = inject(SessionService);
  days = signal<ScheduleDayConfigForUpdateDto[]>([]);
  selectedDaySignal = signal<ScheduleDayConfigForUpdateDto | undefined>(undefined);
  employeeSelectedSignalValue = computed(() => this.scheduleService.signalEmployeeSelected());


  ngOnInit(): void {
    if(this.employeeSelectedSignalValue().email === undefined){
      this.sessionService.getSession$.subscribe(session => {
        if(session?.email && session?.role === 'MANAGER'){
          const userResponse: ManagerResponse = {
            id: 0,
            email: session?.email,
            role: session?.role,
            firstName: "",
            lastname: "",
            offeredServices: []
          }
          this.scheduleService.signalEmployeeSelected.set(userResponse);
        }
      });
    }
  }


  constructor() {
    effect(() => {
      const updatedDays = this.scheduleService.signalScheduleConfigForUpdate().scheduleDays;
      this.days.set(updatedDays);
  
      if (updatedDays.length > 0) {
        const currentSelected = this.selectedDaySignal();
        const stillExists = updatedDays.find(day => day.day === currentSelected?.day);
  
        if (stillExists) {
          this.selectedDaySignal.set(stillExists);
        } else {
          this.selectedDaySignal.set(updatedDays[0]);
        }
  
        this.scheduleService.generateHours(this.selectedDaySignal()!);
      }
    });
  }

  dayActive(dayResp: ScheduleDayConfigForUpdateDto) {
    this.selectedDaySignal.set(dayResp);
    this.scheduleService.generateHours(dayResp);
  }

  onSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const index = parseInt(select.value);
    if (!isNaN(index) && this.days()[index]) {
      this.dayActive(this.days()[index]);
      select.value = '';
    }
  }

  whatDay() {
    return this.scheduleService.signalScheduleConfigForUpdate().scheduleDays.find(day => day.day === this.selectedDaySignal()?.day);
  }
}
