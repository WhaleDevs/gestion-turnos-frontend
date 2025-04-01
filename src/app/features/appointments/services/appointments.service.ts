import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment';
import { HttpClient } from '@angular/common/http';
import { AppointmentForCreationDto, INIT_APPOINTMENT_FOR_CREATE_DTO } from '../models/requests-dto/appointmentsForCreate.dto';
import { AppointmentResponse } from '../models/responses/appointments.response';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '@app/shared/models/api-response';
import { EDayOfWeek } from '@app/utils/dayEnum';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private http = inject(HttpClient);
  private scheduleService = inject(ScheduleService);
  private url = environment.API_URL + '/appointments';

  signalDayStrFull = computed(() => this.scheduleService.returnDayFullFromDate(this.signalDateSelected()));
  signalDayStr = computed(() => this.scheduleService.returnDayFromDate(this.signalDateSelected()));
  signalDayNumber = computed(() => this.scheduleService.returnDayNumberFromDate(this.signalDateSelected()));
  signalDateSelected = signal<string>(new Date().toISOString().split('T')[0]);
  signalHoursEnabled = signal<String[]>([]);

  signalWeekSelected = signal<[string, string,string,string,string,string,string]>(['', '', '', '', '', '', '']);
  signalAppointmentToCreate = signal<AppointmentForCreationDto>(INIT_APPOINTMENT_FOR_CREATE_DTO);
  signalAppointments = signal<AppointmentResponse[]>([]);
  signalAppointmentsForDate = computed(() => 
    this.signalAppointments().filter(appointment => appointment.date === this.signalDateSelected()));
  
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
    const endDate = this.signalWeekSelected()[6];
    console.log('Fechas', startDate, endDate);   
    return this.http.get<ApiResponse<AppointmentResponse[]>>(this.url + '/between-dates' + `?id=${scheduleId}&startDate=${startDate}&endDate=${endDate}`)
    .pipe(
      tap((appointments: ApiResponse<AppointmentResponse[]>) => {
        if (appointments.data) {
          appointments.data?.map(appointment => {
            appointment.date = this.formateDate(appointment.date);
          });
        }
        this.setAppointments(appointments.data!)
      })
    );
  }

  setAppointments(appointments: AppointmentResponse[]) {
    console.log('Citas', appointments);
    this.signalAppointments.set(appointments);
  }

  createAppointment(): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(this.url, this.signalAppointmentToCreate());
  }

  setHoursEnabled(hours: String[]) {
    this.signalHoursEnabled.set(hours);
  } 

  formateDate(date: string): string {
    return date.split("T")[0];
  }
}
