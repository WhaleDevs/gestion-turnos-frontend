import { Component } from '@angular/core';
import { DateComponent } from "../date/date.component";
import { TodayComponent } from "../today/today.component";
import { MostDemandedTimeComponent } from "../most-demanded-time/most-demanded-time.component";
import { CountDayComponent } from "../count-day/count-day.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  template: `
  <div class="dashboard"> 
  <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
    .dashboard {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    padding: 16px;
    border: 1px solid var(--border);
  }`],
  standalone: true
})

export class DashboardComponent {

}
