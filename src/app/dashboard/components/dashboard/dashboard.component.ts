import { Component } from '@angular/core';
import { DateComponent } from "../date/date.component";
import { TodayComponent } from "../today/today.component";
import { MostDemandedTimeComponent } from "../most-demanded-time/most-demanded-time.component";
import { CountDayComponent } from "../count-day/count-day.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

}
