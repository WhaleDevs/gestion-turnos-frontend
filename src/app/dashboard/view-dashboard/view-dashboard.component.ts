import { Component } from '@angular/core';
import { DashboardComponent } from "../components/dashboard/dashboard.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";

@Component({
  selector: 'app-view-dashboard',
  imports: [DashboardComponent, SidebarComponent],
  templateUrl: './view-dashboard.component.html',
  styleUrl: './view-dashboard.component.scss'
})
export class ViewDashboardComponent {

}
