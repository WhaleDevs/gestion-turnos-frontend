import { Component, computed, effect, inject, signal } from '@angular/core';
import { SessionService } from '@app/auth/services/session.service';
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
  private sessionService = inject(SessionService);
  name = signal('Cargando...');
  email = signal('');
  ngOnInit(): void {
    this.sessionService.getSession$.subscribe({
      next: (user) => {
        this.name.set(user?.role || '');
        this.email.set(user?.email || '');
      }
    })
  }
}
