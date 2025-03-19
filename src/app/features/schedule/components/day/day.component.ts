import { Component, inject, Input, OnInit } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroTrash } from '@ng-icons/heroicons/outline';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ScheduleDayConfigResponse } from '../../models/schedule-response';

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIcon],
  templateUrl: './day.component.html',
  styleUrl: './day.component.scss',
  providers: [provideIcons({ heroPlus, heroTrash })]
})
export class DayComponent {
  private ScheduleService = inject(ScheduleService);
  @Input() scheduleId: number = 0;

  scheduleDayConfigForm: FormGroup;
  restForm: FormGroup;
  day: ScheduleDayConfigResponse = {} as ScheduleDayConfigResponse;
  
  ngOnInit(): void {
    this.ScheduleService.$dayActive.subscribe(day => {
      this.day = day;
      console.count();
      this.scheduleDayConfigForm.patchValue({
        ...day,
        startTime: this.formatTime(day.startTime),
        endTime: this.formatTime(day.endTime)
      });

      if (day.rests && day.rests.length > 0) {
        console.table(day.rests[0]);
        this.scheduleDayConfigForm.setControl(
          'rests',
          this.fb.array(
            this.day.rests.map(rest => this.fb.group({
              id: [rest.id || ''],
              startRest: [this.formatTime(rest.startTime), [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)]],
              endRest: [this.formatTime(rest.endTime), [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)]]
            }))
          )
        ); 
      }else{
        console.log('No hay descansos');
      }
    });
  }

  formatTime(time: any): string {
    if (!time) return '';
    if (typeof time === 'string') return time;
    if (time instanceof Date) {
      return time.toTimeString().slice(0, 5);
    }
    return '';
  }


  constructor(private fb: FormBuilder) {
    this.restForm = this.fb.group({
      startRest: new FormControl('', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)]),
      endRest: new FormControl('', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)])
    });

    this.scheduleDayConfigForm = this.fb.group({
      id: [''],
      startTime: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)]],
      endTime: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)]],
      slotInterval: ['', [Validators.required, Validators.min(1), Validators.max(1440)]],
      status: [false],
      rests: this.fb.array([
        this.restForm
      ])
    });
  }

  get rests(): FormArray {
    return this.scheduleDayConfigForm.get('rests') as FormArray;
  }

  addRest(): void {
    this.rests.push(this.fb.group({
      id: [''],
      startRest: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)]],
      endRest: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)]]
    }));
  }

  removeRest(index: number): void {
    this.rests.removeAt(index);
  }

  onSubmit(): void {
    if (this.scheduleDayConfigForm.valid) {
      this.ScheduleService.updateDay(this.scheduleDayConfigForm.value, this.day.id, this.scheduleId).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
