import { Component } from '@angular/core';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroLockClosed, heroUserCircle } from '@ng-icons/heroicons/outline';
import { NgClass } from '@angular/common';
import { GeneralSettingsComponent } from "./components/general-settings/general-settings.component";

@Component({
  selector: 'app-config',
  imports: [UpdateProfileComponent, ChangePasswordComponent, NgIcon, NgClass, GeneralSettingsComponent],
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
