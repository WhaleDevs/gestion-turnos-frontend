import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '@envs/environment.development';
import { INITIAL_MANAGER, INITIAL_MANAGERS, ManagerResponse } from '../models/manager.response';
import { Observable, take, tap } from 'rxjs';
import { ApiResponse } from '@app/shared/models/api-response';
import { ManagerForCreationDto } from '../models/managerForCreationDto.dto';
import { HolidayResponse } from '../models/holiday.response';
import { HolidayForCreationDto } from '../models/holidayForCreationDto.dto';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private http = inject(HttpClient);
  protected url = environment.API_URL;
  selectedManager: WritableSignal<ManagerResponse> = signal(INITIAL_MANAGER);
  managers: WritableSignal<ManagerResponse[]> = signal([]);
  holidays: WritableSignal<HolidayResponse[]> = signal([]);


  getManagers(): Observable<ApiResponse<ManagerResponse[]>>{
    return this.http.get<ApiResponse<ManagerResponse[]>>(`${this.url}/users`).pipe(
      tap((response: ApiResponse<ManagerResponse[]>) => {
        if(response.success && response.data){
          this.managers.set(response.data);
        }
      })
    );
  }

  delete(id:number):Observable<ApiResponse<void>>{
    return this.http.delete<ApiResponse<void>>(`${this.url}/users/${id}`).pipe(
      tap((response: ApiResponse<void>) => {
        if(response.success){
          this.managers.set(this.managers().filter(manager => manager.id !== id)) 
        }
      })
    );
  }

  create(request:ManagerForCreationDto): Observable<ApiResponse<ManagerResponse>>{
    return this.http.post<ApiResponse<ManagerResponse>>(`${this.url}/auth/create-manager`, request).pipe(
      tap((response: ApiResponse<ManagerResponse>) => {
        if(response.success && response.data){
          const newManagers= [...this.managers(), response.data]
          this.managers.set(newManagers)
        }
      })
    )
  }

  createHoliday(request:HolidayForCreationDto): Observable<ApiResponse<HolidayResponse>>{
    return this.http.post<ApiResponse<HolidayResponse>>(`${this.url}/schedule-holidays`, request).pipe(
      tap((response: ApiResponse<HolidayResponse>) => {
        if(response.success && response.data){  
          this.holidays.set([...this.holidays(), response.data])
        }
      })
    )
  }

  getHolidays(userId: number): Observable<ApiResponse<HolidayResponse[]>> {
    return this.http.get<ApiResponse<HolidayResponse[]>>(`${this.url}/schedule-holidays/${userId}`).pipe(
      tap((response: ApiResponse<HolidayResponse[]>) => {
        if (response.success && response.data) {
          const parsedData = response.data.map(holiday => ({
            ...holiday,
            startDate: DateTime.fromISO(holiday.startDate).toFormat('dd/MM/yyyy'),
            endDate: DateTime.fromISO(holiday.endDate).toFormat('dd/MM/yyyy')
          }));
          this.holidays.set(parsedData);
        }
      })
    );
  }

  deleteHoliday(holidayId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.url}/schedule-holidays/${holidayId}`).pipe(
      tap((response: ApiResponse<void>) => {
        if (response.success) {
          this.holidays.set(this.holidays().filter(holiday => holiday.id !== holidayId));
        }   
      })
    );
  }
  
}
