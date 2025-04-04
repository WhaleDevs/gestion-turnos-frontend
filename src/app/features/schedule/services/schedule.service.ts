import { computed, effect, inject, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { environment } from '@envs/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
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
  signalDayStatusFalse = linkedSignal(() => this.signalScheduleConfigForUpdate().scheduleDays.filter(day => day.status === false).map(day => day.day));
  isLoading = signal(false);

  getScheduleConfigForUpdateResponse(email: string): Observable<ApiResponse<ScheduleConfigResponse>> {
    this.isLoading.set(true); 
    const newUrl = `${this.url}/schedules/config/${email}`;
    return this.http.get<ApiResponse<ScheduleConfigResponse>>(newUrl).pipe(
      tap((response) => {
        this.setSignalScheduleConfigResponse(response.data!);
        this.isLoading.set(false); 
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
    return this.http.patch<ApiResponse<ScheduleConfigResponse>>(newUrl, this.signalScheduleConfigForUpdate()).pipe(
      tap((response: ApiResponse<ScheduleConfigResponse>) => {
        this.signalScheduleConfigResponse.set({ ...response.data! });
      })
    );
  }
  

}