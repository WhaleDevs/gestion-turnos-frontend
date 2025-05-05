import { Component } from '@angular/core';
import { ListManagersComponent } from "./components/list-managers/list-managers.component";

@Component({
  selector: 'app-managers',
  imports: [ListManagersComponent],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss'
})
export class ManagersComponent {

}
