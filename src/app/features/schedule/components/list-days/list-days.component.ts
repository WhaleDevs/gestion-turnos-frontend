import { Component, inject, signal } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { DayComponent } from "../day/day.component";
import { SaveScheduleComponent } from '../save-schedule/save-schedule.component';
import { SessionService } from '@app/auth/services/session.service';
import { ScheduleConfigForUpdateDto, ScheduleDayConfigForUpdateDto } from '../../models/requests-dto/scheduleConfigForUpdate.dto';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-list-days',
  imports: [DayComponent, SaveScheduleComponent, NgClass],
  templateUrl: './list-days.component.html',
  styleUrls: ['./list-days.component.scss'],
  standalone: true
})
export class ListDaysComponent {

  private ScheduleService = inject(ScheduleService);
  private sessionService = inject(SessionService);
  protected schedule: ScheduleConfigForUpdateDto = {} as ScheduleConfigForUpdateDto;
  days: ScheduleDayConfigForUpdateDto[] = []
  selectedDaySignal = signal<ScheduleDayConfigForUpdateDto>({} as ScheduleDayConfigForUpdateDto);

  ngOnInit(): void {
    this.sessionService.getSession$.subscribe({
      next: (data) => {
        if (!data) return;
          this.ScheduleService.getScheduleUpdate(data.email).subscribe({
            next: (data) => {
              if (!data) return;
              this.schedule = data.data as unknown as ScheduleConfigForUpdateDto;
              this.ScheduleService.setSignalScheduleUpdate(this.schedule);
              this.days = this.schedule.daysConfig;
              this.selectedDaySignal.set(this.days[0]);
            },
            error: (error) => {
              console.log(error);
            }
          })
      }
    })
  }

  dayActive(dayResp: ScheduleDayConfigForUpdateDto) {
    this.selectedDaySignal.set(dayResp);
  }

  onSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const index = parseInt(select.value);
    if (!isNaN(index)) {
      this.dayActive(this.days[index]);
      select.value = '';
    }
  }

}
