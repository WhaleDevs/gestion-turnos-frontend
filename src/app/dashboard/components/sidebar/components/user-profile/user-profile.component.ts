import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {heroUserCircle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-user-profile',
  imports: [NgIcon],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  providers: [provideIcons({heroUserCircle})]
})
export class UserProfileComponent {

}
