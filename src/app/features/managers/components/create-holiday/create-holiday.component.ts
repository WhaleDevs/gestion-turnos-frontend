import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { HolidayForCreationDto } from '../../models/holidayForCreationDto.dto';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { AlertService } from '@app/shared/services/alert.service';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { ManagerService } from '../../services/manager.service';

@Component({
  selector: 'app-create-holiday',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, // 👈 este es el que falta
    MatButtonModule,
    MatCardModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-holiday.component.html',
  styleUrl: './create-holiday.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateHolidayComponent {
  private _alerts = inject(AlertService);
  private dateAdapter = inject(DateAdapter<Date>);
  private managerService = inject(ManagerService);
  holidaysForm: FormGroup;
  selected = model<Date | null>(null);
  pageHolidays: number = 0;
  
  constructor(private fb: FormBuilder) {
    this.holidaysForm = this.fb.group({
      startDate: [null, Validators.required], // Fecha de inicio
      endDate: [null, Validators.required], // Fecha de fin
      reason: [''],
    });
  }

  selectedStart: Date | null = null;
  selectedEnd: Date | null = null;

  onDateSelected(date: Date, type: 'start' | 'end') {
    if (type === 'start') {
      this.selectedStart = date;
      this.holidaysForm.patchValue({ startDate: date });
    } else {
      this.selectedEnd = date;
      this.holidaysForm.patchValue({ endDate: date });
    }
  }
  
  nextPage() {
    this.pageHolidays++;
  }

  previousPage() {
    this.pageHolidays--;
  }


  submit() {
    const start = this.holidaysForm.get('startDate')?.value;
    const end = this.holidaysForm.get('endDate')?.value;
    const reason = this.holidaysForm.get('reason')?.value;

    if (!start) {
      this._alerts.showError('Fecha de inicio no definida');
      return;
    }
    if (!end) {
      this._alerts.showError('Fecha de fin no definida');
      return;
    }
    if (start > end) {
      this._alerts.showError(
        'La fecha de inicio no puede ser posterior a la fecha de fin'
      );
    }

    const formattedStart = DateTime.fromJSDate(start).toFormat('yyyy-MM-dd');
    const formattedEnd = DateTime.fromJSDate(end).toFormat('yyyy-MM-dd');

    const requestDto: HolidayForCreationDto = {
      userId: this.managerService.selectedManager().id,
      startDate: formattedStart,
      endDate: formattedEnd,
      reason: reason,
    };

    this.managerService.createHoliday(requestDto).subscribe();

    console.log(requestDto);
  }
}
