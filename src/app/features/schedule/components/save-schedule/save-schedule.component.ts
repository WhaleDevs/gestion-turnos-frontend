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
    this.scheduleService.updateSchedule().subscribe({
      next: () => {
        console.log('Schedule updated successfully');
        // You can add a success notification here
      },
      error: (error: Error) => {
        console.error('Error updating schedule:', error);
        // You can add an error notification here
      }
    });
  }
}
