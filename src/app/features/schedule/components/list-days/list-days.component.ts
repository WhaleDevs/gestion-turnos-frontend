import { Component, inject } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { DayComponent } from "../day/day.component";
import { ScheduleDayConfigResponse, ScheduleResponse } from '../../models/schedule-response';
import { SessionService } from '@app/auth/services/session.service';

@Component({
  selector: 'app-list-days',
  imports: [DayComponent],
  templateUrl: './list-days.component.html',
  styleUrl: './list-days.component.scss'
})
export class ListDaysComponent {
  
  private ScheduleService = inject(ScheduleService);
  private sessionService = inject(SessionService);
  protected schedule: ScheduleResponse = {} as ScheduleResponse;
  days: ScheduleDayConfigResponse[] = []

  ngOnInit(): void {

    this.sessionService.getSession$.subscribe({
      next: (data) => {
        if (!data) return;
        this.ScheduleService.getScheduleAll(data.email).subscribe({
          next: (data) => {
            this.schedule = data.data ?? {} as ScheduleResponse;
            this.days = this.schedule.daysConfig;
          },
          error: (error) => {
            console.log(error);
          }
        })
      },
      error: (error) => {
        console.log(error);
      }
    });


 
  }

  dayActive(dayResp: ScheduleDayConfigResponse) {
    this.ScheduleService.dayActive.next(dayResp);
  }

}
