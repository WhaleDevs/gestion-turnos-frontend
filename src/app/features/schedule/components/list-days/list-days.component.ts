import { Component, effect, inject, signal } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { DayComponent } from "../day/day.component";
import { SaveScheduleComponent } from '../save-schedule/save-schedule.component';
import { NgClass } from '@angular/common';
import { ScheduleDayConfigForUpdateDto } from '../../models/requests-dto/scheduleConfigForUpdate.dto';

@Component({
  selector: 'app-list-days',
  imports: [DayComponent, SaveScheduleComponent, NgClass],
  templateUrl: './list-days.component.html',
  styleUrls: ['./list-days.component.scss'],
  standalone: true
})
export class ListDaysComponent {

  private scheduleService = inject(ScheduleService);
  days = signal<ScheduleDayConfigForUpdateDto[]>([]);
  selectedDaySignal = signal<ScheduleDayConfigForUpdateDto | undefined>(undefined);
  wasSelected = signal(false);

  constructor() {
    effect(() => {
      const updatedDays = this.scheduleService.signalScheduleConfigForUpdate().scheduleDays;
      this.days.set(updatedDays);
      if (this.wasSelected()) {
        return;
      }
      if (updatedDays.length > 0) {
        this.selectedDaySignal.set(updatedDays[0]);
        this.wasSelected.set(true);
      }
    });
  }

  dayActive(dayResp: ScheduleDayConfigForUpdateDto) {
    this.selectedDaySignal.set(dayResp);
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
