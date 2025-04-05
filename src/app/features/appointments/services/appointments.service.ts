import { computed, inject, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { environment } from '@envs/environment';
import { HttpClient } from '@angular/common/http';
import { AppointmentForCreationDto, INIT_APPOINTMENT_FOR_CREATE_DTO } from '../models/requests-dto/appointmentsForCreate.dto';
import { AppointmentResponse } from '../models/responses/appointments.response';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '@app/shared/models/api-response';
import { EDayOfWeek } from '@app/utils/dayEnum';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { Week } from '../components/calendar/calendar.component';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private http = inject(HttpClient);
  private scheduleService = inject(ScheduleService);
  private url = environment.API_URL + '/appointments';

  signalWeekSelected: WritableSignal<Week[]> = signal<Week[]>([]);
  signalDateSelected = signal<Week | null>(null);
  signalDateFromWeek = signal<Week|null>(null);
  signalDayStatusFalse = computed(() => this.scheduleService.signalDayStatusFalse());
  signalHoursEnabled = signal<String[]>([]);
  signalAppointmentToCreate = signal<AppointmentForCreationDto>(INIT_APPOINTMENT_FOR_CREATE_DTO);
  signalAppointments = signal<AppointmentResponse[]>([]);
  signalAppointmentsForDate = linkedSignal(() => 
    this.signalAppointments().filter(appointment => appointment.date === this.signalDateSelected()?.date.replaceAll('/', '-')));
  signalAppointmentSelected = signal<AppointmentResponse | null>(null);
  constructor() { }

  setAppointmentToCreate(appointment: AppointmentForCreationDto) {
    this.signalAppointmentToCreate.set(appointment); 
  }

  getAppointmentsBetweenDates(scheduleId: number, startDate: string, endDate: string): Observable<ApiResponse<AppointmentResponse[]>> {
    startDate = startDate.replaceAll('/', '-');
    endDate = endDate.replaceAll('/', '-');
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
    this.signalAppointments.set(appointments);
  }

  createAppointment(): Observable<ApiResponse<AppointmentResponse>> {
    return this.http.post<ApiResponse<AppointmentResponse>>(this.url, this.signalAppointmentToCreate());
  }

  setHoursEnabled(hours: String[]) {
    this.signalHoursEnabled.set(hours);
  } 

  formateDate(date: string): string {
    return date.split("T")[0];
  }
}
