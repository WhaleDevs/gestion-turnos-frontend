import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment';
import { HttpClient } from '@angular/common/http';
import { AppointmentForCreationDto, INIT_APPOINTMENT_FOR_CREATE_DTO } from '../models/requests-dto/appointmentsForCreate.dto';
import { AppointmentResponse } from '../models/responses/appointments.response';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '@app/shared/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private http = inject(HttpClient);
  private url = environment.API_URL + '/appointments';

  signalDateSelected = signal<string>(new Date().toISOString().split('T')[0]);
  signalWeekSelected = signal<[string, string,string,string,string,string,string]>(['', '', '', '', '', '', '']);
  signalAppointmentToCreate = signal<AppointmentForCreationDto>(INIT_APPOINTMENT_FOR_CREATE_DTO);
  signalAppointments = signal<AppointmentResponse[]>([]);
  signalAppointmentSelected = signal<AppointmentResponse | null>(null);
  constructor() { }

  setAppointmentToCreate(appointment: AppointmentForCreationDto) {
    this.signalAppointmentToCreate.set(appointment); 
  }

  setSignalDateSelected(date: string) {
    this.signalDateSelected.set(date);
  }

  getAppointmentsBetweenDates(scheduleId: number): Observable<ApiResponse<AppointmentResponse[]>> {
    const startDate = this.signalWeekSelected()[0];
    const endDate = this.signalWeekSelected()[1];    
    return this.http.get<ApiResponse<AppointmentResponse[]>>(this.url + '/between-dates' + `?id=${scheduleId}&startDate=${startDate}&endDate=${endDate}`)
    .pipe(
      tap((appointments: ApiResponse<AppointmentResponse[]>) => this.setAppointments(appointments.data!))
    );
  }

  setAppointments(appointments: AppointmentResponse[]) {
    this.signalAppointments.set(appointments);
  }

  createAppointment(): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(this.url, this.signalAppointmentToCreate());
  }
 
}
