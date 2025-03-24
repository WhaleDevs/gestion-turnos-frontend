import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '@envs/environment';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { INITAL_SCHEDULE_RESPONSE, ScheduleDayConfigResponse, ScheduleResponse } from '../models/schedule-response';
import { INITAL_SCHEDULE_UPDATE, ScheduleDayConfigForUpdateDto, ScheduleForUpdateDto } from '../models/schedule-update';
import { ApiResponse } from '@app/shared/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  protected url = environment.API_URL;
  private http = inject(HttpClient);

  scheduleComponentActive: BehaviorSubject<string> = new BehaviorSubject<string>('form-schedule');
  $scheduleComponentActive = this.scheduleComponentActive.asObservable();

  signalScheduleUpdate: WritableSignal<ScheduleForUpdateDto> = signal<ScheduleForUpdateDto>(INITAL_SCHEDULE_UPDATE);

  constructor() {
    effect(() => {
      console.log('Schedule Update:', this.signalScheduleUpdate());
    });

  }

  getScheduleAll(email: string): Observable<ApiResponse<ScheduleResponse>> {
    const newUrl = `${this.url}/schedules/${email}`;
    return this.http.get<ApiResponse<ScheduleResponse>>(newUrl);
  }

  getScheduleUpdate(email: string): Observable<ApiResponse<any>> {
    const newUrl = `${this.url}/schedules/${email}/updateResponse`;
    return this.http.get<ApiResponse<any>>(newUrl);
    }


  updateSchedule(): Observable<ApiResponse<any>> {
    const newUrl = `${this.url}/schedules/update-config`;
    return this.http.patch<ApiResponse<any>>(newUrl, this.signalScheduleUpdate()).pipe(
      tap((response) => {
        console.log('API Response:', response);
      }),
      catchError((error) => {
        console.error('Error en la API:', error);
        return throwError(() => new Error('Error al actualizar el día.'));
      })
    );
  }

  setSignalScheduleUpdate(schedule: ScheduleForUpdateDto) {
    this.signalScheduleUpdate.set(schedule);
  }


  updateSignal(dayToUpdate: ScheduleDayConfigForUpdateDto) {
    this.signalScheduleUpdate.update(schedule => {
      return {
        ...schedule,
        scheduleDays: schedule.scheduleDays.map(day =>
          day.id === dayToUpdate.id
            ? { ...day, ...dayToUpdate }
            : day
        )
      };
    });
  }

  mapScheduleResponseToUpdate(schedule: ScheduleResponse): ScheduleForUpdateDto {
    return {
      id: schedule.id,
      scheduleDays: schedule.daysConfig.map(day => {
        return {
          id: day.id,
          startTime: day.startTime,
          endTime: day.endTime,
          slotInterval: day.slotInterval,
          status: day.status,
          rests: day.rests.map(rest => {
            return {
              id: rest.id,
              startRest: rest.startTime,
              endRest: rest.endTime
            }
          })
        }
      }) as ScheduleDayConfigForUpdateDto[]
    };
  }
}
