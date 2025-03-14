import { Component } from '@angular/core';
import { DateComponent } from "../date/date.component";
import { MostDemandedTimeComponent } from "../most-demanded-time/most-demanded-time.component";
import { TodayComponent } from "../today/today.component";
import { CountDayComponent } from "../count-day/count-day.component";

@Component({
  selector: 'app-resume',
  imports: [DateComponent, MostDemandedTimeComponent, TodayComponent, CountDayComponent],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss'
})
export class ResumeComponent {

}
