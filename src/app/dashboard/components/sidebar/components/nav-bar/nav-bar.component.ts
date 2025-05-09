import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { SessionService } from '@app/auth/services/session.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBriefcase, heroCalendarDays, heroCog6Tooth, heroHome, heroPaperClip, heroUserGroup, heroRectangleGroup } from '@ng-icons/heroicons/outline';


@Component({
  selector: 'app-nav-bar',
  imports: [NgIcon, RouterLink, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  providers: [provideIcons({ heroCalendarDays, heroUserGroup, heroCog6Tooth, heroPaperClip, heroHome, heroBriefcase, heroRectangleGroup })]
})
export class NavBarComponent {
  private sessionService = inject(SessionService);
  role:string='';

  ngOnInit(): void {
    this.sessionService.getSession$.subscribe({
      next: (user) => {
        this.role = user?.role || '';
      }
    })
  }
}
