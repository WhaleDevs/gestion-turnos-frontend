import { Component } from '@angular/core';
import { UpdateProfileComponent } from "./components/update-profile/update-profile.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";

@Component({
  selector: 'app-config',
  imports: [UpdateProfileComponent, ChangePasswordComponent],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {

}
