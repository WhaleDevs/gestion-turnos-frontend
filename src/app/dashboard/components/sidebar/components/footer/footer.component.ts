import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftStartOnRectangle } from '@ng-icons/heroicons/outline';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [NgIcon],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  providers: [provideIcons({heroArrowLeftStartOnRectangle})]

})
export class FooterComponent {

  private router = inject(Router);
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

}
