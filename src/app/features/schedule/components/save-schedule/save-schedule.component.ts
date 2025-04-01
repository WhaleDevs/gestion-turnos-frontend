import { Component } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-save-schedule',
  templateUrl: './save-schedule.component.html',
  styleUrls: ['./save-schedule.component.scss'],
  standalone: true
})
export class SaveScheduleComponent {
  constructor(private scheduleService: ScheduleService) {}

  onSave() {
    this.scheduleService.updateScheduleConfigForUpdate().subscribe({
      next: () => {
        console.log('Schedule updated successfully');
      },
      error: (error: Error) => {
        console.error('Error updating schedule:', error);
      }
    });
  }
}
