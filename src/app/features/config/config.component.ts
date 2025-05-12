import { Component } from '@angular/core';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroLockClosed, heroUserCircle } from '@ng-icons/heroicons/outline';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-config',
  imports: [UpdateProfileComponent, ChangePasswordComponent, NgIcon, NgClass],
  providers: [provideIcons({ heroLockClosed, heroUserCircle })],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {

  currentSection: string = 'general';

  navigateTo(component: string) {
    this.currentSection = component;
  }
}
