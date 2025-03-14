import { Component } from '@angular/core';
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-sidebar',
  imports: [UserProfileComponent, NavBarComponent, FooterComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
