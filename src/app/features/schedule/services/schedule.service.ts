import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '@envs/environment';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/shared/models/api-response';
import { ScheduleResponse } from '../models/responses/schedule.response';
import { INITAL_SCHEDULE_CONFIG_FOR_UPDATE, ScheduleConfigForUpdateDto, ScheduleDayConfigForUpdateDto } from '../models/requests-dto/scheduleConfigForUpdate.dto';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  protected url = environment.API_URL;
  private http = inject(HttpClient);

  scheduleComponentActive: BehaviorSubject<string> = new BehaviorSubject<string>('form-schedule');
  $scheduleComponentActive = this.scheduleComponentActive.asObservable();

  //response 
  signalScheduleUpdate: WritableSignal<ScheduleConfigForUpdateDto> = signal<ScheduleConfigForUpdateDto>(INITAL_SCHEDULE_CONFIG_FOR_UPDATE);

  constructor() {
    effect(() => {
      console.log('Schedule Update:', this.signalScheduleUpdate());
    });

  }

  getScheduleAll(email: string): Observable<ApiResponse<ScheduleResponse>> {
    const newUrl = `${this.url}/schedules/${email}`;
    return this.http.get<ApiResponse<ScheduleResponse>>(newUrl);
  }

  getScheduleUpdate(email: string): Observable<ApiResponse<ScheduleConfigForUpdateDto>> {
    const newUrl = `${this.url}/schedules/config/${email}`;
    return this.http.get<ApiResponse<ScheduleConfigForUpdateDto>>(newUrl);
    }


  //dto 
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

  setSignalScheduleUpdate(schedule: ScheduleConfigForUpdateDto) {
    this.signalScheduleUpdate.set(schedule);
  }


  updateSignal(dayToUpdate: ScheduleDayConfigForUpdateDto) {
    this.signalScheduleUpdate.update(schedule => {
      return {
        ...schedule,
        scheduleDays: schedule.daysConfig.map((day: ScheduleDayConfigForUpdateDto) =>
          day.id === dayToUpdate.id
            ? { ...day, ...dayToUpdate }
            : day
        )
      };
    });
  }

}
