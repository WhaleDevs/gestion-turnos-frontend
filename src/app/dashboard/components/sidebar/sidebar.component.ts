import { Component, EventEmitter, Output } from '@angular/core';
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-sidebar',
  imports: [UserProfileComponent, NavBarComponent, FooterComponent],
  template: `

    <section class="sidebar-container" (click)="closeSidebarOut()">
        <app-user-profile class="user-profile"></app-user-profile>
        <app-nav-bar class="nav-bar"></app-nav-bar>
        <app-footer class="footer"></app-footer>    
    </section>
    
  `,
  styles: [`

    .sidebar-container {
        width: 100%;
        min-height: 100vh; 
        padding: var(--padding-s);
        display: grid;
        grid-template-rows: auto 7fr auto;
        grid-template-columns: 1fr;
        grid-template-areas:
          "user-profile"
          "nav-bar"
          "footer";
        gap: var(--gap-l);
        @media screen and (max-width: 768px) {
            min-height: 100%;
        }
    }
    
    .user-profile {
      grid-area: user-profile;
    }
    
    .nav-bar {
      grid-area: nav-bar;
    }
    
    .footer {
      grid-area: footer;
    }

  `]
})
export class SidebarComponent {
  @Output() closeSidebar = new EventEmitter<void>();

  closeSidebarOut() {
    this.closeSidebar.emit();
  }

}
