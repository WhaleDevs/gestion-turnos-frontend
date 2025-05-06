import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBriefcase, heroCalendarDays, heroCog6Tooth, heroHome, heroPaperClip, heroUserGroup } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-nav-bar',
  imports: [NgIcon, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  providers: [provideIcons({ heroCalendarDays, heroUserGroup, heroCog6Tooth, heroPaperClip, heroHome, heroBriefcase })]
})
export class NavBarComponent {
}
