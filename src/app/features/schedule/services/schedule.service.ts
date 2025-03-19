import { inject, Injectable, signal, Signal } from '@angular/core';
import { environment } from '@envs/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/shared/models/api-response';
import { ScheduleDayConfigResponse, ScheduleResponse } from '../models/schedule-response';
import { ScheduleDayConfigForUpdateDto } from '../models/schedule-update';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  protected url = environment.API_URL;
  private http = inject(HttpClient);

  scheduleComponentActive: BehaviorSubject<string> = new BehaviorSubject<string>('form-schedule');
  $scheduleComponentActive = this.scheduleComponentActive.asObservable();

  dayActive: BehaviorSubject<ScheduleDayConfigResponse> = new BehaviorSubject<ScheduleDayConfigResponse>({} as ScheduleDayConfigResponse);
  $dayActive = this.dayActive.asObservable();

  // contador:Signal<number> = new signal(0);


  getDayActive(): ScheduleDayConfigResponse {
    return this.dayActive.getValue();
  }

  constructor() { }

  getScheduleAll(email: string): Observable<ApiResponse<ScheduleResponse>> {
    const newUrl = `${this.url}/schedules/${email}`;
    return this.http.get<ApiResponse<ScheduleResponse>>(newUrl).pipe(
      tap((response) => {
        console.log('API Response:', response);
        const schedule = response?.data as ScheduleResponse;
        if (!schedule) {
          console.warn('schedule no está definido.');
          return;
        }
        const daysConfig = schedule.daysConfig;          
        if (!daysConfig || !Array.isArray(daysConfig) || daysConfig.length === 0) {
          console.warn('daysConfig no está definido o está vacío.');
          return;
        }
        this.dayActive.next(daysConfig[0]);
      }),
      catchError((error) => {
        console.error('Error en la API:', error);
        return throwError(() => new Error('Error al obtener los horarios.'));
      })
    );
  }

  updateDay(day: ScheduleDayConfigForUpdateDto, dayId:number, scheduleId:number): Observable<ApiResponse<any>> {
    const newUrl = `${this.url}/schedules/${scheduleId}/days/${dayId}`;
    return this.http.put<ApiResponse<any>>(newUrl, day).pipe(
      tap((response) => {
        console.log('API Response:', response);
      }),
      catchError((error) => {
        console.error('Error en la API:', error);
        return throwError(() => new Error('Error al actualizar el día.'));
      })
    );
  }

}
