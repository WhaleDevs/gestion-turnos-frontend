import { computed, effect, inject, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { environment } from '@envs/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/shared/models/api-response';
import { INITAL_SCHEDULE_CONFIG_RESPONSE, ScheduleConfigResponse, ScheduleResponse } from '../models/responses/schedule.response';
import { INITAL_SCHEDULE_CONFIG_FOR_UPDATE, ScheduleConfigForUpdateDto, ScheduleDayConfigForUpdateDto } from '../models/requests-dto/scheduleConfigForUpdate.dto';
import { DateTime } from 'luxon';
import { AppointmentResponse } from '@app/features/appointments/models/responses/appointments.response';
import { SessionService } from '@app/auth/services/session.service';
import { AlertService } from '@app/shared/services/alert.service';
import { ManagerResponse } from '@app/features/managers/models/manager.response';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  protected url = environment.API_URL;
  private http = inject(HttpClient);
  private sessionService = inject(SessionService);
  private alertService = inject(AlertService);

  scheduleComponentActive: BehaviorSubject<string> = new BehaviorSubject<string>('form-schedule');
  $scheduleComponentActive = this.scheduleComponentActive.asObservable();
  signalScheduleConfigResponse: WritableSignal<ScheduleConfigResponse> = signal<ScheduleConfigResponse>(INITAL_SCHEDULE_CONFIG_RESPONSE);
  signalScheduleConfigForUpdate: WritableSignal<ScheduleConfigForUpdateDto> = signal<ScheduleConfigForUpdateDto>(INITAL_SCHEDULE_CONFIG_FOR_UPDATE);
  signalDayStatusFalse = linkedSignal(() => this.signalScheduleConfigForUpdate().scheduleDays.filter(day => day.status === false).map(day => day.day));
  signalEmployeeSelected = signal<ManagerResponse>({} as ManagerResponse);
  isLoading = signal(false);
  hoursForDay = signal<string[]>([]);
  signalHolidays = computed(() => this.signalScheduleConfigResponse().holidays.map(holiday => ({
    ...holiday,
    startDate: holiday.startDate.slice(0, 10),
    endDate: holiday.endDate.slice(0, 10)
  })));

  generateHours(day: ScheduleDayConfigForUpdateDto) {
    const hours: string[] = [];
    const startTime = DateTime.fromFormat(day.startTime!, 'HH:mm');
    const endTime = DateTime.fromFormat(day.endTime!, 'HH:mm');
    let currentTime = startTime;
    while (currentTime < endTime) {
      hours.push(currentTime.toFormat('HH:mm'));
      currentTime = currentTime.plus({ minutes: day.slotInterval });
    }
    this.hoursForDay.set(hours);
  }

  getScheduleConfigForUpdateResponse(email: string): Observable<ApiResponse<ScheduleConfigResponse>> {
    this.isLoading.set(true); 
    const newUrl = `${this.url}/schedules/config/${email}`;
    return this.http.get<ApiResponse<ScheduleConfigResponse>>(newUrl).pipe(
      tap((response) => {
        this.setSignalScheduleConfigResponse(response.data!);
        this.isLoading.set(false); 
        console.log("Schedule config for update response:", response.data);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  setSignalScheduleConfigResponse(schedule: ScheduleConfigResponse) {
    const scheduleForUpdate: ScheduleConfigForUpdateDto = {
      id: schedule.id,
      scheduleDays: schedule.daysConfig.map(day => ({
        id: day.id,
        day: day.day,
        startTime: day.startTime,
        endTime: day.endTime,
        slotInterval: day.slotInterval,
        status: day.status,
        rests: day.rests.map(rest => ({
          id: rest.id,
          startRest: rest.startTime,
          endRest: rest.endTime
        }))
      }))
    };
    this.setSignalScheduleConfigForUpdate(scheduleForUpdate);
    this.signalScheduleConfigResponse.set(schedule);
  }

  setSignalScheduleConfigForUpdate(schedule: ScheduleConfigForUpdateDto) {
    this.signalScheduleConfigForUpdate.set(schedule);
  }

  updateSignalScheduleConfigForUpdate(schedule: ScheduleDayConfigForUpdateDto) {
    const scheduleForUpdate: ScheduleConfigForUpdateDto = {
      id: this.signalScheduleConfigForUpdate().id,
      scheduleDays: this.signalScheduleConfigForUpdate().scheduleDays.map(day => day.id === schedule.id ? schedule : day)
    };
    this.signalScheduleConfigForUpdate.set(scheduleForUpdate);
  }

  updateScheduleConfigForUpdate(): Observable<ApiResponse<ScheduleConfigResponse>> {
    const newUrl = `${this.url}/schedules/update-config`;
    console.log("Agenda actualizada y enviada al backend: ",this.signalScheduleConfigForUpdate());
    return this.http.patch<ApiResponse<ScheduleConfigResponse>>(newUrl, this.signalScheduleConfigForUpdate()).pipe(
      tap((response: ApiResponse<ScheduleConfigResponse>) => {
        this.setSignalScheduleConfigResponse(response.data!)
      })
    );
  }

  getMostDemandedAppointments(months:string,email: string): Observable<ApiResponse<any[]>> {
    const newUrl = `${this.url}/schedules/stats/${email}?months=${months}`;
    return this.http.get<ApiResponse<any[]>>(newUrl);
  }

  setSignalEmployeeSelected(employee: ManagerResponse) {
    console.log("Employee selected:", employee);
    this.signalEmployeeSelected.set(employee);
    this.getScheduleConfigForUpdateResponse(employee.email).subscribe();
  }


  isBetweenDates(date: string, startDate: string, endDate: string) {
    return date >= startDate && date <= endDate;
  }
  
  
}