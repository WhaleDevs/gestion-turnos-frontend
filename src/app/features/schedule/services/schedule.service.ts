import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '@envs/environment';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/shared/models/api-response';
import { INITAL_SCHEDULE_CONFIG_RESPONSE, ScheduleConfigResponse, ScheduleResponse } from '../models/responses/schedule.response';
import { INITAL_SCHEDULE_CONFIG_FOR_UPDATE, ScheduleConfigForUpdateDto, ScheduleDayConfigForUpdateDto } from '../models/requests-dto/scheduleConfigForUpdate.dto';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  protected url = environment.API_URL;
  private http = inject(HttpClient);

  scheduleComponentActive: BehaviorSubject<string> = new BehaviorSubject<string>('form-schedule');
  $scheduleComponentActive = this.scheduleComponentActive.asObservable();
  signalScheduleConfigResponse: WritableSignal<ScheduleConfigResponse> = signal<ScheduleConfigResponse>(INITAL_SCHEDULE_CONFIG_RESPONSE);
  signalScheduleConfigForUpdate: WritableSignal<ScheduleConfigForUpdateDto> = signal<ScheduleConfigForUpdateDto>(INITAL_SCHEDULE_CONFIG_FOR_UPDATE);


  constructor() {
    effect(() => {
      console.log("UDPATE AGEND RECEIVED", this.signalScheduleConfigForUpdate());
    });
  }

  getScheduleAll(email: string): Observable<ApiResponse<ScheduleResponse>> {
    const newUrl = `${this.url}/schedules/${email}`;
    return this.http.get<ApiResponse<ScheduleResponse>>(newUrl);
  }

  getScheduleConfigForUpdateResponse(email: string): Observable<ApiResponse<ScheduleConfigResponse>> {
    const newUrl = `${this.url}/schedules/config/${email}`;
    return this.http.get<ApiResponse<ScheduleConfigResponse>>(newUrl);
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
    console.log("SCHEDULE FOR UPDATE", scheduleForUpdate);
    this.setSignalScheduleConfigForUpdate(scheduleForUpdate);
    this.signalScheduleConfigResponse.set(schedule);
  }

  setSignalScheduleConfigForUpdate(schedule: ScheduleConfigForUpdateDto) {
    this.signalScheduleConfigForUpdate.set(schedule);
  }

  updateSignalScheduleConfigForUpdate(schedule: ScheduleDayConfigForUpdateDto) {
    const scheduleForUpdate: ScheduleConfigForUpdateDto = {
      id: schedule.id,
      scheduleDays: this.signalScheduleConfigForUpdate().scheduleDays.map(day => day.id === schedule.id ? schedule : day)
    };
    this.signalScheduleConfigForUpdate.set(scheduleForUpdate);
  }

  updateScheduleConfigForUpdate(): Observable<ApiResponse<any>> {
    const newUrl = `${this.url}/schedules/update-config`;
    return this.http.patch<ApiResponse<any>>(newUrl, this.signalScheduleConfigForUpdate());
  }

  returnDayFullFromDate(date: string): string {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_HUGE, { locale: 'es' }).split(',')[0][0].toUpperCase() + DateTime.fromISO(date).toLocaleString(DateTime.DATE_HUGE, { locale: 'es' }).slice(1);
  }

  returnDayFromDate(date: string): string {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_HUGE, { locale: 'es' }).split(',')[0].toUpperCase();
  }

  returnDayNumberFromDate(date: string): number {
    return DateTime.fromISO(date).get('day');
  }

}
