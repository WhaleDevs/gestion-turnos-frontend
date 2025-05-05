import { computed, effect, inject, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { environment } from '@envs/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppointmentForCreationDto, INIT_APPOINTMENT_FOR_CREATE_DTO } from '../models/requests-dto/appointmentsForCreate.dto';
import { AppointmentResponse } from '../models/responses/appointments.response';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '@app/shared/models/api-response';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { Week } from '../components/calendar/calendar.component';
import { DateTime } from 'luxon';
import { CustomerResponse } from '@app/features/customers/models/customer.response';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  constructor() {
  }
  // ─────────────────────────────────────────────
  // 🔧 INYECCIONES Y CONFIG
  // ─────────────────────────────────────────────
  private http = inject(HttpClient);
  private scheduleService = inject(ScheduleService);
  private url = environment.API_URL + '/appointments';

  // ─────────────────────────────────────────────
  // 📡 SIGNALS
  // ─────────────────────────────────────────────
  signalHoursForDate = computed(() => this.generateHours(
    this.scheduleService.signalScheduleConfigResponse()?.daysConfig.find(day => day.day === this.signalDateSelected()?.dayName)?.startTime ?? '',
    this.scheduleService.signalScheduleConfigResponse()?.daysConfig.find(day => day.day === this.signalDateSelected()?.dayName)?.endTime ?? '',
    false
  ))

  signalHoursNoFilters = computed(() => this.generateHours(
    this.scheduleService.signalScheduleConfigResponse()?.daysConfig.find(day => day.day === this.signalDateSelected()?.dayName)?.startTime ?? '',
    this.scheduleService.signalScheduleConfigResponse()?.daysConfig.find(day => day.day === this.signalDateSelected()?.dayName)?.endTime ?? '',
    true
  ));

  signalWeekSelected: WritableSignal<Week[]> = signal<Week[]>([]);
  signalDateSelected = signal<Week | null>(null);
  signalDateFromWeek = signal<Week | null>(null);
  signalDayStatusFalse = computed(() => this.scheduleService.signalDayStatusFalse());
  signalHoursEnabled = signal<String[]>([]);
  signalAppointmentToCreate = signal<AppointmentForCreationDto>(INIT_APPOINTMENT_FOR_CREATE_DTO);
  signalAppointments = signal<AppointmentResponse[]>([]);

  signalAppointmentsForDate = computed(() =>
    this.signalAppointments()
      .filter(appointment => appointment.date === this.signalDateSelected()?.date)
      .sort((a: AppointmentResponse, b: AppointmentResponse) =>
        DateTime.fromISO(a.startTime).toMillis() - DateTime.fromISO(b.startTime).toMillis()
      )
  );
  
  signalAppointmentSelected = signal<AppointmentResponse | null>(null);

  // ─────────────────────────────────────────────
  // ⚙️ MÉTODOS PÚBLICOS DE MODIFICACIÓN
  // ─────────────────────────────────────────────

  setAppointmentToCreate(appointment: AppointmentForCreationDto) {
    this.signalAppointmentToCreate.set(appointment);
  }

  setAppointments(appointments: AppointmentResponse[]) {
    this.signalAppointments.set(appointments);
  }

  setHoursEnabled(hours: String[]) {
    this.signalHoursEnabled.set(hours);
  }

  // ─────────────────────────────────────────────
  // 📡 LLAMADAS HTTP
  // ─────────────────────────────────────────────

  getAppointmentsBetweenDates(scheduleId: number, startDate: string, endDate: string): Observable<ApiResponse<AppointmentResponse[]>> {
    startDate = startDate.replaceAll('/', '-');
    endDate = endDate.replaceAll('/', '-');
    return this.http.get<ApiResponse<AppointmentResponse[]>>(this.url + '/between-dates' + `?id=${scheduleId}&startDate=${startDate}&endDate=${endDate}`)
      .pipe(
        tap((appointments: ApiResponse<AppointmentResponse[]>) => {
          if (appointments.data) {
            appointments.data?.forEach(appointment => {
              appointment.date = this.formateDate(appointment.date);
            });
          }
          this.setAppointments(appointments.data!);
        })
      );
  }

  createAppointment(): Observable<ApiResponse<AppointmentResponse>> {
    return this.http.post<ApiResponse<AppointmentResponse>>(this.url, this.signalAppointmentToCreate()).pipe(
      tap((response)=>{
        if (response.data) {
          response.data.date = this.formateDate(response.data.date);
        }
        this.setAppointments([response.data!, ...this.signalAppointments()]);
      })
    );
  }


  updateAppointmentStatus(appointmentId: number, status: string): Observable<ApiResponse<AppointmentResponse>> {
    const httpParams = new HttpParams()
      .set(':id', appointmentId.toString())
      .set(':status', status);
    return this.http.patch<ApiResponse<AppointmentResponse>>(
      `${this.url}/update-status`,
      null,
      { params: httpParams }
    );
  }

  deleteAppointment(): Observable<ApiResponse<AppointmentResponse>> {
    const httpParams = new HttpParams()
      .set(':id', this.signalAppointmentSelected()?.id.toString()!);
    return this.http.delete<ApiResponse<AppointmentResponse>>(this.url, { params: httpParams }).pipe(
      tap((response) => {
        if (response.success) {
          this.setAppointments(this.signalAppointments().filter(appointment => appointment.id !== this.signalAppointmentSelected()?.id));
          this.signalAppointmentSelected.set(null);
        }
      })
    );
  }
  
  // ─────────────────────────────────────────────
  // 🧠 LÓGICA DE HORARIOS Y DESCANSOS
  // ─────────────────────────────────────────────

  generateHours(startTime: string, endTime: string, noFilterHours: boolean = false): string[] {
    console.log('🔧 Generando horas disponibles...');
  
    const hoursEnabled = this.signalHoursEnabled();
    console.log('⏱️ Horas ya reservadas:', hoursEnabled);
  
    const scheduleConfig = this.scheduleService.signalScheduleConfigResponse();
    const selectedDayName = this.signalDateSelected()?.dayName;
    console.log('📅 Día seleccionado:', selectedDayName);
  
    const dayConfig = scheduleConfig?.daysConfig.find(day => day.day === selectedDayName);
    const interval = dayConfig?.slotInterval ?? 30;
    console.log('⏲️ Intervalo entre turnos:', interval);
  
    const rests = dayConfig?.rests ?? [];
    console.log('😴 Horarios de descanso:', rests);
  
    const hours: string[] = [];
  
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    let currentTime = new Date();
    currentTime.setHours(startHours, startMinutes, 0, 0);
  
    const endTimeObj = new Date();
    endTimeObj.setHours(endHours, endMinutes, 0, 0);
  
    while (currentTime < endTimeObj) {
      const currentHourStr = currentTime.toTimeString().slice(0, 5);
      console.log('🕓 Evaluando hora:', currentHourStr);
  
      const isRestTime = rests.some(rest =>
        rest.startTime === currentHourStr ||
        this.isInRestPeriod(currentHourStr, rest)
      );
  
      console.log(`🔍 ¿Está en descanso (${currentHourStr})?:`, isRestTime);
  
      if (!isRestTime) {
        hours.push(currentHourStr);
        console.log('✅ Hora añadida:', currentHourStr);
      }
  
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
  
    console.log('📋 Horas generadas antes de filtrar:', hours);
  
    const filteredHours = hours.filter(hour => {
      const isDisabled = !noFilterHours && hoursEnabled.includes(hour);
      const keep = !isDisabled;
      console.log(`🧹 Filtrando hora: ${hour} | Reservada: ${isDisabled} | ¿Mantener?: ${keep}`);
      return keep;
    });
  
    console.log('✅ Horas finales disponibles:', filteredHours);
    return filteredHours;
  }
  

  // ─────────────────────────────────────────────
  // 🕐 UTILIDAD PRIVADA
  // ─────────────────────────────────────────────

  private isInRestPeriod(time: string, rest: { startTime: string, endTime: string }): boolean {
    const [h1, m1] = rest.startTime.split(':').map(Number);
    const [h2, m2] = rest.endTime.split(':').map(Number);
    const [ch, cm] = time.split(':').map(Number);

    const restStart = h1 * 60 + m1;
    const restEnd = h2 * 60 + m2;
    const current = ch * 60 + cm;

    return current > restStart && current < restEnd;
  }

  private formateDate(date: string): string {
    return date.split("T")[0];
  }

}