import { Component, computed, inject, signal } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-week',
  imports: [NgClass],
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss'
})
export class WeekComponent {
  private appointmentsService = inject(AppointmentsService);
  weekSelected = computed<[string, string, string, string, string, string, string]>(() => (this.appointmentsService.signalWeekSelected()));

  returnDay(date: string | undefined): string {
    if (!date) return "Día no disponible";
    return date.split('-')[2]; 
  }
  
  returnDayName(date: string | undefined): string {
    if (!date) return "Día no disponible";
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const dateObj = new Date(date + "T00:00:00");
    return dayNames[dateObj.getDay()];
  }
  
  whatDayWasSelected(day: string): boolean {
    return this.appointmentsService.signalDateSelected() == day;
  }

  setSignalDateSelected(day: string): void {
    this.appointmentsService.setSignalDateSelected(day);
  }
}
