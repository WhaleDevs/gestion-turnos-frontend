import { Component } from '@angular/core';
import { ListManagersComponent } from "./components/list-managers/list-managers.component";
import { CreateManagerComponent } from "./components/create-manager/create-manager.component";

@Component({
  selector: 'app-managers',
  imports: [ListManagersComponent, CreateManagerComponent],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss'
})
export class ManagersComponent {

}
