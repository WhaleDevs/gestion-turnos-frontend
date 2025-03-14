import { Component } from '@angular/core';
import { DateComponent } from "../date/date.component";
import { TodayComponent } from "../today/today.component";
import { MostDemandedTimeComponent } from "../most-demanded-time/most-demanded-time.component";
import { CountDayComponent } from "../count-day/count-day.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})

export class DashboardComponent {

}
